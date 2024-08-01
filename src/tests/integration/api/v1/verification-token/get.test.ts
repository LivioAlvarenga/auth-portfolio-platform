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

describe('GET /api/v1/verification-token', () => {
  describe('Verification Token Validation Use Case', () => {
    test('should return 400 if email or token is not provided', async () => {
      const responseNoEmail = await fetch(
        'http://localhost:3000/api/v1/verification-token?email=valid.email@example.com',
        {
          method: 'GET',
        },
      )
      const responseNoEmailBody = await responseNoEmail.json()

      expect(responseNoEmail.status).toBe(400)
      expect(responseNoEmailBody.message).toBe(
        'Email e token são obrigatórios.',
      )

      const responseNoToken = await fetch(
        'http://localhost:3000/api/v1/verification-token?email=valid.email@example.com',
        {
          method: 'GET',
        },
      )
      const responseNoTokenBody = await responseNoToken.json()

      expect(responseNoToken.status).toBe(400)
      expect(responseNoTokenBody.message).toBe(
        'Email e token são obrigatórios.',
      )
    })

    test('should return 400 if email or token is not valid', async () => {
      const invalidEmailResponse = await fetch(
        'http://localhost:3000/api/v1/verification-token?email=invalidemail&token=validtoken',
        {
          method: 'GET',
        },
      )
      const invalidEmailBody = await invalidEmailResponse.json()

      expect(invalidEmailResponse.status).toBe(400)
      expect(invalidEmailBody.message).toBe('E-mail inválido!')

      const invalidTokenResponse = await fetch(
        'http://localhost:3000/api/v1/verification-token?email=valid.email@example.com&token=invalidtoken',
        {
          method: 'GET',
        },
      )
      const invalidTokenBody = await invalidTokenResponse.json()

      expect(invalidTokenResponse.status).toBe(400)
      expect(invalidTokenBody.message).toBe(
        'Token deve ser um UUID válido ou um código OTP de 6 dígitos',
      )
    })

    test('should return 404 if token is invalid or expired', async () => {
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

      const responseExpired = await fetch(
        `http://localhost:3000/api/v1/verification-token?email=${existingUser.email}&token=${expiredToken}`,
        {
          method: 'GET',
        },
      )
      const responseExpiredBody = await responseExpired.json()

      expect(responseExpired.status).toBe(404)
      expect(responseExpiredBody.message).toBe('Token inválido ou expirado.')

      // Inserir um token inválido na base de dados
      const invalidToken = uuidv4()

      const responseInvalid = await fetch(
        `http://localhost:3000/api/v1/verification-token?email=${existingUser.email}&token=${invalidToken}`,
        {
          method: 'GET',
        },
      )
      const responseInvalidBody = await responseInvalid.json()

      expect(responseInvalid.status).toBe(404)
      expect(responseInvalidBody.message).toBe('Token inválido ou expirado.')
    })

    test('should update emailVerified and email_verified_provider columns in users table if token is valid', async () => {
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
        `http://localhost:3000/api/v1/verification-token?email=${existingUser.email}&token=${validToken}`,
        {
          method: 'GET',
        },
      )
      const responseBody = await response.json()

      expect(response.status).toBe(200)
      expect(responseBody.message).toBe('Email verificado com sucesso.')

      // Verificar se as colunas foram atualizadas
      const userResult = await database.query({
        text: `SELECT "emailVerified", email_verified_provider FROM users WHERE email = $1`,
        values: [existingUser.email],
      })

      expect(userResult.rows.length).toBe(1)
      expect(userResult.rows[0].emailVerified).toBeDefined()
      expect(userResult.rows[0].email_verified_provider).toBe('credential')
    })

    test('should delete token from database if token is valid', async () => {
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
        `http://localhost:3000/api/v1/verification-token?email=${existingUser.email}&token=${validToken}`,
        {
          method: 'GET',
        },
      )
      const responseBody = await response.json()

      expect(response.status).toBe(200)
      expect(responseBody.message).toBe('Email verificado com sucesso.')

      // Verificar se o token foi deletado
      const tokenResult = await database.query({
        text: `SELECT * FROM verification_token WHERE token = $1 AND identifier = $2`,
        values: [validToken, existingUser.email],
      })

      expect(tokenResult.rows.length).toBe(0)
    })

    test('should return 200 with success message if token is valid', async () => {
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
        `http://localhost:3000/api/v1/verification-token?email=${existingUser.email}&token=${validToken}`,
        {
          method: 'GET',
        },
      )
      const responseBody = await response.json()

      expect(response.status).toBe(200)
      expect(responseBody.message).toBe('Email verificado com sucesso.')
    })
  })
})
