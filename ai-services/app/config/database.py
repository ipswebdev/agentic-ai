from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://sawantpranay97_db_user:XvBEnApPHTGvfeEd@cluster0.ho2j3pj.mongodb.net/agentic-ai?retryWrites=true&w=majority&appName=Cluster0"
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
