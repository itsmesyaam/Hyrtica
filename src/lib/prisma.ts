import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  var __hyrtica_process_handlers_set: boolean | undefined
}

// Global safety net: Prevent Node.js process crashes from unhandled background rejections or errors
if (typeof process !== 'undefined' && !globalThis.__hyrtica_process_handlers_set) {
  globalThis.__hyrtica_process_handlers_set = true
  process.on('unhandledRejection', (reason) => {
    console.warn('[Server Warning] Unhandled promise rejection caught safely:', reason)
  })
  process.on('uncaughtException', (err) => {
    console.warn('[Server Warning] Uncaught exception caught safely:', err.message)
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient | null {
  try {
    const connectionString = process.env.DATABASE_URL
    if (connectionString && connectionString !== 'postgresql://postgres:postgres@localhost:5432/hyrtica') {
      const isProductionDb = connectionString.includes('railway') || connectionString.includes('sslmode=') || process.env.NODE_ENV === 'production'
      const pool = new Pool({
        connectionString,
        ssl: isProductionDb ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 10
      })

      pool.on('error', (err) => {
        console.warn('[PostgreSQL Pool Warning] Background connection error caught safely:', err.message)
      })

      const adapter = new PrismaPg(pool)
      console.log('Prisma initialized successfully with PostgreSQL adapter.')
      return new PrismaClient({ adapter })
    } else {
      console.warn('Prisma: Using local database placeholder. Live queries will fall back to mock data.')
    }
  } catch (error) {
    console.warn('Prisma initialization fallback mode active:', error)
  }
  return null
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma
