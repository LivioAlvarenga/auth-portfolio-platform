import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { comparePassword } from '@/lib/bcrypt'
import { orchestrator } from '@/tests/orchestrator'
import { utilsTest } from '@/tests/utils/defaultUtilsTest'
import { v4 } from 'uuid'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.dropAllTables()
  await orchestrator.runPendingMigrations()
})

afterEach(async () => {
  // Limpar os dados de usuários e tokens após cada teste para evitar duplicações
  await database.query('DELETE FROM verification_token')
  await database.query('DELETE FROM users')
})

describe('POST /api/v1/public/auth/reset-password', () => {
  test('should return 404 if user not found', async () => {
    const identifier = v4()
    const password = 'Password23@#!'

    const response = await fetch(
      `${webserver.host}/api/v1/public/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      },
    )

    const responseBody = await response.json()

    expect(response.status).toBe(404)
    expect(responseBody.message).toBe('Usuário não encontrado.')
  })

  test('should return 404 if token does not exist or is expired', async () => {
    const user = await utilsTest.createDefaultUser()
    const newPassword = 'Password123$%$'

    const response = await fetch(
      `${webserver.host}/api/v1/public/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
          identifier: user.id,
        }),
      },
    )

    const responseBody = await response.json()

    expect(response.status).toBe(404)
    expect(responseBody).toEqual({ message: 'Token inválido ou expirado.' })
  })

  test('should hash password, update it in the database, update emailVerified and delete the token', async () => {
    const resetPasswordToken = await utilsTest.createDefaultResetPasswordToken()
    const newPassword = 'Password123$%$'

    const response = await fetch(
      `${webserver.host}/api/v1/public/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
          identifier: resetPasswordToken.identifier,
        }),
      },
    )

    const responseBody = await response.json()

    expect(response.status).toBe(201)
    expect(responseBody).toEqual({
      message: 'Senha atualizada com sucesso.',
      userId: expect.any(String),
    })

    // Check if the password was updated and hashed correctly
    const userUpdateResult = await database.query({
      text: 'SELECT * FROM users WHERE id = $1',
      values: [resetPasswordToken.identifier],
    })
    const userUpdate = userUpdateResult.rows[0]

    expect(userUpdate.emailVerified).not.toBe(null)
    expect(userUpdate.email_verified_provider).toBe('credential')

    const passwordHash = userUpdate?.password_hash
    const passwordMatch = await comparePassword(
      newPassword,
      passwordHash as string,
    )

    expect(passwordMatch).toBe(true)

    // Check if the token was deleted
    const tokenExistsResult = await database.query({
      text: `
        SELECT * FROM verification_token
        WHERE identifier = $1 AND token_type = $2
      `,
      values: [resetPasswordToken.identifier, 'RESET_PASSWORD'],
    })
    const tokenExists = tokenExistsResult.rows[0]

    expect(tokenExists).not.toBe(true)
  })
})
