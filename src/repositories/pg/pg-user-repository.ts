import { database } from '@/infra/database'
import { User, UserInput, UserRepository } from '../user-repository'

export class PgUserRepository implements UserRepository {
  // Validate this method
  async createUser(data: UserInput): Promise<Omit<User, 'passwordHash'>> {
    const query = {
      text: `
        INSERT INTO users (name, nick_name, email, "emailVerified", email_verified_provider, image, password_hash, role, profile_completion_score, two_factor_enabled, location_collection_consent)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, name, nick_name, email, "emailVerified", email_verified_provider, image, role, profile_completion_score, two_factor_enabled, location_collection_consent, created_at, updated_at
      `,
      values: [
        data.name || null,
        data.nick_name || null,
        data.email,
        data.emailVerified || null,
        data.email_verified_provider || null,
        data.image || null,
        data.password_hash || null,
        data.role || 'user',
        data.profile_completion_score,
        data.two_factor_enabled || false,
        data.location_collection_consent || false,
      ],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  // Validate this method
  async updateUser(
    id: string,
    data: Partial<UserInput>,
  ): Promise<Omit<User, 'passwordHash'>> {
    const setClause = Object.keys(data)
      .map((key, index) => {
        // Tratamento especial para colunas que precisam de aspas duplas
        const column = key === 'emailVerified' ? `"${key}"` : key
        return `${column} = $${index + 2}`
      })
      .join(', ')

    if (!setClause) {
      throw new Error('No data provided for update')
    }

    const query = {
      text: `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, nick_name, email, "emailVerified", email_verified_provider, image, role, profile_completion_score, updated_at, two_factor_enabled, location_collection_consent
    `,
      values: [id, ...Object.values(data)],
    }

    const result = await database.query(query)

    if (result.rowCount === 0) {
      throw new Error('User not found')
    }

    return result.rows[0]
  }

  // Validate this method
  async updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<{ userId: string } | null> {
    const query = {
      text: `
        UPDATE users
        SET password_hash = $2, updated_at = now() at time zone 'utc'
        WHERE id = $1
        RETURNING id
      `,
      values: [userId, passwordHash],
    }

    const result = await database.query(query)

    return result.rows[0] ? { userId: result.rows[0].id } : null
  }

  async updateProfileCompletionScore(
    userId: string,
    score: number,
  ): Promise<{ userId: string } | null> {
    const query = {
      text: `
        UPDATE users
        SET profile_completion_score = $2, updated_at = now() at time zone 'utc'
        WHERE id = $1
        RETURNING id
      `,
      values: [userId, score],
    }

    const result = await database.query(query)

    return result.rows[0] ? { userId: result.rows[0].id } : null
  }

  // Validate this method
  async getUserByEmail(email: string): Promise<User | null> {
    const query = {
      text: `
        SELECT * FROM users
        WHERE email = $1
      `,
      values: [email],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }

  // Validate this method
  async getUserById(id: string): Promise<User | null> {
    const query = {
      text: `
        SELECT * FROM users
        WHERE id = $1
      `,
      values: [id],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }

  async deleteUser(id: string): Promise<boolean> {
    const query = {
      text: `
        DELETE FROM users
        WHERE id = $1
      `,
      values: [id],
    }

    const result = await database.query(query)
    return result.rowCount > 0
  }
}
