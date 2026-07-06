const {sendMessage, getChatHistory} = require('../controllers/chat.controller')

const express = require('express');
const chatRouter = express.Router();

chatRouter.post('/',sendMessage)
chatRouter.get('/history',getChatHistory)
module.exports = {
    chatRouter
}