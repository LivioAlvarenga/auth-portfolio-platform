import UAParser from 'ua-parser-js'

export function getDeviceInfo() {
  return new Promise((resolve) => {
    const parser = new UAParser()
    const result = parser.getResult()
    const deviceIdentifier = `${result.browser.name}-${result.os.name}-${result.device.vendor || 'Unknown'}-${result.device.model || 'Device'}`
    resolve(deviceIdentifier)
  })
}
