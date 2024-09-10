import { twoFactorLogin } from '@/controllers/auth/login/credential/two-factor/login'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await twoFactorLogin(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
