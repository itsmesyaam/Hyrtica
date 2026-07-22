"use client"

import React from 'react'
import { Users, Briefcase, MapPin, TrendingUp, Search } from 'lucide-react'

export default function RecruiterWorkspace() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Recruiter Workspace</h1>
        <p className="text-slate-400 text-sm">Manage candidate pipelines, set up technical assessments, and track job matches.</p>
      </div>

      {/* Grid of basic stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Pipeline</span>
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-4">148</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Positions</span>
            <Briefcase className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-4">12</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews Today</span>
            <TrendingUp className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-4">5</p>
        </div>
      </div>

      {/* Visual Workspace placeholder */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center flex flex-col items-center justify-center gap-4 text-slate-500">
        <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400">
          <Search className="h-6 w-6 text-slate-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-300">Candidate Search Console</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Ready to integrate the database query layer. Search through applicants by skill, location, or name.
          </p>
        </div>
      </div>
    </div>
  )
}
