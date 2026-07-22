import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const FIRST_NAMES = [
  'Amit', 'Priya', 'Rajesh', 'Sneha', 'Vikram', 'Aishwarya', 'Rohan', 'Neha', 'Aditya', 'Anjali',
  'Vijay', 'Sunita', 'Sanjay', 'Kiran', 'Deepak', 'Meera', 'Arjun', 'Pooja', 'Rahul', 'Divya',
  'David', 'Sarah', 'John', 'Emily', 'Michael', 'Jessica', 'James', 'Ashley', 'Robert', 'Amanda',
  'William', 'Olivia', 'Joseph', 'Sophia', 'Thomas', 'Isabella', 'Charles', 'Mia', 'Daniel', 'Charlotte',
  'Ramesh', 'Gita', 'Harish', 'Kavita', 'Suresh', 'Lata', 'Mohan', 'Sita', 'Anil', 'Jyoti'
]

const LAST_NAMES = [
  'Sharma', 'Patel', 'Kumar', 'Reddy', 'Singh', 'Sen', 'Mehta', 'Johar', 'Gupta', 'Rao',
  'Nair', 'Joshi', 'Verma', 'Pillai', 'Deshmukh', 'Choudhury', 'Iyer', 'Bose', 'Das', 'Roy',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
  'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
  'Dwivedi', 'Trivedi', 'Pandey', 'Mishra', 'Dubey', 'Shukla', 'Chatterjee', 'Mukherjee', 'Banerjee', 'Ghosh'
]

const TITLES = [
  'Senior Software Engineer', 'Frontend UI/UX Developer', 'Backend API Developer', 'Cloud DevOps Specialist',
  'Data Science Associate', 'Systems Infrastructure Architect', 'Product Development Manager',
  'Machine Learning Engineer', 'Security Operations Engineer', 'Full Stack JavaScript Specialist'
]

const CITIES = [
  'Mumbai, IN', 'Bangalore, IN', 'Hyderabad, IN', 'Delhi, IN', 'Chennai, IN',
  'Pune, IN', 'London, UK', 'New York, USA', 'San Francisco, USA', 'Sydney, AU'
]

const TECH_SKILLS = [
  'Python', 'React', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Node.js', 'Go', 'CSS', 'SQL',
  'Java', 'C++', 'Terraform', 'Prometheus', 'Grafana', 'Next.js', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis'
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomSkills(count: number): string[] {
  const shuffled = [...TECH_SKILLS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

async function main() {
  console.log('Clearing existing database records...')
  await prisma.application.deleteMany({})
  await prisma.jobPosting.deleteMany({})
  await prisma.candidate.deleteMany({})

  console.log('Seeding 50 mock candidate records...')
  
  for (let i = 0; i < 50; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const fullName = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`
    const title = getRandomElement(TITLES)
    const location = getRandomElement(CITIES)
    const yearsOfExperience = Math.floor(Math.random() * 12) + 1 // 1 to 12 years
    const expectedSalary = (Math.floor(Math.random() * 10) + 5) * 15000 // $75,000 to $210,000
    const skills = getRandomSkills(Math.floor(Math.random() * 4) + 3) // 3 to 6 skills
    const phone = `+91 ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`
    const linkedin = `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}`
    const bio = `Experienced ${title} with a proven track record of designing scalable client-side features, database optimizations, and containerized deployment setups.`
    const rawResumeText = `${fullName}\n${title}\nLocation: ${location}\nExperience: ${yearsOfExperience} years\nCore Skills: ${skills.join(', ')}\n\nBio:\n${bio}\n\nEducation:\nBachelor of Technology in Computer Engineering`
    
    await prisma.candidate.create({
      data: {
        fullName,
        email,
        phone,
        location,
        yearsOfExperience,
        expectedSalary,
        skills,
        rawResumeText,
        resumeUrl: `https://hyrtica-resumes.s3.amazonaws.com/cv-${i}.pdf`
      }
    })
  }

  console.log('Seeding complete. 50 candidate profiles added.')
}

main()
  .catch(e => {
    console.error('Error during database seed execution:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
