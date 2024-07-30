import { database } from '@/infra/database'
import { orchestrator } from '@/tests/orchestrator'
import { addHours } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.dropAllTables()
  await orchestrator.runPendingMigrations()
})

afterEach(async () => {
  // Limpar os dados de usuários e tokens após cada teste para evitar duplicações
  await database.query('DELETE FROM verification_token')
  await database.query('DELETE FROM accounts')
  await database.query('DELETE FROM users')
})

describe('POST /api/v1/verification-token', () => {
  describe('Verification Token Creation Use Case', () => {
    test('should return 404 if email does not exist in database', async () => {
      const newToken = { email: 'nonexistent@example.com' }

      const response = await fetch(
        'http://localhost:3000/api/v1/verification-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newToken),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe(
        'Não foi possível criar o token, pois o email fornecido não existe.',
      )
    })

    test('should return 201 and token if email exists in database', async () => {
      // Inserir um usuário na base de dados
      const existingUser = {
        email: 'existing.email@example.com',
        password: 'Valid1Password!',
      }

      const newUser = await database.query({
        text: 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        values: [existingUser.email, existingUser.password],
      })

      await database.query({
        text: `
          INSERT INTO accounts ("userId", type, provider, "providerAccountId")
          VALUES ($1, $2, $3, $4)
        `,
        values: [
          newUser.rows[0].id,
          'credential',
          'credential',
          newUser.rows[0].id,
        ],
      })

      // Enviar uma requisição para a API com o email do usuário
      const response = await fetch(
        'http://localhost:3000/api/v1/verification-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: existingUser.email }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token criado com sucesso.')
      expect(responseBody.token).toBeDefined()
    })
  })
})

describe('GET /api/v1/verification-token', () => {
  describe('Verification Token Validation Use Case', () => {
    test('should return 400 if token is not provided', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/verification-token',
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(400)
      expect(responseBody.message).toBe('Token não fornecido.')
    })

    test('should return 404 if token does not exist in database', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/verification-token?token=nonexistenttoken',
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Token inválido ou expirado.')
    })

    test('should return 404 if token is expired', async () => {
      // Inserir um usuário na base de dados
      const existingUser = {
        email: 'existing.email@example.com',
        password: 'Valid1Password!',
      }

      const newUser = await database.query({
        text: 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        values: [existingUser.email, existingUser.password],
      })

      await database.query({
        text: `
          INSERT INTO accounts ("userId", type, provider, "providerAccountId")
          VALUES ($1, $2, $3, $4)
        `,
        values: [
          newUser.rows[0].id,
          'credential',
          'credential',
          newUser.rows[0].id,
        ],
      })

      // Inserir um token expirado na base de dados
      const expiredToken = uuidv4()
      const expiredDate = addHours(new Date(), -24)

      await database.query({
        text: `INSERT INTO verification_token (identifier, token, expires) VALUES ($1, $2, $3)`,
        values: [existingUser.email, expiredToken, expiredDate],
      })

      const response = await fetch(
        `http://localhost:3000/api/v1/verification-token?token=${expiredToken}`,
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(404)
      expect(responseBody.message).toBe('Token inválido ou expirado.')
    })

    test('should return 200 and user data if token is valid', async () => {
      // Inserir um usuário na base de dados
      const existingUser = {
        email: 'existing.email@example.com',
        password: 'Valid1Password!',
      }

      const newUser = await database.query({
        text: 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        values: [existingUser.email, existingUser.password],
      })

      await database.query({
        text: `
          INSERT INTO accounts ("userId", type, provider, "providerAccountId")
          VALUES ($1, $2, $3, $4)
        `,
        values: [
          newUser.rows[0].id,
          'credential',
          'credential',
          newUser.rows[0].id,
        ],
      })

      // Inserir um token válido na base de dados
      const validToken = uuidv4()
      const validDate = addHours(new Date(), 24)

      await database.query({
        text: `INSERT INTO verification_token (identifier, token, expires) VALUES ($1, $2, $3)`,
        values: [existingUser.email, validToken, validDate],
      })

      const response = await fetch(
        `http://localhost:3000/api/v1/verification-token?token=${validToken}`,
        {
          method: 'GET',
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(200)
      expect(responseBody.name).toBeDefined()
      expect(responseBody.nick_name).toBeDefined()
      expect(responseBody.email).toBe(existingUser.email)
      expect(responseBody.expires).toBe(validDate.toISOString())
    })
  })
})
