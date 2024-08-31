import { twoFactorToggle } from '@/controllers/auth/login/credential/two-factor/toggle'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await twoFactorToggle(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
