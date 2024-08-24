import { requestMagicLink } from '@/controllers/auth/login/magic-link/request'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await requestMagicLink(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
