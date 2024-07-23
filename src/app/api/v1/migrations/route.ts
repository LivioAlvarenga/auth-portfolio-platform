import migrator from '@/infra/migrator'
import { NextResponse, type NextRequest } from 'next/server'

async function migrations(req: NextRequest) {
  const allowedMethods = ['GET', 'POST']
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `method "${req.method}" not allowed` },
      { status: 405 },
    )
  }

  try {
    if (req.method === 'GET') {
      const pendingMigrations = await migrator.listPendingMigrations()

      return NextResponse.json(pendingMigrations, { status: 200 })
    } else if (req.method === 'POST') {
      const migratedMigrations = await migrator.runPendingMigrations()

      if (migratedMigrations.length > 0) {
        return NextResponse.json(migratedMigrations, { status: 201 })
      }

      return NextResponse.json(migratedMigrations, { status: 200 })
    }
  } catch (error) {
    console.error('💥Error running migrations', error)
    throw error
  }
}

export {
  migrations as DELETE,
  migrations as GET,
  migrations as PATCH,
  migrations as POST,
  migrations as PUT,
}
