import { forgotPassword } from '@/controllers/auth/forgot-password'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await forgotPassword(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
