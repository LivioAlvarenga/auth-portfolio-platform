import { webserver } from '@/infra/webserver'
import { redirect } from 'next/navigation'
import { auth } from '.'

interface ServerProtectedRouteProps {
  role?: 'user' | 'admin'
  fallbackPath?: string
  accessIfNotAuthenticated?: boolean
}

/**
 * serverProtectedRoute is a function that protects routes based on user authentication and roles.
 * It can either restrict access to authenticated users with specific roles or restrict access
 * to users who are not authenticated (e.g., login, register pages).
 *
 * @param props - The properties to configure the route protection.
 * @param props.role - The required role to access the route.
 * @param props.fallbackPath - The path to redirect if the user does not have the required role.
 * @param props.accessIfNotAuthenticated - If true, the route is only accessible to users who are not authenticated.
 *
 * @returns The session object if the user is authenticated and has the required role.
 *
 * @example
 * // Protect a route for only admin users
 * await serverProtectedRoute({ role: 'admin' });
 *
 * @example
 * // Protect a route that should only be accessible to non-authenticated users (e.g., login page)
 * await serverProtectedRoute({ accessIfNotAuthenticated: true });
 */
export async function serverProtectedRoute({
  role = 'user',
  fallbackPath = '/',
  accessIfNotAuthenticated = false,
}: ServerProtectedRouteProps = {}) {
  const session = await auth()

  const roleHierarchy = {
    user: 1,
    admin: 2,
  }

  if (accessIfNotAuthenticated) {
    // If the user is authenticated, redirect to the home page
    if (session && session.user) {
      return redirect(`${webserver.host}`)
    }
  } else {
    // If there is no session or the user object is undefined, redirect to the login page
    if (!session || !session.user || !session.user.role) {
      return redirect(`${webserver.host}/login`)
    }

    // If the user's role does not match the required role, redirect to the fallback path
    const userRole = session.user.role as 'user' | 'admin'

    if (roleHierarchy[userRole] < roleHierarchy[role]) {
      return redirect(`${webserver.host}${fallbackPath}`)
    }
  }

  return session
}
