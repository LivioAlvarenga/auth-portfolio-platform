/* eslint-disable no-unused-vars */
import 'next-auth'

declare module 'next-auth' {
  interface User {
    emailVerified?: boolean | null
  }
}
