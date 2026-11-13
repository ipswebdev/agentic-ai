const { createMessage, fetchAllMessages, deleteMessagesByThreadId } = require("../repositories/conversationMessage.repository");

const storeMessage = async (threadId,role,content,evidence=[]) => {
    
    const createdMessage = await createMessage({threadId,role,content,evidence})
    if(!createdMessage){
        return {
            success:false,
            message:'Error Saving message'
        }
    }
    const modifiedMessage = {
        id:createdMessage._id.toString(),
        evidence:createdMessage.evidence,
        role:createdMessage.role,
        threadId:createdMessage.threadId.toString(),
        content:createdMessage.content,
        createdAt:createdMessage.createdAt
    }
    return {
        success:true,
        data:modifiedMessage
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
    if(!fetchedMessages.length){
        return {
            success:true,
            data:{
            messages : []
        }
        }
    }
    const modifiedfetchedMessages = fetchedMessages.map(m=>({
                id: m._id.toString(),
                role: m.role,
                content: m.content,
                evidence: m.evidence,
                createdAt: m.createdAt
            }))
    return {
        success:true,
        data:{
            messages : modifiedfetchedMessages
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