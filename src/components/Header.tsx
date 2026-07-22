"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hexagon, ChevronDown, User, Users, Compass, Shield, LogOut } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Determine current active workspace state based on pathname
  const getActiveRole = () => {
    if (pathname?.startsWith('/recruiter')) {
      return { label: 'Recruiter Workspace', type: 'recruiter', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' }
    }
    if (pathname?.startsWith('/candidate')) {
      return { label: 'Candidate Portal', type: 'candidate', color: 'text-blue-650 bg-blue-50 border-blue-100' }
    }
    return { label: 'Public Portal', type: 'public', color: 'text-slate-500 bg-slate-50 border-slate-100' }
  }

  const activeRole = getActiveRole()

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full bg-white border-b border-slate-100/80 sticky top-0 z-50 shadow-sm/5 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-18 items-center justify-between">
        
        {/* Left branding */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/10">
            <Hexagon className="h-5.5 w-5.5 text-white animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
              Hyrtica
            </span>
            <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 leading-none">
              Job platform
            </span>
          </div>
        </Link>

        {/* Center Links (Adaptive based on active path) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-500 select-none">
          {activeRole.type === 'public' && (
            <>
              <Link href="/" className="text-blue-600 flex items-center gap-1">Home <ChevronDown className="h-3.5 w-3.5" /></Link>
              <a href="#" className="hover:text-blue-600 transition">Find a job</a>
              <Link href="/recruiter/dashboard" className="hover:text-blue-600 transition flex items-center gap-1">Recruiters <ChevronDown className="h-3.5 w-3.5" /></Link>
              <Link href="/candidate/dashboard" className="hover:text-blue-600 transition flex items-center gap-1">Candidates <ChevronDown className="h-3.5 w-3.5" /></Link>
              <a href="#" className="hover:text-blue-600 transition flex items-center gap-1">Blog <ChevronDown className="h-3.5 w-3.5" /></a>
              <a href="#" className="hover:text-blue-600 transition flex items-center gap-1">Pages <ChevronDown className="h-3.5 w-3.5" /></a>
            </>
          )}

          {activeRole.type === 'recruiter' && (
            <>
              <Link href="/recruiter/dashboard" className="text-blue-600 font-bold">Active Dashboard</Link>
              <a href="#" className="hover:text-blue-600 transition">Candidate Pipelines</a>
              <a href="#" className="hover:text-blue-600 transition">Open Job Positions</a>
              <a href="#" className="hover:text-blue-600 transition">Assigned Assessments</a>
            </>
          )}

          {activeRole.type === 'candidate' && (
            <>
              <Link href="/candidate/dashboard" className="text-blue-600 font-bold">My Profile Home</Link>
              <a href="#" className="hover:text-blue-600 transition">Resume Parser</a>
              <a href="#" className="hover:text-blue-600 transition">Applications Tracker</a>
              <a href="#" className="hover:text-blue-600 transition">Recommended Jobs</a>
            </>
          )}
        </div>

        {/* Right Role-Switcher Dropdown Menu */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition cursor-pointer select-none"
            >
              <span className={`h-2 w-2 rounded-full ${
                activeRole.type === 'recruiter' ? 'bg-indigo-600' :
                activeRole.type === 'candidate' ? 'bg-blue-600 animate-pulse' :
                'bg-slate-400'
              }`}></span>
              <span>{activeRole.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu popover */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 animate-fade-in font-semibold">
                <span className="text-4xs font-extrabold text-slate-400 uppercase tracking-widest block px-3 py-1.5 border-b border-slate-50 mb-1.5">
                  Select User workspace
                </span>

                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition ${
                    activeRole.type === 'public'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Compass className="h-4 w-4" />
                  <span>Landing Page Portal</span>
                </Link>

                <Link
                  href="/recruiter/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition ${
                    activeRole.type === 'recruiter'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Recruiter Workspace</span>
                </Link>

                <Link
                  href="/candidate/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition ${
                    activeRole.type === 'candidate'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Candidate Portal</span>
                </Link>
              </div>
            )}
          </div>

          {/* Core Access Button */}
          <a href="#" className="hidden sm:inline-flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer">
            Sign in
          </a>

        </div>

      </div>
    </header>
  )
}
