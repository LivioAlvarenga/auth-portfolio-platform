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
          INSERT INTO verification_token (identifier, token, token_type, expires, opt)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
      values: [
        data.identifier,
        data.token,
        data.tokenType || null,
        data.expires,
        data.opt || null,
      ],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  // Validate this method
  async updateToken(data: VerificationTokenInput): Promise<VerificationToken> {
    const query = {
      text: `
          UPDATE verification_token
          SET token = $2, expires = $3, opt = $4, updated_at = now() at time zone 'utc'
          WHERE identifier = $1 AND token_type = $5
          RETURNING *
        `,
      values: [
        data.identifier,
        data.token,
        data.expires,
        data.opt || null,
        data.tokenType,
      ],
    }

    const result = await database.query(query)
    return result.rows[0] || null
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
  async getValidTokenByTypeAndIdentifier(
    identifier: string,
    tokenType: string,
  ): Promise<VerificationToken | null> {
    const query = {
      text: `
          SELECT * FROM verification_token
          WHERE identifier = $1 AND token_type = $2 AND expires > now() at time zone 'utc'
        `,
      values: [identifier, tokenType],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }

  async getValidTokenByToken(token: string): Promise<VerificationToken | null> {
    const query = {
      text: `
          SELECT * FROM verification_token
          WHERE token = $1 AND expires > now() at time zone 'utc'
        `,
      values: [token],
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

  // Validate this method
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
