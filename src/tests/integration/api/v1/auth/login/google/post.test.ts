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
  await database.query('DELETE FROM sessions')
  await database.query('DELETE FROM avatars')
})

describe('POST /api/v1/auth/login/google', () => {
  describe('User Login Google Use Case', () => {
    test('should return 404 if session not found', async () => {
      const differentCookie = `authjs.session-token=${v4()}; Path=/; SameSite=Lax; HttpOnly; Secure`

      const device = 'device-id'

      const response = await fetch(
        `${webserver.host}/api/v1/auth/login/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: differentCookie,
          },
          body: JSON.stringify({
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Sessão não encontrada.')
    })

    test('should return 403 if email not verified', async () => {
      const userGoogleAuthJs =
        await utilsTest.createDefaultUserWithGoogleAccountFromAuthJs({
          email_verified: true,
        })

      const device = 'device-id'

      const response = await fetch(
        `${webserver.host}/api/v1/auth/login/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: userGoogleAuthJs.cookie,
          },
          body: JSON.stringify({
            device,
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(403)
      expect(responseBody.message).toBe('Email não verificado.')

      const sessionResult = await database.query({
        text: 'SELECT * FROM sessions WHERE "sessionToken" = $1',
        values: [userGoogleAuthJs.session.sessionToken],
      })
      const session = sessionResult.rows[0]

      expect(session).toBeUndefined()
    })

    // TODO: criar test para (3. useCase - check if email was verified and update emailVerified and email_verified_provider) - if (user && !user.emailVerified && emailVerified)

    // TODO: criar test para (4. useCase - get avatarUrl, resize, save in bucket, add url in avatars table, update users.image with avatarUrl if not exists) - Usar mock para resizeAndConvertImage e this.imageRepository.uploadImage

    // TODO: criar test para (5. useCase - delete cookies)
  })
})
