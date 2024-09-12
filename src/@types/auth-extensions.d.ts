/* eslint-disable no-unused-vars */
import 'next-auth'

declare module '@auth/core/adapters' {
  import { User } from 'next-auth'

  export interface AdapterUser extends User {
    role?: string
    profile_completion_score?: number | null
    two_factor_enabled?: boolean
    location_collection_consent?: boolean
  }
}
