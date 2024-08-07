import { database } from '@/infra/database'
import { Account, AccountInput, AccountRepository } from '../account-repository'

export class PgAccountRepository implements AccountRepository {
  async createAccount(data: AccountInput): Promise<Account> {
    const query = {
      text: `
      INSERT INTO accounts ("userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      values: [
        data.userId,
        data.type,
        data.provider,
        data.providerAccountId,
        data.refresh_token || null,
        data.access_token || null,
        data.expires_at || null,
        data.token_type || null,
        data.scope || null,
        data.id_token || null,
        data.session_state || null,
      ],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    return database.query({
      text: `
      SELECT * FROM accounts
      WHERE "userId" = $1
      `,
      values: [userId],
    })
  }

  async getProvidersByUserId(userId: string): Promise<string[]> {
    const result = await database.query({
      text: `
      SELECT DISTINCT provider FROM accounts
      WHERE "userId" = $1
      `,
      values: [userId],
    })

    return result.rows.map((row: { provider: string }) => row.provider)
  }
}
