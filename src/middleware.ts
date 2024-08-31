/*
Explanation for Using Matcher /app/api/v1/private/:path* and Keeping Middleware Simple

We decided to use the matcher /app/api/v1/private/:path* in our middleware configuration to ensure that the middleware only runs on routes that require protection. This approach significantly reduces unnecessary processing, as the middleware will not execute on public routes or other parts of the application that do not need this layer of security.

By applying the middleware exclusively to the /app/api/v1/private/:path* routes, we maintain simplicity and avoid introducing performance bottlenecks. The middleware's primary function is to perform a quick and efficient check to see if a session token is present in the request. This operation is lightweight and keeps the middleware performant even under heavy load.

More robust checks, such as verifying the integrity of the session token and confirming the user's role, are deliberately deferred to the controllers and use cases. This ensures that the middleware remains focused on its core responsibility—authentication—while the controllers handle more complex logic that may require interaction with the database or other systems. This separation of concerns not only enhances performance but also makes the application more modular and easier to maintain.

By keeping the middleware lightweight and delegating detailed verification tasks to the appropriate layers, we can optimize the performance of our system without compromising security.
*/

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const isProduction = process.env.NODE_ENV === 'production'

export function middleware(request: NextRequest) {
  const sessionToken = isProduction
    ? request.cookies.get('__Secure-authjs.session-token')
    : request.cookies.get('authjs.session-token')

  // if the session token is not present, redirect to the login page
  if (!sessionToken?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // if the session token is present, continue to the next middleware
  return NextResponse.next()
}

// Config of matcher to only run this middleware on the private API routes
export const config = {
  matcher: '/app/api/v1/private/:path*',
}
