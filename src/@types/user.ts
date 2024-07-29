export interface CreateUser {
  name?: string
  nick_name?: string
  email: string
  password?: string
  image?: string
}

export interface User {
  id: string
  name?: string
  nick_name?: string
  email: string
  emailVerified?: Date
  email_verified_provider?: string
  image?: string
  passwordHash?: string
  role: string
  createdAt: Date
  updatedAt: Date
}
