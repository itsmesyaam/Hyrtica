import { GoogleGenAI } from '@google/genai'

// Deterministic fallback vector generator for 768 dimensions
function generateMockEmbedding768(text: string): number[] {
  const vector: number[] = []
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  for (let i = 0; i < 768; i++) {
    const val = Math.sin(hash + (i * 1.5))
    vector.push(val)
  }
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0))
  return vector.map(v => v / (magnitude || 1))
}

/**
 * Generate 768-dimensional vector embedding using Gemini text-embedding-004
 */
export async function generateEmbedding768(text: string): Promise<number[]> {
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
      const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text
      })
      const values = response.embeddings?.[0]?.values
      if (values && Array.isArray(values)) {
        if (values.length === 768) {
          return values
        }
        return values.slice(0, 768)
      }
    } catch (e) {
      console.warn('Gemini 768 embedding call failed, using mock generator:', e)
    }
  }

  return generateMockEmbedding768(text)
}

// Deterministic fallback vector generation for 1536 dimensions
function generateMockEmbedding(text: string): number[] {
  const vector: number[] = []
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  for (let i = 0; i < 1536; i++) {
    const val = Math.sin(hash + i)
    vector.push(val)
  }
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0))
  return vector.map(v => v / (magnitude || 1))
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
          dimensions: 1536
        })
      })
      const result = await response.json()
      if (result.data && result.data[0] && result.data[0].embedding) {
        return result.data[0].embedding
      }
    } catch (e) {
      console.warn('OpenAI embedding call failed, trying next methods...', e)
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
      const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text
      })
      
      const values = response.embeddings?.[0]?.values
      if (values && Array.isArray(values)) {
        if (values.length === 768) {
          const extended = [...values, ...values]
          const magnitude = Math.sqrt(extended.reduce((sum, v) => sum + v * v, 0))
          return extended.map(v => v / (magnitude || 1))
        }
        if (values.length === 1536) {
          return values
        }
      }
    } catch (e) {
      console.warn('Google Gen AI embedding call failed. Falling back to mock generator.', e)
    }
  }

  return generateMockEmbedding(text)
}
