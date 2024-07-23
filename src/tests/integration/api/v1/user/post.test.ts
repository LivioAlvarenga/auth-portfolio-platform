import { CreateUser } from '@/@types/user'
import { database } from '@/infra/database'
import { comparePassword } from '@/lib/bcrypt'
import { orchestrator } from '@/tests/orchestrator'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.dropAllTables()
  await orchestrator.runPendingMigrations()
})
describe('POST /api/v1/user', () => {
  describe('User Creation Use Case', () => {
    beforeAll(async () => {
      const existingUser: CreateUser = {
        email: 'existing.email@example.com',
        password: 'Valid1Password!',
      }

      await database.query({
        text: 'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
        values: [existingUser.email, existingUser.password],
      })
    })

    test('should return error for already registered email', async () => {
      const newUser: CreateUser = {
        email: 'existing.email@example.com',
        password: 'Valid1Password!',
      }

      const response = await fetch('http://localhost:3000/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

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

      const response = await fetch('http://localhost:3000/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      // Check for successful response
      expect(response.status).toBe(201)

      // Verify that the password was hashed
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

      const response = await fetch('http://localhost:3000/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const responseBody = await response.json()

      // Check for error response
      expect(response.status).toBe(400)
      expect(responseBody.message).toBe('Dados insuficientes para o cadastro.')
    })

    test('should create user successfully', async () => {
      const newUser: CreateUser = {
        email: 'new3.email@example.com',
        password: 'Valid3Password!',
        name: 'New User',
        nickName: 'newusernickname',
      }

      const response = await fetch('http://localhost:3000/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const responseBody = await response.json()

      // Check for successful response
      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Usuário criado com sucesso!')

      // Check returned user data
      expect(responseBody.user).toHaveProperty('id')
      expect(responseBody.user.email).toBe(newUser.email)
      expect(responseBody.user.name).toBe(newUser.name?.toLowerCase())
      expect(responseBody.user.nickName).toBe(newUser.nickName?.toLowerCase())
    })
  })
})
