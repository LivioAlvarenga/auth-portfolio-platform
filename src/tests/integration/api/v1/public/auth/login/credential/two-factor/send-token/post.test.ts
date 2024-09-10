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
  await database.query('DELETE FROM verification_token')
})

describe('POST /api/v1/public/auth/login/credential/two-factor/send-token', () => {
  describe('User Send Token Two Factor Use Case', () => {
    test('should return 404 if userId does not exist', async () => {
      const nonExistentUserId = v4()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/send-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: nonExistentUserId,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should generate a two-factor authentication token, save it in the database, and send the token via email to the user', async () => {
      const user = await utilsTest.createDefaultUser()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/send-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(200)
      expect(responseBody.message).toBe(
        'Token de autenticação de dois fatores enviado com sucesso!',
      )

      // Check if the token was saved in the database
      const tokenResult = await database.query({
        text: 'SELECT * FROM verification_token WHERE identifier = $1',
        values: [user.id],
      })

      expect(tokenResult.rows.length).toBe(1)

      const token = tokenResult.rows[0]

      expect(token.identifier).toBe(user.id)
      expect(token.token_type).toBe('TWO_FACTOR_VERIFICATION')
      expect(token.opt).toBeDefined()

      // Verify if the token expires in 10 minutes
      const expires = new Date(token.expires)
      const createdAt = new Date(token.created_at)
      const diffMinutes = Math.round(
        (expires.getTime() - createdAt.getTime()) / (1000 * 60),
      )

      expect(diffMinutes).toBe(10)
    })
  })
})
