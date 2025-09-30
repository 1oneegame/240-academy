import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем API роуты и статические файлы
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next()
  }

  

  if (pathname === '/auth') {
    const token = request.cookies.get('better-auth.session_token')
    
    if (token) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/student'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('better-auth.session_token')
    
    if (!token) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth', '/admin/:path*']
}
