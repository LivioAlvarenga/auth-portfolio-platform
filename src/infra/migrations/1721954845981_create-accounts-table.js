/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('accounts', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    userId: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    type: {
      type: 'varchar(255)',
      notNull: true,
    },
    provider: {
      type: 'varchar(255)',
      notNull: true,
    },
    providerAccountId: {
      type: 'varchar(255)',
      notNull: true,
    },
    refresh_token: {
      type: 'text',
      notNull: false,
    },
    access_token: {
      type: 'text',
      notNull: false,
    },
    expires_at: {
      type: 'int',
      notNull: false,
    },
    token_type: {
      type: 'varchar(255)',
      notNull: false,
    },
    scope: {
      type: 'varchar(255)',
      notNull: false,
    },
    id_token: {
      type: 'text',
      notNull: false,
    },
    session_state: {
      type: 'varchar(255)',
      notNull: false,
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  })

  // Add unique constraint for provider and provider_account_id
  pgm.addConstraint('accounts', 'unique_provider_provider_account_id', {
    unique: ['provider', 'providerAccountId'],
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the accounts table
  pgm.dropTable('accounts')
}
