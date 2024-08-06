/* eslint-disable no-unused-vars */

export interface User {
  id: string
  name?: string
  nick_name?: string
  email: string
  emailVerified?: Date
  email_verified_provider?: string
  image?: string
  password_hash?: string
  role: 'admin' | 'user'
  created_at: Date
  updated_at: Date
}

export interface UserInput {
  name?: string
  nickName?: string
  email: string
  emailVerified?: Date
  emailVerifiedProvider?: string
  image?: string
  passwordHash?: string
  role?: 'admin' | 'user'
}

export interface UserRepository {
  createUser(data: UserInput): Promise<Omit<User, 'passwordHash'>>
  updateUser(id: string, data: Partial<User>): Promise<boolean>
  updatePassword(
    email: string,
    passwordHash: string,
  ): Promise<{ userId: string } | null>
  getUserByEmail(email: string): Promise<User | null>
  deleteUser(id: string): Promise<boolean>
}
