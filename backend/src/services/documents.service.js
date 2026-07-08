const { createDocument,fetchDocument, updateDocumentStatusbyId, fetchAllDocuments } = require("../repositories/document.repository");

const {
    FAST_API_URL
} = require("../config/env");

const extractFileDetails =  (file) => {
  const fileDetails = {
      fileName:file.originalname,
      mimeType:file.mimetype,
      size:file.size,
      filePath:file.path
    };
    return fileDetails;
}

const processDocumentData = async (id,filePath) => {
  const payload = {
    documentId :id,
    filePath : filePath
  }
  const res = await fetch(`${FAST_API_URL}/process-document`,{
    method:'POST',
    body:JSON.stringify(payload),
    headers: {
            "Content-Type": "application/json"
    },
  })
  const data = await res.json()
  return data;
}

const processDocumentUpload = async ({
   file,
    }) => {
      const uploadedFile = extractFileDetails(file)
      const createdDocument = await createDocument(uploadedFile); 
    
      const res = {
        documentId: createdDocument._id.toString(),
        filePath: createdDocument.filePath
      }
    return res;
}

const fetchDocumentById = async (id) => {
    const doc = await fetchDocument(id);
    const docModification = {
      id: doc._id,
      fileName: doc.fileName,
      filePath: doc.filePath,
      mimeType: doc.mimeType,
      size: doc.size,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
     if (!doc) {
      return {
          success: false,
          message: 'Document not found'
        };
    }
    return {
      success: true,
      document: docModification
    };
}

const fetchDocuments = async () => {
    const docs = await fetchAllDocuments();
    console.log('fetch!',docs)
     if (!docs?.length) {
      return {
          success: true,
          documents:[],
          message: 'No Documents not found'
        };
    }
    return {
      success: true,
      documents: docs
    };
}

const isStatusValid = (status) => {
  const isValid = [
        'UPLOADED',
        'PROCESSING',
        'READY',
        'FAILED'
      ].includes(status)
  return isValid;    
} 

const updateDocumentStatus = async (id,status) => {
  ('updateDocumentStatus',status,isStatusValid());
  if(!isStatusValid(status)){
    return {
      success: false,
      document: null,
      message: 'Status not correct!'
    };
  }
  const updatedDoc = await updateDocumentStatusbyId(id, status);
  if (!updatedDoc) {
      return {
          success: false,
          message: 'Document not found'
        };
    }
    return {
      success: true,
      document: updatedDoc
    };
}

module.exports = {
    processDocumentUpload,
    fetchDocumentById,
    extractFileDetails,
    updateDocumentStatus,
    fetchDocuments,
    processDocumentData
}