import { database } from '@/infra/database'
import {
  VerificationToken,
  VerificationTokenInput,
  VerificationTokenRepository,
} from '../verification-token-repository'

export class PgVerificationTokenRepository
  implements VerificationTokenRepository
{
  // Validate this method
  async createToken(data: VerificationTokenInput): Promise<VerificationToken> {
    const query = {
      text: `
          INSERT INTO verification_token (identifier, token, token_type, expires)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
      values: [data.identifier, data.token, data.tokenType, data.expires],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  // Validate this method
  async getValidToken(
    identifier: string,
    token: string,
  ): Promise<VerificationToken | null> {
    const query = {
      text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token = $2 AND expires > now() at time zone 'utc'
        `,
      values: [identifier, token],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }

  // Validate this method
  async deleteToken(identifier: string, token: string): Promise<boolean> {
    const query = {
      text: `
      DELETE FROM verification_token
      WHERE identifier = $1 AND token = $2
    `,
      values: [identifier, token],
    }

    const result = await database.query(query)
    return result.rowCount > 0
  }

  async deleteExpiredTokens(): Promise<boolean> {
    const query = {
      text: `
      DELETE FROM verification_token
      WHERE expires < now() at time zone 'utc'
    `,
      values: [],
    }

    const result = await database.query(query)
    return result.rowCount > 0
  }
}
