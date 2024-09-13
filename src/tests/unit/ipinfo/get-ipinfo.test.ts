import { getLocationDataFromIP } from '@/lib/ipinfo'

describe('IPinfo API', () => {
  test('should return valid location data for a given IP', async () => {
    // Simulate a real IP address (e.g., Google's public DNS)
    const ip = '8.8.8.8'

    // Call the function that interacts with the IPinfo API
    const locationData = await getLocationDataFromIP(ip)

    // Check that the returned location data is not "unknown"
    expect(locationData.ip).toBe(ip)
    expect(locationData.country).not.toBe('unknown')
    expect(locationData.region).not.toBe('unknown')
    expect(locationData.city).not.toBe('unknown')
    expect(locationData.timezone).not.toBe('unknown')
  })

  test('should return unknown values if the API fails', async () => {
    // Simulate an invalid IP address to trigger an error
    const invalidIp = '999.999.999.999'

    // Call the function with the invalid IP
    const locationData = await getLocationDataFromIP(invalidIp)

    // Expect all values to be "unknown" since the IP is invalid
    expect(locationData.ip).toBe('unknown')
    expect(locationData.country).toBe('unknown')
    expect(locationData.region).toBe('unknown')
    expect(locationData.city).toBe('unknown')
    expect(locationData.timezone).toBe('unknown')
  })
})
