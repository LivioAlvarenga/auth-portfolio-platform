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

describe('POST /api/v1/public/auth/login/credential/two-factor/login', () => {
  describe('User Login Two Factor Use Case', () => {
    test('should return 404 if userId does not exist', async () => {
      const nonExistentUserId = v4()
      const nonExistentOpt = '123456'
      const device = 'device'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: nonExistentUserId,
            opt: nonExistentOpt,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should return 404 if token does not exist', async () => {
      const user = await utilsTest.createDefaultUserTwoFactor()
      const nonExistentOpt = '123456'
      const device = 'device'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            opt: nonExistentOpt,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Token não encontrado ou expirado.')
    })

    test('should return 400 if opt code is invalid', async () => {
      const { user } = await utilsTest.createDefaultTokenWithTwoFactorOpt({})
      const nonExistentOpt = '123456'
      const device = 'device'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            opt: nonExistentOpt,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(400)
      expect(responseBody.message).toBe('Token inválido.')
    })

    test('should successfully log in the user with two-factor authentication, update emailVerified if not set, and create a new session with a valid session token', async () => {
      const { user, token } =
        await utilsTest.createDefaultTokenWithTwoFactorOpt({
          emailVerified: false,
        })
      const device = 'device'

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            opt: token.opt,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Usuário logado com sucesso!')

      // check if user emailVerified is set
      const userResult = await database.query({
        text: 'SELECT * FROM users WHERE id = $1',
        values: [responseBody.userId],
      })
      const updatedUser = userResult.rows[0]

      expect(updatedUser.email_verified_provider).toBe('credential')
      expect(updatedUser.emailVerified).toBeTruthy()

      // check the profile completion score
      expect(updatedUser.profile_completion_score).toBe(3)

      // check is token was deleted
      const tokenResult = await database.query({
        text: 'SELECT * FROM verification_token WHERE identifier = $1',
        values: [token.identifier],
      })
      const deletedToken = tokenResult.rows[0]

      expect(deletedToken).toBeFalsy()

      // check if a new session was created
      const sessionResult = await database.query({
        text: 'SELECT * FROM sessions WHERE "userId" = $1',
        values: [responseBody.userId],
      })

      expect(sessionResult.rows.length).toBe(1)

      const session = sessionResult.rows[0]

      expect(session.userId).toBe(user.id)
      expect(session.device_identifier).toBe(device)
      expect(session.sessionToken).toBeTruthy()

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

      expect(tokenValue).toBe(session.sessionToken)

      // verify if cookie expires in 30 days
      const expires = new Date(session.expires)
      const now = new Date()
      const diffDays = Math.round(
        (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )
      expect(diffDays).toBe(30)
    })
  })
})
