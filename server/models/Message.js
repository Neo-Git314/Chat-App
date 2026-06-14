const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required: true
    },
    senderId:{
        type: String ,
        required: true
    },
     content: {
        type: String,
        default: ""
    },
     type:{
        type:String,
        enum:["text","image","file"],
        default:"text",
     },
     seenBy:[{
        type:String,
     }],
},{
    timestamps: true
}
);
  module.exports = mongoose.model("Message", messageSchema);

