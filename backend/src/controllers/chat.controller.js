const { json } = require("body-parser");
const { chatHistory,processMessage, getAIAnswer } = require("../services/chat.service");

const sendMessage = async  (req, res) =>  {
  const message = processMessage(req.body);
  const {documentId} = req.body
  const data = await getAIAnswer(message,documentId);
  const response = await data.data.answer
  return res.json({answer:response,success:data.success})
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