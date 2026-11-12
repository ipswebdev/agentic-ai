const mongoose = require('mongoose');

const conversationMessageSchema = new mongoose.Schema({
    threadId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ConversationThread",
        required:true
    },
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    evidence: [{
        chunkId: {
            type: String
        },
        score: {
            type: Number
        }
    }]|[],
},
{
timestamps: true
})

conversationMessageSchema.index({
    threadId: 1,
    createdAt: 1
});

const ConversationMessage = mongoose.model('ConversationMessage',conversationMessageSchema);

module.exports = {
    ConversationMessage
}