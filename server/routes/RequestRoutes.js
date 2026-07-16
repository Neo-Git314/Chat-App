const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Conversation = require("../models/Conversation");
const verifyToken = require("../middleware/authMiddleware");
router.post("/", verifyToken, async (req, res) => {
    try {
        const senderId = req.user.uid;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                message: "Receiver ID is required"
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                message: "You can't send a request to yourself."
            });
        }

        const existingRequest = await Request.findOne({
            $or: [
                { senderId, receiverId },
                {
                    senderId: receiverId,
                    receiverId: senderId
                }
            ]
        });

        if (existingRequest) {
            if (existingRequest.status === "accepted") {
                return res.status(400).json({
                    message: "Users are already friends"
                });
            }

            return res.status(400).json({
                message: "Request already exists"
            });
        }

        const newRequest = new Request({
            senderId,
            receiverId,
            status: "pending"
        });

        await newRequest.save();

        return res.status(201).json({
            message: "Friend request sent successfully",
            request: newRequest
        });
    }

     catch (error) {
        console.error("Error in POST /api/requests:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
router.get("/pending", verifyToken, async (req, res) => {
    try {   const currentUserId = req.user.uid;
  const requests = await Request.find({
            receiverId: currentUserId,
            status: "pending"
 });
 return res.status(200).json(requests);

    } catch (error) {
        console.error("Error in GET /api/requests/pending:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const currentUserId = req.user.uid;
        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }
        if (request.receiverId !== currentUserId) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        if (request.status !== "pending") {
            return res.status(400).json({
                message: "Request has already been processed"
            });
        }
       request.status = status;
        await request.save();
        if (status === "accepted") {
            const existingConversation = await Conversation.findOne({
                participants: {
                    $all: [request.senderId, request.receiverId]
                }
            });
             

            if (!existingConversation) {
                const newConversation = new Conversation({
                    participants: [
                        request.senderId,
                        request.receiverId
                    ],
                    lastMessage: {
                        content: "",
                        senderId: "",
                        type: "text",
                        timestamp: null
                    },
                    unreadCount: {
                        [request.senderId]: 0,
                        [request.receiverId]: 0
                    }
                });

                await newConversation.save();
            }
        }
        return res.status(200).json({
            message: "Request updated successfully",
            request
        });
    } catch (error) {
        console.error("Error in PATCH /api/requests/:id", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
router.get("/friends", verifyToken, async (req, res) => {
    try {
        const currentUserId = req.user.uid;

        const friends = await Request.find({
            $or: [
                { senderId: currentUserId },
                { receiverId: currentUserId }
            ],
            status: "accepted"
        });
        return res.status(200).json(friends);

    } catch (error) {
        console.error("Error in GET /api/requests/friends:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
module.exports = router;