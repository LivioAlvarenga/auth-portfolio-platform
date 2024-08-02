import { database } from '@/infra/database'
import { orchestrator } from '@/tests/orchestrator'
import { addDays } from 'date-fns'
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

    test('should return 201 and UUID token if opt is false', async () => {
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
          body: JSON.stringify({ email: existingUser.email, opt: false }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token criado com sucesso.')
      expect(responseBody.token).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      ) // Verifica se o token é um UUID
    })

    test('should return 201 and OTP token if opt is true', async () => {
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
          body: JSON.stringify({ email: existingUser.email, opt: true }),
        },
      )

      const responseBody = await response.json()

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token criado com sucesso.')
      expect(responseBody.token).toMatch(/^\d{6}$/) // Verifica se o token é um OTP de 6 dígitos
    })

    test('should update existing token instead of creating a new one', async () => {
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

      // Criar um token inicial na base de dados
      const initialToken = uuidv4()
      const initialExpires = addDays(new Date(), 1)
      const initialTokenType = 'RESET_PASSWORD'

      await database.query({
        text: `INSERT INTO verification_token (identifier, token, expires, token_type) VALUES ($1, $2, $3, $4)`,
        values: [
          existingUser.email,
          initialToken,
          initialExpires,
          initialTokenType,
        ],
      })

      // Enviar uma requisição para a API para atualizar o token existente
      const response = await fetch(
        'http://localhost:3000/api/v1/verification-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: existingUser.email,
            opt: false,
            tokenType: 'RESET_PASSWORD',
          }),
        },
      )

      const responseBody = await response.json()

      const updatedTokenResult = await database.query({
        text: `SELECT token FROM verification_token WHERE identifier = $1`,
        values: [existingUser.email],
      })

      const updatedToken = updatedTokenResult.rows[0].token

      expect(response.status).toBe(201)
      expect(responseBody.message).toBe('Token criado com sucesso.')
      expect(responseBody.token).toBe(updatedToken) // Verifica se o token foi atualizado
      expect(responseBody.token).not.toBe(initialToken) // Verifica se o token não é o mesmo do inicial
    })
  })
})
