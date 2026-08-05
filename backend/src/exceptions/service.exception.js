const { AppException } = require("./base.exception");

class ServiceException extends AppException {}

class DocumentProcessingException extends ServiceException {}

class AIRequestException extends ServiceException {}

module.exports = {
    ServiceException,
    DocumentProcessingException,
    AIRequestException
}