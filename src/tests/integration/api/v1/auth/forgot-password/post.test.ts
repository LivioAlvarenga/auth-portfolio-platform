import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { orchestrator } from '@/tests/orchestrator'
import { utilsTest } from '@/tests/utils/defaultUtilsTest'
import { addDays } from 'date-fns'
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

describe('POST /api/v1/auth/forgot-password', () => {
  describe('Forgot Password Use Case', () => {
    test('should return 404 if user not found', async () => {
      const email = 'notfoundemail@test.com'

      const response = await fetch(
        `${webserver.host}/api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should create a new reset password token if it does not exist in the database', async () => {
      const user = await utilsTest.createDefaultUser()

      const response = await fetch(
        `${webserver.host}/api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token criado com sucesso.')
      expect(responseBody.userId).toBe(user.id)

      const verificationTokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [user.id, 'RESET_PASSWORD'],
      })

      const verificationToken = verificationTokenResult.rows[0]

      expect(verificationToken).toBeDefined()
      expect(verificationToken.token).toBeDefined()
      expect(verificationToken.expires).toBeDefined()
      expect(verificationToken.token_type).toBe('RESET_PASSWORD')
      expect(verificationToken.identifier).toBe(user.id)
    })

    test('should update the existing reset password token if it already exists in the database', async () => {
      const user = await utilsTest.createDefaultUser()
      const tokenResult = await database.query({
        text: `
          INSERT INTO verification_token (identifier, token, expires, token_type)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        values: [user.id, v4(), addDays(new Date(), 1), 'RESET_PASSWORD'],
      })
      const token = tokenResult.rows[0]

      const response = await fetch(
        `${webserver.host}/api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token criado com sucesso.')
      expect(responseBody.userId).toBe(user.id)

      const verificationTokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [user.id, 'RESET_PASSWORD'],
      })

      const updatedToken = verificationTokenResult.rows[0]

      expect(updatedToken).toBeDefined()
      expect(updatedToken.token).not.toBe(token.token) // O token foi atualizado
      expect(updatedToken.expires).not.toBe(token.expires) // A data de expiração foi atualizada
      expect(updatedToken.token_type).toBe('RESET_PASSWORD')
      expect(updatedToken.identifier).toBe(user.id)
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

      await fetch(`${webserver.host}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
        }),
      })

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
