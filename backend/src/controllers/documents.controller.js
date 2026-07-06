const { json } = require("body-parser");
const { fetchDocument, processDocumentUpload, extractFileDetails,fetchDocumentById,updateDocumentStatus, fetchDocuments,processDocumentData } = require("../services/documents.service");

const uploadDocument = async  (req, res) =>  {
  console.log(req.file)
  const data = await processDocumentUpload({file:req.file});
  return res.json(data)
}

const getDocument = async (req,res) => {
  const {id} = {...req.params};
  const userDoc = await fetchDocumentById(id);
    res.json({
    ...userDoc,
  });
}

const processDocument = async (req,res) => {
  const {id} = {...req.params};
  const userDoc = await fetchDocumentById(id);
  
  if(userDoc.success){
    if(userDoc.document.status === 'READY'){
      res.status(200).json({
        success:userDoc.success,
        "documentId": userDoc.document._id,
    });
    }else{
      console.log('processDoc proccessingCall',userDoc)
      const processedDoc = await processDocumentData(id,userDoc.document.filePath)
       res.status(200).json({
      ...processedDoc,
    });
    }
  }else{
    res.status(400).json({
      success:false,
      message:'No Such Document Exists'
    });
  }
}

const getDocuments = async (req,res) => {
  const userDocs = await fetchDocuments();
    res.json({
    ...userDocs,
  });
}

const changeDocumentStatus = async (req,res) => {
  const {id} = {...req.params};
  const status = req.body.status;
  const userDoc = await updateDocumentStatus(id,status);
  return res.json(userDoc)
}

module.exports = {
  uploadDocument,
  getDocument,
  getDocuments,
  changeDocumentStatus,
  processDocument
}