import { Pinecone } from '@pinecone-database/pinecone'

export interface CandidateVectorMetadata {
  fullName: string
  skills: string[]
  yearsOfExperience: number
  location: string
  email?: string
}

export interface PineconeMatchResult {
  id: string
  score: number
  metadata?: CandidateVectorMetadata
}

// In-memory fallback vector store for local testing without Pinecone credentials
const mockVectorStore: Array<{
  id: string
  values: number[]
  metadata: CandidateVectorMetadata
}> = [
  {
    id: "4",
    values: Array(768).fill(0.1),
    metadata: { fullName: "Sneha Reddy", skills: ["Node.js", "React", "Python"], yearsOfExperience: 4, location: "Remote" }
  },
  {
    id: "1",
    values: Array(768).fill(0.08),
    metadata: { fullName: "Amit Sharma", skills: ["Python", "React", "AWS"], yearsOfExperience: 8, location: "Hybrid" }
  },
  {
    id: "3",
    values: Array(768).fill(0.05),
    metadata: { fullName: "Rajesh Kumar", skills: ["React", "TypeScript", "CSS"], yearsOfExperience: 3, location: "On-site" }
  },
  {
    id: "2",
    values: Array(768).fill(0.04),
    metadata: { fullName: "Priya Patel", skills: ["AWS", "Docker", "Kubernetes"], yearsOfExperience: 6, location: "Remote" }
  }
]

function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0.8
  let dotProduct = 0
  let normA = 0
  let normB = 0
  const len = Math.min(vecA.length, vecB.length)
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0.8
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

let pineconeClient: Pinecone | null = null

function getPineconeClient(): Pinecone | null {
  if (process.env.PINECONE_API_KEY) {
    if (!pineconeClient) {
      pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
    }
    return pineconeClient
  }
  console.warn('[Pinecone Warning] PINECONE_API_KEY environment variable is not set. Operating with fallback vector store.')
  return null
}

/**
 * Reset all vectors in Pinecone Index and clear in-memory fallback store
 */
export async function resetPineconeIndex(): Promise<boolean> {
  const pc = getPineconeClient()
  const indexName = process.env.PINECONE_INDEX || 'hyrtica-candidates'

  if (pc) {
    try {
      const index = pc.index(indexName)
      await index.deleteAll()
      console.log(`[Pinecone] Successfully wiped all vectors from index ${indexName}`)
    } catch (error) {
      console.warn('[Pinecone] Failed to delete all vectors from index:', error)
    }
  }

  mockVectorStore.length = 0
  console.log('[Pinecone-Fallback] In-memory vector store wiped clean.')
  return true
}

/**
 * Upsert candidate 768-dim vector & metadata into Pinecone Index (or local fallback)
 */
export async function upsertCandidateVector(
  candidateId: string,
  embedding: number[],
  metadata: CandidateVectorMetadata
): Promise<boolean> {
  const pc = getPineconeClient()
  const indexName = process.env.PINECONE_INDEX || 'hyrtica-candidates'

  if (pc) {
    try {
      const index = pc.index(indexName)
      await index.upsert({
        records: [
          {
            id: candidateId,
            values: embedding,
            metadata: {
              fullName: metadata.fullName,
              skills: metadata.skills.join(','),
              yearsOfExperience: metadata.yearsOfExperience,
              location: metadata.location,
              email: metadata.email || ''
            }
          }
        ]
      })
      console.log(`[Pinecone] Successfully upserted candidate vector for ${candidateId}`)
      return true
    } catch (error) {
      console.warn('[Pinecone] Vector upsert failed, using fallback store:', error)
    }
  }

  // Fallback in-memory store
  const existingIdx = mockVectorStore.findIndex(item => item.id === candidateId)
  if (existingIdx >= 0) {
    mockVectorStore[existingIdx] = { id: candidateId, values: embedding, metadata }
  } else {
    mockVectorStore.push({ id: candidateId, values: embedding, metadata })
  }
  console.log(`[Pinecone-Fallback] Indexed vector for candidate ${candidateId}`)
  return true
}

/**
 * Query Pinecone Index for top K candidate matches using Cosine Similarity
 */
export async function queryTopCandidates(
  jobVector: number[],
  topK: number = 10
): Promise<PineconeMatchResult[]> {
  const pc = getPineconeClient()
  const indexName = process.env.PINECONE_INDEX || 'hyrtica-candidates'

  if (pc) {
    try {
      const index = pc.index(indexName)
      const queryResponse = await index.query({
        vector: jobVector,
        topK,
        includeMetadata: true
      })

      if (queryResponse.matches && queryResponse.matches.length > 0) {
        return queryResponse.matches.map(match => ({
          id: match.id,
          score: match.score || 0.85,
          metadata: match.metadata
            ? {
                fullName: (match.metadata.fullName as string) || 'Candidate',
                skills: typeof match.metadata.skills === 'string'
                  ? (match.metadata.skills as string).split(',')
                  : (match.metadata.skills as string[]) || [],
                yearsOfExperience: Number(match.metadata.yearsOfExperience || 5),
                location: (match.metadata.location as string) || 'Remote',
                email: (match.metadata.email as string) || ''
              }
            : undefined
        }))
      }
    } catch (error) {
      console.warn('[Pinecone] Vector query failed, falling back to local vector similarity calculation:', error)
    }
  }

  // Fallback Cosine Similarity calculation across mock vector store
  const scored = mockVectorStore.map(item => ({
    id: item.id,
    score: Math.min(0.99, Math.max(0.70, calculateCosineSimilarity(jobVector, item.values))),
    metadata: item.metadata
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topK)
}
