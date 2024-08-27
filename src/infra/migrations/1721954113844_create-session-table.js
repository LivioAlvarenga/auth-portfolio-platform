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
  // Create the sessions table
  pgm.createTable('sessions', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    sessionToken: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    userId: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    expires: {
      type: 'timestamp with time zone',
      notNull: true,
    },
    // The device identifier is used to identify the device that the user is using to login - generated with `User-Agent` library
    device_identifier: {
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

  // Add foreign key to users table
  pgm.addConstraint('sessions', 'fk_sessions_user_id', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the sessions table
  pgm.dropTable('sessions')
}
