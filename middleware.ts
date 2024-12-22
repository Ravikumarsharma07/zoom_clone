import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export { default } from "next-auth/middleware"
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request})
    const url = request.nextUrl
    if(token && (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up")
        )){
        return NextResponse.redirect(new URL('/', request.url))
    }
    if(!token && (
        url.pathname.startsWith("/Upcoming") ||
        url.pathname.startsWith("/Previous") ||        
        url.pathname.startsWith("/Personal-room") || 
        url.pathname.startsWith("/Recordings") || 
        url.pathname.startsWith("/meeting") ||
        url.pathname == "/"      
    )){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
}