import httpx
EXPRESS_API_URL = 'http://localhost:3001'


def updateDocumentStatus(documentId = '',status='PROCESSING'):
    DOCUMENT_PATCH_URL = f"{EXPRESS_API_URL}/documents/{documentId}"
    response = httpx.patch(DOCUMENT_PATCH_URL,json={
            "status":status 
    });
    return response
