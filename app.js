const express = require('express')
const app = express()
const http = require( 'http' )
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const userController = require('./src/controllers/userController')
const commonUtility = require('./src/helper/commonUtility.js')
const validateUserToken = commonUtility.validateUserToken

app.use(express.json())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cors())
app.use(fileUpload())
app.use(commonUtility.checkPermission)

app.post('/api/login', userController.login)
app.post('/api/users', userController.createUser)
app.patch('/api/users', [validateUserToken, userController.editUser])
app.get('/api/users', [validateUserToken, userController.getUsers])
app.get('/api/users/:user_id', [validateUserToken, userController.getUserById])

http.createServer(app).listen(process.env.PORT)