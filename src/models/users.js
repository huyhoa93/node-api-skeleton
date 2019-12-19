const DB = require('../helper/mysql_sequelize')
const Sequelize = require('sequelize')
const Users = DB.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  is_deleted: Sequelize.TINYINT
})
module.exports = Users