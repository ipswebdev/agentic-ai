const {AppException} = require('./base.exception.js');

class RepositoryException extends AppException {}
class DocumentFetchException extends RepositoryException {}
class DocumentDeleteException extends RepositoryException {}
class DocumentUpdateException extends RepositoryException {}
class DocumentSaveException extends RepositoryException {}
class DocumentUploadException extends RepositoryException {}
class UserFetchByIdException extends RepositoryException {}
class UserSaveException extends RepositoryException {}
class UserFetchByGoogleSubException extends RepositoryException {}

module.exports = {RepositoryException, DocumentDeleteException,DocumentFetchException, DocumentUpdateException, DocumentSaveException, DocumentUploadException,UserFetchByGoogleSubException,UserSaveException,UserFetchByIdException};