import { Client, Pool } from 'pg'

async function query(queryObject: any) {
  let client
  try {
    client = await getNewClient()

    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.error('💥Error executing query', error)
    throw error
  } finally {
    if (client) {
      await client.end()
    }
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  })

  await client.connect()

  return client
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const database = { query, getNewClient, pool }

export { database }
