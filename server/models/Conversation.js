const mongoose=require("mongoose");
const messageSchema=new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    lastMessage: String,
    }, { timestamps: true });
module.exports = mongoose.model("Conversation", conversationSchema);