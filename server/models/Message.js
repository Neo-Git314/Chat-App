const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
     content: String,
     type:{
        type:String,
        enum:["text","image","file"],
        default:"text",
     },
     seenBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
     }],
     timestamp: {
    type: Date,
    default: Date.now,
  },
});
  module.exports = mongoose.model("Message", messageSchema);

