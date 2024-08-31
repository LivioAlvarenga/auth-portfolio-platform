export interface User {
  id: string
  name?: string
  nick_name?: string
  email: string
  emailVerified?: string
  email_verified_provider?: string
  image?: string
  password_hash?: string
  role: 'admin' | 'user'
  profile_completion_score?: number
  two_factor_enabled?: boolean
  created_at: Date
  updated_at: Date
}

export interface UserInput {
  name?: string
  nick_name?: string
  email: string
  emailVerified?: Date
  email_verified_provider?: string
  image?: string
  password_hash?: string
  role?: 'admin' | 'user'
  profile_completion_score?: number
  two_factor_enabled?: boolean
  updated_at?: Date
}

export interface UserRepository {
  createUser(data: UserInput): Promise<Omit<User, 'passwordHash'>>
  updateUser(
    id: string,
    data: Partial<UserInput>,
  ): Promise<Omit<User, 'passwordHash'>>
  updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<{ userId: string } | null>
  updateProfileCompletionScore(
    userId: string,
    score: number,
  ): Promise<{ userId: string } | null>
  getUserByEmail(email: string): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  deleteUser(id: string): Promise<boolean>
}
