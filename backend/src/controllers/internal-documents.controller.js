const { updateDocumentStatusInternally } = require("../repositories/document.repository");


const internalDocStatusUpdate =  async (req,res) => {
  const {id} = {...req.params};
  const status = req.body.status;
    console.log('internalDocStatus',id,status)
  try{
    const userDoc = await updateDocumentStatusInternally(id,status);
    console.log('internalDocStatus try',userDoc)
    if(userDoc?.document){
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