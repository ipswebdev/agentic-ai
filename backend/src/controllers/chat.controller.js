const { chatHistory,processMessage, getAIAnswer } = require("../services/chat.service");
const {success,failure} = require('../utils/response.utils')
const {fetchDocumentById} = require('../services/documents.service')

const sendMessage = async  (req, res) =>  {
  const message = processMessage(req.body);
  const {documentId} = req.body
  const user = req?.user;
  if(!user || !user?.id){
    return failure(res,"No user found!",401)
  }
  if(!documentId){
    return failure(res,"Document ID missing!",404)
  }
  const documentDetails = await fetchDocumentById(documentId,user.id)
  if(!documentDetails?.success || !documentDetails?.document){
    return failure(res,"Unauthorized Document Access",404)
  }
  const data = await getAIAnswer(message,documentId);
  const answer = await data.answer
  const AnswerData = {
    answer:answer,
  }
  if(answer && data.success){
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