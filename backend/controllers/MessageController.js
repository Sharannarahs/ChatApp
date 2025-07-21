import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";


// GET ALL USERS EXCEPT LOGGED IN USER

export const getUsersForSidebar = async (req, res) => {
    try{
        const userId = req.user._id;
        console.log("Logged-in User ID:", userId);
        
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");
        console.log("Other Users:", filteredUsers.map(u => ({ id: u._id, name: u.name })));

        // COUNT NUMBER OF MESSAGES NOT SEEN

        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})

            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
                console.log(`Unseen messages from ${user._id}:`, messages.length);
            }
        })
        await Promise.all(promises);

        console.log("Final unseenMessages object:", unseenMessages);

        res.json({success: true, users: filteredUsers, unseenMessages});
         

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});        
    }
}


// GET ALL MESSAGES FOR SELECTED USERS

export const getMessage = async (req, res) => {
    try{
        const { id: selectedUserID } = req.params;
        console.log("Selected User ID (Chat Partner):", selectedUserID);

        const myId = req.user._id;
        console.log("My User ID:", myId);

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserID},
                {senderId: selectedUserID, receiverId: myId},
            ]
        })
        // UPDATING SEEN MESSAGE
        await Message.updateMany({senderId: selectedUserID, receiverId: myId}, {seen: true});

        res.json({success: true, messages});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// API TO MARK MESSAGE AS SEEN USING MESSAGE ID
// AFTER OPENING AND STAYING IN CHAT

export const markMessageAsSeen = async (req, res) => {
    try{
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen: true});

        res.json({success: true});

    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// SEND MESSAGE TO SELECTED USER

export const sendMessage = async (req, res) => {
    try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
            console.log("Image uploaded to Cloudinary:", imageUrl);
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // EMIT THE NEW MESSAGE TO THE RECEIVERS SOCKET
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        console.log("Message saved in DB:", newMessage);
        res.json({success: true, newMessage});


    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}