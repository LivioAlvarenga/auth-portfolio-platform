import { database } from '@/infra/database'
import { NextResponse, type NextRequest } from 'next/server'
import migrationRunner, { RunnerOption } from 'node-pg-migrate'
import { join } from 'node:path'

async function migrations(req: NextRequest) {
  console.log('😐Current directory:', process.cwd())
  console.log(
    '🌈Migrations path:',
    join(process.cwd(), 'src', 'infra', 'migrations'),
  )

  const dbClient = await database.getNewClient()
  const defaultMigrationsOptions: RunnerOption = {
    dbClient, // when pass db connection with dbClient option, it will not close the connection
    migrationsTable: 'pg_migrations',
    dryRun: true, // This will not run the migrations, just show what would be run
    dir: join('src', 'infra', 'migrations'), // Work in all systems
    direction: 'up',
    verbose: true,
  }

  if (req.method === 'GET') {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions)

    await dbClient.end() // We need to close the connection here, because we are passing the dbClient to the migrationRunner

    return NextResponse.json(pendingMigrations, { status: 200 })
  } else if (req.method === 'POST') {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    })

    await dbClient.end()

    if (migratedMigrations.length > 0) {
      return NextResponse.json(migratedMigrations, { status: 201 })
    }

    return NextResponse.json(migratedMigrations, { status: 200 })
  }

  return NextResponse.json({ message: 'method not allowed' }, { status: 405 })
}

export { migrations as GET, migrations as POST }
