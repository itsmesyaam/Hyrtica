"use client"

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import { 
  Hexagon, ChevronDown, Briefcase, MapPin, 
  Search, Users, Edit3, ShieldAlert, Code, 
  CircleDollarSign, Megaphone, Terminal, Bookmark,
  ArrowRight, Heart, CloudLightning, Plus, Sparkles, Check
} from 'lucide-react'

// Mock categories for carousel
interface Category {
  id: string
  name: string
  jobsCount: number
  iconName: 'briefcase' | 'edit' | 'users' | 'search' | 'code' | 'dollar' | 'terminal' | 'megaphone'
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'Retail & Product', jobsCount: 3, iconName: 'briefcase' },
  { id: '2', name: 'Content Writer', jobsCount: 8, iconName: 'edit' },
  { id: '3', name: 'Human Resource', jobsCount: 3, iconName: 'users' },
  { id: '4', name: 'Market Research', jobsCount: 4, iconName: 'search' },
  { id: '5', name: 'Software', jobsCount: 4, iconName: 'code' },
  { id: '6', name: 'Finance', jobsCount: 5, iconName: 'dollar' },
  { id: '7', name: 'Management', jobsCount: 5, iconName: 'terminal' },
  { id: '8', name: 'Marketing & Sale', jobsCount: 4, iconName: 'megaphone' }
]

// Mock job listings
interface Job {
  id: string
  title: string
  company: string
  location: string
  logoBg: string
  type: string
  postedDate: string
  desc: string
  skills: string[]
  salaryRate: string
  category: string
}

const JOBS: Job[] = [
  {
    id: '1',
    title: 'Lead Quality Control QA',
    company: 'Ashford',
    location: 'France',
    logoBg: 'bg-red-100 text-red-600',
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
    logoBg: 'bg-emerald-100 text-emerald-600',
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
    logoBg: 'bg-violet-100 text-violet-600',
    type: 'Full Time',
    postedDate: 'Posted 5 months ago',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.',
    skills: ['Node', 'React', 'Docker'],
    salaryRate: '$750/Hour',
    category: 'Software'
  }
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Content Writer')
  const [industrySearch, setIndustrySearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [keywordSearch, setKeywordSearch] = useState('')
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    setLoadingJobs(true)
    fetch(`/api/jobs?category=${encodeURIComponent(selectedCategory)}`)
      .then(res => res.json())
      .then(data => {
        setFilteredJobs(data)
        setLoadingJobs(false)
      })
      .catch(err => {
        console.error('Failed to fetch jobs:', err)
        setFilteredJobs([])
        setLoadingJobs(false)
      })
  }, [selectedCategory])

  const toggleSaveJob = (id: string) => {
    setSavedJobs(prev => 
      prev.includes(id) 
        ? prev.filter(jobId => jobId !== id) 
        : [...prev, id]
    )
  }

  const renderCategoryIcon = (iconName: string) => {
    const sizeClass = "h-6 w-6 text-indigo-600"
    switch (iconName) {
      case 'briefcase': return <Briefcase className={sizeClass} />
      case 'edit': return <Edit3 className={sizeClass} />
      case 'users': return <Users className={sizeClass} />
      case 'search': return <Search className={sizeClass} />
      case 'code': return <Code className={sizeClass} />
      case 'dollar': return <CircleDollarSign className={sizeClass} />
      case 'terminal': return <Terminal className={sizeClass} />
      case 'megaphone': return <Megaphone className={sizeClass} />
      default: return <Briefcase className={sizeClass} />
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      
      {/* 1. Navigation Header */}
      <Header />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-white py-16 lg:py-24">
        
        {/* Decorative background shapes */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-indigo-50/40 blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              The <span className="text-blue-600 relative">Easiest Way</span> <br />
              to Get Your New Job
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-lg leading-relaxed">
              Each month, more than 3 million job seekers turn to website in their search for work, making over 140,000 applications every single day
            </p>

            {/* Search Bar Bar */}
            <div className="w-full bg-white p-3 rounded-2xl sm:rounded-full border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col sm:flex-row items-center gap-3">
              
              {/* Industry Field */}
              <div className="flex items-center gap-2 px-3 py-1 flex-1 w-full border-b sm:border-b-0 sm:border-r border-slate-100">
                <Briefcase className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Industry..."
                  value={industrySearch}
                  onChange={e => setIndustrySearch(e.target.value)}
                  className="w-full bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {/* Location Field */}
              <div className="flex items-center gap-2 px-3 py-1 flex-1 w-full border-b sm:border-b-0 sm:border-r border-slate-100">
                <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={locationSearch}
                  onChange={e => setLocationSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {/* Keywords Field */}
              <div className="flex items-center gap-2 px-3 py-1 flex-1 w-full">
                <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={keywordSearch}
                  onChange={e => setKeywordSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>

              {/* Search button */}
              <button 
                type="button"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl sm:rounded-full text-sm font-bold text-white shadow-md shadow-blue-600/10 transition shrink-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>

            </div>

            {/* Popular Searches */}
            <div className="text-xs sm:text-sm text-slate-400">
              <span className="font-semibold text-slate-500">Popular Searches:</span>{' '}
              <a href="#" className="hover:text-blue-600 underline decoration-slate-200 hover:decoration-blue-600 transition ml-1">Content Writer</a>,
              <a href="#" className="hover:text-blue-600 underline decoration-slate-200 hover:decoration-blue-600 transition ml-1">Finance</a>,
              <a href="#" className="hover:text-blue-600 underline decoration-slate-200 hover:decoration-blue-600 transition ml-1">Human Resource</a>,
              <a href="#" className="hover:text-blue-600 underline decoration-slate-200 hover:decoration-blue-600 transition ml-1">Management</a>
            </div>

          </div>

          {/* Hero Right Visual collage */}
          <div className="lg:col-span-5 relative w-full h-[400px] flex items-center justify-center">
            
            {/* Collage Background grids */}
            <div className="absolute top-4 left-4 h-32 w-32 border-l border-t border-slate-100 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 h-32 w-32 border-r border-b border-slate-100 pointer-events-none"></div>
            <div className="absolute -top-10 right-4 h-48 w-48 rounded-full bg-blue-50/80 pointer-events-none"></div>

            {/* Main Visual Image Card 1 */}
            <div className="absolute top-4 left-6 w-[280px] h-[210px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 z-10 transition duration-500 hover:scale-103 bg-slate-100">
              <Image
                src="/team1.jpg"
                alt="Hyrtica team collaboration mockup"
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>

            {/* Main Visual Image Card 2 */}
            <div className="absolute bottom-6 right-6 w-[280px] h-[210px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 transition duration-500 hover:scale-103 bg-slate-100">
              <Image
                src="/team2.jpg"
                alt="Hyrtica corporate handshake mockup"
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>

          </div>

        </div>

      </section>

      {/* 3. "Browse by category" Carousel Section */}
      <section className="bg-white py-16 sm:py-24 border-t border-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section titles */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse by category</h2>
            <p className="text-slate-500 text-sm mt-3">Find the job that's perfect for you. about 800+ new jobs everyday</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-5">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 p-5 flex flex-col gap-4 transition duration-300 hover:shadow-lg hover:shadow-slate-100/50 cursor-pointer"
              >
                {/* Icon wrapper */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-blue-50 transition duration-350 shrink-0">
                  {renderCategoryIcon(cat.iconName)}
                </div>
                
                {/* Titles */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {cat.jobsCount} Jobs Available
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Promotional Banner Strip */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="w-full rounded-3xl bg-blue-50/60 border border-blue-100/40 p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
            
            {/* Visual background vector mocks */}
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none opacity-20 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
            
            <div className="flex flex-col gap-2 relative z-10 text-center md:text-left">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">WE ARE HIRING</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-1.5">
                Let's Work Together & Explore Opportunities
              </h2>
            </div>

            <div className="relative z-10 shrink-0">
              <button 
                type="button" 
                className="bg-blue-600 hover:bg-blue-700 hover:scale-103 px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-lg shadow-blue-600/10 transition cursor-pointer"
              >
                Apply Now
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 5. "Jobs of the day" Grid Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          
          {/* Section titles */}
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jobs of the day</h2>
            <p className="text-slate-500 text-sm mt-3">Search and connect with the right candidates faster</p>
          </div>

          {/* Navigation Pill tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.name
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/10'
                      : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {renderCategoryIcon(cat.iconName)}
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* Jobs Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 min-h-[300px] relative">
            {loadingJobs ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">Loading listings...</span>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 border border-dashed border-slate-100 rounded-2xl w-full">
                No active jobs listed under this category today. Try selecting another tab.
              </div>
            ) : (
              filteredJobs.map(job => {
                const isSaved = savedJobs.includes(job.id)
                return (
                  <div 
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 p-5 flex flex-col justify-between gap-5 transition duration-300 hover:shadow-xl hover:shadow-slate-100/50 group"
                  >
                    
                    {/* Header: Company, Location, Save */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Company Logo placeholder */}
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm ${job.logoBg}`}>
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
                      
                      {/* Save lightning/bookmark badge button */}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`rounded-lg p-1.5 border transition cursor-pointer ${
                          isSaved
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                      </button>
                    </div>

                    {/* Job Title and Date */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                        {job.title}
                      </h3>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-3xs font-bold text-slate-400 uppercase tracking-wider">
                          {job.type}
                        </span>
                        <span className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-3xs font-bold text-slate-400 uppercase tracking-wider">
                          {job.postedDate}
                        </span>
                      </div>
                    </div>

                    {/* Job Description text snippet */}
                    <p className="text-2xs text-slate-400 leading-relaxed truncate-2-lines">
                      {job.desc}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map(s => (
                        <span 
                          key={s}
                          className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-3xs font-semibold text-slate-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-1">
                      <div>
                        <span className="text-xs font-bold text-blue-600">{job.salaryRate}</span>
                      </div>
                      
                      <button 
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>

                  </div>
                )
              }))}
          </div>

        </div>
      </section>

      {/* Corporate Clean Footer */}
      <footer className="border-t border-slate-100 bg-slate-50/50 py-10 mt-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-black">
              H
            </div>
            <span className="font-black text-slate-900 tracking-tight">Hyrtica</span>
          </div>
          <p className="text-2xs text-slate-400 mt-4">
            © 2026 Hyrtica Systems Inc. Powered by JobBox layout design guides. Secured under Corporate SSL Certificates.
          </p>
        </div>
      </footer>

    </div>
  )
}
