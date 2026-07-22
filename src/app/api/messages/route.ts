import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export interface MessageItem {
  id: string
  candidateId: string
  sender: 'RECRUITER' | 'CANDIDATE'
  content: string
  createdAt: string
}

// In-memory messages store for fallback when PostgreSQL is offline or unmigrated
const MOCK_MESSAGES_STORE: MessageItem[] = [
  {
    id: 'msg-1',
    candidateId: '1',
    sender: 'RECRUITER',
    content: "Hi Amit, we reviewed your profile and were really impressed by your backend systems and vector search experience!",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'msg-2',
    candidateId: '1',
    sender: 'CANDIDATE',
    content: "Thank you! I'd love to learn more about the Senior Software Engineer position and the team architecture.",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'msg-3',
    candidateId: '1',
    sender: 'RECRUITER',
    content: "Fantastic! I have assigned an assessment task in your Candidate Portal. Feel free to reply here if you have any questions.",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId') || '1'

    if (prisma) {
      try {
        const dbMessages = await prisma.message.findMany({
          where: { candidateId },
          orderBy: { createdAt: 'asc' }
        })
        if (dbMessages && dbMessages.length > 0) {
          const formatted = dbMessages.map(m => ({
            id: m.id,
            candidateId: m.candidateId,
            sender: m.sender as 'RECRUITER' | 'CANDIDATE',
            content: m.content,
            createdAt: m.createdAt.toISOString()
          }))
          return NextResponse.json({ success: true, messages: formatted })
        }
      } catch (dbErr) {
        console.warn('PostgreSQL: Could not fetch messages from DB, using fallback memory store:', dbErr)
      }
    }

    const filtered = MOCK_MESSAGES_STORE.filter(m => m.candidateId === candidateId || candidateId === '1')
    return NextResponse.json({ success: true, messages: filtered })
  } catch (error) {
    console.error('Fetch messages endpoint error:', error)
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateId, sender, content } = body

    if (!candidateId || !sender || !content) {
      return NextResponse.json({ error: 'Missing candidateId, sender, or content' }, { status: 400 })
    }

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      candidateId,
      sender: sender === 'CANDIDATE' ? 'CANDIDATE' : 'RECRUITER',
      content,
      createdAt: new Date().toISOString()
    }

    if (prisma) {
      try {
        await prisma.message.create({
          data: {
            id: newMessage.id,
            candidateId,
            sender: newMessage.sender,
            content
          }
        })
        console.log(`[PostgreSQL] Saved chat message ${newMessage.id} for candidate ${candidateId}`)
      } catch (dbErr) {
        console.warn('PostgreSQL: Message creation in DB skipped, stored in fallback cache:', dbErr)
      }
    }

    MOCK_MESSAGES_STORE.push(newMessage)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      chatMessage: newMessage
    })
  } catch (error) {
    console.error('Send message endpoint error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
