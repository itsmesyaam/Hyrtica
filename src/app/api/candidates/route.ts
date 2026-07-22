import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 10 baseline mock candidates matching the recruiter UI
const BASELINE_MOCK_CANDIDATES = [
  {
    id: '1',
    name: 'Amit Sharma',
    title: 'Senior Software Engineer',
    experience: '5+ yrs',
    location: 'Hybrid',
    locationName: 'Mumbai, IN',
    minSalary: 120000,
    matchScore: 94,
    skills: ['Python', 'React', 'AWS'],
    status: 'Shortlisted',
    avatarBg: 'bg-blue-100 text-blue-600',
    email: 'amit.sharma@example.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/amit-sharma',
    bio: 'Infrastructure specialist with over 8 years of experience building secure web endpoints and scaling application pipelines.',
    parsedCvSummary: '8+ years expert in backend systems design, Python REST APIs, React state synchronization, and Terraform automation.',
    workHistory: [
      {
        role: 'Senior Infrastructure Engineer',
        company: 'Global Build-Tech Solutions',
        duration: '2023 - Present',
        achievements: [
          'Designed a distributed proxy gateway balancing up to 15,000 requests/sec during peak traffic.',
          'Hardened Docker pipeline security configurations, reducing container vulnerability flags by 85%.',
          'Orchestrated multi-environment Terraform scripts supporting automated tenant provisioning.'
        ]
      },
      {
        role: 'Software Engineer',
        company: 'BuildLink Systems',
        duration: '2020 - 2023',
        achievements: [
          'Integrated PostgreSQL database clustering, cutting query response latency by 30%.',
          'Developed core database wrappers using secure parameter bindings to completely block SQL injection.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Technology in Computer Science',
      institution: 'Indian Institute of Technology, Bombay',
      year: '2020'
    },
    certifications: [
      'AWS Certified Solutions Architect - Associate',
      'HashiCorp Certified Terraform Associate'
    ],
    aiCompetencies: [
      'Distributed Gateway Architecture',
      'SQL Query Optimization',
      'Secure Parameter Bindings'
    ]
  },
  {
    id: '2',
    name: 'Priya Patel',
    title: 'Cloud Infrastructure Architect',
    experience: '5+ yrs',
    location: 'Remote',
    locationName: 'Pune, IN',
    minSalary: 145000,
    matchScore: 88,
    skills: ['AWS', 'Docker', 'Kubernetes'],
    status: 'New',
    avatarBg: 'bg-teal-100 text-teal-600',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    linkedin: 'linkedin.com/in/priya-patel',
    bio: 'AWS certified architect focused on cloud-native migrations, serverless clusters, and multi-region Kubernetes deployments.',
    parsedCvSummary: 'AWS Solutions Architect with 6+ years designing scalable EKS clusters, CI/CD automations, and disaster recovery blueprints.',
    workHistory: [
      {
        role: 'Lead Cloud Architect',
        company: 'Aether Cloud Operations',
        duration: '2022 - Present',
        achievements: [
          'Architected multi-region active-active Kubernetes clusters, achieving 99.99% system availability.',
          'Configured automated Terraform recovery modules for instant cross-region server failover.',
          'Managed a $120k monthly cloud budget, implementing resource tagging that saved 22% in wastes.'
        ]
      },
      {
        role: 'DevOps Specialist',
        company: 'Apex Cloud Solutions',
        duration: '2019 - 2022',
        achievements: [
          'Maintained CI/CD pipelines supporting 120 deployment cycles per day across 8 engineering teams.',
          'Set up Prometheus and Grafana alerts, dropping the average incident detection time from 20m to 3m.'
        ]
      }
    ],
    education: {
      degree: 'Master of Science in Cloud Computing',
      institution: 'BITS Pilani',
      year: '2019'
    },
    certifications: [
      'AWS Certified Solutions Architect - Professional',
      'Certified Kubernetes Administrator (CKA)'
    ],
    aiCompetencies: [
      'Multi-region Disaster Recovery',
      'Infrastructure as Code (IaC)',
      'Telemetry Alerting Systems'
    ]
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    title: 'Frontend UI/UX Engineer',
    experience: '3-5 yrs',
    location: 'On-site',
    locationName: 'Delhi, IN',
    minSalary: 85000,
    matchScore: 91,
    skills: ['React', 'TypeScript', 'CSS'],
    status: 'New',
    avatarBg: 'bg-indigo-100 text-indigo-600',
    email: 'rajesh.k@example.com',
    phone: '+91 76543 21098',
    linkedin: 'linkedin.com/in/rajesh-kumar',
    bio: 'Passionate frontend developer obsessed with design systems, accessibility guidelines (WCAG AAA), and fluid animation packages.',
    parsedCvSummary: 'UI/UX engineer with 4 years creating typed component systems in React, accessibility audits, and bundle size reduction.',
    workHistory: [
      {
        role: 'UI/UX Frontend Engineer',
        company: 'CoreDesign Digital Agency',
        duration: '2023 - Present',
        achievements: [
          'Designed and implemented a customizable Next.js design system component library.',
          'Overhauled user portal accessibility, lifting WCAG compliance score to AAA level.',
          'Reduced web bundle load sizes by 32% utilizing lazy loading and tree-shaking methodologies.'
        ]
      },
      {
        role: 'Junior Frontend Developer',
        company: 'PixelPerfect Labs',
        duration: '2021 - 2023',
        achievements: [
          'Developed responsive templates and charts using HTML5 canvas elements and Tailwind CSS.',
          'Integrated client-side state managers with REST APIs, decreasing data refresh lags.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Science in Information Technology',
      institution: 'Delhi University',
      year: '2021'
    },
    certifications: [
      'Google UX Design Certificate',
      'W3C Web Accessibility Specialist Credentials'
    ],
    aiCompetencies: [
      'Design System Architecture',
      'WCAG AAA Compliance Audits',
      'Frontend Bundle Size Optimization'
    ]
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    title: 'Full Stack Developer',
    experience: '3-5 yrs',
    location: 'Remote',
    locationName: 'Bangalore, IN',
    minSalary: 95000,
    matchScore: 95,
    skills: ['Node.js', 'React', 'Python'],
    status: 'Contacted',
    avatarBg: 'bg-purple-100 text-purple-600',
    email: 'sneha.reddy@example.com',
    phone: '+91 65432 10987',
    linkedin: 'linkedin.com/in/sneha-reddy',
    bio: 'Versatile builder comfortable writing backend API integrations and responsive frontends. Experienced in distributed data syncing.',
    parsedCvSummary: 'Full-stack Javascript and Python engineer, specializing in Node.js event concurrency, WebSocket pipelines, and Redis speeds.',
    workHistory: [
      {
        role: 'Full Stack Engineer',
        company: 'Stanza Software Hub',
        duration: '2022 - Present',
        achievements: [
          'Developed Node.js data syncing service handles 4M logs daily over WebSocket pipelines.',
          'Designed client dashboard with dynamic drag-and-drop metrics visualizer panels.',
          'Configured Redis caching, increasing API response speeds for catalog fetches by 45%.'
        ]
      },
      {
        role: 'Full Stack Developer',
        company: 'InnovateTech Solutions',
        duration: '2020 - 2022',
        achievements: [
          'Created JWT authorization mechanisms and user profiles backend with Express and MongoDB.',
          'Maintained responsive dashboard forms, achieving seamless performance on high-glare mobile screens.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Engineering in Information Science',
      institution: 'PES University, Bangalore',
      year: '2020'
    },
    certifications: [
      'AWS Certified Developer - Associate',
      'Certified Scrum Developer (CSD)'
    ],
    aiCompetencies: [
      'WebSocket Synchronization',
      'API Cache Implementation',
      'Token Authentication Security'
    ]
  },
  {
    id: '5',
    name: 'Vikram Singh',
    title: 'DevOps & GitOps Specialist',
    experience: '5+ yrs',
    location: 'Hybrid',
    locationName: 'Hyderabad, IN',
    minSalary: 130000,
    matchScore: 96,
    skills: ['Docker', 'Kubernetes', 'Go'],
    status: 'Shortlisted',
    avatarBg: 'bg-emerald-100 text-emerald-650',
    email: 'vikram.s@example.com',
    phone: '+91 54321 09876',
    linkedin: 'linkedin.com/in/vikram-singh',
    bio: 'SRE focused on zero-downtime database cleanups, automatic failover configurations, and continuous delivery with ArgoCD.',
    parsedCvSummary: 'Systems and DevOps specialist with 7+ years optimizing Kubernetes staging spaces, container packaging, and Go scripts.',
    workHistory: [
      {
        role: 'Senior DevOps Architect',
        company: 'InfraScale Systems',
        duration: '2023 - Present',
        achievements: [
          'Pioneered continuous delivery pipelines using ArgoCD, reducing application deploy cycles to under 5 mins.',
          'Coded a custom resource cleanup agent in Go, saving $14,000 in unused staging environments.',
          'Hardened Kubernetes cluster egress policies, completely blocking unauthorized namespace queries.'
        ]
      },
      {
        role: 'Systems Administrator',
        company: 'NetCorp Services',
        duration: '2021 - 2023',
        achievements: [
          'Maintained high-availability Linux servers and configured active-standby database replication parameters.',
          'Coordinated disaster recovery fire drills, proving complete cross-site service restoration in under 12 mins.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Technology in Computer Engineering',
      institution: 'JNTU Hyderabad',
      year: '2021'
    },
    certifications: [
      'Certified Kubernetes Security Specialist (CKS)',
      'Red Hat Certified System Administrator (RHCSA)'
    ],
    aiCompetencies: [
      'GitOps Delivery Models',
      'Kubernetes Security Hardening',
      'Automation Scripting in Go'
    ]
  },
  {
    id: '6',
    name: 'Aishwarya Sen',
    title: 'Junior Data Analyst',
    experience: '0-2 yrs',
    location: 'On-site',
    locationName: 'Kolkata, IN',
    minSalary: 55000,
    matchScore: 87,
    skills: ['Python', 'SQL'],
    status: 'New',
    avatarBg: 'bg-rose-100 text-rose-655',
    email: 'aishwarya.sen@example.com',
    phone: '+91 43210 98765',
    linkedin: 'linkedin.com/in/aishwarya-sen',
    bio: 'Eager analytics professional specializing in data hygiene, visualization scripts, and compiling transactional metrics.',
    parsedCvSummary: 'Entry-level analytics associate, proficient in Python Pandas cleansing scripting, SQL relational queries, and funnels reporting.',
    workHistory: [
      {
        role: 'Junior Data Analyst',
        company: 'Insight Data Works',
        duration: '2024 - Present',
        achievements: [
          'Cleaned and verified large datasets, boosting data ingestion pipelines fidelity by 15%.',
          'Wrote custom Python pandas scripts to automate weekly customer funnel churn logs compiling.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Science in Statistics',
      institution: 'Presidency University, Kolkata',
      year: '2024'
    },
    certifications: [
      'Google Advanced Data Analytics Certificate',
      'SQL Certification - HackerRank Professional'
    ],
    aiCompetencies: [
      'Funnel Analytics Reporting',
      'Data Scrubbing Pipelines',
      'Pandas Automation Scripting'
    ]
  },
  {
    id: '7',
    name: 'Rohan Mehta',
    title: 'Junior Frontend Developer',
    experience: '0-2 yrs',
    location: 'Hybrid',
    locationName: 'Ahmedabad, IN',
    minSalary: 50000,
    matchScore: 82,
    skills: ['React', 'CSS', 'TypeScript'],
    status: 'New',
    avatarBg: 'bg-amber-100 text-amber-600',
    email: 'rohan.mehta@example.com',
    phone: '+91 32109 87654',
    linkedin: 'linkedin.com/in/rohan-mehta',
    bio: 'Graduate developer skilled in semantic layout structures, CSS flexbox models, and creating responsive single-page dashboards.',
    parsedCvSummary: 'Front-end trainee developer, proficient in responsive CSS flexbox templates, semantic HTML markup, and React refactoring.',
    workHistory: [
      {
        role: 'Frontend Trainee',
        company: 'TechCraft Solutions',
        duration: '2025 - Present',
        achievements: [
          'Collaborated with designers to convert mockups into cross-browser pixel-perfect CSS templates.',
          'Assisted in refactoring legacy jQuery elements to reusable React components.'
        ]
      }
    ],
    education: {
      degree: 'Diploma in Information Technology',
      institution: 'Gujarat Technological University',
      year: '2024'
    },
    certifications: [
      'Meta Front-End Developer Professional Certificate'
    ],
    aiCompetencies: [
      'Responsive Web Templating',
      'jQuery to React Refactoring',
      'CSS Flexbox Layout Models'
    ]
  },
  {
    id: '8',
    name: 'Karan Johar',
    title: 'Backend API Engineer',
    experience: '3-5 yrs',
    location: 'Remote',
    locationName: 'Gurgaon, IN',
    minSalary: 90000,
    matchScore: 89,
    skills: ['Node.js', 'Go', 'SQL'],
    status: 'New',
    avatarBg: 'bg-violet-100 text-violet-650',
    email: 'karan.j@example.com',
    phone: '+91 21098 76543',
    linkedin: 'linkedin.com/in/karan-johar',
    bio: 'Backend developer focused on relational database schemas, secure session management, and microservice communication patterns.',
    parsedCvSummary: 'Node and Go backend API specialist with 3 years establishing indexing models, event logs trails, and microservices.',
    workHistory: [
      {
        role: 'Associate Backend Engineer',
        company: 'Veloce Telecom Systems',
        duration: '2023 - Present',
        achievements: [
          'Maintained node-based transaction routers serving 80,000 active users.',
          'Refactored SQL schemas with precise index structures, reducing slow queries by 40%.',
          'Coded secondary system audit utilities in Go to track internal event trails.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Amity University, Noida',
      year: '2023'
    },
    certifications: [
      'Certified Node Developer',
      'PostgreSQL Professional Certification'
    ],
    aiCompetencies: [
      'Database Schema Indexing',
      'Audit Trail Frameworks',
      'Relational Query Structures'
    ]
  },
  {
    id: '9',
    name: 'Neha Gupta',
    title: 'Machine Learning Engineer',
    experience: '5+ yrs',
    location: 'Remote',
    locationName: 'Chennai, IN',
    minSalary: 140000,
    matchScore: 97,
    skills: ['Python', 'Go'],
    status: 'Contacted',
    avatarBg: 'bg-sky-100 text-sky-655',
    email: 'neha.gupta@example.com',
    phone: '+91 10987 65432',
    linkedin: 'linkedin.com/in/neha-gupta',
    bio: 'Research engineer implementing predictive analytics algorithms, model optimization pipelines, and high-performance inference engines.',
    parsedCvSummary: 'ML systems and algorithms designer with 6+ years fine-tuning predictive text restoration models and batch scraping lines.',
    workHistory: [
      {
        role: 'Machine Learning Engineer',
        company: 'NeuralCompute Systems',
        duration: '2022 - Present',
        achievements: [
          'Optimized neural net inference engines, reducing execution times on edge chips by 28%.',
          'Pioneered automatic text attribution frameworks using Python model fine-tuning.',
          'Engineered parallel batch data scraping tasks executing in distributed threads.'
        ]
      },
      {
        role: 'Data Scientist',
        company: 'QuantAnalytica Labs',
        duration: '2019 - 2022',
        achievements: [
          'Built churn prediction regressions with 91% accuracy rates for enterprise finance portals.',
          'Automated data scrubbing systems, removing dirty logs across SQL warehouses.'
        ]
      }
    ],
    education: {
      degree: 'Master of Technology in Data Science',
      institution: 'IIT Madras',
      year: '2019'
    },
    certifications: [
      'TensorFlow Developer Certificate',
      'DeepLearning.AI TensorFlow Professional'
    ],
    aiCompetencies: [
      'Inference Engine Tuning',
      'Text Restoration Algorithms',
      'Parallel Data Ingestion Models'
    ]
  },
  {
    id: '10',
    name: 'Aditya Rao',
    title: 'Systems Software Engineer',
    experience: '5+ yrs',
    location: 'On-site',
    locationName: 'Bangalore, IN',
    minSalary: 110000,
    matchScore: 90,
    skills: ['Go', 'Docker', 'Kubernetes'],
    status: 'Rejected',
    avatarBg: 'bg-slate-100 text-slate-655',
    email: 'aditya.rao@example.com',
    phone: '+91 99887 76655',
    linkedin: 'linkedin.com/in/aditya-rao',
    bio: 'Low-level systems architect focused on concurrent network connections, API throttling layers, and container security profiles.',
    parsedCvSummary: 'Systems systems software builder, expert in concurrent socket coding, sandboxed Docker limits, and proxy systems configuration.',
    workHistory: [
      {
        role: 'Systems Software Developer',
        company: 'NetHard Networks',
        duration: '2023 - Present',
        achievements: [
          'Developed multithreaded network listeners in Go resolving socket spikes cleanly.',
          'Dockerized systems utility tools, creating secure sandbox boundaries.',
          'Engineered secure proxy configs bypassing system latency limits.'
        ]
      }
    ],
    education: {
      degree: 'Bachelor of Technology in Electronics',
      institution: 'RV College of Engineering, Bangalore',
      year: '2022'
    },
    certifications: [
      'AWS Certified Developer - Associate',
      'Docker Certified Associate (DCA)'
    ],
    aiCompetencies: [
      'Concurrent Network Sockets',
      'Container Sandbox Configurations',
      'Docker Core Packaging'
    ]
  }
]

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
