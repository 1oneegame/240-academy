import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/student')) {
    const token = request.cookies.get('better-auth.session_token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  if (pathname === '/auth') {
    const token = request.cookies.get('better-auth.session_token')
    
    if (token) {
      return NextResponse.redirect(new URL('/student', request.url))
    }
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('better-auth.session_token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Для админ-роутов проверка роли будет происходить на уровне компонентов
    // Middleware только проверяет наличие токена
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*', '/auth', '/admin/:path*']
}
