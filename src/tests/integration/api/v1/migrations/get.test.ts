import { webserver } from '@/infra/webserver'
import { orchestrator } from '@/tests/orchestrator'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.dropAllTables()
})

test('GET to /api/v1/migrations should return 200', async () => {
  const response = await fetch(`${webserver.host}/api/v1/migrations`)
  expect(response.status).toBe(200)

  const responseBody = await response.json()

  expect(Array.isArray(responseBody)).toBe(true)
  expect(responseBody.length).toBeGreaterThan(0)
})
