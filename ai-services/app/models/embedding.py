from datetime import datetime
from pydantic import BaseModel, Field


class DocumentEmbedding(BaseModel):
    chunkId: str
    text: str
    documentId: str
    embedding: list[float]

    createdAt : datetime = Field(default_factory = datetime.utcnow)