import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export interface TaskItem {
  id: string
  candidateId: string
  title: string
  description: string
  dueDate: string
  status: 'PENDING' | 'SUBMITTED' | 'COMPLETED'
  createdAt: string
}

// In-memory tasks store for fallback when PostgreSQL database is offline or unmigrated
const MOCK_TASKS_STORE: TaskItem[] = [
  {
    id: 'task-1',
    candidateId: '1',
    title: 'Distributed Systems & API Concurrency Assessment',
    description: 'Complete the 45-minute coding assessment evaluating Node.js & Python event-loop performance.',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    candidateId: '1',
    title: 'System Architecture Blueprints Submission',
    description: 'Submit an architectural diagram for a multi-region proxy load balancer.',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId') || '1'

    if (prisma) {
      try {
        const dbTasks = await prisma.task.findMany({
          where: { candidateId },
          orderBy: { createdAt: 'desc' }
        })
        if (dbTasks && dbTasks.length > 0) {
          const formatted = dbTasks.map(t => ({
            id: t.id,
            candidateId: t.candidateId,
            title: t.title,
            description: t.description,
            dueDate: t.dueDate.toISOString(),
            status: t.status as 'PENDING' | 'SUBMITTED' | 'COMPLETED',
            createdAt: t.createdAt.toISOString()
          }))
          return NextResponse.json({ success: true, tasks: formatted })
        }
      } catch (dbErr) {
        console.warn('PostgreSQL: Could not fetch tasks from DB, using fallback memory store:', dbErr)
      }
    }

    const filtered = MOCK_TASKS_STORE.filter(t => t.candidateId === candidateId || candidateId === '1')
    return NextResponse.json({ success: true, tasks: filtered })
  } catch (error) {
    console.error('Fetch tasks endpoint error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateId, title, description, dueDate } = body

    if (!candidateId || !title || !description) {
      return NextResponse.json({ error: 'Missing candidateId, title, or description' }, { status: 400 })
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      candidateId,
      title,
      description,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 4).toISOString(),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }

    if (prisma) {
      try {
        await prisma.task.create({
          data: {
            id: newTask.id,
            candidateId,
            title,
            description,
            dueDate: new Date(newTask.dueDate),
            status: 'PENDING'
          }
        })
        console.log(`[PostgreSQL] Created task record ${newTask.id} for candidate ${candidateId}`)
      } catch (dbErr) {
        console.warn('PostgreSQL: Task creation in DB skipped, stored in fallback cache:', dbErr)
      }
    }

    MOCK_TASKS_STORE.unshift(newTask)

    return NextResponse.json({
      success: true,
      message: 'Assessment task assigned successfully!',
      task: newTask
    })
  } catch (error) {
    console.error('Assign task endpoint error:', error)
    return NextResponse.json({ error: 'Failed to assign assessment task' }, { status: 500 })
  }
}
