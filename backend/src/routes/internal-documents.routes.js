const express = require('express');
const { internalDocStatusUpdate } = require('../controllers/internal-documents.controller');
const internalDocumentRouter = express.Router();


internalDocumentRouter.patch('/document/:id/status',internalDocStatusUpdate)


module.exports = {
    internalDocumentRouter
}