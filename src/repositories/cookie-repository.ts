/**
 * Interface representing the properties of a cookie.
 */
export interface Cookie {
  /**
   * The name of the cookie.
   */
  name: string

  /**
   * Optional prefix for the cookie name in production (e.g., `__Secure-`).
   */
  prefixProd?: string

  /**
   * The value of the cookie. Can be undefined.
   */
  value?: string

  /**
   * The expiration of the cookie, which can be a string duration (e.g., "1 day", "2 hours")
   * or a `Date` object.
   */
  expires?: string | Date

  /**
   * Whether the cookie should be accessible only by the server (default is `true`).
   */
  httpOnly?: boolean

  /**
   * Whether the cookie should be sent only over secure connections (HTTPS) (default is `true` in production).
   */
  secure?: boolean

  /**
   * The path where the cookie is valid (default is `/`).
   */
  path?: string | '/'

  /**
   * SameSite policy for the cookie (`lax`, `strict`, `none`).
   */
  sameSite?: 'lax' | 'strict' | 'none'
}

/**
 * Interface defining the contract for a cookie repository.
 *
 * This interface should be implemented by any cookie management class,
 * ensuring a consistent API for setting, deleting, and retrieving cookies.
 */
export interface CookieRepository {
  /**
   * Sets a cookie in the browser based on the provided settings.
   *
   * @param cookie - Object containing the cookie properties.
   *
   * Properties of `cookie`:
   * - `name`: The name of the cookie.
   * - `prefixProd`: Optional prefix for the cookie name in production (default is `__Secure-`).
   * - `value`: The value of the cookie (cannot be undefined).
   * - `expires`: The expiration of the cookie, which can be a string duration (e.g., "1 day", "2 hours") or a `Date` object. If not provided, defaults to 5 minutes.
   * - `httpOnly`: Whether the cookie should be accessible only by the server (default is `true`).
   * - `secure`: Whether the cookie should be sent only over secure connections (HTTPS) (default is `true` in production).
   * - `path`: The path where the cookie is valid (default is `/`).
   * - `sameSite`: SameSite policy for the cookie (`lax`, `strict`, `none`).
   */
  setCookie(cookie: Cookie): void

  /**
   * Deletes a cookie based on the provided name.
   *
   * @param name - The name of the cookie to delete.
   * @param prefixProd - Optional prefix for the production environment.
   */
  deleteCookie(name: string): void

  /**
   * Retrieves the value of a cookie based on the provided name.
   *
   * @param name - The name of the cookie to retrieve.
   * @param prefixProd - Optional prefix for the production environment.
   * @returns The value of the cookie, if it exists.
   */
  getCookie(name: string): Cookie | undefined
}
