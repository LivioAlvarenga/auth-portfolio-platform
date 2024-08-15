import { database } from '@/infra/database'
import { Session, SessionInput, SessionRepository } from '../session-repository'

export class PgSessionRepository implements SessionRepository {
  async createSession(data: SessionInput): Promise<Session> {
    const query = {
      text: `
        INSERT INTO sessions ("sessionToken", "userId", expires, device_identifier)
        VALUES ($1, $2, $3, $4)
        RETURNING id, "sessionToken", "userId", expires, device_identifier
      `,
      values: [
        data.sessionToken,
        data.userId,
        data.expires,
        data.device_identifier,
      ],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  async deleteExpiredSessions(): Promise<boolean> {
    const query = {
      text: `
        DELETE FROM sessions
        WHERE expires < now() at time zone 'utc'
      `,
      values: [],
    }

    const result = await database.query(query)
    return result.rowCount > 0
  }

  async deleteSessionByToken(sessionToken: string): Promise<boolean> {
    const query = {
      text: `
        DELETE FROM sessions
        WHERE "sessionToken" = $1
      `,
      values: [sessionToken],
    }

    const result = await database.query(query)
    return result.rowCount > 0
  }

  async getSessionByUserIdAndDevice(
    userId: string,
    device_identifier: string,
  ): Promise<Session | null> {
    const query = {
      text: `
        SELECT * FROM sessions
        WHERE "userId" = $1
        AND device_identifier = $2
      `,
      values: [userId, device_identifier],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }

  async getSessionByToken(sessionToken: string): Promise<Session | null> {
    const query = {
      text: `
        SELECT * FROM sessions
        WHERE "sessionToken" = $1
      `,
      values: [sessionToken],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }
}
