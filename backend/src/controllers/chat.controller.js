const { json } = require("body-parser");
const { chatHistory,processMessage, getAIAnswer } = require("../services/chat.service");

const sendMessage = async  (req, res) =>  {
  const message = processMessage(req.body);
  const {documentId} = req.body
  const data = await getAIAnswer(message,documentId);
  const answer = await data.answer
  if(answer && data.success){
    return res.status(200).json({answer:answer,success:data.success})
  }
  return res.status(400).json({answer:answer,success:data.success})
  
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