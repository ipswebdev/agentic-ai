const { fetchDocument, processDocumentUpload, extractFileDetails,fetchDocumentById,updateDocumentStatus, fetchDocuments,processDocumentData } = require("../services/documents.service");
const {success,failure} = require("../utils/response.utils")
const {parse} = require('path');
const {DocumentProcessingException} = require("../exceptions/service.exception");
const { DocumentFetchException,DocumentUpdateException,DocumentSaveException} = require("../exceptions/repository.exception");
const {logger} = require("../config/logger");
const  { unlink } = require("fs/promises");

const uploadDocument = async  (req, res) =>  {
  const MB_VALUE = 10
  const MAX_FILE_SIZE = MB_VALUE * 1024 * 1024;
  if(!req.file){
    logger.error('File not present in the request');
    return failure(res,`File Not Present!Check the uploaded file`,400)
  }
  const file = req.file;
  const {ext} = (parse(file.originalname))
  if(file.size > MAX_FILE_SIZE){
    logger.error(`File Size more than ${MB_VALUE} MB. Upload a file less than ${MB_VALUE} MB`);
    return failure(res,`File Size more than ${MB_VALUE} MB. Upload a file less than ${MB_VALUE} MB`,415)
  }
  if(file.mimetype !== "application/pdf" || ext.toLowerCase() !== '.pdf') {
      logger.error('File should be a pdf');
      return failure(res,`File should be a pdf`,415)
  }
  try{
    const data = await processDocumentUpload({file:req.file});
    return success(res,data,'Upload Successful!',200)
  }catch(err){
    if(err instanceof DocumentSaveException){
        logger.error('Error saving document to database',err);
        return failure(res,err.message,500)
    }
    logger.error('Error saving document to database',err);
    return failure(res,"Error uploading file",500)
  }
  
}

const getDocument = async (req,res) => {
  const {id} = {...req.params};
  try{
    const userDoc = await fetchDocumentById(id);
    const d = userDoc.document
    return success(res,d,'Successfully fetched document',200)
  }catch(err){
    logger.error('Error fetching document',err);
    if(err instanceof DocumentFetchException){
      return failure(res,err.message,500)
    }
    return failure(res,'Error fetching document',500)
  }
}

const deleteDocument = async (req,res) => {
  const {id} = {...req.params};
  const userDoc = await fetchDocumentById(id);
  const d = userDoc.document;
  console.log('deleteDoc',d)
  deleteDocumentFromDisk(d.filePath)
  return success(res,d,'Successfully fetched document',200)
}

const deleteDocumentFromDisk = async function deleteFile(path) {
  try {
    console.log(`deleteDocumentFromDisk ${path}`);
    const result = await unlink(path);
    console.log(`Successfully deleted ${path}`,result);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
}

const processDocument = async (req,res) => {
  const {id} = {...req.params};
  try{
    const userDoc = await fetchDocumentById(id);
  
  if(userDoc.success){
    if(userDoc.document.status === 'READY'){
      deleteDocumentFromDisk(userDoc.document.filePath)
      return success(res,{
          "documentId": userDoc.document.id,
      },'Document already processsed!',200)
    }else{
      console.log('Doc',id,userDoc.document.filePath)
      const processedDoc = await processDocumentData(id,userDoc.document.filePath)
      if(processedDoc?.documentId && processedDoc.success){
        deleteDocumentFromDisk(userDoc.document.filePath)
        return success(res,{
                documentId:processedDoc.documentId
                },
                'Document processsed!',200
              )
      }else{
        logger.error('Error processing document',processedDoc?.message);
        deleteDocumentFromDisk(userDoc.document.filePath)
        return failure(res,processedDoc?.message,500)
      }
    }
  }else{
    logger.error('No such document exists',userDoc?.message);
    return failure(res,'No such document exists',404)
  }
  }catch(err){
    logger.error('Error processing document',err);
    if(err instanceof DocumentFetchException){
      return failure(res,err.message,500)
    }
    if(err instanceof DocumentProcessingException){
      return failure(res,err.message,500)
    }
    return failure(res,'Error processing document',500)
  }
}


const getDocuments = async (req,res) => {
  try{
    const userDocs = await fetchDocuments();
    const documents = userDocs.documents.map(d=>{
      return{
        id:d._id,
        fileName:d.fileName,
        filePath: d.filePath,
        mimeType: d.mimeType,
        size: d.size,
        status: d.status,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }
    })
    return success(res,{
      "documents":documents
    },'Fetched Documents successfully',200);
  }catch(err){
    logger.error('Error fetching documents',err);
    return failure(res,'Error fetching documents',500)
  }
}

const changeDocumentStatus = async (req,res) => {
  const {id} = {...req.params};
  const status = req.body.status;
  try{
    const userDoc = await updateDocumentStatus(id,status);
    const d = userDoc.document;
    return success(res,{document:{
        id:d._id,
        fileName:d.fileName,
        filePath: d.filePath,
        mimeType: d.mimeType,
        size: d.size,
        status: d.status,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }},
      'Updated Document Status',200
    )
  }catch(err){
    logger.error('Error updating document status',err);
    if(err instanceof DocumentUpdateException){
      return failure(res,err.message,500)
    }
    return failure(res,'Error updating document status',500)
  }
  
}

module.exports = {
  uploadDocument,
  getDocument,
  getDocuments,
  changeDocumentStatus,
  processDocument,
  deleteDocument
}