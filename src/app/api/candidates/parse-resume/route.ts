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
      return NextResponse.json({ error: 'No resume file uploaded' }, { status: 400 })
    }

    // 1. Extract raw text from uploaded PDF/DOCX file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const rawText = await extractTextFromBuffer(buffer, file.name)

    // 2. Parse raw text into strict JSON structure via Gemini AI / Structured Outputs
    const parsedCandidate = await parseResumeText(rawText)
    const candidateId = `cand-${Date.now()}`

    // 3. Generate 768-dimensional vector embedding using Gemini text-embedding-004
    const compositeText = `${parsedCandidate.fullName}\n${parsedCandidate.summary}\nSkills: ${parsedCandidate.skills.join(', ')}\nLocation: ${parsedCandidate.location}`
    const embedding768 = await generateEmbedding768(compositeText)

    // 4. Parallelly save relational candidate text record to PostgreSQL & vector to Pinecone
    const [pgSuccess, pineconeSuccess] = await Promise.all([
      saveRelationalCandidate({
        id: candidateId,
        fullName: parsedCandidate.fullName,
        email: parsedCandidate.email,
        phone: parsedCandidate.phone,
        location: parsedCandidate.location,
        yearsOfExperience: parsedCandidate.yearsOfExperience,
        expectedSalary: parsedCandidate.expectedSalary || 120000,
        skills: parsedCandidate.skills,
        rawResumeText: rawText,
        resumeUrl: `https://hyrtica-resumes.s3.amazonaws.com/${file.name}`
      }),
      upsertCandidateVector(candidateId, embedding768, {
        fullName: parsedCandidate.fullName,
        skills: parsedCandidate.skills,
        yearsOfExperience: parsedCandidate.yearsOfExperience,
        location: parsedCandidate.location,
        email: parsedCandidate.email
      })
    ])

    // 5. Return JSON payload to client for pre-filling candidate profile forms
    return NextResponse.json({
      success: true,
      candidateId,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      rawTextLength: rawText.length,
      embeddingLength: embedding768.length,
      pgSuccess,
      pineconeSuccess,
      candidate: parsedCandidate
    })
  } catch (error) {
    console.error('Parse resume endpoint error:', error)
    return NextResponse.json({ error: 'Failed to extract and parse resume document' }, { status: 500 })
  }
}
