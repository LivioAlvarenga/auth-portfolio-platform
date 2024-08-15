import { loginCredential } from '@/controllers/auth/login/credential'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await loginCredential(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
