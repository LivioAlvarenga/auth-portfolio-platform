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
  await database.query('DELETE FROM sessions')
  await database.query('DELETE FROM verification_token')
})

describe('POST /api/v1/auth/login/magic-link/verify', () => {
  describe('User Login Verify Magic Link Use Case', () => {
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
          values: [userId, v4(), 'LOGIN_MAGIC_LINK'],
        })
      }

      // Create magic link user with valid token
      const { token } = await utilsTest.createDefaultUserWithMagicLink()

      const tokesExpiredResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE expires < now() at time zone 'utc'
        `,
      })
      const tokensExpired = tokesExpiredResult.rows

      expect(tokensExpired.length).toBe(10)

      await fetch(`${webserver.host}/api/v1/auth/login/magic-link/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          device: 'device-id',
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

    test('should delete all expired sessions', async () => {
      // Create 10 users with expired sessions
      for (let i = 0; i < 10; i++) {
        const userId = v4()
        const email = `email${i}@test.com.br`
        const device = `device${i}`

        await database.query({
          text: `
            INSERT INTO users (id, email, password_hash, "emailVerified", email_verified_provider) VALUES ($1, $2, $3, $4, $5)
          `,
          values: [userId, email, 'password_hash', new Date(), 'magic-link'],
        })

        await database.query({
          text: `
            INSERT INTO sessions ("sessionToken", "userId", expires, device_identifier)
            VALUES ($1, $2, now() - interval '1 day', $3)
          `,
          values: [v4(), userId, device],
        })
      }

      // Create magic link user with valid token
      const { token } = await utilsTest.createDefaultUserWithMagicLink()

      const sessionsExpiredResult = await database.query({
        text: `
          SELECT * FROM sessions
          WHERE expires < now() at time zone 'utc'
        `,
      })
      const sessionsExpired = sessionsExpiredResult.rows

      expect(sessionsExpired.length).toBe(10)

      await fetch(`${webserver.host}/api/v1/auth/login/magic-link/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          device: 'device-id',
        }),
      })

      const sessionsResult = await database.query({
        text: `
          SELECT * FROM sessions
          WHERE expires < now() at time zone 'utc'
        `,
      })

      const sessions = sessionsResult.rows

      expect(sessions.length).toBe(0)
    })

    test('should return 404 if token does not exist in database', async () => {
      const { token } = await utilsTest.createDefaultUserWithMagicLink()

      // Invalidate the token by deleting it from the database
      await database.query({
        text: `
          DELETE FROM verification_token
          WHERE token = $1
        `,
        values: [token.token],
      })

      // Attempt to verify the deleted token
      const response = await fetch(
        `${webserver.host}/api/v1/auth/login/magic-link/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            device: 'device-id',
          }),
        },
      )

      const result = await response.json()

      expect(response.status).toBe(404)
      expect(result.message).toBe('Token não encontrado.')
    })

    test('should verify the magic link, update user email verification, calculate profile score, create session, and delete verification token', async () => {
      // Create a user with a valid token
      const { user, token } = await utilsTest.createDefaultUserWithMagicLink()

      // Verify the magic link
      const response = await fetch(
        `${webserver.host}/api/v1/auth/login/magic-link/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            device: 'device-id',
          }),
        },
      )

      const result = await response.json()

      // Assert the response
      expect(response.status).toBe(201)
      expect(result.message).toBe('Usuário logado com sucesso!')
      expect(result.userId).toBe(user.id)

      // Check that the user's email was verified
      const updatedUserResult = await database.query({
        text: `
          SELECT "emailVerified", email_verified_provider
          FROM users
          WHERE id = $1
        `,
        values: [user.id],
      })

      const updatedUser = updatedUserResult.rows[0]
      expect(updatedUser.emailVerified).not.toBeNull()
      expect(updatedUser.email_verified_provider).toBe('magic-link')

      // Check that the profile completion score was calculated and updated
      const profileScoreResult = await database.query({
        text: `
          SELECT profile_completion_score
          FROM users
          WHERE id = $1
        `,
        values: [user.id],
      })

      const profileCompletionScore =
        profileScoreResult.rows[0].profile_completion_score
      expect(profileCompletionScore).toBe(4)

      // Check that a session was created
      const sessionResult = await database.query({
        text: `
          SELECT *
          FROM sessions
          WHERE "userId" = $1 AND device_identifier = $2
        `,
        values: [user.id, 'device-id'],
      })

      const session = sessionResult.rows[0]
      expect(session).toBeDefined()
      expect(session.sessionToken).toBeDefined()

      // Check that the verification token was deleted
      const verificationTokenResult = await database.query({
        text: `
          SELECT *
          FROM verification_token
          WHERE identifier = $1 AND token = $2
        `,
        values: [user.id, token],
      })

      expect(verificationTokenResult.rows.length).toBe(0)

      // Verify if the cookie was set
      const cookies = response.headers.get('set-cookie') as string
      expect(cookies).not.toBeNull()

      // Verify if the cookie is HttpOnly
      expect(cookies).toContain('HttpOnly')

      // Verify if the cookie value is the new session token
      const tokenCookie = cookies
        .split(';')
        .find((cookie) =>
          cookie.trim().startsWith('authjs.session-token'),
        ) as string
      const tokenValue = tokenCookie.split('=')[1]

      expect(tokenValue).toBe(session.sessionToken)

      // Verify if cookie expires in 30 days
      const expires = new Date(session.expires)
      const now = new Date()
      const diffDays = Math.round(
        (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )
      expect(diffDays).toBe(30)
    })
  })
})
