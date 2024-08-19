import { addDays, addHours, addMinutes, addMonths } from 'date-fns'
import { cookies } from 'next/headers'
import { Cookie, CookieRepository } from '../cookie-repository'

/**
 * `NextCookieRepository` class for managing cookies in Next.js.
 *
 * This class provides methods to create (setCookie), delete (deleteCookie), and retrieve (getCookie) cookies
 * securely, considering the production environment and applying a secure prefix.
 */
export class NextCookieRepository implements CookieRepository {
  /**
   * Generates the full cookie name considering the prefix.
   *
   * @param name - The name of the cookie.
   * @param prefixProd - Optional prefix for the production environment.
   * @returns The full cookie name with the prefix, if applicable.
   */
  private getCookieName(name: string, prefixProd?: string): string {
    const defaultPrefix = '__Secure-'
    const prefix =
      process.env.NODE_ENV === 'production' ? prefixProd || defaultPrefix : ''
    return `${prefix}${name}`
  }

  /**
   * Calculates the expiration date based on a duration string.
   *
   * @param duration - String that defines the duration, such as "1 day", "2 hours", "30 minutes", "3 months".
   * @returns A `Date` object corresponding to the calculated expiration date.
   */
  private calculateExpiry(duration: string): Date {
    const [value, unit] = duration.split(' ')
    const amount = parseInt(value, 10)

    switch (unit) {
      case 'day':
      case 'days':
        return addDays(new Date(), amount)
      case 'hour':
      case 'hours':
        return addHours(new Date(), amount)
      case 'minute':
      case 'minutes':
        return addMinutes(new Date(), amount)
      case 'month':
      case 'months':
        return addMonths(new Date(), amount)
      default:
        throw new Error('Unsupported time unit.')
    }
  }

  setCookie(cookie: Cookie): void {
    const {
      name,
      prefixProd,
      value,
      expires,
      httpOnly,
      secure,
      path,
      sameSite,
    } = cookie

    if (!value) {
      throw new Error('The cookie value cannot be undefined.')
    }

    const cookieName = this.getCookieName(name, prefixProd)

    // Determine expiryDate based on the type of expires
    let expiryDate: Date
    if (typeof expires === 'string') {
      expiryDate = this.calculateExpiry(expires)
    } else if (expires instanceof Date) {
      expiryDate = expires
    } else {
      // Default to 5 minutes if no expiration is provided
      expiryDate = addMinutes(new Date(), 5)
    }

    cookies().set(cookieName, value, {
      expires: expiryDate,
      httpOnly: httpOnly !== undefined ? httpOnly : true,
      secure:
        secure !== undefined ? secure : process.env.NODE_ENV === 'production',
      path: path || '/',
      sameSite: sameSite || 'lax',
    })
  }

  deleteCookie(name: string, prefixProd?: string): void {
    const cookieName = this.getCookieName(name, prefixProd)
    cookies().delete(cookieName)
  }

  getCookie(name: string, prefixProd?: string): Cookie | undefined {
    const cookieName = this.getCookieName(name, prefixProd)
    return cookies().get(cookieName)
  }
}
