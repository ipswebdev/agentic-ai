const { fetchDocumentById, } = require("../services/documents.service");
const {success,failure} = require("../utils/response.utils")
const { DocumentFetchException,DocumentUpdateException,DocumentSaveException, ThreadFetchException, ThreadSaveException} = require("../exceptions/repository.exception");
const {logger} = require("../config/logger");
const { getConversationThreads, createConversationThread, fetchConversationThreadById, deleteConversationThread } = require("../services/conversationThread.service");
const { fetchMessages } = require("../services/conversationMessage.service");



const getThread = async (req,res) => {
  const {id} = {...req.params};
  try{
    const userDoc = await fetchConversationThreadById(id,req.user.id);
    if(userDoc && userDoc?.success){
      const d = userDoc.data
      return success(res,d,'Successfully fetched Thread',200)
    }else{
      return  failure(res,'No Thread found',404)
    }
    
  }catch(err){
    logger.error('Error fetching Thread',err);
    if(err instanceof ThreadFetchException){
      return failure(res,err.message,500)
    }
    return failure(res,'Error fetching Thread',500)
  }
}

const createNewThread = async (req,res) => {
  const {documentId} = req.body
  const {title} = req.body
  if(!documentId?.trim()){
    return  failure(res,'No document found',400)
  }
  try{
    const userThread = await createConversationThread(req.user.id,documentId,title);
    if(userThread && userThread?.thread){
      const d = userThread.thread
      return success(res,d,'Successfully Created Thread',200)
    }else{
      return  failure(res,'Could not create a Thread',400)
    }
    
  }catch(err){
    logger.error('Error creating thread',err);
    if(err instanceof ThreadSaveException){
      return failure(res,err.message,500)
    }
    return failure(res,'Error creating thread',500)
  }
}

const deleteThread =async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThread = await deleteConversationThread(id, req.user.id)
    if (!deletedThread.success) {
      return failure(res, 'Could not delete Thread from DB', 500);
    }
      return success(
        res,
        deletedThread.thread,
        'Successfully Deleted Thread',
        200
      );
  } catch (err) {
    logger.error('Error deleting document', err);
    return failure(res, 'Error deleting document', 500);
  }
};

const getAllThreads = async (req,res) => {
  try{
    const userThreads = await getConversationThreads(req.user.id);
    return success(res,{
      threads:userThreads.threads
    },'Fetched Threads successfully',200);
  }catch(err){
    logger.error('Error fetching Threads',err);
    return failure(res,'Error fetching Threads',500)
  }
}

const getAllThreadMessages = async (req,res) => {
  try{
    const {id} = req.params
    if(!id?.trim()){
      return  failure(res,'No threadID found',400)
    }
    const threadDoc = await fetchConversationThreadById(id,req.user.id);
    if(threadDoc && threadDoc?.success && threadDoc?.data?.id){
      const messageRes = await fetchMessages(threadDoc.data.id)
      if(!messageRes){
        return  failure(res,'No messages found',404)
      }
      const d = messageRes.data
      return success(res,d,'Successfully fetched messages',200)
    }else{
      return  failure(res,'No messages found',404)
    }
  }catch(err){
    logger.error('Error fetching Threads',err);
    return failure(res,'Error fetching Threads',500)
  }
}

module.exports = {
  getThread,
  deleteThread,
  getAllThreads,
  createNewThread,
  getAllThreadMessages
}