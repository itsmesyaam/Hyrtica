"use client"

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Hexagon, Search, Filter, Briefcase, MapPin, 
  Award, ChevronDown, ChevronLeft, ChevronRight, 
  X, Phone, Mail, Link2, CheckCircle2, Clock, 
  Check, RefreshCw, Cpu, Sparkles, FileDown, 
  CalendarRange, MessageSquare, Save, Users, 
  GraduationCap, Calendar, Star, Building2, Eye
} from 'lucide-react'

// Define interfaces
interface WorkHistory {
  role: string
  company: string
  duration: string
  achievements: string[]
}

interface Education {
  degree: string
  institution: string
  year: string
}

interface Candidate {
  id: string
  name: string
  title: string
  experience: '0-2 yrs' | '3-5 yrs' | '5+ yrs' | string
  location: 'Remote' | 'Hybrid' | 'On-site' | string
  locationName: string
  minSalary: number // expected salary in USD per year
  matchScore: number
  matchScoreText?: string
  rationale?: string
  skills: string[]
  status: 'New' | 'Shortlisted' | 'Contacted' | 'Rejected'
  avatarBg: string
  email: string
  phone: string
  linkedin: string
  bio: string
  parsedCvSummary: string
  workHistory: WorkHistory[]
  education: Education
  certifications: string[]
  aiCompetencies: string[]
}

interface JobCard {
  id: string
  title: string
  company: string
  location: string
  type: string
  applicantsCount: number
  posted: string
  badgeBg: string
}

const ACTIVE_JOB_CARDS: JobCard[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Hyrtica Tech',
    location: 'Mumbai, IN (Hybrid)',
    type: 'Full Time',
    applicantsCount: 42,
    posted: '2d ago',
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  {
    id: '2',
    title: 'Cloud Infrastructure Architect',
    company: 'Aether Cloud Ops',
    location: 'Remote',
    type: 'Full Time',
    applicantsCount: 28,
    posted: '4d ago',
    badgeBg: 'bg-teal-50 text-teal-600 border-teal-100'
  },
  {
    id: '3',
    title: 'Frontend UI/UX Engineer',
    company: 'CoreDesign Agency',
    location: 'Delhi, IN (On-site)',
    type: 'Full Time',
    applicantsCount: 35,
    posted: '1w ago',
    badgeBg: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'Stanza Software',
    location: 'Bangalore, IN (Remote)',
    type: 'Full Time',
    applicantsCount: 19,
    posted: '3d ago',
    badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  }
]

// 10 realistic candidate records
const INITIAL_CANDIDATES: Candidate[] = [
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
    avatarBg: 'bg-rose-100 text-rose-650',
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

const ALL_SKILLS = ['Python', 'React', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Node.js', 'Go', 'CSS', 'SQL']

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [totalCandidates, setTotalCandidates] = useState(0)
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [experienceFilter, setExperienceFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [minSalaryFilter, setMinSalaryFilter] = useState<string>('0')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [aiSemanticMatch, setAiSemanticMatch] = useState<boolean>(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const [selectedAiJob, setSelectedAiJob] = useState<JobCard | null>(null)
  const [loadingAiJobId, setLoadingAiJobId] = useState<string | null>(null)

  useEffect(() => {
    if (selectedAiJob) return // Don't override AI match search with default fetch
    setLoadingCandidates(true)
    const params = new URLSearchParams({
      search: searchQuery,
      experience: experienceFilter,
      location: locationFilter,
      minSalary: minSalaryFilter,
      page: currentPage.toString(),
      limit: '10'
    })
    fetch(`/api/candidates?${params.toString()}`)
      .then(res => res.json())
      .then(res => {
        setCandidates(res.data)
        setTotalCandidates(res.totalCount)
        setLoadingCandidates(false)
      })
      .catch(err => {
        console.error('Failed to fetch candidates:', err)
        setCandidates([])
        setTotalCandidates(0)
        setLoadingCandidates(false)
      })
  }, [searchQuery, experienceFilter, locationFilter, minSalaryFilter, currentPage, selectedAiJob])

  const handleFindAiMatches = async (job: JobCard) => {
    setLoadingAiJobId(job.id)
    setSelectedAiJob(job)
    setLoadingCandidates(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}/match`)
      const json = await res.json()
      if (json.data && Array.isArray(json.data)) {
        const mapped: Candidate[] = json.data.map((item: any) => {
          const found = INITIAL_CANDIDATES.find(c => c.id === item.id)
          return {
            id: item.id,
            name: item.name || found?.name || 'Candidate Match',
            title: item.title || found?.title || 'Engineer',
            experience: found?.experience || (item.yearsOfExperience ? `${item.yearsOfExperience}+ yrs` : '3-5 yrs'),
            location: item.location || found?.location || 'Remote',
            locationName: found?.locationName || item.location || 'Remote',
            minSalary: found?.minSalary || 110000,
            matchScore: parseInt(item.matchScore) || 92,
            matchScoreText: item.matchScore || `${item.matchScore}% Match`,
            rationale: item.rationale || 'High skill overlap matching target position requirements.',
            skills: item.skills || found?.skills || ['React', 'Python', 'AWS'],
            status: found?.status || 'New',
            avatarBg: found?.avatarBg || 'bg-blue-100 text-blue-600',
            email: found?.email || 'candidate@example.com',
            phone: found?.phone || '+91 98765 43210',
            linkedin: found?.linkedin || 'linkedin.com/in/candidate',
            bio: found?.bio || 'Experienced software professional aligned with position tech stack.',
            parsedCvSummary: item.rationale || found?.parsedCvSummary || 'Parsed profile summary.',
            workHistory: found?.workHistory || [],
            education: found?.education || { degree: 'Bachelor of Technology', institution: 'IIT', year: '2021' },
            certifications: found?.certifications || ['AWS Certified Solutions Architect'],
            aiCompetencies: found?.aiCompetencies || ['System Architecture', 'Cloud Services']
          }
        })
        setCandidates(mapped)
        setTotalCandidates(mapped.length)
        setAlertMsg(`AI Match pipeline executed! Loaded top 10 candidate matches for "${job.title}".`)
      }
    } catch (err) {
      console.error('Error running AI Candidate Match:', err)
      setAlertMsg('Failed to run AI Match. Please try again.')
    } finally {
      setLoadingAiJobId(null)
      setLoadingCandidates(false)
    }
  }

  const handleClearAiMatch = () => {
    setSelectedAiJob(null)
    setLoadingCandidates(true)
    fetch('/api/candidates?page=1&limit=10')
      .then(res => res.json())
      .then(res => {
        setCandidates(res.data)
        setTotalCandidates(res.totalCount)
        setLoadingCandidates(false)
      })
      .catch(() => setLoadingCandidates(false))
  }
  
  // Interactive toast alerts / visual confirmations
  const [alertMsg, setAlertMsg] = useState<string | null>(null)
  const [downloadingCv, setDownloadingCv] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({})

  // Listen to escape key down to close slide-over
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCandidate(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Quick toggle shortlist tag
  const handleShortlistToggle = (id: string) => {
    setCandidates(prev => 
      prev.map(c => {
        if (c.id === id) {
          const isShortlisted = c.status === 'Shortlisted'
          const name = c.name
          setAlertMsg(`Candidate ${name} is now ${isShortlisted ? 'un-shortlisted' : 'shortlisted'}.`)
          setTimeout(() => setAlertMsg(null), 3000)
          return { ...c, status: isShortlisted ? 'New' : 'Shortlisted' }
        }
        return c
      })
    )
    if (selectedCandidate?.id === id) {
      setSelectedCandidate(prev => 
        prev ? { ...prev, status: prev.status === 'Shortlisted' ? 'New' : 'Shortlisted' } : null
      )
    }
  }

  // Toggle skills filters
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    )
  }

  // Action: Message candidate
  const handleMessageCandidate = (name: string) => {
    setAlertMsg(`Mock message sequence opened for ${name}. Email notification dispatched!`)
    setTimeout(() => setAlertMsg(null), 3000)
  }

  // Action: Download PDF Resume
  const handleDownloadPdf = (id: string, name: string) => {
    setDownloadingCv(prev => ({ ...prev, [id]: 'saving' }))
    setTimeout(() => {
      setDownloadingCv(prev => ({ ...prev, [id]: 'saved' }))
      setTimeout(() => {
        setDownloadingCv(prev => ({ ...prev, [id]: 'idle' }))
      }, 2000)
    }, 1200)
  }

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setExperienceFilter('all')
    setLocationFilter('all')
    setMinSalaryFilter('0')
    setSelectedSkills([])
  }

  const filteredCandidates = candidates
  const totalCount = totalCandidates
  const pageCandidateSlice = candidates
  const totalPages = Math.ceil(totalCount / 10)
  const skip = (currentPage - 1) * 10

  const getStatusBadge = (status: Candidate['status']) => {
    const styles = {
      New: 'bg-blue-50 text-blue-600 border-blue-100',
      Shortlisted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      Contacted: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      Rejected: 'bg-rose-50 text-rose-600 border-rose-100'
    }

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation Header */}
      <Header />

      {/* Main Container Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Dynamic Alerts Banner */}
        {alertMsg && (
          <div className="rounded-xl bg-blue-600 text-white px-4 py-3.5 text-sm font-semibold flex items-center justify-between shadow-lg shadow-blue-600/10 animate-fade-in">
            <span>{alertMsg}</span>
            <button onClick={() => setAlertMsg(null)} className="text-white/80 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* 1. Header & Stats Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-3xs font-extrabold uppercase tracking-wider">Total Candidates</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2.5">50,420</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-3xs font-extrabold uppercase tracking-wider">Active Postings</span>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2.5">12</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-3xs font-extrabold uppercase tracking-wider">Shortlisted Profiles</span>
              <Star className="h-4 w-4 text-blue-600 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2.5">148</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-3xs font-extrabold uppercase tracking-wider">Interviews Slotted</span>
              <CalendarRange className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2.5">5</p>
          </div>
        </div>

        {/* 1.5 Active Job Postings Cards Section */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3.5 gap-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Active Job Postings & AI Matching Suite
              </h2>
            </div>
            <span className="text-3xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
              Powered by pgvector Cosine Distance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIVE_JOB_CARDS.map(job => {
              const isJobSelected = selectedAiJob?.id === job.id
              const isLoadingThisJob = loadingAiJobId === job.id
              return (
                <div
                  key={job.id}
                  className={`rounded-xl border p-4.5 flex flex-col justify-between gap-4 transition-all duration-200 ${
                    isJobSelected
                      ? 'border-blue-500 bg-blue-50/40 shadow-md shadow-blue-600/5 ring-2 ring-blue-500/20'
                      : 'border-slate-150 bg-white hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-3xs font-extrabold px-2 py-0.5 rounded-md border ${job.badgeBg}`}>
                        {job.company}
                      </span>
                      <span className="text-3xs text-slate-400 font-medium">{job.posted}</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">
                      {job.title}
                    </h3>

                    <div className="flex items-center justify-between text-2xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Users className="h-3 w-3 text-blue-600" /> {job.applicantsCount} applicants
                      </span>
                    </div>
                  </div>

                  {/* Find Best AI Matches Button */}
                  <button
                    type="button"
                    onClick={() => handleFindAiMatches(job)}
                    disabled={isLoadingThisJob}
                    className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition cursor-pointer shadow-xs ${
                      isJobSelected
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
                    }`}
                  >
                    {isLoadingThisJob ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Matching Vectors...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                        <span>Find Best AI Matches</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Vector Match Active Banner */}
        {selectedAiJob && (
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/90 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xs font-extrabold text-blue-600 uppercase tracking-widest">AI Vector Match Active</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-3xs font-extrabold px-2.5 py-0.5 border border-emerald-300">
                    Pinecone + PostgreSQL (1M Scale)
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  Top 10 AI Candidates Matched for &ldquo;{selectedAiJob.title}&rdquo;
                </h3>
              </div>
            </div>
            <button
              onClick={handleClearAiMatch}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <X className="h-4 w-4 text-slate-400" />
              Clear AI Filter
            </button>
          </div>
        )}

        {/* 2. Advanced Search & Filter Suite */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Advanced Pipeline Filters
              </h2>
            </div>
            
            {/* AI Toggle Switcher */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-full shadow-inner shrink-0">
              <Sparkles className={`h-4 w-4 ${aiSemanticMatch ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-2xs font-bold text-slate-600 uppercase tracking-widest">
                AI Semantic Match
              </span>
              
              <button
                type="button"
                onClick={() => setAiSemanticMatch(!aiSemanticMatch)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                  aiSemanticMatch ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  aiSemanticMatch ? 'translate-x-4' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Keywords */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="search-input" className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">
                Keywords Match
              </label>
              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Role, name, skill..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 transition shadow-inner/5"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exp-select" className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">
                Experience Level
              </label>
              <select
                id="exp-select"
                value={experienceFilter}
                onChange={e => setExperienceFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="all">All Experience Levels</option>
                <option value="0-2 yrs">Junior (0-2 yrs)</option>
                <option value="3-5 yrs">Mid-Level (3-5 yrs)</option>
                <option value="5+ yrs">Senior (5+ yrs)</option>
              </select>
            </div>

            {/* Location Remote */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="loc-select" className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">
                Location Preference
              </label>
              <select
                id="loc-select"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Minimum Expected Salary */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="salary-select" className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Min Salary Expectation
                </label>
                <span className="text-xs font-bold text-blue-600">
                  {minSalaryFilter === '0' ? 'No limit' : `$${(parseInt(minSalaryFilter) / 1000).toFixed(0)}k+`}
                </span>
              </div>
              <input
                id="salary-select"
                type="range"
                min="0"
                max="160000"
                step="10000"
                value={minSalaryFilter}
                onChange={e => setMinSalaryFilter(e.target.value)}
                className="w-full h-1.5 rounded-lg bg-slate-100 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Primary Skills multi-select */}
          <div className="flex flex-col gap-2">
            <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">
              Primary System Skills Mappings
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map(skill => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/10'
                        : 'bg-slate-50 border-slate-150 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
              
              {(searchQuery || experienceFilter !== 'all' || locationFilter !== 'all' || minSalaryFilter !== '0' || selectedSkills.length > 0) && (
                <button
                  onClick={handleResetFilters}
                  className="rounded-lg px-2.5 py-1 text-xs font-bold text-slate-400 border border-slate-150 bg-white hover:text-blue-600 hover:border-blue-200 transition cursor-pointer flex items-center gap-1 ml-auto"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset Filter Suite
                </button>
              )}
            </div>
          </div>

        </div>

        {/* 3. Candidate Table / Pipeline View */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between min-h-[400px]">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/50 text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Candidate Details</th>
                  <th className="py-4 px-4 text-center">Match Rating</th>
                  <th className="py-4 px-4">Core Skill Tags</th>
                  <th className="py-4 px-4">Pipeline Status</th>
                  <th className="py-4 px-6 text-right">Action Interface</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {loadingCandidates ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="animate-spin h-6 w-6 text-blue-650" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Loading candidates...</span>
                      </div>
                    </td>
                  </tr>
                ) : pageCandidateSlice.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Search className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">No applicants match selected constraints</p>
                        <button 
                          onClick={handleResetFilters}
                          className="rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-2xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageCandidateSlice.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/30 transition group">
                      
                      {/* Name & Avatar */}
                      <td className="py-4 px-6 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${c.avatarBg}`}>
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition leading-snug">
                              {c.name}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Briefcase className="h-3 w-3 shrink-0 text-slate-400" /> {c.title}
                            </span>
                            <span className="text-3xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                              <MapPin className="h-2.5 w-2.5 shrink-0 text-slate-400" /> {c.locationName} ({c.location})
                            </span>

                            {/* AI Rationale Snippet */}
                            {c.rationale && (
                              <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-indigo-50/90 border border-indigo-100 p-2 text-3xs text-indigo-950 font-medium leading-relaxed">
                                <Sparkles className="h-3 w-3 text-indigo-600 shrink-0 mt-0.5" />
                                <span>
                                  <strong className="font-bold text-indigo-950">AI Rationale:</strong> {c.rationale}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Match Score */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800 shadow-xs">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                            {c.matchScoreText || `${c.matchScore}% Match`}
                          </span>
                          <span className="text-3xs font-bold text-emerald-600 uppercase tracking-widest">
                            Cosine Match
                          </span>
                        </div>
                      </td>

                      {/* Core Skills */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.map(s => (
                            <span key={s} className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-3xs font-semibold text-slate-500">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(c.status)}
                      </td>

                      {/* Actions buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCandidate(c)}
                            title="Quick Preview Profile"
                            className="p-1.5 border border-slate-100 rounded-lg bg-slate-50 hover:bg-blue-600 text-slate-500 hover:text-white transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleShortlistToggle(c.id)}
                            title={c.status === 'Shortlisted' ? 'Remove from Shortlist' : 'Save to Shortlist'}
                            className={`p-1.5 border rounded-lg transition cursor-pointer ${
                              c.status === 'Shortlisted'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250'
                                : 'bg-slate-50 border-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white'
                            }`}
                          >
                            <Save className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMessageCandidate(c.name)}
                            title="Message Candidate"
                            className="p-1.5 border border-slate-100 rounded-lg bg-slate-50 hover:bg-blue-600 text-slate-500 hover:text-white transition cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 5. Pagination Bar */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-500 font-semibold">
            <div>
              Showing <span className="text-slate-700">{totalCount === 0 ? 0 : skip + 1}-{skip + pageCandidateSlice.length}</span> of <span className="text-slate-700">{totalCount}</span> candidates
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <button 
                onClick={() => setCurrentPage(1)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                  currentPage === 1 
                    ? 'border-blue-600 bg-blue-600 text-white shadow shadow-blue-600/10'
                    : 'border-slate-200 bg-white text-slate-650 hover:border-slate-300'
                }`}
              >
                1
              </button>

              {totalPages >= 2 && (
                <button 
                  onClick={() => setCurrentPage(2)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                    currentPage === 2 
                      ? 'border-blue-600 bg-blue-600 text-white shadow shadow-blue-600/10'
                      : 'border-slate-200 bg-white text-slate-650 hover:border-slate-300'
                  }`}
                >
                  2
                </button>
              )}

              {totalPages >= 3 && (
                <button 
                  onClick={() => setCurrentPage(3)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                    currentPage === 3 
                      ? 'border-blue-600 bg-blue-600 text-white shadow shadow-blue-600/10'
                      : 'border-slate-200 bg-white text-slate-650 hover:border-slate-300'
                  }`}
                >
                  3
                </button>
              )}

              {totalPages > 3 && (
                <>
                  <span className="px-1 text-slate-400">...</span>
                  <button 
                    onClick={() => setCurrentPage(totalPages)}
                    className={`inline-flex h-8 w-[50px] items-center justify-center rounded-lg border transition cursor-pointer ${
                      currentPage === totalPages 
                        ? 'border-blue-600 bg-blue-600 text-white shadow shadow-blue-600/10'
                        : 'border-slate-200 bg-white text-slate-650 hover:border-slate-300'
                    }`}
                  >
                    {totalPages.toLocaleString()}
                  </button>
                </>
              )}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* 4. Side Slide-Over (Candidate Detail Drawer) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setSelectedCandidate(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          ></div>

          {/* Drawer body container */}
          <div className="relative w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-slide-in">
            
            {/* Header Close and Identity card */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Candidate Profile Summary
                  </span>
                  {getStatusBadge(selectedCandidate.status)}
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedCandidate.name}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-semibold">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {selectedCandidate.title}
                  <span className="text-slate-300">•</span>
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {selectedCandidate.locationName} ({selectedCandidate.location})
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Score */}
                <div className="text-right">
                  <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">AI Match Score</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-sm font-black text-emerald-800 shadow-xs mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    {selectedCandidate.matchScoreText || `${selectedCandidate.matchScore}% Match`}
                  </span>
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-xl border border-slate-250 bg-white p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable parsed details */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* AI extracted core competencies */}
              <div className="flex flex-col gap-2">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" /> AI-Extracted Core Competencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.aiCompetencies.map(comp => (
                    <span 
                      key={comp}
                      className="rounded-lg bg-blue-50 border border-blue-100/50 px-2.5 py-1 text-xs font-semibold text-blue-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <Cpu className="h-3.5 w-3.5 text-blue-600 shrink-0" /> {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio summary */}
              <div className="flex flex-col gap-1.5">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">CV Summary</span>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner/5">
                  {selectedCandidate.parsedCvSummary}
                </p>
              </div>

              {/* Work history timeline */}
              <div className="flex flex-col gap-3">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" /> Work History Timeline
                </span>

                <div className="relative border-l border-slate-150 pl-6 ml-2 space-y-6">
                  {selectedCandidate.workHistory.map((work, index) => (
                    <div key={index} className="relative group">
                      
                      {/* Timeline Node Point */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border border-blue-600 group-hover:bg-blue-600 transition duration-300 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 group-hover:bg-white transition duration-300"></span>
                      </span>

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                            {work.role}
                          </h4>
                          <span className="text-2xs text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {work.duration}
                          </span>
                        </div>
                        <p className="text-2xs font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-slate-400" /> {work.company}
                        </p>
                        <ul className="list-disc pl-4 space-y-1.5 mt-3 text-xs text-slate-600 leading-relaxed">
                          {work.achievements.map((ach, aIdx) => (
                            <li key={aIdx}>{ach}</li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                {/* Education */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-blue-600" /> Education
                  </span>
                  <div className="mt-2.5">
                    <h5 className="text-xs font-bold text-slate-800">
                      {selectedCandidate.education.degree}
                    </h5>
                    <p className="text-3xs font-semibold text-slate-400 mt-1">
                      {selectedCandidate.education.institution}
                    </p>
                    <p className="text-3xs font-bold text-slate-500 mt-2">
                      Class of {selectedCandidate.education.year}
                    </p>
                  </div>
                </div>

                {/* Certifications */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Award className="h-4 w-4 text-blue-600" /> Certifications
                  </span>
                  <ul className="mt-2.5 space-y-1">
                    {selectedCandidate.certifications.map((c, cIdx) => (
                      <li key={cIdx} className="text-2xs text-slate-600 flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-blue-600 shrink-0"></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest">Contact Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-650">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="truncate">{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Link2 className="h-4 w-4 text-blue-500 shrink-0" />
                    <a href={`https://${selectedCandidate.linkedin}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                      {selectedCandidate.linkedin}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Drawer Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleShortlistToggle(selectedCandidate.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition cursor-pointer border ${
                  selectedCandidate.status === 'Shortlisted'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Save className="h-4 w-4" />
                {selectedCandidate.status === 'Shortlisted' ? 'Shortlisted Candidate' : 'Shortlist Candidate'}
              </button>

              <button
                onClick={() => handleMessageCandidate(selectedCandidate.name)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-semibold text-white transition shadow-lg shadow-blue-600/10 cursor-pointer"
              >
                <CalendarRange className="h-4 w-4" />
                Schedule Interview
              </button>

              {/* PDF Resume download (interactive loading status) */}
              <button
                onClick={() => handleDownloadPdf(selectedCandidate.id, selectedCandidate.name)}
                disabled={downloadingCv[selectedCandidate.id] === 'saving'}
                className="rounded-xl border border-slate-250 bg-white hover:bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition cursor-pointer flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-75 disabled:cursor-default"
              >
                {downloadingCv[selectedCandidate.id] === 'saving' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : downloadingCv[selectedCandidate.id] === 'saved' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600 animate-scale-in" />
                    <span className="text-emerald-700">Saved PDF!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    <span>Download CV</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
