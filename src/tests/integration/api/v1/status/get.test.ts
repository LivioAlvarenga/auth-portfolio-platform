import { webserver } from '@/infra/webserver'
import { orchestrator } from '@/tests/orchestrator'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
})

test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch(`${webserver.host}/api/v1/status`)
  expect(response.status).toBe(200)

  const responseBody = await response.json()

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString()
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt)

  expect(responseBody.dependencies.database.version).toEqual('16.3')
  expect(responseBody.dependencies.database.max_connections).toEqual(100)
  expect(responseBody.dependencies.database.oppened_connetions).toEqual(1)
})
