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

describe('GET /api/v1/auth/verify-email-opt', () => {
  describe('Get Verify Email Use Case', () => {
    test('should return 404 if user not found', async () => {
      const userId = v4() // random user id
      const opt = '123456' // example opt

      const response = await fetch(
        `${webserver.host}/api/v1/auth/verify-email-opt?token=${userId}&opt=${opt}`,
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should return 404 if token not found or expired', async () => {
      const user = await utilsTest.createDefaultUser()
      const opt = '123456' // example opt

      const response = await fetch(
        `${webserver.host}/api/v1/auth/verify-email-opt?token=${user.id}&opt=${opt}`,
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Token não encontrado ou expirado.')
    })

    test('should return 400 if opt is invalid', async () => {
      const token = await utilsTest.createDefaultTokenWithOpt()
      const opt = '123456' // example opt

      const response = await fetch(
        `${webserver.host}/api/v1/auth/verify-email-opt?token=${token.identifier}&opt=${opt}`,
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(400)
      expect(responseBody.message).toBe('Token inválido.')
    })

    test('should verify email and delete token if opt is valid', async () => {
      const token = await utilsTest.createDefaultTokenWithOpt()

      const response = await fetch(
        `${webserver.host}/api/v1/auth/verify-email-opt?token=${token.identifier}&opt=${token.opt}`,
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Email verificado com sucesso!')

      const userResult = await database.query({
        text: `
          SELECT * FROM users
          WHERE id = $1
        `,
        values: [token.identifier],
      })

      const user = userResult.rows[0]

      expect(user.emailVerified).toBeDefined()
      expect(user.email_verified_provider).toBe('credential')
      expect(user.profile_completion_score).toBe(3)

      const tokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token = $2
        `,
        values: [token.identifier, token.token],
      })

      expect(tokenResult.rows.length).toBe(0)
    })

    test('should delete all expired tokens', async () => {
      // Create 10 users with expired tokens
      for (let i = 0; i < 10; i++) {
        const userId = v4()
        const email = `email${i}@test.com.br`

        await database.query({
          text: `
            INSERT INTO users (id, email, password_hash, "emailVerified", email_verified_provider) VALUES ($1, $2, $3, $4, $5)
          `,
          values: [userId, email, 'password_hash', new Date(), 'credential'],
        })

        await database.query({
          text: `
            INSERT INTO verification_token (identifier, token, expires, token_type)
            VALUES ($1, $2, now() - interval '1 day', $3)
          `,
          values: [userId, v4(), 'EMAIL_VERIFICATION'],
        })
      }

      // Create one user with valid token
      const user = await utilsTest.createDefaultUserEmailVerified()

      const tokesExpiredResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE expires < now() at time zone 'utc'
        `,
      })
      const tokensExpired = tokesExpiredResult.rows

      expect(tokensExpired.length).toBe(10)

      await fetch(
        `${webserver.host}/api/v1/auth/verify-email-opt?token=${user.id}&opt=123456`,
        {
          method: 'GET',
        },
      )

      const tokesResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE expires < now() at time zone 'utc'
        `,
      })

      const tokens = tokesResult.rows

      expect(tokens.length).toBe(0)
    })
  })
})
