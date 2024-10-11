// export default authMiddleware({
//   customRedirect: async (session, request) => {
//     const { nextUrl } = request

//     const isLoggedIn = !!session

//     const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname)

//     const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname)

//     const isApiAuthRoute = request.nextUrl.pathname.startsWith(API_AUTH_PREFIX)

//     if (isApiAuthRoute) {
//       return NextResponse.next()
//     }

//     if (isAuthRoute) {
//       if (isLoggedIn) {
//         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//       }
//       return NextResponse.next()
//     }

//     if (!isLoggedIn && !isPublicRoute) {
//       let callbackUrl = nextUrl.pathname

//       if (nextUrl.search) {
//         callbackUrl += nextUrl.search
//       }

//       const encodedCallbackUrl = encodeURIComponent(callbackUrl)

//       return Response.redirect(
//         new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
//       )
//     }
//   },
// })

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// }

import { NextResponse } from "next/server"
import { authMiddleware } from "better-auth/next-js"

// import { NextResponse } from "next/server"
//import { authMiddleware } from "better-auth/next-js"

const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
]

const PUBLIC_ROUTES = ["/"]

const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export default authMiddleware({
  customRedirect: async (session, request) => {
    const baseURL = request.nextUrl.origin

    const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname)

    const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname)

    const isProtectedRoute = !isPublicRoute && !isAuthRoute

    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, baseURL))
    }

    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL("/sign-in", baseURL))
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ],
}
