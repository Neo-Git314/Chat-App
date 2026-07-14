const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
router.post("/verify", verifyToken , async (req,res)=>{
    try{
        const{ uid,name,email,picture}=req.user;
        let user=await User.findOne({uid});
        if(!user){
            user= new User({
                uid: uid,
                displayName: name|| "ChatFlow User",
                email: email || "",
                photoURL: picture || "" ,
                isOnline: true,
                lastSeen: new Date()
            });
            await user.save();
            return res.status(201).json({ message:"User verified and registered!",user});
        } else{
            user.isOnline=true;
            user.lastSeen = new  Date();
            await user.save();
            return res.status(200).json({ message: "User status updated to online!", user });
        }
        } catch(error){
            console.error("Error in POST /verify:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    
});
router.get("/", verifyToken, async (req, res) => {
    try{
        const{search}=req.query;
        let query = { uid: { $ne: req.user.uid } };

        if (search) {
            query.$or = [
                { displayName: { $regex: search, $options: "i" } }, // Name me search karega (Case-Insensitive)
                { email: { $regex: search, $options: "i" } }        // Email me search karega
            ];
        }
        const users = await User.find(query).select("uid displayName email photoURL bio isOnline lastSeen")
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in GET /api/users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.patch('/:uid', verifyToken, async (req, res) => {
    try {
        if (req.user.uid !== req.params.uid) {
            return res.status(403).json({ message: "Unauthorized to update this user." });
        }
        const { displayName, bio, photoURL } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { uid: req.params.uid },
            { displayName, bio, photoURL },
            { new: true }
        ).select("uid displayName email photoURL bio isOnline lastSeen");
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/:uid', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid }).select("uid displayName email photoURL bio isOnline lastSeen").lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
