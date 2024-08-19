export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
  created_at: Date
  updated_at: Date
}

export interface AccountInput {
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export interface AccountRepository {
  createAccount(data: AccountInput): Promise<Account>
  getAccountsByUserId(userId: string): Promise<Account[]>
  getProvidersByUserId(userId: string): Promise<string[]>
  getAccountByProvider(provider: string): Promise<Account>
  deleteAccountByProvider(provider: string): Promise<boolean>
}
