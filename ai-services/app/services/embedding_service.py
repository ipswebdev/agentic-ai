from google import genai
from app.config.settings import GEMINI_API_KEY
import app.config.logger

import logging

logger = logging.getLogger(__name__)
class AIModelUnavailableException(Exception):
    pass

client = genai.Client(api_key=GEMINI_API_KEY)
def generate_embedding(text):
    response = client.models.embed_content(
        model="gemini-embedding-2",
        contents=text
    )
    return response

def get_answer(question,context):
    prompt = f"""
        You are a document assistant.

        Answer the user's question using ONLY the provided context.

        If the answer is not present in the context, say:
        'I could not find the answer in the provided document.'

        Context:
        {context}

        Question:
        {question}
    """
    try:
        response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
        )
        return response.text
    except Exception as err1:
        logger.exception(
            "Gemini 2.5 Flash failed:"
        )
        try:
            response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
            )
            return response.text
        except Exception as err2:
            logger.exception(
                "Gemini 2.0 Flash failed:"
            )
            raise AIModelUnavailableException("AI Model Currently unavailable. Try after sometime.") from err2
    
