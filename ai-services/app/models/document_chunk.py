from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field

class ChunkStatus(str, Enum):
    PENDING = "PENDING"
    EMBEDDED = "EMBEDDED"
    FAILED = "FAILED"

class DocumentChunk(BaseModel):
    documentId: str
    chunkNumber: int
    text: str

    status: ChunkStatus = ChunkStatus.PENDING

    createdAt : datetime = Field(default_factory = datetime.utcnow)
    updatedAt : datetime = Field(default_factory = datetime.utcnow)
