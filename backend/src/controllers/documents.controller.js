const { json } = require("body-parser");
const { fetchDocument, processDocumentUpload, extractFileDetails,fetchDocumentById,updateDocumentStatus, fetchDocuments,processDocumentData } = require("../services/documents.service");
const {success,failure} = require("../utils/response.utils")

const uploadDocument = async  (req, res) =>  {
  console.log(req.file)
  const data = await processDocumentUpload({file:req.file});
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
      if(processedDoc?.data?.documentId && processedDoc?.data?.success){
        return success(res,{
                documentId:processedDoc.data.documentId
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