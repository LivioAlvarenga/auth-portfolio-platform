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
  await database.query('DELETE FROM accounts')
  await database.query('DELETE FROM verification_token')
})

describe('GET /api/v1/public/auth/login/magic-link/request', () => {
  describe('User Login Get Request Magic Link Use Case', () => {
    test('should return 404 if token is not found', async () => {
      const nonExistentTokenId = v4()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/request?token=${nonExistentTokenId}`,
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Token não encontrado.')
      expect(responseBody.token).toBeUndefined()
    })

    test('should return 201 if token is found', async () => {
      const existingUser =
        await utilsTest.createDefaultUserWithAccount('magic-link')

      // Create an initial token for the user
      const initialToken = v4()
      await database.query({
        text: `
          INSERT INTO verification_token (identifier, token, expires, token_type)
          VALUES ($1, $2, now() + interval '1 day', $3)
        `,
        values: [existingUser.id, initialToken, 'LOGIN_MAGIC_LINK'],
      })

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/request?token=${initialToken}`,
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token encontrado.')
      expect(responseBody.token).toBeDefined()
      expect(responseBody.token.token).toBe(initialToken)
      expect(new Date(responseBody.token.expires)).toBeInstanceOf(Date)
    })
  })
})
