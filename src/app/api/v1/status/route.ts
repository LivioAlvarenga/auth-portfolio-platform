import { query } from '@/infra/database'
import { NextResponse, type NextRequest } from 'next/server'

async function status(req: NextRequest) {
  if (req.method === 'GET') {
    const result = await query('SELECT 1 + 1;')

    return NextResponse.json({ message: 'ok' }, { status: 200 })
  } else {
    return NextResponse.json({ message: 'method not allowed' }, { status: 405 })
  }
}

export { status as GET }
