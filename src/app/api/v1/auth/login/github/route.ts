import { loginGithub } from '@/controllers/auth/login/github'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await loginGithub(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
