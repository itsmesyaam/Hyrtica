import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Lead Quality Control QA',
    company: 'Ashford',
    location: 'France',
    logoBg: 'bg-red-100 text-red-650',
    type: 'Full Time',
    postedDate: 'Posted 4 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['App', 'Figma', 'Java'],
    salaryRate: '$500/Hour',
    category: 'Content Writer'
  },
  {
    id: '2',
    title: 'React Native Web Developer',
    company: 'Percepta',
    location: 'Germany',
    logoBg: 'bg-teal-100 text-teal-600',
    type: 'Part Time',
    postedDate: 'Posted 4 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['App', 'Figma', 'PSD'],
    salaryRate: '$800/Hour',
    category: 'Content Writer'
  },
  {
    id: '3',
    title: 'Senior System Engineer',
    company: 'Tesla',
    location: 'Denmark',
    logoBg: 'bg-amber-100 text-amber-600',
    type: 'Temporary',
    postedDate: 'Posted 4 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['App', 'Figma', 'Java'],
    salaryRate: '$500/Hour',
    category: 'Finance'
  },
  {
    id: '4',
    title: 'Full Stack Engineer',
    company: 'Bing Search',
    location: 'New York, USA',
    logoBg: 'bg-indigo-100 text-indigo-600',
    type: 'Internship',
    postedDate: 'Posted 5 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['Figma', 'Java', 'Go'],
    salaryRate: '$800/Hour',
    category: 'Human Resource'
  },
  {
    id: '5',
    title: 'Frontend Developer',
    company: 'Amazon',
    location: 'London',
    logoBg: 'bg-sky-100 text-sky-600',
    type: 'Full Time',
    postedDate: 'Posted 5 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['React', 'CSS', 'TypeScript'],
    salaryRate: '$600/Hour',
    category: 'Management'
  },
  {
    id: '6',
    title: 'UI / UX Designer fulltime',
    company: 'Exela Movers',
    location: 'Australia',
    logoBg: 'bg-emerald-100 text-emerald-650',
    type: 'Part Time',
    postedDate: 'Posted 5 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['Figma', 'UI', 'Web'],
    salaryRate: '$450/Hour',
    category: 'Market Research'
  },
  {
    id: '7',
    title: 'Java Software Engineer',
    company: 'Aceable, Inc.',
    location: 'London',
    logoBg: 'bg-orange-100 text-orange-600',
    type: 'Part Time',
    postedDate: 'Posted 5 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['Java', 'Spring', 'AWS'],
    salaryRate: '$550/Hour',
    category: 'Marketing & Sale'
  },
  {
    id: '8',
    title: 'Full Stack Developer',
    company: 'Baseball Saving',
    location: 'Australia',
    logoBg: 'bg-violet-100 text-violet-650',
    type: 'Full Time',
    postedDate: 'Posted 5 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['Node', 'React', 'Docker'],
    salaryRate: '$750/Hour',
    category: 'Software'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''

    if (prisma) {
      const whereClause: any = {}
      if (category) {
        whereClause.description = { contains: category, mode: 'insensitive' }
      }
      
      const data = await prisma.jobPosting.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      })
      
      if (data.length > 0) {
        return NextResponse.json(data)
      }
    }
  } catch (error) {
    console.warn('Database query failed. Serving static jobs list.')
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  
  const filtered = category 
    ? MOCK_JOBS.filter(job => job.category === category)
    : MOCK_JOBS

  return NextResponse.json(filtered)
}
