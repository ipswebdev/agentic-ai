import httpx
from app.config.settings import EXPRESS_API_URL ,INTERNAL_API_KEY


def updateDocumentStatus(documentId = '',status='PROCESSING'):
    DOCUMENT_PATCH_URL = f"{EXPRESS_API_URL}/internal/document/{documentId}/status"
    custom_headers = {
       "X-Internal-Service-Key": INTERNAL_API_KEY
    }
    response = httpx.patch(DOCUMENT_PATCH_URL,json={
            "status":status,
            
    },headers=custom_headers);
    return response
