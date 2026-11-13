const { chatHistory,processMessage, getAIAnswer } = require("../services/chat.service");
const {success,failure} = require('../utils/response.utils')

const { fetchConversationThreadById } = require("../services/conversationThread.service");
const { storeMessage } = require("../services/conversationMessage.service");
const { updateThreadActivity } = require("../repositories/conversationThread.repository");

const sendMessage = async  (req, res) =>  {
  const message = processMessage(req.body);
  const {threadId} = req.body
  const user = req?.user;

  if(message === 'No Message'){
    return failure(res,"No message found!",401)
  }
  
  if(!user || !user?.id){
    return failure(res,"No user found!",401)
  }
  
  if(!threadId){
    return failure(res,"Thread ID missing!",404)
  }

  const threadDetails = await fetchConversationThreadById(threadId,user.id)
  
  if(!threadDetails?.success || !threadDetails?.data?.documentId){
    return failure(res,"No Document Linked to the Thread",400)
  }
  
  const storedMessage = await storeMessage(threadId,'user',message,[])
  
  if (!storedMessage.success) {
      return failure(res, "Unable to save user message", 500);
  }

  const data = await getAIAnswer(message,threadDetails?.data?.documentId);
  const answer = await data.answer
  const AnswerData = {
    answer:answer,
    matches:data.matches,
  }

  if(answer && data.success){
    const evidence = data?.matches?.length ? data.matches : []
    const storedAnswer = await storeMessage(threadId,'assistant',answer,evidence)
    if(storedAnswer.success){
      const updatedThreadActivity = await updateThreadActivity(threadId,user.id) 
      if(!updatedThreadActivity){
        return failure(res, "Unable to update thread", 400);
      }
    }else{
      return failure(res, "Unable to save assistant response", 500);
    }
    return success(res,AnswerData,"Answer generated Successfully!",200)
  }
  return failure(res,"Error generating response",400)
}

const getChatHistory = (req,res) => {
    res.json({
    hisoty: chatHistory,
  });
}
const getChatDetail = (req,res) => {
}

module.exports = {
  getChatHistory,
  sendMessage,
  getChatDetail
}