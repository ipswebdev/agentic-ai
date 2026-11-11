const { ConversationThread } = require('../models/conversationThread.model')
const {logger} = require('../config/logger')
const {ThreadSaveException,ThreadDeleteException,ThreadFetchException} = require('../exceptions/repository.exception')

const createThread = async (threadData) => {
    try{
        const res = await ConversationThread.create(threadData);
        return res; 
    }catch(err){
        logger.error('Error saving thread',err);
        throw new ThreadSaveException("Unable to save thread.");
    }
}

const fetchThread = async (threadId,userId) => {
    try{
        const res = await ConversationThread.findOne({_id:threadId,userId:userId});
        return res;
    }catch(err){
        logger.error('Error fetching thread',err);
        throw new ThreadFetchException("Unable to fetch thread.");
    }
}

const fetchAllThreads = async (userId,documentId) => {
    try{
        const res = await ConversationThread.find({userId:userId,documentId:documentId}).sort({
    updatedAt: -1
});
        return res; 
    }catch(err){
        logger.error('Error fetching threads',err);
        throw new ThreadFetchException("Unable to fetch thread.");
    } 
}

const deleteThread = async (threadId,userId) => {
    try{
        const res = await ConversationThread.findOneAndDelete({_id:threadId,userId:userId});
        return res;
    }catch(err){
        logger.error('Error Deleting thread',err);
        throw new ThreadDeleteException("Unable to Delete thread.");
    }
}



module.exports = {
  createThread,
  fetchThread,
  fetchAllThreads,
  deleteThread,
};