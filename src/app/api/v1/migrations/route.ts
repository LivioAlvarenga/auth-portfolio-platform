import { database } from '@/infra/database'
import { NextResponse, type NextRequest } from 'next/server'
import migrationRunner, { RunnerOption } from 'node-pg-migrate'
import { join } from 'node:path'
import { Client } from 'pg'

async function migrations(req: NextRequest) {
  const allowedMethods = ['GET', 'POST']
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `method "${req.method}" not allowed` },
      { status: 405 },
    )
  }

  let dbClient: Client | null = null

  try {
    dbClient = await database.getNewClient()

    const defaultMigrationsOptions: RunnerOption = {
      dbClient, // when pass db connection with dbClient option, it will not close the connection. We need to close it manually in the finally block
      migrationsTable: 'pg_migrations',
      dryRun: true, // This will not run the migrations, just show what would be run
      dir: join(process.cwd(), 'src', 'infra', 'migrations'), // Work in all systems
      direction: 'up',
      verbose: true,
    }

    if (req.method === 'GET') {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions)

      return NextResponse.json(pendingMigrations, { status: 200 })
    } else if (req.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      })

      if (migratedMigrations.length > 0) {
        return NextResponse.json(migratedMigrations, { status: 201 })
      }

      return NextResponse.json(migratedMigrations, { status: 200 })
    }
  } catch (error) {
    console.error('💥Error running migrations', error)
    throw error
  } finally {
    if (dbClient) {
      await dbClient.end() // We need to close the connection here, because we are passing the dbClient to the migrationRunner, and it will not close the connection. It will be our responsibility to close it
    }
  }
}

export {
  migrations as DELETE,
  migrations as GET,
  migrations as PATCH,
  migrations as POST,
  migrations as PUT,
}
