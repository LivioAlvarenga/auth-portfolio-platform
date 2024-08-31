import { CreateUser } from '@/@types/user'
import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { comparePassword } from '@/lib/bcrypt'
import { orchestrator } from '@/tests/orchestrator'
import { utilsTest } from '@/tests/utils/defaultUtilsTest'

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

describe('POST /api/v1/public/auth/register', () => {
  describe('User Register Use Case', () => {
    test('should return error for already registered email', async () => {
      const createdUser = await utilsTest.createDefaultUserWithAccount()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: createdUser.email,
            password: 'Valid1Password!',
          }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(400)
      expect(responseBody.message).toBe('E-mail já cadastrado.')
    })

    test('should hash password before saving', async () => {
      const newUser: CreateUser = {
        email: 'new.email@example.com',
        password: 'Valid2Password!',
        name: 'New User',
      }

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        },
      )

      expect(response.status).toBe(201)

      const userResult = await database.query({
        text: 'SELECT password_hash FROM users WHERE email = $1',
        values: [newUser.email],
      })
      const hashedPassword = userResult.rows[0].password_hash
      const isPasswordHashed = await comparePassword(
        newUser.password!,
        hashedPassword,
      )

      expect(isPasswordHashed).toBe(true)
    })

    test('should return error for insufficient data', async () => {
      const newUser: Partial<CreateUser> = {
        email: 'new1.email@example.com',
        password: 'Valid2Password!',
        // Missing name
      }

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(400)
      expect(responseBody.message).toBe('Dados insuficientes para o cadastro.')
    })

    test('should update existing user details and create a new "credential" account if the user has already logged in with a Google account', async () => {
      const userGoogle = await utilsTest.createDefaultUserWithAccountGoggle()

      const newUser: CreateUser = {
        email: userGoogle.email,
        password: 'Valid3Password!',
        name: 'Credential User',
        nick_name: 'Credential User nickname',
      }

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        },
      )
      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Usuário criado com sucesso!')

      const accountResult = await database.query({
        text: 'SELECT * FROM accounts WHERE "userId" = $1',
        values: [responseBody.userId],
      })
      const account = accountResult.rows

      expect(account.length).toBe(2)
      expect(account).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ provider: 'google' }),
          expect.objectContaining({ provider: 'credential' }),
        ]),
      )

      const userResult = await database.query({
        text: 'SELECT * FROM users WHERE id = $1',
        values: [responseBody.userId],
      })
      const user = userResult.rows[0]

      expect(user.name).toBe(newUser.name?.toLowerCase())
      expect(user.nick_name).toBe(newUser.nick_name?.toLowerCase())
      expect(user.password_hash).toBeDefined()
      expect(user.emailVerified).toBeTruthy()
      expect(user.email_verified_provider).toBe('google')
      expect(user.image).toBe(userGoogle.image)
      expect(user.profile_completion_score).toBe(1)
    })

    test('should create a new "credential" account and update user details if the user has not logged in with a other provider', async () => {
      const newUser: CreateUser = {
        email: 'credentialuser@example.com',
        password: 'Valid3Password!',
        name: 'Credential User',
        nick_name: 'Credential User nickname',
      }

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        },
      )
      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Usuário criado com sucesso!')

      const accountResult = await database.query({
        text: 'SELECT * FROM accounts WHERE "userId" = $1',
        values: [responseBody.userId],
      })
      const account = accountResult.rows

      expect(account.length).toBe(1)
      expect(account).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ provider: 'credential' }),
        ]),
      )

      const userResult = await database.query({
        text: 'SELECT * FROM users WHERE id = $1',
        values: [responseBody.userId],
      })
      const user = userResult.rows[0]

      expect(user.name).toBe(newUser.name?.toLowerCase())
      expect(user.nick_name).toBe(newUser.nick_name?.toLowerCase())
      expect(user.password_hash).toBeDefined()
      expect(user.emailVerified).toBeFalsy()
      expect(user.email_verified_provider).toBeNull()
      expect(user.image).toBeNull()
      expect(user.profile_completion_score).toBe(4)
    })
  })
})
