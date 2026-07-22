"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Hexagon, User, Briefcase, MapPin, Award, 
  CheckCircle2, Clock, UploadCloud, FileText, 
  Check, ChevronRight, X, Sparkles, Building2, 
  Calendar, TrendingUp, AlertCircle, RefreshCw, Cpu,
  ClipboardList, MessageSquare, Send
} from 'lucide-react'

// Interfaces
interface Application {
  id: string
  title: string
  company: string
  logoBg: string
  appliedDate: string
  status: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offers'
}

interface RecommendedJob {
  id: string
  title: string
  company: string
  location: string
  logoBg: string
  salary: string
  skills: string[]
}

// Initial applications
const INITIAL_APPLICATIONS: Application[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Amazon',
    logoBg: 'bg-sky-100 text-sky-600',
    appliedDate: 'Jul 10, 2026',
    status: 'Applied'
  },
  {
    id: '2',
    title: 'Senior Systems Analyst',
    company: 'Tesla',
    logoBg: 'bg-amber-100 text-amber-600',
    appliedDate: 'Jul 05, 2026',
    status: 'Under Review'
  },
  {
    id: '3',
    title: 'Lead React Developer',
    company: 'Percepta',
    logoBg: 'bg-teal-100 text-teal-600',
    appliedDate: 'Jul 12, 2026',
    status: 'Interview Scheduled'
  },
  {
    id: '4',
    title: 'Cloud Architect',
    company: 'Microsoft',
    logoBg: 'bg-indigo-100 text-indigo-600',
    appliedDate: 'Jun 28, 2026',
    status: 'Offers'
  }
]

const RECOMMENDED_JOBS: RecommendedJob[] = [
  {
    id: 'rec-1',
    title: 'Senior Software Engineer',
    company: 'Global Build-Tech Solutions',
    location: 'Mumbai, IN',
    logoBg: 'bg-blue-100 text-blue-600',
    salary: '$120,000/year',
    skills: ['Python', 'React', 'AWS']
  },
  {
    id: 'rec-2',
    title: 'DevOps Architect',
    company: 'InfraScale Systems',
    location: 'Hyderabad, IN',
    logoBg: 'bg-emerald-100 text-emerald-600',
    salary: '$130,000/year',
    skills: ['Go', 'Kubernetes', 'Docker']
  },
  {
    id: 'rec-3',
    title: 'Machine Learning Engineer',
    company: 'NeuralCompute Systems',
    location: 'Chennai, IN',
    logoBg: 'bg-purple-100 text-purple-600',
    salary: '$140,000/year',
    skills: ['Python', 'Go', 'ML']
  }
]

export default function CandidateDashboard() {
  const [lookingStatus, setLookingStatus] = useState<'Actively Looking' | 'Open to Offers' | 'Not Looking'>('Actively Looking')
  const [profileProgress, setProfileProgress] = useState(85)
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS)
  const [activeTab, setActiveTab] = useState<'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offers'>('Applied')
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>(RECOMMENDED_JOBS)

  // Resume Upload State
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [parsingState, setParsingState] = useState<'idle' | 'parsing' | 'completed'>('idle')
  const [parsingStep, setParsingStep] = useState<number>(0)
  const [parsedResume, setParsedResume] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Progress steps
  const PARSE_PROGRESS_STEPS = [
    "Extracting text from PDF...",
    "AI analyzing skills & experience...",
    "Generating search embeddings...",
    "Profile created successfully!"
  ]

  // Tasks & Messaging State
  const [assignedTasks, setAssignedTasks] = useState<any[]>([])
  const [candidateMessages, setCandidateMessages] = useState<any[]>([])
  const [candidateReplyContent, setCandidateReplyContent] = useState('')
  const [sendingCandidateReply, setSendingCandidateReply] = useState(false)

  // Fetch Tasks & Messages on load
  useEffect(() => {
    fetch('/api/tasks?candidateId=1')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.tasks)) {
          setAssignedTasks(res.tasks)
        }
      })
      .catch(e => console.error('Failed to fetch candidate tasks:', e))

    fetch('/api/messages?candidateId=1')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.messages)) {
          setCandidateMessages(res.messages)
        }
      })
      .catch(e => console.error('Failed to fetch candidate messages:', e))
  }, [])

  const handleSendCandidateReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateReplyContent.trim()) return
    setSendingCandidateReply(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: '1',
          sender: 'CANDIDATE',
          content: candidateReplyContent.trim()
        })
      })
      const json = await res.json()
      if (json.success && json.chatMessage) {
        setCandidateMessages(prev => [...prev, json.chatMessage])
        setCandidateReplyContent('')
      }
    } catch (err) {
      console.error('Failed to send candidate reply:', err)
    } finally {
      setSendingCandidateReply(false)
    }
  }

  // Notification state
  const [notification, setNotification] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const performUploadAndParse = (file: File) => {
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')
    setParsingState('parsing')
    setParsingStep(0)

    const timer1 = setTimeout(() => setParsingStep(1), 500)
    const timer2 = setTimeout(() => setParsingStep(2), 1200)
    
    const formData = new FormData()
    formData.append('file', file)

    fetch('/api/candidates/parse-resume', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          clearTimeout(timer1)
          clearTimeout(timer2)
          setParsingStep(3)

          setTimeout(() => {
            setParsingState('completed')
            setProfileProgress(100)
            setParsedResume(res.candidate)
            setNotification('Resume parsed successfully with Gemini AI! Profile strength reached 100%.')
            setTimeout(() => setNotification(null), 4000)
          }, 600)
        } else {
          throw new Error(res.error || 'Failed to parse file')
        }
      })
      .catch(err => {
        console.error('Upload failed:', err)
        clearTimeout(timer1)
        clearTimeout(timer2)
        setParsingState('idle')
        setNotification('Failed to upload and parse resume. Please try again.')
        setTimeout(() => setNotification(null), 4000)
      })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
        performUploadAndParse(file)
      } else {
        setNotification('Invalid file type. Please upload a PDF or DOCX file.')
        setTimeout(() => setNotification(null), 3000)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      performUploadAndParse(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Instant apply action
  const handleInstantApply = (job: RecommendedJob) => {
    // Add to applications
    const newApp: Application = {
      id: Date.now().toString(),
      title: job.title,
      company: job.company,
      logoBg: job.logoBg,
      appliedDate: 'Today',
      status: 'Applied'
    }

    setApplications(prev => [newApp, ...prev])
    setRecommendedJobs(prev => prev.filter(j => j.id !== job.id))
    
    // Set notification
    setNotification(`Successfully applied to ${job.company}! Applied count updated.`)
    setTimeout(() => setNotification(null), 3500)
  }

  // Clear uploader state
  const resetUploader = () => {
    setFileName(null)
    setFileSize(null)
    setParsingState('idle')
    setParsedResume(null)
    setProfileProgress(85)
  }

  // Filter application list based on active tab
  const filteredApps = applications.filter(app => app.status === activeTab)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation Header */}
      <Header />

      {/* Main Container Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Dynamic Alerts Banner */}
        {notification && (
          <div className="rounded-xl bg-blue-600 text-white px-4 py-3.5 text-sm font-semibold flex items-center justify-between shadow-lg shadow-blue-600/10 animate-fade-in">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* 1. Profile Strength & Status Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress Bar Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Profile Strength</h3>
                <span className="text-sm font-black text-blue-650">{profileProgress}% Complete</span>
              </div>
              
              {/* Actual Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100/50 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
              {profileProgress === 100 ? (
                <span className="text-emerald-700">Perfect! Your profile details are fully parsed and optimized for AI semantic job matching.</span>
              ) : (
                <span>Add 2 more skills (e.g. Kubernetes, Docker) or upload your resume file to reach 100%.</span>
              )}
            </div>
          </div>

          {/* Status Toggle Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Workplace Status</h3>
              <p className="text-2xs text-slate-400 mt-1">Specify your current job seeking availability to recruiters.</p>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setLookingStatus('Actively Looking')}
                className={`rounded-lg py-2 text-3xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  lookingStatus === 'Actively Looking'
                    ? 'bg-white text-emerald-650 shadow'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setLookingStatus('Open to Offers')}
                className={`rounded-lg py-2 text-3xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  lookingStatus === 'Open to Offers'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setLookingStatus('Not Looking')}
                className={`rounded-lg py-2 text-3xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  lookingStatus === 'Not Looking'
                    ? 'bg-white text-slate-655 shadow'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Passive
              </button>
            </div>
          </div>

        </div>

        {/* 2. Interactive Resume Uploader & Parser */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Uploader Box */}
          <div className={`rounded-2xl border-2 border-dashed p-8 shadow-sm text-center flex flex-col items-center justify-center gap-4 transition duration-300 ${
            parsingState === 'completed'
              ? 'lg:col-span-4 border-slate-200 bg-white'
              : 'lg:col-span-12 border-slate-200 bg-white hover:border-blue-400'
          } ${dragActive ? 'border-blue-400 bg-blue-50/10' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx"
              className="hidden"
            />

            <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
              <UploadCloud className="h-6 w-6 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">
                {fileName ? fileName : 'Upload your Resume'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {fileSize ? `File size: ${fileSize}` : 'Supports PDF and DOCX formats up to 5MB'}
              </p>
            </div>

            {parsingState === 'idle' && (
              <button
                onClick={triggerFileInput}
                className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-2 text-xs font-bold text-white shadow shadow-blue-600/10 transition cursor-pointer"
              >
                Select File
              </button>
            )}

            {parsingState === 'parsing' && (
              <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-2 bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-inner">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((parsingStep + 1) / PARSE_PROGRESS_STEPS.length) * 100}%` }}
                  ></div>
                </div>

                <div className="w-full space-y-2 text-left text-2xs">
                  {PARSE_PROGRESS_STEPS.map((stepText, idx) => {
                    const isDone = parsingStep > idx
                    const isCurrent = parsingStep === idx
                    return (
                      <div 
                        key={stepText} 
                        className={`flex items-center gap-2 font-bold transition-colors duration-300 ${
                          isDone 
                            ? 'text-emerald-600 font-extrabold' 
                            : isCurrent 
                            ? 'text-blue-600 font-extrabold' 
                            : 'text-slate-300'
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <RefreshCw className="h-3.5 w-3.5 text-blue-600 animate-spin shrink-0" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-300 shrink-0 ml-0.5"></div>
                        )}
                        <span>{stepText}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {parsingState === 'completed' && (
              <button
                onClick={resetUploader}
                className="rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 px-5 py-2 text-xs font-bold text-slate-600 transition cursor-pointer flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear File
              </button>
            )}

          </div>

          {/* Parser Output Summary & Form Card */}
          {parsingState === 'completed' && parsedResume && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-8 flex flex-col gap-5 animate-fade-in">
              
              {/* Header banner */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    Parsed Candidate Profile & Skills
                  </h2>
                  <p className="text-3xs text-slate-400">Extracted via Gemini AI Structured Outputs & Indexed to pgvector.</p>
                </div>
                <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase ml-auto flex items-center gap-1 shadow-xs">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Profile Created (100%)
                </span>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      readOnly
                      value={parsedResume.fullName || parsedResume.name || 'Amit Sharma'}
                      className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 font-bold text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">Email & Phone</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={parsedResume.email || 'amit.sharma@example.com'}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 outline-none"
                      />
                      <input
                        type="text"
                        readOnly
                        value={parsedResume.phone || '+91 98765 43210'}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">Experience & Salary Expectation</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5 font-extrabold text-blue-700">
                        {parsedResume.yearsOfExperience ? `${parsedResume.yearsOfExperience} Years Experience` : '8 Years Experience'}
                      </span>
                      <span className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 font-extrabold text-emerald-700">
                        ${(parsedResume.expectedSalary || 120000).toLocaleString()} / yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">Location</label>
                    <input
                      type="text"
                      readOnly
                      value={parsedResume.location || 'Mumbai, IN (Hybrid)'}
                      className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 font-semibold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">Generated Skill Badges</label>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(parsedResume.skills || ['Python', 'React', 'AWS']).map((s: string) => (
                        <span key={s} className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-1 text-2xs font-extrabold text-blue-700 flex items-center gap-1 shadow-2xs">
                          <Check className="h-3 w-3 text-blue-600" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              {parsedResume.summary && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">AI Generated Executive Summary</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50/70 border border-slate-100 p-3 rounded-xl">
                    {parsedResume.summary}
                  </p>
                </div>
              )}

              {/* Work History */}
              {parsedResume.workHistory && parsedResume.workHistory.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">Parsed Work History</span>
                  <div className="space-y-2">
                    {parsedResume.workHistory.map((item: any, idx: number) => (
                      <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-2xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{item.title} &bull; <span className="text-blue-600">{item.company}</span></span>
                          <span className="text-3xs text-slate-400 font-semibold">{item.duration}</span>
                        </div>
                        <p className="text-slate-600 leading-snug">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* 3. Applied Jobs Tracker & 4. Recommended Jobs grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Applied Jobs Kanban Tracker Column */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-7 flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Application Pipelines
                </h2>
              </div>
              
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                {applications.length} Active
              </span>
            </div>

            {/* Pipeline Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
              {(['Applied', 'Under Review', 'Interview Scheduled', 'Offers'] as const).map(tab => {
                const count = applications.filter(a => a.status === tab).length
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg py-2.5 text-center text-3xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{tab.split(' ')[0]}</span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded-md text-3xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-650'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Applications List */}
            <div className="space-y-3 min-h-[220px]">
              {filteredApps.length === 0 ? (
                <div className="py-12 text-center text-slate-400 border border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-350 border border-slate-100">
                    <FileText className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">No applications in {activeTab} stage</p>
                </div>
              ) : (
                filteredApps.map(app => (
                  <div 
                    key={app.id} 
                    className="border border-slate-100 bg-white p-4 rounded-xl flex items-center justify-between gap-4 hover:border-blue-200 transition duration-300 hover:shadow-md hover:shadow-slate-100/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${app.logoBg}`}>
                        {app.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{app.company}</h4>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{app.title}</h3>
                        <p className="text-3xs text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                          <Calendar className="h-3 w-3 text-slate-400" /> Applied: {app.appliedDate}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-3xs font-bold uppercase tracking-wider ${
                      app.status === 'Applied' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      app.status === 'Under Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      app.status === 'Interview Scheduled' ? 'bg-teal-50 text-teal-650 border-teal-100' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {app.status}
                    </span>

                  </div>
                ))
              )}
            </div>

          </div>

          {/* Recommended Jobs Column */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-5 flex flex-col gap-6">
            
            <div className="border-b border-slate-100 pb-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Matches for You
              </h2>
            </div>

            <div className="space-y-4">
              {recommendedJobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 border border-dashed border-slate-100 rounded-xl">
                  You have applied to all recommended listings! We will parse new postings soon.
                </div>
              ) : (
                recommendedJobs.map(job => (
                  <div 
                    key={job.id}
                    className="bg-white rounded-xl border border-slate-100 hover:border-blue-200 p-4 flex flex-col justify-between gap-4 transition duration-300 hover:shadow-md hover:shadow-slate-100/30 group"
                  >
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${job.logoBg}`}>
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                            {job.company}
                          </h4>
                          <p className="text-3xs font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5">
                            <MapPin className="h-3 w-3 text-slate-400" /> {job.location}
                          </p>
                        </div>
                      </div>
                      
                      <span className="text-xs font-bold text-blue-600 shrink-0">
                        {job.salary.split('/')[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.map(s => (
                          <span key={s} className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-3xs font-semibold text-slate-500">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstantApply(job)}
                      className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-2 text-xs font-bold transition cursor-pointer"
                    >
                      Instant Apply <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* 5. My Assigned Assessments / Tasks & 6. Employer Chat Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
          
          {/* Assigned Tasks Card Column */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    My Assigned Assessments / Tasks
                  </h2>
                  <p className="text-3xs text-slate-400">Coding exercises & system architecture tests assigned by recruiters.</p>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full uppercase">
                {assignedTasks.length} Assigned
              </span>
            </div>

            <div className="space-y-3 min-h-[180px]">
              {assignedTasks.length === 0 ? (
                <div className="py-10 text-center text-slate-400 border border-dashed border-slate-100 rounded-xl text-xs">
                  No pending assessment tasks assigned yet.
                </div>
              ) : (
                assignedTasks.map(t => (
                  <div key={t.id} className="rounded-xl border border-slate-150 bg-slate-50/60 p-4 space-y-2 hover:border-indigo-200 transition">
                    <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                        {t.title}
                      </span>
                      <span className="text-3xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-600 leading-relaxed">{t.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-3xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" /> Due: {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                      <button className="text-indigo-600 hover:underline font-bold cursor-pointer">
                        Start Task &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Employer Direct Chat Widget Column */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    Employer Direct Chat
                  </h2>
                  <p className="text-3xs text-slate-400">Direct message exchange with hiring recruiters.</p>
                </div>
              </div>
              <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                Active Thread
              </span>
            </div>

            {/* Chat Thread */}
            <div className="h-[220px] overflow-y-auto bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 space-y-3">
              {candidateMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No recruiter messages yet.
                </div>
              ) : (
                candidateMessages.map(msg => {
                  const isCandidate = msg.sender === 'CANDIDATE'
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-sm rounded-2xl px-3.5 py-2 text-xs shadow-2xs ${
                          isCandidate
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <span className="block font-extrabold text-3xs uppercase tracking-wider mb-0.5 opacity-80">
                          {isCandidate ? 'You' : 'Hiring Recruiter'}
                        </span>
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-3xs text-slate-400 mt-1 px-1 font-semibold">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })
              )}
            </div>

            {/* Candidate Reply Input Form */}
            <form onSubmit={handleSendCandidateReply} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Reply to employer..."
                value={candidateReplyContent}
                onChange={e => setCandidateReplyContent(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 transition"
              />
              <button
                type="submit"
                disabled={sendingCandidateReply || !candidateReplyContent.trim()}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition shadow shadow-blue-600/10 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </form>

          </div>

        </div>

      </main>

      {/* CSS Animation Keyframes for uploader parser slider */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

    </div>
  )
}
