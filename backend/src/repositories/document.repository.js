const { Document } = require('../models/document.model')

const createDocument = async (documentData) => {
    const res = await Document.create(documentData);
    return res; 
}

const fetchDocument = async (id) => {
    const res = await Document.findById(id);
    console.log('fetchDoc',res,)
    return res; 
}

const fetchAllDocuments = async () => {
    const res = await Document.find({});
    return res; 
}

const updateDocumentStatusbyId = async (id,status) => {
    const res = await Document.findByIdAndUpdate(id,{status:status},{new: true});
    return res;
}

module.exports = {
  createDocument,
  fetchDocument,
  updateDocumentStatusbyId,
  fetchAllDocuments
};