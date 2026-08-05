const { createDocument,fetchDocument, updateDocumentStatusbyId, fetchAllDocuments } = require("../repositories/document.repository");
const { DocumentProcessingException } = require("../exceptions/service.exception");
const {DocumentUploadException} = require("../exceptions/repository.exception")
const {logger} = require("../config/logger");
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
  try{
    const res = await fetch(`${FAST_API_URL}/process-document`,{
      method:'POST',
      body:JSON.stringify(payload),
      headers: {
              "Content-Type": "application/json"
      },
    })
    const data = await res.json()
    return data;
  }catch(err){
    logger.error('Error processing document data',err);
    throw new DocumentProcessingException('Error processing document data');
  }
}

const processDocumentUpload = async ({
   file,
    }) => {
      try{
        const uploadedFile = extractFileDetails(file)
        const createdDocument = await createDocument(uploadedFile); 
      
        const res = {
          documentId: createdDocument._id.toString(),
          filePath: createdDocument.filePath
        }
        return res;
      }catch(err){
        logger.error('Error uploading document',err);
        if(err instanceof DocumentSaveException){
          throw err;
        }
        throw new DocumentUploadException("Unable to upload document.");
      }
}

const fetchDocumentById = async (id) => {
  // try{
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
  // }catch(err){
  //   throw new DocumentFetchException(err);
  // }
}

const fetchDocuments = async () => {
  try{
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
  }catch(err){
    logger.error('Error fetching documents',err);
    if(err instanceof DocumentFetchException){
      throw new DocumentFetchException(err);
    }
  }
    
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
  if(!isStatusValid(status)){
    return {
      success: false,
      document: null,
      message: 'Status not correct!'
    };
  }
  try{
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
  catch(err){
    logger.error('Error updating document status',err);
    throw new DocumentUpdateException(err);
  }
  
}

module.exports = {
    processDocumentUpload,
    fetchDocumentById,
    extractFileDetails,
    updateDocumentStatus,
    fetchDocuments,
    processDocumentData
}