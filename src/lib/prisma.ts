import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

let prisma: PrismaClient | null = null

try {
  const connectionString = process.env.DATABASE_URL
  if (connectionString && connectionString !== 'postgresql://postgres:postgres@localhost:5432/hyrtica') {
    const isProductionDb = connectionString.includes('railway') || connectionString.includes('sslmode=') || process.env.NODE_ENV === 'production'
    const pool = new Pool({
      connectionString,
      ssl: isProductionDb ? { rejectUnauthorized: false } : undefined
    })
    const adapter = new PrismaPg(pool)
    prisma = new PrismaClient({ adapter })
    console.log('Prisma initialized successfully with PostgreSQL adapter.')
  } else {
    console.warn('Prisma: Using local database placeholder. Live queries will fall back to mock data.')
  }
} catch (error) {
  console.warn('Prisma initialization fallback mode active:', error)
  prisma = null
}

export default prisma
