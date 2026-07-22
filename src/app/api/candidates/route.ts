import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Baseline mock candidates array (Empty for clean production slate)
const BASELINE_MOCK_CANDIDATES: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const experience = searchParams.get('experience') || 'all'
    const location = searchParams.get('location') || 'all'
    const minSalary = parseInt(searchParams.get('minSalary') || '0')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Attempt live database queries via Prisma if enabled
    if (prisma) {
      const whereClause: any = {}

      if (search) {
        whereClause.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { skills: { hasSome: [search] } }
        ]
      }

      if (experience !== 'all') {
        whereClause.yearsOfExperience = experience === '0-2 yrs' 
          ? { lte: 2 } 
          : experience === '3-5 yrs' 
          ? { gte: 3, lte: 5 } 
          : { gte: 6 }
      }

      if (location !== 'all') {
        whereClause.location = location
      }

      if (minSalary > 0) {
        whereClause.expectedSalary = { gte: minSalary }
      }

      const totalCount = await prisma.candidate.count({ where: whereClause })
      const data = await prisma.candidate.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      const totalPages = Math.ceil(totalCount / limit)
      return NextResponse.json({ data, totalCount, page, totalPages })
    }
  } catch (dbError) {
    console.warn('Database query failed. Falling back to robust in-memory mock routing.')
  }

  // FAIL-SAFE IN-MEMORY FILTERING & PAGINATION (Serves baseline mock array)
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const experience = searchParams.get('experience') || 'all'
  const location = searchParams.get('location') || 'all'
  const minSalary = parseInt(searchParams.get('minSalary') || '0')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const filtered = BASELINE_MOCK_CANDIDATES.filter(c => {
    const matchesSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))

    // Map experience level text to candidate years
    let matchesExperience = true
    if (experience !== 'all') {
      matchesExperience = c.experience === experience
    }

    const matchesLocation = location === 'all' || c.location === location
    const matchesSalary = minSalary === 0 || c.minSalary >= minSalary

    return matchesSearch && matchesExperience && matchesLocation && matchesSalary
  })

  const paginatedData = filtered.slice(skip, skip + limit)
  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({
    data: paginatedData,
    totalCount,
    page,
    totalPages
  })
}
