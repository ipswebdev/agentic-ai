
const {
    MONGO_URI
} = require("../config/env");


const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect(MONGO_URI)
}

module.exports = {
    connectDb
}