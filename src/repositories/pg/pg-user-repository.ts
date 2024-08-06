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
        data.nickName || null,
        data.email,
        data.emailVerified || null,
        data.emailVerifiedProvider || null,
        data.image || null,
        data.passwordHash || null,
        data.role || 'user',
      ],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  async updateUser(id: string, data: Partial<User>): Promise<boolean> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')

    if (!setClause) {
      // If data is empty, no need to proceed with the query
      return false
    }

    const query = {
      text: `
      UPDATE users
      SET ${setClause}
      WHERE id = $1
    `,
      values: [id, ...Object.values(data)],
    }

    const result = await database.query(query)
    return result.rowCount > 0
  }

  // Validate this method
  async updatePassword(
    email: string,
    passwordHash: string,
  ): Promise<{ userId: string } | null> {
    const query = {
      text: `
        UPDATE users
        SET password_hash = $2, updated_at = now() at time zone 'utc'
        WHERE email = $1
        RETURNING id
      `,
      values: [email, passwordHash],
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
