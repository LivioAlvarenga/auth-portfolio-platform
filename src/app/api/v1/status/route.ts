import { database } from '@/infra/database'
import { NextResponse, type NextRequest } from 'next/server'

async function status(req: NextRequest) {
  const allowedMethods = ['GET']
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `method "${req.method}" not allowed` },
      { status: 405 },
    )
  }

  if (req.method === 'GET') {
    const updatedAt = new Date().toISOString()

    const databaseVersionResult = await database.query('SHOW server_version;')
    const databaseVersionValue = databaseVersionResult.rows[0].server_version

    const databaseConnectionsResult = await database.query(
      'SHOW max_connections;',
    )
    const databaseConnectionsValue =
      databaseConnectionsResult.rows[0].max_connections

    const dataBaseName = process.env.POSTGRES_DB
    const databaseOpenedConnectionsResult = await database.query({
      text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
      values: [dataBaseName],
    })
    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResult.rows[0].count

    return NextResponse.json(
      {
        updated_at: updatedAt,
        dependencies: {
          database: {
            version: databaseVersionValue,
            max_connections: parseInt(databaseConnectionsValue),
            oppened_connetions: databaseOpenedConnectionsValue,
          },
        },
      },
      { status: 200 },
    )
  }
}

export {
  status as DELETE,
  status as GET,
  status as PATCH,
  status as POST,
  status as PUT,
}
