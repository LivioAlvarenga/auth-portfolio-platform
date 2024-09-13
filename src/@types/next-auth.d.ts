/* eslint-disable no-unused-vars */
import 'next-auth'

declare module 'next-auth' {
  interface User {
    nick_name?: string | null
    email_verified_provider?: string | null
    password_hash?: string | null
    role?: string
    profile_completion_score?: number | null
    two_factor_enabled?: boolean
    location_collection_consent?: boolean
    created_at?: Date
    updated_at?: Date
  }
}

type ISODateString = string

export {}
