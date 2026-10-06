const { createDocument,fetchDocument, updateDocumentStatusbyId, fetchAllDocuments, deleteDocument } = require("../repositories/document.repository");
const {logger} = require("../config/logger");
const {
    FAST_API_URL
} = require("../config/env");
const { DocumentProcessingException } = require("../exceptions/service.exception");

const extractFileDetails =  (file) => {
  const fileDetails = {
      fileName:file.originalname,
      mimeType:file.mimetype,
      size:file.size,
      filePath:file.path
    };
    return fileDetails;
}

const deleteDocumentFromMongo = async (id,userId) => {
  try{
    const deletedDoc = await deleteDocument(id,userId);
    if (!deletedDoc) {
      return {
          success: false,
          message: 'Document not found'
        };
    }
    return {
      success: true,
      document: deletedDoc
    };
  }
  catch(err){
    logger.error('Error Deleting document status',err);
    throw err;
  }
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
   file,userId
    }) => {
      try{
        if(!userId){
          throw new Error('User not found for documentCreation') 
        }
        const uploadedFile = extractFileDetails(file)
        const createdDocument = await createDocument({...uploadedFile,userId:userId}); 
      
        const res = {
          documentId: createdDocument._id.toString(),
          filePath: createdDocument.filePath
        }
        return res;
      }catch(err){
        logger.error('Error uploading document',err);
          throw err;
      }
}

const fetchDocumentById = async (id,userId) => {
    const doc = await fetchDocument(id,userId);
    if (!doc) {
      return {
          success: false,
          message: 'Document not found'
        };
    }
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
     
    return {
      success: true,
      document: docModification
    };
}

const fetchDocuments = async (userId) => {
  try{
    const docs = await fetchAllDocuments(userId);
    // console.log('fetch!',docs)
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
      throw err;
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

const updateDocumentStatus = async (id,status,userId) => {
  if(!isStatusValid(status)){
    return {
      success: false,
      document: null,
      message: 'Status not correct!'
    };
  }
  try{
    const updatedDoc = await updateDocumentStatusbyId(id, status,userId);
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
    throw err;
  }
  
}

module.exports = {
    processDocumentUpload,
    fetchDocumentById,
    extractFileDetails,
    updateDocumentStatus,
    fetchDocuments,
    processDocumentData,
    deleteDocumentFromMongo
}