import { verifyEmailOpt } from '@/controllers/auth/verify-email-opt'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await verifyEmailOpt(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
