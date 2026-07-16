const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Request=require("../models/Request");
const verifyToken = require("../middleware/authMiddleware");
router.post("/", verifyToken, async (req, res) => {
    try {
        const currentUserId = req.user.uid;
        const { participantId } = req.body;
       if (!participantId) {
            return res.status(400).json({ message: "Participant ID is required" });
        } 
        const participantExists = await User.findOne({ uid: participantId });
        if (!participantExists) {
            return res.status(404).json({ message: "User not found" });
        } 
        const areFriends = await Request.findOne({
            $or: [
                { senderId: currentUserId, receiverId: participantId },
                { senderId: participantId, receiverId: currentUserId }
            ],
            status: "accepted"
        });
        if(!areFriends){
            return res.status(403).json({
                message:"send request first"
            });
        }
          const existingConversation = await Conversation.findOne({
            participants: { $all: [currentUserId, participantId] }
        });
          if (existingConversation) {
            return res.status(200).json(existingConversation);
        }
         const newConversation = new Conversation({
            participants: [currentUserId, participantId],
            lastMessage: {
                content: "",
                senderId: "",
                type: "text",
                timestamp: null
            },
            unreadCount: {
                [currentUserId]: 0,
                [participantId]: 0
            }
        });
        await newConversation.save();
        return res.status(201).json(newConversation);
 } catch (error) {
        console.error("Error in POST /api/conversations:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
         if (userId !== req.user.uid) {
            return res.status(403).json({ message: "Access denied" });
        }
          const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).sort({ updatedAt: -1 });
         const conversationsWithUser = await Promise.all(
            conversations.map(async (conv) => {
              const otherUserId = conv.participants.find(
                    (id) => id !== userId
                );
              const otherUser = await User.findOne({ uid: otherUserId })
                    .select("uid displayName photoURL isOnline lastSeen");

                return {
                    ...conv.toObject(),
                    otherUser 
                };
            })
        ); 
        
        return res.status(200).json(conversationsWithUser);

    } catch (error) {
        console.error("Error in GET /api/conversations/:userId:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});   
module.exports = router;