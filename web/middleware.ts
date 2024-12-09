import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken');
  const { pathname } = req.nextUrl;

  const authPaths = ['/login', '/register', '/forget-password', '/reset-password'];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isAdminPage = pathname.startsWith('/admin');
  const isHomePage = pathname === '/';

  if (!token && isAdminPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && (isAuthPage || isHomePage)) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}
