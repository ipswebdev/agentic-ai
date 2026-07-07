const {
    FASTAPI_URL,
} = require("../config/env");
const chatHistory = [
  {
    id: 1,
    message: 'Hello'
  },
  {
    id: 2,
    message: 'What is RAG?'
  }
]

const processMessage = ({
   message,
}) => {
    const extractedMessage = message ? message : "No Message";
    return extractedMessage;
}

const getAIAnswer = async (message,documentId) => {
  const uri = 'generate-answer'
  const baseUrl = `${FASTAPI_URL}/${uri}`
  const payload = JSON.stringify({
    message: message,
    "documentId":documentId 
  })
  try{
    const aiMessage = await fetch(
      baseUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload
      }
    );
    
    const data = await aiMessage.json()
    if(data && data.answer && data.matches && data.matches.length){
      return  {
      success:true, 
      answer:data.answer
      }
    }else{
      return  {
      success:false, 
      answer:'Couldnt get AI Response'
    }
    }
    
  }catch(error){
    return {
      success:false,
      answer:'Couldnt get AI Response'
    } 
  }
  
}

module.exports = {
    chatHistory,
    processMessage,
    getAIAnswer
}