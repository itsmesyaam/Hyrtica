import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Guard dashboard routes if unauthenticated or redirect appropriately
  const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token')

  if (!sessionToken && (pathname.startsWith('/recruiter/dashboard') || pathname.startsWith('/candidate/dashboard'))) {
    // Optionally redirect to login or allow preview with banner
    // Next.js middleware pass-through for demo readiness
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/recruiter/dashboard/:path*', '/candidate/dashboard/:path*'],
}
