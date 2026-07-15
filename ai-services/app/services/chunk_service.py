from app.models.document_chunk import DocumentChunk
import app.config.logger

import logging

logger = logging.getLogger(__name__)
def generateChunkText(text,chunkSize,overlap):
    stride = chunkSize - overlap
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), stride):
        endIndex = i + chunkSize
        chunks.append(" ".join(words[i:endIndex]))
    return chunks

def createChunks(text,documentId,chunkSize=5,overlap=2):
    chunks = generateChunkText(text,chunkSize,overlap)
    logger.info('createChunks %d',len(chunks))
    documentChunks = []
    for i in range(0, len(chunks)):
        documentChunk = DocumentChunk(
            text = chunks[i],
            documentId=documentId,
            chunkNumber=i,
            )
        documentChunks.append(documentChunk)   
    return documentChunks

