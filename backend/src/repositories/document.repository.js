const { Document } = require('../models/document.model')
const { DocumentSaveException, DocumentFetchException, DocumentUpdateException,DocumentDeleteException } = require('../exceptions/repository.exception')
const {logger} = require('../config/logger')
const createDocument = async (documentData) => {
    try{
        console.log('createDoc',documentData)
        const res = await Document.create(documentData);
        return res; 
    }catch(err){
        logger.error('Error saving document',err);
        throw new DocumentSaveException("Unable to save document.");
    }
}

const fetchDocument = async (id,userId) => {
    try{
        const res = await Document.findOne({_id:id,userId:userId});
        return res;
    }catch(err){
        logger.error('Error fetching document',err);
        throw new DocumentFetchException("Unable to fetch document.");
    }
}

const fetchAllDocuments = async (userId) => {
    try{
        const res = await Document.find({userId:userId});
        return res; 
    }catch(err){
        logger.error('Error fetching documents',err);
        throw new DocumentFetchException("Unable to fetch document.");
    } 
}

const deleteDocument = async (id,userId) => {
    try{
        const res = await Document.findOneAndDelete({_id:id,userId:userId});
        return res;
    }catch(err){
        logger.error('Error Deleting document',err);
        throw new DocumentDeleteException("Unable to Delete document.");
    }
}


const updateDocumentStatusbyId = async (id,status,userId) => {
    try{
        const res = await Document.findOneAndUpdate({_id:id,userId:userId},{status:status},{new: true});
        return res;
    }catch(err){
        logger.error('Error updating document status',err);
        throw new DocumentUpdateException("Unable to update document status.");
    }
    
}

const updateDocumentStatusInternally = async (id,status,userId) => {
    try{
        const res = await Document.findOneAndUpdate({_id:id},{status:status},{new: true});
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
  fetchAllDocuments,
  deleteDocument,
  updateDocumentStatusInternally
};