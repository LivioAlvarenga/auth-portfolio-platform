import { loginGoogle } from '@/controllers/auth/login/google'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await loginGoogle(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
