import mongoose from "mongoose";

// FUNCTION TO CONNECT TO MONGODB

export const connectDB = async () =>{
    try{

        mongoose.connection.on("connected", () => console.log("Database connected")); // EVENT

        await mongoose.connect(`${process.env.MONGODB_URI}/chatapp`)

    } catch (error) {
        console.log(error);
        
    }
}