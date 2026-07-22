import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

let prisma: PrismaClient | null = null

try {
  const connectionString = process.env.DATABASE_URL
  if (connectionString && connectionString !== 'postgresql://postgres:postgres@localhost:5432/hyrtica') {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    prisma = new PrismaClient({ adapter })
    console.log('Prisma initialized successfully with PostgreSQL adapter.')
  } else {
    console.warn('Prisma: Using local database placeholder. Live queries will fall back to mock data.')
  }
} catch (error) {
  console.error('Prisma initialization error:', error)
}

export default prisma
