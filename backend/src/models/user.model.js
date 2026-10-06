const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: {
    type: String,
    required:true,
   },
   email: {
    type: String,
    required:true,
   },
   googleSub: {
    type: String,
    unique: true,
    required:true,
   },
},{
timestamps: true
})

const User = mongoose.model("User",userSchema)

module.exports = {
    User
}