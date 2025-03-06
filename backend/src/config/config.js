require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'engenharia_app',
    password: process.env.DB_PASS || 'pNfMpwRmfJBFJ3py',
    database: process.env.DB_NAME || 'engenharia_app',
    host: process.env.DB_HOST || '164.152.48.221',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast: true
    },
    timezone: '-03:00'
  },
  test: {
    username: process.env.DB_USER || 'engenharia_app',
    password: process.env.DB_PASS || 'pNfMpwRmfJBFJ3py',
    database: process.env.DB_NAME || 'engenharia_app',
    host: process.env.DB_HOST || '164.152.48.221',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast: true
    },
    timezone: '-03:00'
  },
  production: {
    username: process.env.DB_USER || 'engenharia_app',
    password: process.env.DB_PASS || 'pNfMpwRmfJBFJ3py',
    database: process.env.DB_NAME || 'engenharia_app',
    host: process.env.DB_HOST || '164.152.48.221',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast: true
    },
    timezone: '-03:00'
  }
}; 