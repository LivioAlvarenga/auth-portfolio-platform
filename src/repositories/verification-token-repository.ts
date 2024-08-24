export interface VerificationToken {
  identifier: string
  token: string
  token_type?: string
  expires: Date
  opt?: string
  created_at: Date
  updated_at: Date
}

export interface VerificationTokenInput {
  identifier: string
  token: string
  tokenType?: string
  expires: Date
  opt?: string | null
}

export interface VerificationTokenRepository {
  createToken(data: VerificationTokenInput): Promise<VerificationToken>
  updateToken(data: VerificationTokenInput): Promise<VerificationToken>
  getValidToken(
    identifier: string,
    token: string,
  ): Promise<VerificationToken | null>
  getValidTokenByTypeAndIdentifier(
    identifier: string,
    tokenType: string,
  ): Promise<VerificationToken | null>
  getValidTokenByToken(token: string): Promise<VerificationToken | null>
  deleteToken(identifier: string, token: string): Promise<boolean>
  deleteExpiredTokens(): Promise<boolean>
}
