from app.config.database import db
from app.models.embedding import DocumentEmbedding
def storeEmbedding(data: DocumentEmbedding):
    embeddingsCollection = db["documentEmbeddings"]
    embeddingData = data.model_dump()
    embeddedDocument = embeddingsCollection.insert_one(embeddingData)
    return embeddedDocument
def storeDocEmbeddings(data):
    embeddingsCollection = db["documentEmbeddings"]
    embeddedDocuments = embeddingsCollection.insert_many(data)
    return embeddedDocuments.inserted_ids

def fetchEmbeddingsByDocId(docId):
    embeddingsCollection = db["documentEmbeddings"]
    documentEmbeddings = embeddingsCollection.find({
        "documentId": docId
    })
    return list(documentEmbeddings)