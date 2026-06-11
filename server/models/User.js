const mongoose=require("mongoose");
const messageSchema=new mongoose.Schema({
    uid:{
        type: String,
        required: true,
        unique: true,
    },
    displayName: String,
    email: String,
    photoURL: String,
    bio: String,
    isOnline:{
        type: Boolean,
        default: false,
    },
    lastSeen: Date,
}, {
    timestamps: true
});
module.exports = mongoose.model("User", userSchema);
