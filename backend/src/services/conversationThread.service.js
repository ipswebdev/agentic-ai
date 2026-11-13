const { logger } = require("../config/logger");
const { fetchThread, createThread, fetchAllThreads, deleteThread } = require("../repositories/conversationThread.repository");
const { fetchDocumentById } = require("./documents.service")
const {deleteMessagesByThreadId} = require("../repositories/conversationMessage.repository")

const validateDocumentOwnership = async (userId,documentId) => {
     if(!userId || !documentId){
            return {
                success:false,
                message:"User ID and Document ID are required."
            }
        }
        const documentRes = await fetchDocumentById(documentId,userId);
         if (!documentRes.success) {
            return {
                success: false,
                message: "Document not found."
            };
        }
        return {
            ...documentRes,
        }

}

const createConversationThread = async (userId,documentId,title) => {
    try{
        const documentRes = await validateDocumentOwnership(userId,documentId);
         if (!documentRes.success) {
            return {
                success: false,
                message: "Document not found."
            };
        }
        // Only allow conversations for processed documents.
        if (documentRes?.document?.status !== "READY") {
            return {
                success: false,
                message: "Document is not ready for conversation."
            };
        }
        const thread = await createThread({userId:userId,documentId:documentId,title:title?.trim() || 'New Conversation'})
        if(thread && thread?._id){
            return {
                success:true,
                message:'Thread Successfully created',
                thread:{
                    id: thread._id,
                    documentId: thread.documentId,
                    userId: thread.userId,
                    title: thread.title
                }
            }
        }
    }catch(err){
        logger.error("Error creating conversation thread", err);
        throw err
    }
}

const getConversationThreads = async (userId) => {
    try{
        const threadsRes = await fetchAllThreads(userId)
        if(!threadsRes || !threadsRes.length){
            return {
                success: true,
                threads: []
            };    
        }
        return {
            success: true,
            threads: threadsRes
        };
    }catch(err){
        logger.error('error fetching all threads',err)
        throw err
    }
    
}

const fetchConversationThreadById = async (threadId,userId) => {


    const threadById = await fetchThread(threadId,userId);
    if(!threadById){
        return {
            success:false,
            message:"Thread not found"       
        }
    }
    const documentRes = await validateDocumentOwnership(userId,threadById.documentId);
    if (!documentRes.success) {
        return {
            success: false,
            message: "Document linked to the thread found."
        };
    }
    return{
        success:true,
        data:threadById
    }
} 
const deleteConversationThread = async (threadId, userId) => {
    try {
        // First establish ownership.
        const thread = await fetchThread(threadId, userId);

        if (!thread) {
            return {
                success: false,
                message: "Conversation thread not found."
            };
        }
        // Delete associated messages.
        await deleteMessagesByThreadId(threadId);
        const deletedThread = await deleteThread(threadId, userId);

        if (!deletedThread) {
            return {
                success: false,
                message: "Unable to delete conversation thread."
            };
        }
        return {
            success: true,
            thread: deletedThread
        };

    } catch (err) {
        logger.error("Error deleting conversation thread", err);
        throw err;
    }
};

module.exports = {
    createConversationThread,
    getConversationThreads,
    fetchConversationThreadById,
    deleteConversationThread
};