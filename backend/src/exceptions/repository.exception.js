const {AppException} = require('./base.exception.js');

class RepositoryException extends AppException {}
class DocumentFetchException extends RepositoryException {}
class DocumentDeleteException extends RepositoryException {}
class DocumentUpdateException extends RepositoryException {}
class DocumentSaveException extends RepositoryException {}
class DocumentUploadException extends RepositoryException {}
class UserFetchByIdException extends RepositoryException {}

class ThreadFetchException extends RepositoryException {}
class ThreadDeleteException extends RepositoryException {}
class ThreadUpdateException extends RepositoryException {}
class ThreadSaveException extends RepositoryException {}

class MessageFetchException extends RepositoryException {}
class MessageDeleteException extends RepositoryException {}
class MessageUpdateException extends RepositoryException {}
class MessageSaveException extends RepositoryException {}


class UserSaveException extends RepositoryException {}
class UserFetchByGoogleSubException extends RepositoryException {}

module.exports = {MessageFetchException,MessageDeleteException,MessageSaveException,MessageUpdateException, RepositoryException, DocumentDeleteException,DocumentFetchException, DocumentUpdateException, DocumentSaveException, DocumentUploadException,UserFetchByGoogleSubException,UserSaveException,UserFetchByIdException,ThreadFetchException,ThreadSaveException,ThreadUpdateException,ThreadDeleteException};