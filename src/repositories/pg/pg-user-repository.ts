import { database } from '@/infra/database'
import { User, UserInput, UserRepository } from '../user-repository'

export class PgUserRepository implements UserRepository {
  // Validate this method
  async createUser(data: UserInput): Promise<Omit<User, 'passwordHash'>> {
    const query = {
      text: `
        INSERT INTO users (name, nick_name, email, "emailVerified", email_verified_provider, image, password_hash, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, nick_name, email, "emailVerified", email_verified_provider, image, role, created_at, updated_at
      `,
      values: [
        data.name || null,
        data.nick_name || null,
        data.email,
        data.emailVerified || null,
        data.emailVerifiedProvider || null,
        data.image || null,
        data.password_hash || null,
        data.role || 'user',
      ],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  // Validate this method
  async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<Omit<User, 'passwordHash'>> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')

    if (!setClause) {
      throw new Error('No data provided for update')
    }

    const query = {
      text: `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, nick_name, email, "emailVerified", email_verified_provider, image, role, updated_at
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
