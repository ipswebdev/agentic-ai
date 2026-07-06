
// username:sawantpranay97_db_user

// Password:XvBEnApPHTGvfeEd


const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect("mongodb+srv://sawantpranay97_db_user:XvBEnApPHTGvfeEd@cluster0.ho2j3pj.mongodb.net/agentic-ai?retryWrites=true&w=majority&appName=Cluster0")
}

module.exports = {
    connectDb
}