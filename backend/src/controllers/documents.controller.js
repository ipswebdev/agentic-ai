const { json } = require("body-parser");
const { fetchDocument, processDocumentUpload, extractFileDetails,fetchDocumentById,updateDocumentStatus, fetchDocuments,processDocumentData } = require("../services/documents.service");
const {success,failure} = require("../utils/response.utils")
const {parse} = require('path');

const uploadDocument = async  (req, res) =>  {
  const MB_VALUE = 10
  const MAX_FILE_SIZE = MB_VALUE * 1024 * 1024;
  if(!req.file){
    return failure(res,`File Not Present!Check the uploaded file`,400)
  }
  const file = req.file;
  console.log(req.file);
  const {ext} = (parse(file.originalname))
  if(file.size > MAX_FILE_SIZE){
    return failure(res,`File Size more than ${MB_VALUE} MB. Upload a file less than ${MB_VALUE} MB`,415)
  }
  if(file.mimetype !== "application/pdf" || ext.toLowerCase() !== '.pdf') {
      return failure(res,`File should be a pdf`,415)
  }
  const data = await processDocumentUpload({file:req.file});
  // setTimeout(()=>{
  //   return success(res,data,'Upload Successful!',200)
  // },5000)
  return success(res,data,'Upload Successful!',200)
}

const getDocument = async (req,res) => {
  const {id} = {...req.params};
  const userDoc = await fetchDocumentById(id);
  const d = userDoc.document
  return success(res,d,'Successfully fetched document',200)
}

const processDocument = async (req,res) => {
  const {id} = {...req.params};
  const userDoc = await fetchDocumentById(id);
  
  if(userDoc.success){
    if(userDoc.document.status === 'READY'){
      return success(res,{
          "documentId": userDoc.document.id,
      },'Document already processsed!',200)
    }else{
      const processedDoc = await processDocumentData(id,userDoc.document.filePath)
      console.log('processDoc',processedDoc)
      if(processedDoc?.documentId && processedDoc.success){
        return success(res,{
                documentId:processedDoc.documentId
                },
                'Document processsed!',200
              )
      }else{
        return failure(res,processedDoc?.message,500)
      }
      
    }
  }else{
    return failure(res,'No such document exists',404)
  }
}

const getDocuments = async (req,res) => {
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
}

const changeDocumentStatus = async (req,res) => {
  const {id} = {...req.params};
  const status = req.body.status;
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
}

module.exports = {
  uploadDocument,
  getDocument,
  getDocuments,
  changeDocumentStatus,
  processDocument
}