import { database } from '@/infra/database'

beforeAll(clearDatabase)

async function clearDatabase() {
  await database.query('drop schema public cascade; create schema public;')
}

test('POST to /api/v1/migrations should return 200', async () => {
  // first migrate the database responseBody.length > 0, because we have migrations
  const response1 = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  })
  expect(response1.status).toBe(201)

  const responseBody = await response1.json()

  expect(Array.isArray(responseBody)).toBe(true)
  expect(responseBody.length).toBeGreaterThan(0)

  // now migrate the database responseBody.length === 0, because we have already migrated
  const response2 = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  })
  expect(response2.status).toBe(200)

  const response2Body = await response2.json()

  expect(Array.isArray(response2Body)).toBe(true)
  expect(response2Body.length).toBe(0)
})
