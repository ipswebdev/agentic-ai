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
  const baseUrl = `http://localhost:8000/${uri}`
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
    return  {
      success:true, 
      data:data
    }
  }catch(error){
    return {
      success:false,
      message:'Couldnt get AI Response'
    } 
  }
  
}

module.exports = {
    chatHistory,
    processMessage,
    getAIAnswer
}