"use client"

import React from 'react'
import { Hexagon, Users, User } from 'lucide-react'

interface NavbarProps {
  currentView: 'recruiter' | 'candidate'
  onViewChange: (view: 'recruiter' | 'candidate') => void
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/20">
            <Hexagon className="h-5.5 w-5.5 text-white animate-spin-slow" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
              HYRTICA
            </span>
            <span className="ml-1.5 text-3xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              Enterprise
            </span>
          </div>
        </div>

        {/* View Switcher - Pill Selector */}
        <div className="relative flex rounded-full bg-slate-900 p-1 border border-slate-800 shadow-inner">
          
          {/* Recruiter View Toggle */}
          <button
            id="toggle-recruiter"
            onClick={() => onViewChange('recruiter')}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
              currentView === 'recruiter'
                ? 'text-white shadow bg-gradient-to-r from-violet-600 to-indigo-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Recruiter Workspace</span>
            <span className="sm:hidden">Recruiter</span>
          </button>

          {/* Candidate Portal Toggle */}
          <button
            id="toggle-candidate"
            onClick={() => onViewChange('candidate')}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
              currentView === 'candidate'
                ? 'text-white shadow bg-gradient-to-r from-violet-600 to-indigo-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Candidate Portal</span>
            <span className="sm:hidden">Candidate</span>
          </button>
        </div>

        {/* Action Link / Profile Indicator */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs text-slate-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Hyrtica Core Sync
          </div>
        </div>

      </div>
    </header>
  )
}
