import prisma from '@/lib/prisma'

export interface RelationalCandidate {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  yearsOfExperience: number
  expectedSalary?: number
  skills: string[]
  resumeUrl?: string
  rawResumeText?: string
  createdAt?: Date
}

// In-memory relational candidate store fallback
const MOCK_CANDIDATE_DB: Record<string, RelationalCandidate> = {
  "1": {
    id: "1",
    fullName: "Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, IN (Hybrid)",
    yearsOfExperience: 8,
    expectedSalary: 120000,
    skills: ["Python", "React", "AWS", "TypeScript", "Docker", "PostgreSQL"],
    rawResumeText: "Senior Software Engineer with 8+ years experience designing scalable client-side features and backend infrastructure."
  },
  "2": {
    id: "2",
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98765 43211",
    location: "Remote",
    yearsOfExperience: 6,
    expectedSalary: 135000,
    skills: ["AWS", "Docker", "Kubernetes", "Go", "Terraform"],
    rawResumeText: "Cloud Infrastructure Architect with expertise in AWS, Docker, and Kubernetes deployment pipelines."
  },
  "3": {
    id: "3",
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 98765 43212",
    location: "On-site",
    yearsOfExperience: 3,
    expectedSalary: 95000,
    skills: ["React", "TypeScript", "CSS", "Next.js", "Redux"],
    rawResumeText: "Frontend UI/UX Engineer specialized in React, TypeScript, and modern component design systems."
  },
  "4": {
    id: "4",
    fullName: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "+91 98765 43213",
    location: "Remote",
    yearsOfExperience: 4,
    expectedSalary: 110000,
    skills: ["Node.js", "React", "Python", "MongoDB", "Express"],
    rawResumeText: "Full Stack Developer proficient in Node.js, React, Python, and microservice concurrency."
  }
}

/**
 * Store relational candidate record into PostgreSQL via Prisma or fallback store
 */
export async function saveRelationalCandidate(candidate: RelationalCandidate): Promise<boolean> {
  if (prisma) {
    try {
      await prisma.candidate.upsert({
        where: { email: candidate.email },
        update: {
          fullName: candidate.fullName,
          phone: candidate.phone,
          location: candidate.location,
          yearsOfExperience: candidate.yearsOfExperience,
          expectedSalary: candidate.expectedSalary || 100000,
          skills: candidate.skills,
          rawResumeText: candidate.rawResumeText || ''
        },
        create: {
          id: candidate.id,
          fullName: candidate.fullName,
          email: candidate.email,
          phone: candidate.phone,
          location: candidate.location,
          yearsOfExperience: candidate.yearsOfExperience,
          expectedSalary: candidate.expectedSalary || 100000,
          skills: candidate.skills,
          rawResumeText: candidate.rawResumeText || ''
        }
      })
      console.log(`[PostgreSQL] Saved relational record for candidate ${candidate.id}`)
      return true
    } catch (e) {
      console.warn('[PostgreSQL] Database save skipped, storing in fallback relational cache:', e)
    }
  }

  MOCK_CANDIDATE_DB[candidate.id] = candidate
  return true
}

/**
 * Fetch full candidate profiles from PostgreSQL for a list of candidate IDs
 */
export async function getCandidatesByIds(ids: string[]): Promise<RelationalCandidate[]> {
  if (prisma && ids.length > 0) {
    try {
      const dbCandidates = await prisma.candidate.findMany({
        where: { id: { in: ids } }
      })
      if (dbCandidates && dbCandidates.length > 0) {
        return dbCandidates.map(c => ({
          id: c.id,
          fullName: c.fullName,
          email: c.email,
          phone: c.phone || '',
          location: c.location || 'Remote',
          yearsOfExperience: c.yearsOfExperience || 5,
          expectedSalary: c.expectedSalary ? Number(c.expectedSalary) : undefined,
          skills: c.skills || [],
          rawResumeText: c.rawResumeText || undefined
        }))
      }
    } catch (e) {
      console.warn('[PostgreSQL] Failed to fetch candidate records by IDs from DB:', e)
    }
  }

  // Return candidates matching requested IDs from mock store
  return ids
    .map(id => MOCK_CANDIDATE_DB[id])
    .filter((c): c is RelationalCandidate => Boolean(c))
}
