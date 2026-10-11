const { updateDocumentStatusInternally } = require("../repositories/document.repository");
const {logger} = require('../config/logger')
const {success,failure} = require('../utils/response.utils');
const { DocumentUpdateException } = require("../exceptions/repository.exception");

const internalDocStatusUpdate =  async (req,res) => {
  const {id} = {...req.params};
  const status = req?.body?.status;

  try{
    const userDoc = await updateDocumentStatusInternally(id,status);
    console.log('updateDocumentStatusInternally',userDoc)
    if(userDoc && userDoc?._id){
      const docModification = {
        id: userDoc._id,
        fileName: userDoc.fileName,
        filePath: userDoc.filePath,
        mimeType: userDoc.mimeType,
        size: userDoc.size,
        status: userDoc.status,
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
      }
      return success(res,docModification,'successfully updated',200);
    }else{
       return  failure(res,'No document found',404)
    }  
  }catch(err){
    logger.error('Error updating document status',err);
    if(err instanceof DocumentUpdateException){
      return failure(res,err.message,500)
    }
    return failure(res,'Error updating document status',500)
  }
  
}

module.exports = {
    internalDocStatusUpdate
}