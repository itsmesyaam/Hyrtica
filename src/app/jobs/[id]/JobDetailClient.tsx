"use client"

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { 
  Briefcase, MapPin, DollarSign, Clock, Building2, 
  Share2, Check, UploadCloud, FileText, Sparkles, 
  ArrowLeft, Cpu, CheckCircle2, ShieldCheck
} from 'lucide-react'

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

export default function JobDetailClient({ job }: { job: JobCard }) {
  const [copied, setCopied] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsingState, setParsingState] = useState<'idle' | 'parsing' | 'completed'>('idle')
  const [parsingStep, setParsingStep] = useState<number>(0)
  const [parsedCandidate, setParsedCandidate] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const PARSE_PROGRESS_STEPS = [
    "Extracting text from PDF...",
    "AI analyzing skills against requirements...",
    "Generating 768-dim search vector...",
    "Application submitted successfully!"
  ]

  const performUploadAndParse = (file: File) => {
    setFileName(file.name)
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
            setParsedCandidate(res.candidate)
          }, 600)
        } else {
          throw new Error(res.error || 'Failed to process application')
        }
      })
      .catch(err => {
        console.error('Application upload failed:', err)
        clearTimeout(timer1)
        clearTimeout(timer2)
        setParsingState('idle')
      })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      performUploadAndParse(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      performUploadAndParse(e.target.files[0])
    }
  }

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Back Navigation & Share Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Public Job Board
        </Link>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-blue-600" />
              <span>Share Job Posting</span>
            </>
          )}
        </button>
      </div>

      {/* Main Job Banner Header */}
      <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Naukri Verified Listing
              </span>
              <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                Active Hiring
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5 text-blue-650">
                <Building2 className="h-4 w-4 text-blue-600" /> {job.companyName}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" /> {job.location}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" /> {job.jobType}
              </span>
            </div>
          </div>

          {/* Salary Highlight Box */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-center md:text-right shrink-0 min-w-[200px]">
            <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest block">Offered Remuneration</span>
            <span className="text-base font-black text-blue-600 block mt-1">{job.salaryRange}</span>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Job Description & Required Skills */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" /> Role Overview & Responsibilities
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100 font-medium">
                {job.description}
              </p>
            </div>

            {/* Required Skills Badges */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-600" /> Required Skills & Technical Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Process Card */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-2">
              <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> AI Vector Matching Guarantee
              </span>
              <p className="text-2xs text-slate-600 leading-relaxed">
                When you apply below, Gemini AI extracts your technical background into a 768-dimensional embedding vector, ranking your application instantly in the recruiter's candidate pool.
              </p>
            </div>

          </div>

          {/* Right Column: Direct Resume Application Form */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Apply for this Role
                </h3>
                <p className="text-3xs text-slate-400 font-semibold">Upload your resume to trigger instant AI candidate scoring.</p>
              </div>
            </div>

            {parsingState === 'completed' && parsedCandidate ? (
              /* Success State */
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 animate-fade-in">
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <h4 className="text-sm font-extrabold text-emerald-900">Application Submitted Successfully!</h4>
                <p className="text-2xs text-emerald-700 font-medium">
                  Welcome, <strong>{parsedCandidate.fullName}</strong>! Your profile and vector embedding have been matched against <strong>{job.companyName}</strong>'s position.
                </p>
                <Link
                  href="/candidate/dashboard"
                  className="inline-block rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white transition shadow cursor-pointer mt-2"
                >
                  View Candidate Portal &rarr;
                </Link>
              </div>
            ) : parsingState === 'parsing' ? (
              /* Processing Animation State */
              <div className="py-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-xs font-bold text-blue-600 animate-pulse">
                  {PARSE_PROGRESS_STEPS[parsingStep] || "Processing resume..."}
                </p>
              </div>
            ) : (
              /* Drag and Drop Uploader */
              <div
                onDragEnter={() => setDragActive(true)}
                onDragOver={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-400 bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Click to upload or drag resume
                  </p>
                  <p className="text-3xs text-slate-400 font-semibold mt-1">
                    Supports PDF, DOCX, or Plain Text up to 10MB
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition shadow shadow-blue-600/10"
                >
                  Upload & Instant Apply
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  )
}
