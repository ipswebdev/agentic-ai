const {sendMessage} = require('../controllers/chat.controller')

const express = require('express');
const chatRouter = express.Router();

chatRouter.post('/',sendMessage)
module.exports = {
    chatRouter
}