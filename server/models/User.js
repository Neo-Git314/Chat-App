const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    uid:{
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
         required: true
    },
    email: {
        type:String,
         required: true,
         unique: true
    },
    photoURL: {
    type: String,
    default: "" 
},
    bio: {
        type: String,
        default: "Hey there! I am using ChatFlow."
    },
    isOnline:{
        type: Boolean,
        default: false,
    },
    lastSeen:{
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("User", userSchema);