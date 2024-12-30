import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Daftar path yang tidak perlu autentikasi
const PUBLIC_PATHS = ['/admin/login', '/admin/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Jika path public, lewati pengecekan
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error decoding token:', error);
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*']
};