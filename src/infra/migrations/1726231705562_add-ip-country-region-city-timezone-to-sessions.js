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
  // Add columns for IP, country, region, city, and timezone to the sessions table
  pgm.addColumns('sessions', {
    ip: {
      type: 'varchar(45)', // supports IPv4 and IPv6
      notNull: false,
    },
    country: {
      type: 'varchar(100)',
      notNull: false,
    },
    region: {
      type: 'varchar(100)',
      notNull: false,
    },
    city: {
      type: 'varchar(100)',
      notNull: false,
    },
    timezone: {
      type: 'varchar(100)',
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
  // Drop columns for IP, country, region, city, and timezone from the sessions table
  pgm.dropColumns('sessions', ['ip', 'country', 'region', 'city', 'timezone'])
}
