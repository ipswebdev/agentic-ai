const express = require('express')
const authRouter = express.Router()

const {getUserGoogleIDToken} = require('../controllers/auth.controller')

authRouter.post('/google/login',getUserGoogleIDToken)


module.exports = {authRouter}