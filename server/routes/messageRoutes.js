const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/authMiddleware");
router.post("/", verifyToken, async (req, res) => {
    try{
       const { conversationId, content, type } = req.body;
        const senderId = req.user.uid;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        const newMessage = new Message({
            conversationId,
            senderId,
            content,
            type:type||"text",
            seenBy:[senderId]
        });
        await newMessage.save();
        return res.status(201).json(newMessage);
    } catch(error)
{
    console.error("Error in POST /api/messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}    
    
 });

 router.get("/:conversationId", verifyToken, async (req, res) => {
    try{
        const{conversationId}=req.params;
        const messages=await Message.find({ conversationId})
        .sort({createdAt:1});
        return res.status(200).json(messages);
    } catch(error){
        console.error("Error in GET /api/messages/:conversationId:", error);
        return res.status(500).json({message: "Internal Server Error"});
        
    }
});

router.patch("/seen", verifyToken, async (req, res) => {
    try{
        const {conversationId}=req.body;
        const currentUserId=req.user.uid;
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }
        await Message.updateMany(
            { conversationId: conversationId, seenBy: { $ne: currentUserId } },
            { $addToSet: { seenBy: currentUserId } }
        );
        return res.status(200).json({ message: "Messages marked as seen" });
    } catch (error) {
        console.error("Error in PATCH /api/messages/seen:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

