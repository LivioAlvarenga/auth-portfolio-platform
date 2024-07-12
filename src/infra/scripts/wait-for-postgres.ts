/**
 * Este script verifica se o PostgreSQL está aceitando conexões.
 * Ele é executado como parte do processo de inicialização do projeto
 * para garantir que o banco de dados esteja pronto antes de iniciar
 * as migrações e o servidor de desenvolvimento do Next.js.
 *
 * Fluxo de Inicialização:
 * Quando você executa `npm run dev`, os seguintes passos são seguidos:
 *
 * 1. Os serviços do Docker são iniciados (`services:up`).
 * 2. O script `wait-for-postgres.ts` é executado para verificar se o PostgreSQL está aceitando conexões (`wait-for-postgres`).
 * 3. As migrações do banco de dados são aplicadas (`migration:up`).
 * 4. O servidor de desenvolvimento do Next.js é iniciado (`next dev`).
 */

async function checkPostgres() {
  const { exec } = await import('node:child_process')

  exec('docker exec postgres-dev pg_isready --host localhost', handleReturn)

  function handleReturn(error: Error | null, stdout: string) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.')
      checkPostgres() // recursive call
      return
    }

    console.log('\n🟢 PostgreSQL is accepting connections\n')
  }
}

process.stdout.write('\n\n🔴 Waiting for PostgreSQL to accept connections')
checkPostgres()
