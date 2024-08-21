import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // console.log('😀 ~ middleware run!')
  return NextResponse.next()
}

// See "Matching Paths" below to learn more https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon*|android-chrome*|site.webmanifest*).*)',
  ],
}
