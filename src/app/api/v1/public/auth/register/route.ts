import { register } from '@/controllers/auth/register'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await register(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
