import React from 'react'

interface LogoProps {
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
  className?: string
}

export default function Logo({
  showText = true,
  size = 'md',
  variant = 'dark',
  className = ''
}: LogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900'
  const subtextColor = variant === 'light' ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className={`flex items-center gap-2.5 shrink-0 select-none ${className}`}>
      {/* Modern Abstract "H" Vector Icon with Royal Blue & Sky Blue Nodes */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Royal Blue to Sky Blue Linear Gradient */}
            <linearGradient id="hyrticaRoyalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <linearGradient id="hyrticaSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id="hyrticaNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>

          {/* Background Rounded Shield Tile */}
          <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#hyrticaRoyalGrad)" />

          {/* Left Vertical Pillar of "H" */}
          <rect x="11" y="11" width="6" height="22" rx="3" fill="#FFFFFF" opacity="0.95" />

          {/* Right Vertical Pillar of "H" */}
          <rect x="27" y="11" width="6" height="22" rx="3" fill="url(#hyrticaSkyGrad)" />

          {/* Dynamic Vector Bridge Connecting H with Node Pulse */}
          <path
            d="M17 22H27"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Signal Node Dots */}
          <circle cx="22" cy="22" r="3.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="30" cy="14" r="2.5" fill="#38BDF8" />
          <circle cx="14" cy="30" r="2" fill="#93C5FD" />
        </svg>
      </div>

      {/* Typography: Hyrtica with Accent Dot on 'i' */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight ${textSizes[size]} ${textColor} flex items-center`}>
            <span>Hyrt</span>
            <span className="relative inline-block">
              i
              {/* Accent Sky Blue Dot on the 'i' */}
              <span className="absolute -top-[0.15em] left-1/2 -translate-x-1/2 h-[0.25em] w-[0.25em] rounded-full bg-[#38BDF8] shadow-xs"></span>
            </span>
            <span>ca</span>
          </div>
          <span className={`text-4xs font-extrabold uppercase tracking-widest mt-0.5 ${subtextColor}`}>
            AI Job Platform
          </span>
        </div>
      )}
    </div>
  )
}
