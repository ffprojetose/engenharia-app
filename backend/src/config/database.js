require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: {
      connectTimeout: 60000,
      ssl: false,
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      multipleStatements: true,
      typeCast: true,
      timezone: '-03:00'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 120000,
      idle: 10000,
      evict: 1000,
      handleDisconnects: true
    },
    retry: {
      max: 5,
      timeout: 5000,
      match: [
        /Deadlock/i,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /SequelizeConnectionAcquireTimeoutError/
      ]
    }
  }
}; 