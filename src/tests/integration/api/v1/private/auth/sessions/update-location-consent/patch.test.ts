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
})

describe('PATCH /api/v1/private/auth/sessions/update-location-consent', () => {
  describe('Location Consent Toggle Use Case', () => {
    test('should return 404 if userId does not exist', async () => {
      const nonExistentUserId = v4()
      const nonExistentSessionToken = v4()

      const response = await fetch(
        `${webserver.host}/api/v1/private/auth/sessions/update-location-consent`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            cookie: `authjs.session-token=${nonExistentSessionToken}`,
          },
          body: JSON.stringify({ userId: nonExistentUserId }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Usuário não encontrado.')
    })

    test('should return 404 if session is not found', async () => {
      const user = await utilsTest.createDefaultUser()
      const nonExistentSessionToken = v4()

      const response = await fetch(
        `${webserver.host}/api/v1/private/auth/sessions/update-location-consent`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            cookie: `authjs.session-token=${nonExistentSessionToken}`,
          },
          body: JSON.stringify({ userId: user.id }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Sessão não encontrada.')
    })

    test('should toggle location_collection_consent if userId and session are valid', async () => {
      const { user, session } = await utilsTest.createDefaultUserWithSession()

      const response = await fetch(
        `${webserver.host}/api/v1/private/auth/sessions/update-location-consent`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            cookie: `authjs.session-token=${session.sessionToken}`,
          },
          body: JSON.stringify({ userId: user.id }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe(
        'Toggle de coleta de localização e IP realizado com sucesso.',
      )
      expect(responseBody.userId).toBe(user.id)

      const updatedUserResult = await database.query({
        text: 'SELECT * FROM users WHERE id = $1',
        values: [user.id],
      })

      const updatedUser = updatedUserResult.rows[0]

      expect(updatedUser.location_collection_consent).toBe(
        !user.location_collection_consent,
      )
      expect(updatedUser.location_consent_given_at).not.toBe(null)
    })
  })
})
