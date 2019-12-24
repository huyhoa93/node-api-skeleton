const Sequelize = require('sequelize')
const mysqlSequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  pool: {maxIdleTime: 300},
  define: {
    timestamps: false
  },
  timezone: '+07:00'
})

module.exports = mysqlSequelize
