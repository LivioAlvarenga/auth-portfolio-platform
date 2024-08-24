import { verifyMagicLink } from '@/controllers/auth/login/magic-link/verify'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await verifyMagicLink(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
