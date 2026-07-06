
from app.config.database import db
from app.models.document_chunk import DocumentChunk
def storeChunk(chunk:DocumentChunk):
    documentChunksCollection = db['documentchunks'];
    chunkData = chunk.model_dump()
    documentChunksCollection.insert_one(chunkData)
    return chunkData

def fetchChunkById(documentId:str):
    documentChunksCollection = db['documentchunks'];
    documentChunks = documentChunksCollection.find({
        "documentId": documentId
    })
    return list(documentChunks)

def updateChunkStatus(documentId:str,status):
    documentChunksCollection = db['documentchunks'];
    documentChunksCollection.update_many(
        {
            "documentId": documentId
        },
        {
            "$set": {
                "status": status
            }
        }
    )
    