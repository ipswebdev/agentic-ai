from pymongo import MongoClient
from pymongo.server_api import ServerApi
from app.config.settings import MONGO_URI

uri = MONGO_URI
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["agentic-ai"]
def connectToDB():
    try:
        client.admin.command('ping')
        print("You successfully connected to MongoDB!")
        return db;
    except Exception as e:
        print(e)
        raise;
