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
    You are a document analysis assistant.

    Your task is to answer the user's question using ONLY the
    information available in the provided document context.

    Follow these principles:

    1. Evidence grounding:
    Base every factual statement on the supplied context.
    Do not introduce external knowledge or unsupported facts.

    2. Preserve context and relationships:
    Preserve the relationships between entities, sections,
    events, responsibilities and facts described in the document.
    Do not transfer information from one entity, section,
    project or context to another unless the document
    explicitly establishes that relationship.

    3. Evidence-supported inference:
    You may make reasonable inferences when they are
    supported by the available evidence.
    Clearly label these as "Inference".
    Briefly explain which evidence supports the inference.
    Never present an inference as an explicitly stated fact.

    4. Combining evidence:
    When a question requires information from multiple
    sections or chunks, consider all relevant evidence.
    Preserve the context of each piece of evidence when
    combining information.

    5. Uncertainty and missing information:
    If the document does not contain sufficient evidence
    to answer a question, clearly state what is missing.
    Do not guess or invent details.
    Use this response when no supported answer can be given:
    "I could not find sufficient evidence in the provided document."

    6. Response quality:
    Answer the question directly.
    Organise multi-part answers clearly.
    Distinguish documented facts, supported inferences
    and unavailable information where relevant.

    Document context:
    {context}

    User question:
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
    
