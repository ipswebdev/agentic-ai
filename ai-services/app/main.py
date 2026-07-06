from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from pathlib import Path

from app.config.database import connectToDB

from app.repositories.chunk_repository import storeChunk ,updateChunkStatus,fetchChunkById
from app.repositories.embedding_repository import DocumentEmbedding,storeEmbedding,fetchEmbeddingsByDocId,storeDocEmbeddings

from app.services.document_service import updateDocumentStatus
from app.services.embedding_service import generate_embedding,get_answer
from app.services.chunk_service import generateChunkText,createChunks

import math

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db = connectToDB()
print('db',db)


class ChatRequest(BaseModel):
    message: str
    documentId: str


class DocumentMetadata(BaseModel):
    documentId: str
    filePath: str

class DocumentChunk(BaseModel):
    documentId: str
    chunkNumber: int
    chunk: str

class DocumentProcessingException(Exception):
    pass
class ChunkStorageException(DocumentProcessingException):
    pass
class EmbeddingStorageException(DocumentProcessingException):
    pass
class EmbeddingGenerationException(DocumentProcessingException):
    pass
class DocumentStorageException(DocumentProcessingException):
    pass
class PDFExtractionException(DocumentProcessingException):
    pass
class ChunkGenerationException(DocumentProcessingException):
    pass

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai-service"
    }
def getTextFromPdf(req):
    filePath = get_absolute_file_path(req.filePath)
    content = extractPDF(filePath)
    pages = content.pages
    extractedText = extractText(pages)
    return extractedText
def generateChunks(req):
    try:
        extractedText = getTextFromPdf(req)
        createdChunks = createChunks(extractedText,req.documentId,100,10)
        return createdChunks;
    except Exception as err:
        raise ChunkGenerationException("Chunk Creation Failed!") from err
        
def storeChunks(createdChunks):
    try:
        
        storedChunks = []
        for chunk in createdChunks:
            storedChunk = storeChunk(chunk)
            storedChunks.append(storedChunk)   
        return storedChunks        
    except Exception as err:
        raise ChunkStorageException("Chunk Storage Failed!") from err
        
def hasChunks(existingChunks):
        if(len(existingChunks)>0):
            return True
        return False
def embeddingsComplete(existingChunks,existingEmbeddings):
    if(len(existingChunks) > 0 and len(existingChunks) == len(existingEmbeddings)):
        return True
    return False
def markDocReady(docId):
    updateDocumentStatus(docId,"READY");
@app.post("/process-document")
def  process_document(req: DocumentMetadata):
    try:   
        existingChunks = fetchChunkById(req.documentId);
        docEmbeddings = getDocEmbeddings(req.documentId)
        chunksLength = 0;
        print("Chunks already exist",req.documentId,hasChunks(existingChunks))
        print("Embeddings complete",embeddingsComplete(existingChunks,docEmbeddings))
        if hasChunks(existingChunks) :   
            if(not embeddingsComplete(existingChunks,docEmbeddings)):
                updateDocumentStatus(req.documentId, "PROCESSING")
                generateAndStoreEmbeddings(existingChunks,req.documentId)
            chunksLength = len(existingChunks)
        else:
            updateDocumentStatus(
              req.documentId,
                "PROCESSING"
            );
            createdChunks = generateChunks(req)
            storedChunks = storeChunks(createdChunks)
            chunksLength = len(storedChunks)
            generateAndStoreEmbeddings(storedChunks,req.documentId)
        markDocReady(req.documentId)    
        return {
            "documentId": req.documentId,
            "success":True,
            "chunks":chunksLength
        }

    except DocumentProcessingException as err:
        print(err)

        updateDocumentStatus(
            req.documentId,
            "FAILED"
        )
        raise    
    # except PDFExtractionException as err:
    #     print(err)
        
    #     raise
    # except ChunkGenerationException as err:
    #     print(err)
        
    #     raise

    # except ChunkStorageException as err:
    #     print(err)

    #     raise 
    # except EmbeddingGenerationException as err:
    #     print(err)
        
    #     raise
    # except EmbeddingStorageException as err:
    #     print(err)
        
    #     raise
    # except Exception as err:
    #     print(err);
        
    #     updateDocumentStatus(
    #         req.documentId,
    #         "FAILED"
    #     )

@app.post("/generate-answer")
def generate_answer(req: ChatRequest):
    questionEmbedding = generate_embedding(req.message)
    docEmbeddings = getDocEmbeddings(req.documentId)
    qValues = questionEmbedding.embeddings[0].values
    cosineMatches = []
    for doc in  docEmbeddings:
        print(doc["chunkId"])
        cosValue = cosineSimilarity(qValues,doc["embedding"])
        match = {
            "text":doc["text"],
            "score":cosValue,
            "chunkId": doc["chunkId"]
        }
        cosineMatches.append(match)
    cosineMatches.sort(key=lambda x: x["score"],reverse=True)
    
    context = buildChatContext(cosineMatches[:3])
    answer = get_answer(req.message,context)
    return {
        "answer":answer,
        "matches" :  cosineMatches[:3]
    }

@app.get("/hello")
def hello():
    return {
        "message": "Hello from FastAPI"
    }



def getFile(path):
    with open(path, "rb") as file:
        content = file.read()
        return content


def extractPDF(path):
    try:
        reader = PdfReader(path)
        return reader
    except Exception as err:
        raise PDFExtractionException(f"Failed to extract PDF {path}") from err


def extractText(pages: list):
    text = ''
    for page in pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + ' '
    return text

def getDocEmbeddings(docId):
    return fetchEmbeddingsByDocId(docId);

def generateEmbeddings(chunks):
    generatedEmbeddings = []
    for storedChunk in chunks:
        generatedEmbedding = generate_embedding(storedChunk["text"])
        documentEmbedding = DocumentEmbedding(
            chunkId = str(storedChunk["_id"]),
            documentId = storedChunk["documentId"],
            text= storedChunk["text"],
            embedding= generatedEmbedding.embeddings[0].values
        )
        generatedEmbeddings.append(documentEmbedding.model_dump())
    return generatedEmbeddings 

def storeEmbeddings(embeddings):
    storeDocEmbeddings(embeddings)

def generateAndStoreEmbeddings(chunks,documentId):
    try:
        generatedEmbeddings = generateEmbeddings(chunks)
        storeEmbeddings(generatedEmbeddings)
        updateChunkStatus(
            documentId,
            "EMBEDDED"
        )
    except Exception as err:
        raise EmbeddingGenerationException('Embedding Generation failed') from err;

def buildChatContext(topMatches:list):
    context = '';
    for index, match in enumerate(topMatches):
        context+= (
            f"Chunk {index + 1}:\n"
            f"{match['text']}\n\n"
        )
    return context    
def get_absolute_file_path(relative_path):
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    file_path = BASE_DIR / "backend" / relative_path
    return file_path

def cosineSimilarity(vectorA, vectorB):
    dotProduct = sum(
        a * b
        for a, b in zip(vectorA, vectorB)
    )

    magnitudeA = math.sqrt(
        sum(a * a for a in vectorA)
    )

    magnitudeB = math.sqrt(
        sum(b * b for b in vectorB)
    )

    return (
        dotProduct /
        (magnitudeA * magnitudeB)
    )