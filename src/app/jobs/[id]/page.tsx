import React from 'react'
import Header from '@/components/Header'
import prisma from '@/lib/prisma'
import JobDetailClient from './JobDetailClient'

export const dynamic = 'force-dynamic'

interface JobCard {
  id: string
  title: string
  companyName: string
  location: string
  jobType: string
  salaryRange: string
  description: string
  requiredSkills: string[]
  createdAt?: string
}

const MOCK_JOBS: Record<string, JobCard> = {
  '1': {
    id: '1',
    title: 'Senior Software Engineer (Distributed Systems)',
    companyName: 'Hyrtica Tech',
    location: 'San Francisco, CA (Hybrid)',
    jobType: 'Full-time',
    salaryRange: '$160,000 - $210,000 / year',
    description: 'We are seeking an experienced Senior Software Engineer to build scalable backend microservices, real-time data pipelines, and high-throughput API endpoints. You will work closely with AI engineers integrating vector search indexes for candidate matching at scale.',
    requiredSkills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'Redis', 'Distributed Systems'],
    createdAt: new Date().toISOString()
  },
  '2': {
    id: '2',
    title: 'Frontend Tech Lead (React & Next.js)',
    companyName: 'Naukri scale Labs',
    location: 'Remote',
    jobType: 'Full-time',
    salaryRange: '$140,000 - $185,000 / year',
    description: 'Looking for a passionate Frontend Lead to architect state-of-the-art Web UI applications using Next.js Turbopack, TailwindCSS, and responsive design patterns.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'UI Architecture'],
    createdAt: new Date().toISOString()
  },
  '3': {
    id: '3',
    title: 'Cloud DevOps & Infrastructure Engineer',
    companyName: 'CloudScale Inc',
    location: 'Remote',
    jobType: 'Full-time',
    salaryRange: '$150,000 - $190,000 / year',
    description: 'Manage automated deployment pipelines on Railway, AWS, and Docker container orchestration. Ensure 99.99% uptime and zero-downtime database migrations.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Railway'],
    createdAt: new Date().toISOString()
  }
}

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let job: JobCard | null = null

  if (prisma) {
    try {
      const dbJob = await prisma.jobPosting.findUnique({
        where: { id }
      })
      if (dbJob) {
        job = {
          id: dbJob.id,
          title: dbJob.title,
          companyName: dbJob.companyName,
          location: dbJob.location,
          jobType: dbJob.jobType,
          salaryRange: dbJob.salaryRange,
          description: dbJob.description,
          requiredSkills: dbJob.requiredSkills,
          createdAt: dbJob.createdAt.toISOString()
        }
      }
    } catch (dbErr) {
      console.warn('PostgreSQL job detail fetch warning:', dbErr)
    }
  }

  if (!job) {
    job = MOCK_JOBS[id] || MOCK_JOBS['1']
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 font-sans">
      <Header />
      <JobDetailClient job={job} />
    </div>
  )
}
