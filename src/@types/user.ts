export interface CreateUser {
  name?: string
  nickName?: string
  email: string
  password?: string
  image?: string
}

export interface User {
  id: string
  name?: string
  nickName?: string
  email: string
  emailVerified?: Date
  image?: string
  passwordHash?: string
  createdAt: Date
  updatedAt: Date
}
