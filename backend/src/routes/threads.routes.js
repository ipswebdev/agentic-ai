const { createNewThread,getAllThreads,getThread, deleteThread, getAllThreadMessages } = require('../controllers/threads.controller');

const express = require('express');

const threadRouter = express.Router();

threadRouter.get('/:id',getThread)
threadRouter.delete('/:id',deleteThread)
threadRouter.get('/:id/messages',getAllThreadMessages)
threadRouter.get('/',getAllThreads)
threadRouter.post('/',createNewThread)


module.exports = {
    threadRouter
}