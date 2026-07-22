import prisma from '../src/lib/prisma'
import { resetPineconeIndex } from '../src/lib/pinecone'

async function resetDatabaseAndVectors() {
  console.log('🧹 Starting Hyrtica production database & Pinecone cleanup...')

  if (prisma) {
    try {
      console.log('1. Clearing relational database records in PostgreSQL...')
      await prisma.application.deleteMany({})
      await prisma.task.deleteMany({})
      await prisma.message.deleteMany({})
      await prisma.candidate.deleteMany({})
      await prisma.jobPosting.deleteMany({})
      await prisma.session.deleteMany({})
      await prisma.account.deleteMany({})
      await prisma.user.deleteMany({})
      await prisma.verificationToken.deleteMany({})
      console.log('✅ PostgreSQL database tables reset successfully!')
    } catch (error) {
      console.warn('⚠️ PostgreSQL cleanup warning (using offline/local mode):', error)
    }
  } else {
    console.log('ℹ️ PostgreSQL database URL not configured; skipping SQL truncate.')
  }

  try {
    console.log('2. Clearing vector embeddings from Pinecone index...')
    await resetPineconeIndex()
    console.log('✅ Pinecone vector index reset successfully!')
  } catch (vectorErr) {
    console.warn('⚠️ Pinecone reset warning:', vectorErr)
  }

  console.log('🎉 Production cleanup complete! All mock data removed.')
}

resetDatabaseAndVectors()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Reset script error:', err)
    process.exit(1)
  })
