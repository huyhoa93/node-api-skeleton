const configEnv = require('../../config.json')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const userModel = require('../models/users')
const Pipeline = require('../helper/pipeline')

const commonUtility = {
  isEmail: (email) => {
    if (!validator.isEmail(email)) {
      return false
    }
    return true
  },

  handleInternalServerError: function (pipeline) {
    const res = {
      status: 'fail',
      response: {
        message: 'Internal Server Error',
      }
    }
    pipeline.output.content = res
    pipeline.output.status = configEnv.status_internal_error
    pipeline.forceEnd()
  },

  handleBadRequest: function(pipeline) {
    const res = {
      status: 'fail',
      response: {
        message: 'Bad Request'
      }
    }
    pipeline.output.status = configEnv.status_bad_request
    pipeline.output.content = res
    pipeline.forceEnd()
  },

  handleForbidden: function(pipeline) {
    const res = {
      status: 'fail',
      response: {
        message: 'Forbidden'
      }
    }
    pipeline.output.status = configEnv.status_forbidden
    pipeline.output.content = res
    pipeline.forceEnd()
  },

  handleUnauthorized: function(pipeline) {
    const res = {
      status: 'fail',
      response: {
        message: 'Unauthorized'
      }
    }
    pipeline.output.status = configEnv.status_unauthorized
    pipeline.output.content = res
    pipeline.forceEnd()
  },

  handleNotFound: function(pipeline) {
    const res = {
      status: 'fail',
      response: {
        message: 'Not Found'
      }
    }
    pipeline.output.status = configEnv.status_not_found
    pipeline.output.content = res
    pipeline.forceEnd()
  },

  validateUserToken: async (req, res, next) => {
    const pipeline = new Pipeline(res)
    try {
      const token = req.headers.authorization
      const decoded = jwt.verify(token, configEnv.secretkey)
      const user = await userModel.findOne({
        where: { id: decoded.id },
        raw: true
      })
      if (!user || user.is_deleted !== 0) {
        commonUtility.handleUnauthorized(pipeline)
        return
      }
      pipeline.input['user'] = user
      // eslint-disable-next-line require-atomic-updates
      req.pipeline = pipeline
      next()
    } catch (e) {
      commonUtility.handleUnauthorized(pipeline)
    }
  },

  checkPermission: async function(req, res, next) {
    // Not have permission
    /*
      const rs = {
        status: 'fail',
        response: {
          message: 'Permission Denied'
        }
      }
      res.status(configEnv.status_forbidden).json(rs).end()
      return
    */
      
    // Have permission
    next()
  }
}

module.exports = commonUtility
