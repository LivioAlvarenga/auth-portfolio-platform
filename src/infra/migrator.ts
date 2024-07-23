import migrationRunner, { RunnerOption } from 'node-pg-migrate'
import { join } from 'node:path'
import { database } from './database'

const defaultConfigurations: Omit<RunnerOption, 'dbClient'> = {
  migrationsTable: 'pgmigrations',
  dryRun: true, // This will not run the migrations, just show what would be run
  dir: join(process.cwd(), 'src', 'infra', 'migrations'), // Work in all systems
  direction: 'up',
  verbose: true,
}

async function listPendingMigrations() {
  const databaseClient = await database.getNewClient()

  try {
    const pendingMigrations = await migrationRunner({
      ...defaultConfigurations,
      dbClient: databaseClient,
    })

    return pendingMigrations
  } finally {
    await databaseClient.end()
  }
}

async function runPendingMigrations() {
  const databaseClient = await database.getNewClient()

  try {
    const migratedMigrations = await migrationRunner({
      ...defaultConfigurations,
      dbClient: databaseClient,
      dryRun: false,
    })

    return migratedMigrations
  } finally {
    await databaseClient.end()
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
}

export default migrator
