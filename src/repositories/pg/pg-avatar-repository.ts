import { database } from '@/infra/database'
import { Avatar, AvatarInput, AvatarRepository } from '../avatar-repository'

export class PgAvatarRepository implements AvatarRepository {
  async create(data: AvatarInput): Promise<Avatar> {
    const query = {
      text: `
        INSERT INTO avatars ("userId", url, provider)
        VALUES ($1, $2, $3)
        RETURNING id, "userId", url
      `,
      values: [data.userId, data.url, data.provider],
    }

    const result = await database.query(query)
    return result.rows[0]
  }

  async getAvatarByProvider(provider: string): Promise<Avatar | null> {
    const query = {
      text: `
        SELECT * FROM avatars
        WHERE provider = $1
      `,
      values: [provider],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }

  async updateAvatarById(
    id: string,
    data: AvatarInput,
  ): Promise<Avatar | null> {
    const query = {
      text: `
        UPDATE avatars
        SET url = $2
        WHERE id = $1
        RETURNING id, "userId", url
      `,
      values: [id, data.url],
    }

    const result = await database.query(query)
    return result.rows[0] || null
  }
}
