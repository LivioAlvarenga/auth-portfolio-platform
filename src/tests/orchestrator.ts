import AsyncRetry from 'async-retry'

async function waitForAllServices() {
  await waitForWebServer()

  async function waitForWebServer() {
    return AsyncRetry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    })

    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3000/api/v1/status')
      if (response.status !== 200) {
        throw new Error()
      }
    }
  }
}

const orchestrator = { waitForAllServices }

export { orchestrator }
