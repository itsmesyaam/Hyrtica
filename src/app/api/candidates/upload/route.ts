import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromBuffer } from '@/lib/textExtractor'
import { parseResumeText } from '@/lib/resumeParser'
import { generateEmbedding768 } from '@/lib/embeddings'
import { upsertCandidateVector } from '@/lib/pinecone'
import { saveRelationalCandidate } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const rawText = await extractTextFromBuffer(buffer, file.name)

    // 1. Run AI parsing using Google Gemini API (@google/genai)
    const parsed = await parseResumeText(rawText)
    const candidateId = `cand-${Date.now()}`

    // 2. Generate 768-dim vector embedding using Gemini text-embedding-004
    const compositeText = `${parsed.fullName}\n${parsed.summary}\nSkills: ${parsed.skills.join(', ')}\nLocation: ${parsed.location}`
    const embedding768 = await generateEmbedding768(compositeText)

    // 3. Parallelly save relational candidate text record to PostgreSQL & vector to Pinecone
    const [pgSuccess, pineconeSuccess] = await Promise.all([
      saveRelationalCandidate({
        id: candidateId,
        fullName: parsed.fullName,
        email: parsed.email,
        phone: parsed.phone,
        location: parsed.location,
        yearsOfExperience: parsed.yearsOfExperience,
        expectedSalary: parsed.expectedSalary || 120000,
        skills: parsed.skills,
        rawResumeText: rawText,
        resumeUrl: `https://hyrtica-resumes.s3.amazonaws.com/${file.name}`
      }),
      upsertCandidateVector(candidateId, embedding768, {
        fullName: parsed.fullName,
        skills: parsed.skills,
        yearsOfExperience: parsed.yearsOfExperience,
        location: parsed.location,
        email: parsed.email
      })
    ])

    return NextResponse.json({
      success: true,
      candidateId,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      candidate: parsed,
      embeddingLength: embedding768.length,
      pgSuccess,
      pineconeSuccess
    })
  } catch (error) {
    console.error('Candidate upload error:', error)
    return NextResponse.json({ error: 'Failed to process document parsing and indexing' }, { status: 500 })
  }
}
