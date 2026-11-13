const { createMessage, fetchAllMessages, deleteMessagesByThreadId } = require("../repositories/conversationMessage.repository");

const storeMessage = async (threadId,role,content,evidence=[]) => {
    
    const createdMessage = await createMessage({threadId,role,content,evidence})
    if(!createdMessage){
        return {
            success:false,
            message:'Error Saving message'
        }
    }
    return {
        success:true,
        data:createdMessage
    }
}

const fetchMessages = async (threadId) => {
    
    const fetchedMessages = await fetchAllMessages(threadId)
    if(!fetchedMessages){
        return {
            success:false,
            message:'Error Fetching message'
        }
    }
    return {
        success:true,
        data:{
            messages : fetchedMessages.map(m=>({
                id: m._id.toString(),
                role: m.role,
                content: m.content,
                evidence: m.evidence,
                createdAt: m.createdAt
            }))
        }
    }
}

const deleteMessagesforThread = async (threadId) => {
    
    const deletedMessages = await deleteMessagesByThreadId(threadId)
    if(!deletedMessages){
        return {
            success:false,
            message:'Error Fetching message'
        }
    }
    return {
        success:true,
        data:deletedMessages
    }
}


module.exports = {
    storeMessage,
    fetchMessages,
    deleteMessagesforThread
}