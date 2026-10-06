const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    filePath:{
        type:String,
        required:true
    },
    mimeType:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum: [
        'UPLOADED',
        'PROCESSING',
        'READY',
        'FAILED'
      ],
      default: 'UPLOADED'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},
{
timestamps: true
})

const Document = mongoose.model('Document',documentSchema);

module.exports = {
    Document
}