const { chatHistory,processMessage, getAIAnswer } = require("../services/chat.service");
const {success,failure} = require('../utils/response.utils')
const {fetchDocumentById} = require('../services/documents.service');
const { fetchConversationThreadById } = require("../services/conversationThread.service");
const { storeMessage } = require("../services/conversationMessage.service");

const sendMessage = async  (req, res) =>  {
  const message = processMessage(req.body);
  const {documentId} = req.body
  const {threadId} = req.body
  const user = req?.user;
  if(!user || !user?.id){
    return failure(res,"No user found!",401)
  }
  if(!documentId){
    return failure(res,"Document ID missing!",404)
  }
  if(!threadId){
    return failure(res,"Thread ID missing!",404)
  }
  // const documentDetails = await fetchDocumentById(documentId,user.id)
  // if(!documentDetails?.success || !documentDetails?.document){
  //   return failure(res,"Unauthorized Document Access",404)
  // }
  const threadDetails = await fetchConversationThreadById(user.id,documentId,threadId)
  if(!threadDetails?.success || !threadDetails?.data?.documentId){
    return failure(res,"Unauthorized Thread Access",404)
  }
  const storedMessage = await storeMessage(threadId,'user',message,[])
  if (!storedMessage.success) {
      return failure(res, "Unable to save user message", 500);
  }
  const data = await getAIAnswer(message,documentId);
  const answer = await data.answer
  const AnswerData = {
    answer:answer,
    matches:data.matches,
  }
  if(answer && data.success){
    const storedAnswer = await storeMessage(threadId,'assistant',answer,data?.matches?.length ? answer.data.matches : [])
    await updateThreadActivity(threadId,user.id) 
    if (!storedAnswer.success) {
        return failure(res, "Unable to save assistant response", 500);
    }
    return success(res,AnswerData,"Answer generated Successfully!",200)
  }
  return failure(res,"Error generating response",400)
  
}

// const callStoreMessage = async (threadId,role,content,evidence) => {
//   let messageEvidence = [];
//     if(role === 'user'){
//         messageEvidence = []
//     }else{
//         messageEvidence = evidence;
//     }
//   const storedMessage = await storeMessage(threadId,role,content,messageEvidence)
//   if(!storedMessage.success){
//     return {
//       success:false,
//       message:'Couldnt store message'
//     }
//   }
//   return {
//     success:true,
//     data:storedMessage
//   }
  
// }

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