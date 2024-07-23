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
  pgm.createTable('users', {
    // It must need to integrate with the Auth.js
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },

    // The full name of the user, use name because must need to integrate with the Auth.js
    name: {
      type: 'varchar(255)',
      notNull: false,
    },

    nick_name: {
      type: 'varchar(255)',
      notNull: false,
    },

    // Why 254 in length? https://stackoverflow.com/a/1199238. It must need to integrate with the Auth.js
    email: {
      type: 'varchar(254)',
      notNull: true,
      unique: true,
    },

    // A column emailVerified with timestamp
    email_verified: {
      type: 'timestamp',
      notNull: false,
    },

    // This column use `image` because must need to integrate with the Auth.js
    image: {
      type: 'text',
      notNull: false,
    },

    // Why 60 varchar? https://forums.phpfreaks.com/topic/293405-recommended-sql-datatype-for-bcrypt-hash/#comment-1500831
    password_hash: {
      type: 'varchar(60)',
      notNull: false,
    },

    // Why "with timezone"? https://stackoverflow.com/a/20713587
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
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('User')
}
