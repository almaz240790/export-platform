import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Маршруты, требующие административных прав
const ADMIN_ROUTES = ['/cabinet/admin'];

// Маршруты, требующие аутентификации
const PROTECTED_ROUTES = ['/cabinet'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Проверяем наличие токена (пользователь авторизован)
  const token = await getToken({ req: request });
  
  // Если пользователь пытается получить доступ к защищенному маршруту без авторизации
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Если пользователь пытается получить доступ к маршруту админки без прав администратора
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route)) && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static files (e.g. files in public folder)
     * - _next (Next.js internal files)
     * - favicon.ico, manifest.json, robots.txt etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 