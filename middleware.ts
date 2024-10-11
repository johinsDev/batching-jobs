import { NextResponse } from "next/server"
import { authMiddleware } from "better-auth/next-js"

export default authMiddleware({
  customRedirect: async (session, request) => {
    const baseURL = request.nextUrl.origin
    if (request.nextUrl.pathname === "/login" && session) {
      return NextResponse.redirect(new URL("/dashboard", baseURL))
    }
    if (request.nextUrl.pathname === "/dashboard" && !session) {
      return NextResponse.redirect(new URL("/login", baseURL))
    }
    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/dashboard", "/login"],
}
