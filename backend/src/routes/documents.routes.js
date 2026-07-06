const {getDocument,uploadDocument,changeDocumentStatus, getDocuments,processDocument} = require('../controllers/documents.controller')

const express = require('express');
const documentRouter = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

documentRouter.post('/upload',upload.single('file'), uploadDocument)
documentRouter.get('/:id',getDocument)
documentRouter.post('/:id/process-document',processDocument)
documentRouter.get('/',getDocuments)
documentRouter.patch('/:id',changeDocumentStatus)


module.exports = {
    documentRouter
}