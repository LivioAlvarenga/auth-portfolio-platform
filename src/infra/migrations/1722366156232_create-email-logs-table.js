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
  pgm.createTable('email_logs', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },
    email_logs_id: {
      type: 'uuid',
      notNull: true,
      references: 'email_types(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    to: {
      type: 'varchar(254)',
      notNull: true,
    },
    cc: {
      type: 'varchar(254)',
      notNull: false,
    },
    bcc: {
      type: 'varchar(254)',
      notNull: false,
    },
    subject: {
      type: 'varchar(255)',
      notNull: true,
    },
    status: {
      type: 'varchar(50)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    response: {
      type: 'text',
      notNull: false,
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('email_logs')
}
