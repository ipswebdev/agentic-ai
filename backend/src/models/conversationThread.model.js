const mongoose = require('mongoose');

const conversationThreadSchema = new mongoose.Schema({
    documentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Document",
        required:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        default:"New Conversation"
    }
},
{
timestamps: true
})

conversationThreadSchema.index({
    userId: 1,
    documentId: 1,
    updatedAt: -1
});

const ConversationThread = mongoose.model('ConversationThread',conversationThreadSchema);

module.exports = {
    ConversationThread
}