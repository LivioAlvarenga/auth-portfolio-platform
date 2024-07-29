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
  pgm.createTable('verification_token', {
    identifier: {
      type: 'varchar(255)',
      notNull: true,
    },
    token: {
      type: 'varchar(255)',
      notNull: true,
    },
    expires: {
      type: 'timestamp with time zone',
      notNull: true,
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

  // Add unique constraint for identifier and token
  pgm.addConstraint('verification_token', 'unique_identifier_token', {
    unique: ['identifier', 'token'],
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the verification_token table
  pgm.dropTable('verification_token')
}
