const mongoose=require("mongoose");
const conversationSchema=new mongoose.Schema({
    participants:[{
        type:String ,
        required: true
    }],
    lastMessage: {
        content:   { type: String, default: "" },  
        senderId:  { type: String, default: "" },  
        type:      { type: String, default: "text" }, 
        timestamp: { type: Date,   default: null }   
    },
     unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
    }, { timestamps: true });
module.exports = mongoose.model("Conversation", conversationSchema);