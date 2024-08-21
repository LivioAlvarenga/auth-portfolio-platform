/* eslint-disable no-unused-vars */
import 'next-auth'

declare module 'next-auth' {
  interface User {
    emailVerified?: Date | boolean | null
    nick_name?: string | null
    role?: string | null
  }
}
