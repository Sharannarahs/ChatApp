import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, },
    image: {type: String, },
    seen: {type: Boolean, default: false},

}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;

/*

It means the field (senderId or receiverId) stores an ObjectId — which is the unique ID automatically created by MongoDB for every document.

This ID points to another document in a different collection

ref tells Mongoose that this ObjectId refers to a document in the User model

This enables something called population (explained below), which allows you to fetch the full user document instead of just the ID.



*/