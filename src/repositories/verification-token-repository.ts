/* eslint-disable no-unused-vars */

export interface VerificationToken {
  identifier: string
  token: string
  tokenType?: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}

export interface VerificationTokenInput {
  identifier: string
  token: string
  tokenType?: string
  expires: Date
}

export interface VerificationTokenRepository {
  createToken(data: VerificationTokenInput): Promise<VerificationToken>
  getValidToken(
    identifier: string,
    token: string,
  ): Promise<VerificationToken | null>
  deleteToken(identifier: string, token: string): Promise<boolean>
  deleteExpiredTokens(): Promise<boolean>
}
