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
module.exports = router;
