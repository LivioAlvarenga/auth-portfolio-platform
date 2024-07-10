import { Client } from 'pg'

async function query(queryObject: any) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  })

  try {
    await client.connect()

    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.error('💥Error executing query', error)
    throw error
  } finally {
    await client.end()
  }
}

const database = { query }

export { database }
