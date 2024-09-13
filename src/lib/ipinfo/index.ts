import { NextRequest } from 'next/server'
import { IPinfoWrapper } from 'node-ipinfo'

const token = process.env.IPINFO_TOKEN

if (!token) {
  throw new Error('💥 The IPINFO_TOKEN environment variable is not defined.')
}

const ipinfo = new IPinfoWrapper(token)

/**
 * Retrieves location data based on the provided IP address.
 *
 * @param {string} ip - The IP address to retrieve location data for.
 * @returns {Promise<{ ip: string, country: string, region: string, city: string, timezone: string }>} - Returns location data including IP, country, region, city, and timezone. If an error occurs, returns "unknown" for each field.
 */
export const getLocationDataFromIP = async (ip: string) => {
  try {
    // Make an API request to IPinfo to retrieve the location data
    const details = await ipinfo.lookupIp(ip)

    // Return the relevant details from the response
    return {
      ip: details.ip || 'unknown',
      country: details.country || 'unknown',
      region: details.region || 'unknown',
      city: details.city || 'unknown',
      timezone: details.timezone || 'unknown',
    }
  } catch (error) {
    // Log the error for debugging purposes
    if (process.env.NODE_ENV !== 'test') {
      console.error('💥 Error retrieving location data:', error)
    }

    // Return default "unknown" data to prevent breaking the app
    return {
      ip: 'unknown',
      country: 'unknown',
      region: 'unknown',
      city: 'unknown',
      timezone: 'unknown',
    }
  }
}

/**
 * Retrieves the IP address from the request or uses a simulated IP for localhost.
 *
 * @param {NextRequest} req - The incoming Next.js request object.
 * @returns {string} - The real IP address or the simulated IP if in a localhost environment.
 */
export const getClientIp = (req: NextRequest): string => {
  // Retrieve the IP from the 'x-forwarded-for' header or use req.ip
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'

  // Check if the IP is from localhost (IPv6 `::1` or IPv4 `127.0.0.1`)
  const isLocalhost = ip === '::1' || ip === '127.0.0.1'
  const localhostIp = process.env.LOCALHOST_SIMULATED_IP || '127.0.0.1'

  // Return the simulated IP for localhost or the real IP if not localhost
  return isLocalhost ? localhostIp : ip
}
