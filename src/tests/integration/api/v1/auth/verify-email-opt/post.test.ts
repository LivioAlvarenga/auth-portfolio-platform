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

describe('POST /api/v1/public/auth/verify-email-opt', () => {
  describe('Verify Email Use Case', () => {
    test('should return 404 if user not found', async () => {
      const userId = v4() // random user id

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/verify-email-opt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should return 200 if email is already verified', async () => {
      const user = await utilsTest.createDefaultUserEmailVerified()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/verify-email-opt`,
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
      expect(responseBody.message).toBe('Email já verificado.')
    })

    test('should create new token if it does not exist in database', async () => {
      const user = await utilsTest.createDefaultUser()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/verify-email-opt`,
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

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe(
        'Token de verificação enviado com sucesso!',
      )

      const verificationTokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [user.id, 'EMAIL_VERIFICATION'],
      })

      const verificationToken = verificationTokenResult.rows[0]

      expect(verificationToken).toBeDefined()
      expect(verificationToken.token).toBeDefined()
      expect(verificationToken.opt).toBeDefined()
      expect(verificationToken.expires).toBeDefined()
      expect(verificationToken.token_type).toBe('EMAIL_VERIFICATION')
      expect(verificationToken.identifier).toBe(user.id)
    })

    test('should update token if it exist in database', async () => {
      const token = await utilsTest.createDefaultTokenWithOpt()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/verify-email-opt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: token.identifier,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe(
        'Token de verificação enviado com sucesso!',
      )

      const verificationTokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [token.identifier, 'EMAIL_VERIFICATION'],
      })

      const verificationToken = verificationTokenResult.rows[0]

      expect(verificationTokenResult.rows.length).toBe(1)
      expect(verificationToken).toBeDefined()
      expect(verificationToken.token).not.toBe(token.token)
      expect(verificationToken.opt).not.toBe(token.opt)
      expect(verificationToken.expires).not.toBe(token.expires)
      expect(verificationToken.token_type).toBe('EMAIL_VERIFICATION')
      expect(verificationToken.identifier).toBe(token.identifier)
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

      await fetch(`${webserver.host}/api/v1/public/auth/verify-email-opt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
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
