const Pipeline = require('../helper/pipeline')
const userService = require('../services/userService')
const userController = {
  login: (req, res) => {
    const pipeline = new Pipeline(res)

    pipeline.add('checkLogin', function() {
      userService.checkLogin(req.body.email, req.body.password, pipeline)
    })

    pipeline.add('sendToken', function() {
      userService.sendToken(req.body.isKeepLogin, pipeline)
    })

    pipeline.emit('next')
  },

  createUser: (req, res) => {
    const pipeline = new Pipeline(res)
    
    pipeline.add('createUser', function() {
      userService.createUser(req.body, pipeline)
    })

    pipeline.emit('next')
  },

  editUser: (req) => {
    const pipeline = req.pipeline

    pipeline.add('editUser', () => {
      userService.editUser(req.headers.authorization, req.body, pipeline)
    })

    pipeline.emit('next')
  },

  getUsers: (req) => {
    const pipeline = req.pipeline

    pipeline.add('getUsers', () => {
      userService.getUsers(req.query, pipeline)
    })

    pipeline.emit('next')
  },

  getUserById: (req) => {
    const pipeline = req.pipeline

    pipeline.add('getUserById', () => {
      userService.getUserById(req.params.user_id, pipeline)
    })

    pipeline.emit('next')
  },
}
module.exports = userController
