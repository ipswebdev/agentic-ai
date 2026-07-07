const { createDocument,fetchDocument, updateDocumentStatusbyId, fetchAllDocuments } = require("../repositories/document.repository");

const {
    FASTAPI_URL
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
  const res = await fetch(`${FASTAPI_URL}/process-document`,{
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
  console.log(createdDocument)
  const res = {
  success: true,
  message: "Upload successful",
  documentId: createdDocument._id,
  filePath: createdDocument.filePath
}
    return res;
}

const fetchDocumentById = async (id) => {
    const doc = await fetchDocument(id);
     if (!doc) {
      return {
          success: false,
          message: 'Document not found'
        };
    }
    return {
      success: true,
      document: doc
    };
}

const fetchDocuments = async () => {
    const docs = await fetchAllDocuments();
     if (!docs?.length) {
      return {
          success: false,
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