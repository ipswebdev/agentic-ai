const {AppException} = require('./base.exception.js');

class RepositoryException extends AppException {}
class DocumentFetchException extends RepositoryException {}
class DocumentUpdateException extends RepositoryException {}
class DocumentSaveException extends RepositoryException {}
class DocumentUploadException extends RepositoryException {}

module.exports = {RepositoryException, DocumentFetchException, DocumentUpdateException, DocumentSaveException, DocumentUploadException};