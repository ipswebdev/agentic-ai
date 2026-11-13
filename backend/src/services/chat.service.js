const {
    FAST_API_URL,
} = require("../config/env");
const {success,failure} = require('../utils/response.utils')

const processMessage = ({
   message,
}) => {
    const extractedMessage = message?.trim() ? message : "No Message";
    return extractedMessage;
}

const getAIAnswer = async (message,documentId) => {
  const uri = 'generate-answer'
  const baseUrl = `${FAST_API_URL}/${uri}`
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
      answer:data.answer,
      matches: data.matches
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
    processMessage,
    getAIAnswer
}