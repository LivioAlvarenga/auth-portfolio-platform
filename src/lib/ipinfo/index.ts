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
    console.log('💥 Error retrieving location data wit ipInfo:', error)

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
