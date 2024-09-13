import { updateLocationConsent } from '@/controllers/auth/sessions/update-location-consent'
import { type NextRequest } from 'next/server'

async function handle(req: NextRequest) {
  return await updateLocationConsent(req)
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
}
