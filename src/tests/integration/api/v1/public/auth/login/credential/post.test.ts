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

describe('POST /api/v1/public/auth/login/credential', () => {
  describe('User Login Credential Use Case', () => {
    test('should return 404 if user not found', async () => {
      const email = 'no-exist@email.com'
      const password = 'Password23@#!'
      const device = 'device-id'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should return 403 if email not verified', async () => {
      const user = await utilsTest.createDefaultUser() // this user is not email verified
      const password = 'Password123$%$'
      const device = 'device-id'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            password,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(403)
      expect(responseBody.message).toBe('Email não verificado.')
    })

    test('should return 401 if password is incorrect', async () => {
      const user = await utilsTest.createDefaultUserEmailVerified()
      const password = 'IncorrectPassword123@#!'
      const device = 'device-id'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            password,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(401)
      expect(responseBody.message).toBe('Senha incorreta.')
    })

    test('should return 201 and create a new session after deleting the existing session with the same userId and device, and set the authjs.session-token cookie', async () => {
      const session = await utilsTest.createDefaultUserWithSession()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
            password: session.password,
            device: session.session.device_identifier,
          }),
        },
      )

      expect(response.status).toBe(201)

      // verify if the session was deleted
      const responseBody = await response.json()
      const newSessionResult = await database.query({
        text: 'SELECT * FROM sessions WHERE "userId" = $1',
        values: [responseBody.userId],
      })

      expect(newSessionResult.rows.length).toBe(1)

      const newSession = newSessionResult.rows[0]

      expect(newSession.userId).toBe(session.user.id)
      expect(newSession.device_identifier).toBe(
        session.session.device_identifier,
      )
      expect(newSession.sessionToken).not.toBe(session.session.sessionToken)

      // verify if the cookie was set
      const cookies = response.headers.get('set-cookie') as string
      expect(cookies).not.toBeNull()

      // verify if the cookie is HttpOnly
      expect(cookies).toContain('HttpOnly')

      // verify if cookie value is the new session token
      const tokenCookie = cookies
        .split(';')
        .find((cookie) =>
          cookie.trim().startsWith('authjs.session-token'),
        ) as string
      const tokenValue = tokenCookie.split('=')[1]

      expect(tokenValue).toBe(newSession.sessionToken)

      // verify if cookie expires in 30 days
      const expires = new Date(newSession.expires)
      const now = new Date()
      const diffDays = Math.round(
        (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )
      expect(diffDays).toBe(30)
    })

    test('should return 201 and create a new session when no existing session is found for the given userId and device, and set the authjs.session-token cookie', async () => {
      const session = await utilsTest.createDefaultUserWithSession()

      // delete the session
      await database.query({
        text: 'DELETE FROM sessions WHERE "userId" = $1',
        values: [session.user.id],
      })

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
            password: session.password,
            device: session.session.device_identifier,
          }),
        },
      )

      expect(response.status).toBe(201)

      // verify if the session was created
      const responseBody = await response.json()
      const newSessionResult = await database.query({
        text: 'SELECT * FROM sessions WHERE "userId" = $1',
        values: [responseBody.userId],
      })

      expect(newSessionResult.rows.length).toBe(1)

      const newSession = newSessionResult.rows[0]

      expect(newSession.userId).toBe(session.user.id)
      expect(newSession.device_identifier).toBe(
        session.session.device_identifier,
      )
      expect(newSession.sessionToken).not.toBe(session.session.sessionToken)

      // verify if the cookie was set
      const cookies = response.headers.get('set-cookie') as string
      expect(cookies).not.toBeNull()

      // verify if the cookie is HttpOnly
      expect(cookies).toContain('HttpOnly')

      // verify if cookie value is the new session token
      const tokenCookie = cookies
        .split(';')
        .find((cookie) =>
          cookie.trim().startsWith('authjs.session-token'),
        ) as string
      const tokenValue = tokenCookie.split('=')[1]

      expect(tokenValue).toBe(newSession.sessionToken)

      // verify if cookie expires in 30 days
      const expires = new Date(newSession.expires)
      const now = new Date()
      const diffDays = Math.round(
        (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )
      expect(diffDays).toBe(30)
    })

    test('should return 200 and send two-factor token when user has two_factor_enabled true', async () => {
      const user = await utilsTest.createDefaultUserTwoFactor()

      const password = 'Password123$%$'
      const device = 'device-id'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            password,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(200)
      expect(responseBody.message).toBe(
        'Token de autenticação de dois fatores enviado com sucesso!',
      )
    })

    test('should delete all expired sessions', async () => {
      // Create 10 sessions with expired tokens
      for (let i = 0; i < 10; i++) {
        const userId = v4()
        const email = `email${i}@test.com.br`
        const device = `device${i}`

        await database.query({
          text: `
            INSERT INTO users (id, email, password_hash, "emailVerified", email_verified_provider) VALUES ($1, $2, $3, $4, $5)
          `,
          values: [userId, email, 'password_hash', new Date(), 'credential'],
        })

        await database.query({
          text: `
            INSERT INTO sessions ("sessionToken", "userId", expires, device_identifier)
            VALUES ($1, $2, now() - interval '1 day', $3)
          `,
          values: [v4(), userId, device],
        })
      }

      // Create one session with valid token
      const session = await utilsTest.createDefaultUserWithSession()

      const sessionsExpiredResult = await database.query({
        text: `
          SELECT * FROM sessions
          WHERE expires < now() at time zone 'utc'
        `,
      })
      const sessionsExpired = sessionsExpiredResult.rows

      expect(sessionsExpired.length).toBe(10)

      await fetch(`${webserver.host}/api/v1/public/auth/login/credential`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          password: session.password,
          device: session.session.device_identifier,
        }),
      })

      const sessionsResult = await database.query({
        text: `
          SELECT * FROM sessions
          WHERE expires < now() at time zone 'utc'
        `,
      })

      const tokens = sessionsResult.rows

      expect(tokens.length).toBe(0)
    })
  })
})
