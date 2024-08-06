import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { comparePassword } from '@/lib/bcrypt'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { orchestrator } from '@/tests/orchestrator'
import { utilsTest } from '@/tests/utils/defaultUtilsTest'
import { v4 as uuidv4 } from 'uuid'

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

// Instanciar o repositório PgUserRepository
const userRepository = new PgUserRepository()
const verificationTokenRepository = new PgVerificationTokenRepository()

describe('POST /api/v1/reset-password', () => {
  test('should return 404 if token does not exist or is expired', async () => {
    const resetPasswordToken = await utilsTest.createDefaultResetPasswordToken()
    const newPassword = 'Password123$%$'
    const differentToken = uuidv4()

    const response = await fetch(`${webserver.host}/api/v1/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword,
        token: differentToken,
        email: resetPasswordToken.identifier,
      }),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(404)
    expect(responseBody).toEqual({ message: 'Token inválido ou expirado.' })
  })

  test('should hash password, update it in the database, and delete the token', async () => {
    // Generate a reset password token
    const resetPasswordToken = await utilsTest.createDefaultResetPasswordToken()
    const newPassword = 'Password123$%$'

    const response = await fetch(`${webserver.host}/api/v1/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword,
        token: resetPasswordToken.token,
        email: resetPasswordToken.identifier,
      }),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(201)
    expect(responseBody).toEqual({
      message: 'Senha atualizada com sucesso.',
      userId: expect.any(String),
    })

    // Check if the password was updated and hashed correctly
    const userUpdate = await userRepository.getUserByEmail(
      resetPasswordToken.identifier,
    )
    const passwordHash = userUpdate?.password_hash
    const passwordMatch = await comparePassword(
      newPassword,
      passwordHash as string,
    )

    expect(passwordMatch).toBe(true)

    // Check if the token was deleted
    const tokenExists = await verificationTokenRepository.getValidToken(
      resetPasswordToken.identifier,
      resetPasswordToken.token,
    )

    expect(tokenExists).toBe(null)
  })
})
