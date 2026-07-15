

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pypdf import PdfReader
import logging
from pathlib import Path

from app.config.database import DbConnectionException, connectToDB
from app.config import logger

from app.repositories.chunk_repository import storeChunk, updateChunkStatus, fetchChunkById
from app.repositories.embedding_repository import DocumentEmbedding, storeEmbedding, fetchEmbeddingsByDocId, storeDocEmbeddings

from app.services.document_service import updateDocumentStatus
from app.services.embedding_service import generate_embedding, get_answer, AIModelUnavailableException
from app.services.chunk_service import generateChunkText, createChunks

import math

logger = logging.getLogger(__name__)

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

class AnswerGenerationException(Exception):
    pass

class RepositoryException(Exception):
    pass
class DocumentStatusUpdateException(DocumentProcessingException):
    pass


class ChunkStorageException(DocumentProcessingException):
    pass


class EmbeddingStorageException(DocumentProcessingException):
    pass

class EmbeddingGenerationException(DocumentProcessingException):
    pass

class CosineSimilarityException(AnswerGenerationException):
    pass

class ChatContextException(AnswerGenerationException):
    pass

class QuestionEmbeddingGenerationException(AnswerGenerationException):
    pass


class DocumentStorageException(DocumentProcessingException):
    pass


class PDFExtractionException(DocumentProcessingException):
    pass

class DocEmbeddingsFetchException(RepositoryException):
    pass

class ChunkGenerationException(DocumentProcessingException):
    pass


try:
    db = connectToDB()
    logger.info("You successfully connected to MongoDB! %s",db);
except DbConnectionException as e:
    logger.exception("DbConnectionException : Connected to MongoDB Fail");


@app.get("/health")
def health():
    return {
        "success":True,
        "status": "ok",
        "service": "ai-service"
    }


def getTextFromPdf(req):
    try:
        filePath = get_absolute_file_path(req.filePath)
        content = extractPDF(filePath)
        pages = content.pages
        extractedText = extractText(pages)
    except Exception as err:
        raise PDFExtractionException(f"Failed to extract PDF {filePath}") from err
    if(len(pages) == 0):
        raise PDFExtractionException("No Pages")
    if(len(extractedText.strip()) == 0):
        raise PDFExtractionException("No Readable Text in PDF")
    return extractedText



def generateChunks(req):
    extractedText = getTextFromPdf(req);
    try:
        createdChunks = createChunks(extractedText, req.documentId, 100, 10)
        if len(createdChunks) == 0:
            raise ChunkGenerationException(
                "No chunks generated."
            )
        return createdChunks
    except ChunkGenerationException:
        raise
    except Exception as err:    
        raise ChunkGenerationException(f"Chunk Generation exception ${err}") from err

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
    if (len(existingChunks) > 0):
        return True
    return False


def embeddingsComplete(existingChunks, existingEmbeddings):
    if (len(existingChunks) > 0 and len(existingChunks) == len(existingEmbeddings)):
        return True
    return False


def markDocStatus(docId, status):
    try:
        updateDocumentStatus(docId, status)
    except Exception as err:
        raise DocumentStatusUpdateException('Mongo Error') from err


@app.post("/process-document")
def process_document(req: DocumentMetadata):
    try:
        existingChunks = fetchChunkById(req.documentId)
        docEmbeddings = getDocEmbeddings(req.documentId)
        chunksLength = 0
        logger.info("Chunks already exist %s %s", req.documentId, hasChunks(existingChunks))
        logger.info("Embeddings complete %s", embeddingsComplete(
            existingChunks, docEmbeddings))
        if hasChunks(existingChunks):
            if (not embeddingsComplete(existingChunks, docEmbeddings)):
                markDocStatus(req.documentId, "PROCESSING")
                generateAndStoreEmbeddings(existingChunks, req.documentId)
            chunksLength = len(existingChunks)
        else:
            logger.info("No Chunks")
            markDocStatus(req.documentId, "PROCESSING")
            createdChunks = generateChunks(req)
            storedChunks = storeChunks(createdChunks)
            if len(storedChunks) != len(createdChunks):
                raise ChunkStorageException('All Chunks Not Stored!')
            chunksLength = len(storedChunks)
            generateAndStoreEmbeddings(storedChunks, req.documentId)
        markDocStatus(req.documentId, "READY")
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "documentId": req.documentId,
                "chunks": chunksLength
            }
        )

    except RepositoryException as err:
        logger.exception('RepositoryException')
        return JSONResponse(
            status_code=500,
            content={"message": str(err), "success": False}
        )
    except DocumentProcessingException as err:
        logger.exception('DocumentProcessingException')
        try:
            markDocStatus(req.documentId, "FAILED")
        except DocumentStatusUpdateException as statusErr:
            logger.exception('DocumentStatusUpdateException')
        return JSONResponse(
            status_code=500,
            content={"message": str(err), "success": False}
        )
    except Exception as err:
        logger.exception('Unexpected Exception')
        try:
            markDocStatus(req.documentId, "FAILED")
        except Exception as statusErr:
            logger.exception('DocumentStatusUpdateException')
        return JSONResponse(
            status_code=500,
            content={"message": str(err), "success": False}
        )

def generateCosineSimilarity(questionEmbeddings,docEmbeddings):
    docEmbeddings = docEmbeddings
    qValues = questionEmbeddings
    cosineMatches = []
    for doc in docEmbeddings:
        cosValue = cosineSimilarity(qValues, doc["embedding"])
        match = {
            "text": doc["text"],
            "score": cosValue,
            "chunkId": doc["chunkId"]
        }
        cosineMatches.append(match)
    cosineMatches.sort(key=lambda x: x["score"], reverse=True)
    return cosineMatches


@app.post("/generate-answer")
def generate_answer(req: ChatRequest):
    try:
        questionEmbedding = generate_embedding(req.message)
        docEmbeddings = getDocEmbeddings(req.documentId)
        qValues = questionEmbedding.embeddings[0].values
        cosineMatches = generateCosineSimilarity(qValues,docEmbeddings)
        context = buildChatContext(cosineMatches[:3])
        answer  = get_answer(req.message, context)
        return JSONResponse(status_code=200,content={"success":True,"answer": answer,
            "matches":  cosineMatches[:3]})
    
    except AIModelUnavailableException as err:
        logger.exception("AI MODEL Error")
        return JSONResponse(status_code=500,content={"success":False,"message":str(err)})

    except AnswerGenerationException as err: 
        logger.exception("Err Generating Answer")
        return JSONResponse(status_code=500,content={"success":False,"message":str(err)})

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
    reader = PdfReader(path)
    if(reader.is_encrypted):
        raise PDFExtractionException("Encrypted PDF")
    return reader
    

def extractText(pages: list):
    text = ''
    for page in pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + ' '
    return text


def getDocEmbeddings(docId):
    try:
        return fetchEmbeddingsByDocId(docId)
    except Exception as err:
        raise DocEmbeddingsFetchException('Error Fetching Doc embeddings') from err


def generateEmbeddings(chunks):
    try:
        generatedEmbeddings = []
        for storedChunk in chunks:
            generatedEmbedding = generate_embedding(storedChunk["text"])
            documentEmbedding = DocumentEmbedding(
                chunkId=str(storedChunk["_id"]),
                documentId=storedChunk["documentId"],
                text=storedChunk["text"],
                embedding=generatedEmbedding.embeddings[0].values
            )
            generatedEmbeddings.append(documentEmbedding.model_dump())
        if(len(generatedEmbeddings) != len(chunks)):
            raise EmbeddingGenerationException(
            'Embeddings and Chunks not equal')
        return generatedEmbeddings
    except EmbeddingGenerationException:
        raise 
    except Exception as err:
        raise EmbeddingGenerationException(
        "Embedding Generation failed"
    ) from err


def storeEmbeddings(embeddings):
    try:
        return storeDocEmbeddings(embeddings)
    except Exception as err:
        raise EmbeddingStorageException('Embedding Storage Failed') from err


def generateAndStoreEmbeddings(chunks, documentId):
    generatedEmbeddings = generateEmbeddings(chunks)
    if(not len(chunks) == len(generatedEmbeddings)):
        raise EmbeddingGenerationException('Mismatch in count of Chunks and Embeddings')
    storedEmbeddings = storeEmbeddings(generatedEmbeddings)
    if(not len(storedEmbeddings) == len(generatedEmbeddings)):
        raise EmbeddingStorageException('Mismatch in storing all the generated Embeddings')
    logger.info('Stored Embeddings %d',len(storedEmbeddings))
    try: 
        updateChunkStatus(
            documentId,
            "EMBEDDED"
        )
    except Exception as err:
        raise EmbeddingStorageException("Failed to update Chunk Status") from err


def buildChatContext(topMatches: list):
    # try:
        context = ''
        for index, match in enumerate(topMatches):
            context += (
                f"Chunk {index + 1}:\n"
                f"{match['text']}\n\n"
            )
        return context
    # except Exception as err:
    #     raise ChatContextException("Error building Chat Context") from err


def get_absolute_file_path(relative_path):
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    file_path = BASE_DIR / "backend" / relative_path
    return file_path


def cosineSimilarity(vectorA, vectorB):
    # try:
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
    # except Exception as err:
    #     raise CosineSimilarityException('Failed to generate Cosine Similarity') from err 
