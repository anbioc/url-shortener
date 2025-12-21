import { headers } from "next/headers";
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const token = request.cookies.get('access_token')


  const redir = request.url.endsWith("/dashboard") || request.url.endsWith("/links") ||
  request.url.endsWith("/analytics") || request.url.endsWith("/profile") ||
  request.url.endsWith("/settings")

   if (!token && redir) {
      console.log(`Request url: ${request.url}`)
    return NextResponse.redirect(new URL('/sign-in', request.url))

  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}