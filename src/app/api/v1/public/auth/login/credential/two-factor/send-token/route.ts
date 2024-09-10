import { twoFactorSendToken } from '@/controllers/auth/login/credential/two-factor/send-token'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await twoFactorSendToken(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
