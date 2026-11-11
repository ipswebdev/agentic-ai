const { ConversationMessage } = require('../models/conversationMessage.model')
const {logger} = require('../config/logger')
const {MessageFetchException,MessageSaveException,MessageDeleteException} = require('../exceptions/repository.exception')

const createMessage = async (messageData) => {
    try{
        const res = await ConversationMessage.create(messageData);
        return res; 
    }catch(err){
        logger.error('Error saving message',err);
        throw new MessageSaveException("Unable to save message.");
    }
}

const fetchMessage = async (id,threadId) => {
    try{
        const res = await ConversationMessage.findOne({_id:id,threadId:threadId});
        return res;
    }catch(err){
        logger.error('Error fetching message',err);
        throw new MessageFetchException("Unable to fetch message.");
    }
}

const fetchAllMessages = async (threadId) => {
    try{
        const res = await ConversationMessage.find({threadId:threadId}).sort({createdAt: 1});
        return res; 
    }catch(err){
        logger.error('Error fetching messages',err);
        throw new MessageFetchException("Unable to fetch message.");
    } 
}

const deleteMessage = async (id,threadId) => {
    try{
        const res = await ConversationMessage.findOneAndDelete({_id:id,threadId:threadId});
        return res;
    }catch(err){
        logger.error('Error Deleting message',err);
        throw new MessageDeleteException("Unable to Delete message.");
    }
}




module.exports = {
  createMessage,
  fetchMessage,
  fetchAllMessages,
  deleteMessage,
};