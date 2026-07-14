const mongoose = require("mongoose");
const RequestSchema = new mongoose.Schema({
    senderId:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        required:true
    },
     status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
    }, { timestamps: true });
    RequestSchema.index({
        senderId:1,receiverId:1},
        {unique:true}
    );
    module.exports=mongoose.model("Request",RequestSchema);
