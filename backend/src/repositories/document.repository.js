const { Document } = require('../models/document.model')
const { DocumentSaveException, DocumentFetchException, DocumentUpdateException } = require('../exceptions/repository.exception')
const {logger} = require('../config/logger')
const createDocument = async (documentData) => {
    try{
        const res = await Document.create(documentData);
        return res; 
    }catch(err){
        logger.error('Error saving document',err);
        throw new DocumentSaveException("Unable to save document.");
    }
}

const fetchDocument = async (id) => {
    try{
        const res = await Document.findById(id);
        console.log('fetchDoc',res,)
        return res;
    }catch(err){
        logger.error('Error fetching document',err);
        throw new DocumentFetchException("Unable to fetch document.");
    }
}

const fetchAllDocuments = async () => {
    try{
        const res = await Document.find({});
        return res; 
    }catch(err){
        logger.error('Error fetching documents',err);
        throw new DocumentFetchException("Unable to fetch document.");
    } 
}

const updateDocumentStatusbyId = async (id,status) => {
    try{
        const res = await Document.findByIdAndUpdate(id,{status:status},{new: true});
        return res;
    }catch(err){
        logger.error('Error updating document status',err);
        throw new DocumentUpdateException("Unable to update document status.");
    }
    
}

module.exports = {
  createDocument,
  fetchDocument,
  updateDocumentStatusbyId,
  fetchAllDocuments
};