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

const fetchThread = async (threadId, userId, documentId = null) => {
    try {
        const query = {
            _id: threadId,
            userId: userId
        };

        if (documentId) {
            query.documentId = documentId;
        }

        return await ConversationThread.findOne(query);
    } catch (err) {
        logger.error('Error fetching thread', err);
        throw new ThreadFetchException("Unable to fetch thread.");
    }
};

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

const updateThreadActivity = async (threadId, userId) => {
    try {
        return await ConversationThread.findOneAndUpdate(
            {
                _id: threadId,
                userId: userId
            },
            {
                $set: {
                    updatedAt: new Date()
                }
            },
            {
                new: true,
                timestamps: false
            }
        );
    } catch (err) {
        logger.error('Error updating thread activity', err);
        throw new ThreadUpdateException("Unable to update thread activity.");
    }
};

module.exports = {
  createThread,
  fetchThread,
  fetchAllThreads,
  deleteThread,
  updateThreadActivity
};