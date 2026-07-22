"use client"

import React from 'react'
import { User, FileText, Code, CheckCircle } from 'lucide-react'

export default function CandidatePortal() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Candidate Portal</h1>
        <p className="text-slate-400 text-sm">Upload your resume, build your developer profile, and take assigned coding challenges.</p>
      </div>

      {/* Grid of basic pipeline milestones */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
            <User className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1</h4>
            <p className="text-sm font-bold text-white mt-0.5">Profile Builder</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
            <Code className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2</h4>
            <p className="text-sm font-bold text-white mt-0.5">Code Challenge</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
            <CheckCircle className="h-5 w-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 3</h4>
            <p className="text-sm font-bold text-white mt-0.5">Hiring Review</p>
          </div>
        </div>
      </div>

      {/* Upload Zone mock */}
      <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40 p-12 text-center flex flex-col items-center justify-center gap-4 text-slate-500 hover:border-slate-700 transition cursor-pointer">
        <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400">
          <FileText className="h-6 w-6 text-slate-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-300">Submit Your Resume</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Drag and drop your resume file (.pdf, .docx, .txt) here to parse details automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
