export interface Avatar {
  id: string
  userId: string
  url: string
  provider: string
  created_at: Date
}

export interface AvatarInput {
  userId: string
  url: string
  provider: string
}

export interface AvatarRepository {
  create(data: AvatarInput): Promise<Avatar>
  updateAvatarById(id: string, data: AvatarInput): Promise<Avatar | null>
  getAvatarByProvider(provider: string): Promise<Avatar | null>
}
