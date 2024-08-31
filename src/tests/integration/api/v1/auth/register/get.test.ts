import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { orchestrator } from '@/tests/orchestrator'
import { utilsTest } from '@/tests/utils/defaultUtilsTest'
import { v4 } from 'uuid'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.dropAllTables()
  await orchestrator.runPendingMigrations()
})

afterEach(async () => {
  await database.query('DELETE FROM users')
})

describe('GET /api/v1/public/auth/register', () => {
  describe('Get User Register Use Case', () => {
    test('should return 404 if userId is invalid', async () => {
      const userId = v4()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register?token=${userId}`,
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should return user data if userId is valid', async () => {
      const user = await utilsTest.createDefaultUser()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register?token=${user.id}`,
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Usuário encontrado.')
      expect(responseBody.user.id).toBe(user.id)
      expect(responseBody.user.email).toBe(user.email)
      expect(responseBody.user.name).toBe(user.nick_name || user.name)
    })
  })
})
