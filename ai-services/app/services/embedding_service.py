from google import genai
from app.config.settings import GEMINI_API_KEY

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
        print(
            "Gemini 2.5 Flash failed:",
            err1
        )
        try:
            response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
            )
            return response.text
        except Exception as err2:
            print(
                "Gemini 2.0 Flash failed:",
                err2
            )
            raise AIModelUnavailableException("AI Model Currently unavailable. Try after sometime.") from err2
    
