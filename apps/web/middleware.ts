import { NextRequest, NextResponse } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/agent': ['AGENT'],
  '/company': ['COMPANY'],
  '/dashboard': ['USER'],
  '/resume': ['USER'],
  '/applications': ['USER'],
  '/profile': ['USER'],
  '/messages': ['USER', 'AGENT', 'COMPANY', 'ADMIN'],
};

function getUserFromRequest(req: NextRequest) {
  // Read from cookie (set during login for SSR-safe auth)
  const cookie = req.cookies.get('jobmatch_user');
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value) as { role: string };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find matching protected route prefix
  const protectedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!protectedPrefix) return NextResponse.next();

  const user = getUserFromRequest(req);

  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = ROLE_ROUTES[protectedPrefix];
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const dashboardMap: Record<string, string> = {
      ADMIN: '/admin/dashboard',
      AGENT: '/agent/dashboard',
      COMPANY: '/company/dashboard',
      USER: '/dashboard',
    };
    return NextResponse.redirect(new URL(dashboardMap[user.role] ?? '/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/agent/:path*',
    '/company/:path*',
    '/dashboard/:path*',
    '/resume/:path*',
    '/applications/:path*',
    '/profile/:path*',
    '/messages/:path*',
  ],
};
