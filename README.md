# Agentic AI – Intelligent Document Chat Platform

An AI-powered document chat platform that allows users to upload PDF documents, process them into semantic embeddings, and interact with them through natural language using Retrieval-Augmented Generation (RAG).

The application is built using a microservice architecture with **Next.js**, **Express.js**, **FastAPI**, and **MongoDB**, separating the user interface, API gateway, and AI processing pipeline into independent services.

---

## ✨ Features

### Document Management

- Upload PDF documents
- Automatic document processing
- Document status tracking
- Re-process failed documents
- Document metadata management

### AI Processing Pipeline

- PDF text extraction
- Intelligent text chunking
- Semantic embedding generation
- Embedding persistence
- Cosine similarity search
- Retrieval-Augmented Generation (RAG)

### Chat Experience

- Chat with uploaded documents
- Context-aware responses
- Automatic document selection
- Conversation interface
- Loading indicators
- Toast notifications

### Backend

- Express API Gateway
- Dedicated FastAPI AI service
- MongoDB persistence
- Exception handling
- Modular service architecture

---

# System Architecture

```text
                        ┌──────────────────────┐
                        │     Next.js UI       │
                        │   React + Tailwind   │
                        └──────────┬───────────┘
                                   │
                            REST API Calls
                                   │
                        ┌──────────▼───────────┐
                        │    Express Server    │
                        │  API Gateway Layer   │
                        └──────────┬───────────┘
                                   │
                    Process Document / Chat APIs
                                   │
                        ┌──────────▼───────────┐
                        │    FastAPI Service   │
                        │ AI Processing Engine │
                        └──────────┬───────────┘
                                   │
              ┌────────────────────┴──────────────────┐
              │                                       │
      ┌───────▼────────┐                  ┌───────────▼──────────┐
      │    MongoDB     │                  │      Gemini API      │
      │ Documents      │                  │ Embeddings & Chat    │
      │ Chunks         │                  └──────────────────────┘
      │ Embeddings     │
      └────────────────┘
```

---

# RAG Pipeline

```text
               Upload PDF
                    │
                    ▼
            Extract Document Text
                    │
                    ▼
             Generate Chunks
                    │
                    ▼
             Store Chunks
                    │
                    ▼
          Generate Embeddings
                    │
                    ▼
         Store Embeddings (MongoDB)

────────────────────────────────────────────

              User Question
                    │
                    ▼
     Generate Question Embedding
                    │
                    ▼
        Cosine Similarity Search
                    │
                    ▼
          Retrieve Top Chunks
                    │
                    ▼
        Gemini Chat Model (RAG)
                    │
                    ▼
               Final Response
```

---

# Repository Structure

```text
agentic-ai/

├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── repositories/
│   ├── services/
│   └── uploads/
│
├── ai-services/
│   ├── app/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── config/
│   │   └── main.py
│   └── requirements.txt
│
└── README.md
```

---

# Technology Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- JavaScript *(TypeScript migration planned)*

## Backend

- Node.js
- Express.js
- Multer

## AI Service

- FastAPI
- Python
- PyPDF
- Google Gemini API

## Database

- MongoDB

---

# Project Workflow

```text
User uploads PDF
        │
        ▼
Express stores document metadata
        │
        ▼
FastAPI extracts PDF text
        │
        ▼
Chunks are generated
        │
        ▼
Chunks stored in MongoDB
        │
        ▼
Embeddings generated
        │
        ▼
Embeddings stored
        │
        ▼
Document marked READY
        │
        ▼
User can begin chatting
```

---

# Running the Project

## Clone

```bash
git clone https://github.com/ipswebdev/agentic-ai.git

cd agentic-ai
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## Express Backend

```bash
cd backend

npm install

npm run dev
```

Runs on:

```
http://localhost:3001
```

---

## FastAPI Service

```bash
cd ai-services

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Runs on:

```
http://127.0.0.1:8000
```

---

# Environment Variables

Create the appropriate `.env` files before running the application.

Typical variables include:

```text
MONGO_URI=

GEMINI_API_KEY=

NEXT_PUBLIC_API_URL=

FASTAPI_URL=
```

---

# Current Capabilities

- ✅ Upload PDF documents
- ✅ Process documents
- ✅ Chunk generation
- ✅ Embedding generation
- ✅ Semantic search
- ✅ Chat with documents
- ✅ Document status management
- ✅ Automatic document refresh
- ✅ Modular backend architecture
- ✅ Exception handling and recovery

---

# Planned Enhancements

- Frontend TypeScript migration
- JWT authentication
- Multi-document retrieval
- Batch embedding generation
- Streaming AI responses
- Source citations
- Background document processing
- Docker Compose
- CI/CD pipeline
- Unit & integration tests

---

# Why This Project?

This project was built to explore the practical implementation of modern AI application architecture, including:

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Embedding Models
- AI Platform Engineering
- FastAPI microservices
- Express API Gateway design
- MongoDB data modeling
- Production-oriented AI workflows

Rather than relying on an end-to-end AI framework, the project intentionally implements the complete RAG pipeline manually to better understand each stage of document ingestion, embedding generation, retrieval, and response generation.

---

# Author

**Pranay Sawant**

Software Engineer • AI Platform Engineer

GitHub: https://github.com/ipswebdev