from pymongo import MongoClient
from pymongo.server_api import ServerApi
from app.config.settings import MONGO_URI
import app.config.logger
import logging

class DbConnectionException(Exception):
    pass
uri = MONGO_URI
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["agentic-ai"]
logger = logging.getLogger(__name__)
def connectToDB():
    try:
        client.admin.command('ping')
        return db;
    except Exception as e:
        raise DbConnectionException(f"Failed to connect to MongoDB: {e}") from e;