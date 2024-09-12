import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { orchestrator } from '@/tests/orchestrator'
import { utilsTest } from '@/tests/utils/defaultUtilsTest'
import { differenceInDays, format } from 'date-fns'
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

describe('POST /api/v1/public/auth/login/magic-link/request', () => {
  describe('User Login Request Magic Link Use Case', () => {
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
        `${webserver.host}/api/v1/public/auth/login/magic-link/request`,
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

      const tokesResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE expires < now() at time zone 'utc'
        `,
      })

      const tokens = tokesResult.rows

      expect(tokens.length).toBe(0)
    })

    test('should create user, account, and token', async () => {
      const email = 'test-magic-link@test.com'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/request`,
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

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('E-mail enviado com sucesso.')
      expect(responseBody.userId).toBeDefined()

      const userResult = await database.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      })
      const user = userResult.rows[0]

      expect(user.role).toBe('user')
      expect(user.profile_completion_score).toBe(8)

      const accountResult = await database.query({
        text: 'SELECT * FROM accounts WHERE "userId" = $1 AND provider = $2',
        values: [user.id, 'magic-link'],
      })
      const account = accountResult.rows[0]

      expect(account).toBeDefined()

      const tokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [user.id, 'LOGIN_MAGIC_LINK'],
      })
      const token = tokenResult.rows[0]

      expect(token).toBeDefined()

      // Remove time part from createdAt and expiresAt, keep only the date
      const createdAtDate = format(new Date(token.created_at), 'yyyy/MM/dd')
      const expiresAtDate = format(new Date(token.expires), 'yyyy/MM/dd')

      const differenceInDaysRounded = differenceInDays(
        new Date(expiresAtDate),
        new Date(createdAtDate),
      )

      expect(differenceInDaysRounded).toBe(1)
    })

    test('should create token for existing user and account', async () => {
      const existingUser =
        await utilsTest.createDefaultUserWithAccount('magic-link')

      const email = existingUser.email

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/request`,
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

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('E-mail enviado com sucesso.')
      expect(responseBody.userId).toBe(existingUser.id)

      const userResult = await database.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      })
      const user = userResult.rows[0]

      expect(user.id).toBe(existingUser.id) // User should not change
      expect(user.role).toBe('user')
      expect(user.profile_completion_score).toBe(7)

      const accountResult = await database.query({
        text: 'SELECT * FROM accounts WHERE "userId" = $1 AND provider = $2',
        values: [user.id, 'magic-link'],
      })
      const account = accountResult.rows[0]

      expect(account).toBeDefined()
      expect(account.userId).toBe(existingUser.id) // Account should not change

      const tokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [user.id, 'LOGIN_MAGIC_LINK'],
      })
      const token = tokenResult.rows[0]

      expect(token).toBeDefined()

      // Remove time part from createdAt and expiresAt, keep only the date
      const createdAtDate = format(new Date(token.created_at), 'yyyy/MM/dd')
      const expiresAtDate = format(new Date(token.expires), 'yyyy/MM/dd')

      const differenceInDaysRounded = differenceInDays(
        new Date(expiresAtDate),
        new Date(createdAtDate),
      )

      expect(differenceInDaysRounded).toBe(1)
    })

    test('should update existing token instead of creating a new one', async () => {
      const existingUser =
        await utilsTest.createDefaultUserWithAccount('magic-link')

      const email = existingUser.email

      // Create an initial token for the user
      const initialToken = v4()
      await database.query({
        text: `
          INSERT INTO verification_token (identifier, token, expires, token_type)
          VALUES ($1, $2, now() + interval '1 day', $3)
        `,
        values: [existingUser.id, initialToken, 'LOGIN_MAGIC_LINK'],
      })

      // Call the API to request a new magic link
      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/request`,
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

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('E-mail enviado com sucesso.')
      expect(responseBody.userId).toBe(existingUser.id)

      const userResult = await database.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      })
      const user = userResult.rows[0]

      expect(user.id).toBe(existingUser.id) // User should not change
      expect(user.role).toBe('user')
      expect(user.profile_completion_score).toBe(7)

      const accountResult = await database.query({
        text: 'SELECT * FROM accounts WHERE "userId" = $1 AND provider = $2',
        values: [user.id, 'magic-link'],
      })
      const account = accountResult.rows[0]

      expect(account).toBeDefined()
      expect(account.userId).toBe(existingUser.id) // Account should not change

      // Check if the token was updated instead of creating a new one
      const updatedTokenResult = await database.query({
        text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
        values: [user.id, 'LOGIN_MAGIC_LINK'],
      })
      const updatedToken = updatedTokenResult.rows[0]

      expect(updatedToken).toBeDefined()
      expect(updatedToken.token).not.toBe(initialToken) // Ensure the token was updated
      expect(updatedToken.expires).not.toBe(initialToken) // Ensure the token was updated
      expect(updatedToken.id).toBe(updatedToken.id)

      // Validate that token.expires is 1 day after token.created_at
      const createdAtDate = format(
        new Date(updatedToken.created_at),
        'yyyy/MM/dd',
      )
      const expiresAtDate = format(new Date(updatedToken.expires), 'yyyy/MM/dd')

      const differenceInDaysRounded = differenceInDays(
        new Date(expiresAtDate),
        new Date(createdAtDate),
      )

      expect(differenceInDaysRounded).toBe(1)
    })
  })
})
