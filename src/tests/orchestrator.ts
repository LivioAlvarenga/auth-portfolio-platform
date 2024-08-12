import { database } from '@/infra/database'
import migrator from '@/infra/migrator'
import { webserver } from '@/infra/webserver'
import AsyncRetry from 'async-retry'

async function waitForAllServices() {
  await waitForWebServer()

  async function waitForWebServer() {
    return AsyncRetry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    })

    async function fetchStatusPage() {
      const response = await fetch(`${webserver.host}/api/v1/status`)
      if (response.status !== 200) {
        throw new Error()
      }
    }
  }
}

async function dropAllTables() {
  const databaseClient = await database.getNewClient()
  await databaseClient.query(
    'drop schema public cascade; create schema public;',
  )

  await databaseClient.end()
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations()
}

const orchestrator = { waitForAllServices, dropAllTables, runPendingMigrations }

export { orchestrator }
