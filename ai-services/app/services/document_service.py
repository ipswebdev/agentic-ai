import httpx
from app.config.settings import EXPRESS_API_URL

def updateDocumentStatus(documentId = '',status='PROCESSING'):
    DOCUMENT_PATCH_URL = f"{EXPRESS_API_URL}/documents/{documentId}"
    response = httpx.patch(DOCUMENT_PATCH_URL,json={
            "status":status 
    });
    return response
