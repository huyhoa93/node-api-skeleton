const md5 = require('md5')
const jwt = require('jsonwebtoken')
const configEnv = require('../../config.json')
const commonUtility = require('../helper/commonUtility')
const userModel = require('../models/users')

const userService = {
  checkLogin: async (email, password, pipeline) => {
    try {
      const user = await userModel.findOne({
        where: {
          email: email,
          password: md5(password),
          is_deleted: 0
        },
        raw: true
      })
      if (!user) {
        commonUtility.handleUnauthorized(pipeline)
        return
      }
      pipeline.output.user = user
      pipeline.emit('next')
    } catch (e) {
      commonUtility.handleInternalServerError(pipeline)
    }
  },

  sendToken: (isKeepLogin, pipeline) => {
    const user = pipeline.output.user
    let expireTime = configEnv.JWT_EXPIRATION_TIME
    if (isKeepLogin && (isKeepLogin === 'true' || isKeepLogin === '1')) {
      expireTime = configEnv.JWT_EXPIRATION_KEEP_LOGIN_TIME
    }
    const token = jwt.sign(user, configEnv.secretkey, { expiresIn: expireTime })
    pipeline.output.status = configEnv.status_success
    const res = {
      status: 'success',
      response: {
        jwt_token: token
      }
    }
    pipeline.output.content = res
    pipeline.emit('next')
  },

  createUser: async (data, pipeline) => {
    try {
      if (!commonUtility.isEmail(data.email) || data.name === '' || data.password === '' || (data.password !== data.password_confirm)) {
        commonUtility.handleBadRequest(pipeline)
        return
      }
      const userExist = await userModel.findOne({
        where: { email: data.email },
        raw: true
      })
      if (userExist) {
        commonUtility.handleBadRequest(pipeline)
        return
      }
      const userCreated = await userModel.create({
        name: data.name,
        email: data.email,
        password: md5(data.password)
      })
      const user = userCreated.get({plain: true})
      delete user.password
      const res = {
        status: 'success',
        response: {
          user: user
        }
      }
      pipeline.output.status = configEnv.status_success
      pipeline.output.content = res
      pipeline.emit('next')
    } catch (e) {
      commonUtility.handleInternalServerError(pipeline)
    }
  },

  editUser: async (token, data, pipeline) => {
    try {
      const decoded = jwt.verify(token, configEnv.secretkey)
      const userId = decoded.id
      if (!data.name || (data.password && data.password !== data.password_confirm)) {
        commonUtility.handleBadRequest(pipeline)
        return
      }
      const dataUpdated = {
        name: data.name
      }
      if (data.password) {
        dataUpdated.password = md5(data.password)
      }
      await userModel.update(dataUpdated, {where: { id: userId }})
      const userRes = await userModel.findOne({
        where: {
          id: userId,
          is_deleted: 0
        },
        raw: true
      })
      delete userRes.password
      const res = {
        status: 'success',
        response: {
          user: userRes
        }
      }
      pipeline.output.status = configEnv.status_success
      pipeline.output.content = res
      pipeline.emit('next')
    } catch (e) {
      commonUtility.handleInternalServerError(pipeline)
    }
  },

  getUserById: async (userId, pipeline) => {
    try {
      const user = await userModel.findOne({
        where: { id: userId },
        raw: true
      })
      if (!user) {
        commonUtility.handleNotFound(pipeline)
        return
      }
      const res = {
        status: 'success',
        response: {
          user: user
        }
      }
      pipeline.output.status = configEnv.status_success
      pipeline.output.content = res
      pipeline.emit('next')
    } catch (e) {
      commonUtility.handleInternalServerError(pipeline)
    }
  },

  getUsers: async (queries, pipeline) => {
    try {
      const page = queries.page ? parseInt(queries.page) : false
      const per_page = queries.per_page ? parseInt(queries.per_page) : false
      const offset = (page - 1) * per_page
      const query = {
        raw: true,
        order: [['id', 'DESC']],
        group: ['users.id'],
      }
      if (page && per_page) {
        query['offset'] = offset
        query['limit'] = per_page
      }
      const users = await userModel.findAndCountAll(query)
      const res = {
        status: 'success',
        response: {
          users: users.rows,
          total: users.count.length
        }
      }
      pipeline.output.status = configEnv.status_success
      pipeline.output.content = res
      pipeline.emit('next')
    } catch (e) {
      commonUtility.handleInternalServerError(pipeline)
    }
  }
}

module.exports = userService