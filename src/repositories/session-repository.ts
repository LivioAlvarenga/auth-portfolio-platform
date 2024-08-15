export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: string
  device_identifier: string
  created_at: Date
  updated_at: Date
}

export interface SessionInput {
  sessionToken: string
  userId: string
  expires: Date
  device_identifier?: string
}

export interface SessionRepository {
  createSession(data: SessionInput): Promise<Session>
  deleteExpiredSessions(): Promise<boolean>
  deleteSessionByToken(sessionToken: string): Promise<boolean>
  getSessionByUserIdAndDevice(
    userId: string,
    device_identifier: string,
  ): Promise<Session | null>
  getSessionByToken(sessionToken: string): Promise<Session | null>
}
