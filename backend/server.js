import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/UserRoute.js';
import messageRouter from './routes/MessageRoute.js';
import { Server } from 'socket.io';

// CREATE EXPRESS APP USING HTTP SERVER
const app = express();
const server = http.createServer(app); // SCOKET IO SUPPORTS HTTP SERVER


// INITIALIZE SOCKET.IO SERVER
export const io = new Server(server, {
    cors: {origin: "*"}
})


// STORE ONLINE USERS
export const userSocketMap = {}; // { userId: socketId }
/*
{
  "user123": "socketid12345",
  "user456": "socketid67890"
}
*/

// SOCKET.IO CONNECTION HANDLER
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId; // io.connect("http://localhost:5000", { query: { userId: "12345" } });

    console.log("User Connected", userId);
    // User Connected 12345


    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // EMIT ONLINE USERS TO ALL CONNECTED CLIENTS
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=> {
        console.log("User Disconnectd", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
    })

})

// MIDDLEWARE SETUP
app.use(express.json({limit: "10mb"}));
app.use(cors());

// ROUTE SETUP
app.use("/api/status", (req, res) => res.send("server is live"));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


// CONNECT TO MONGODB
await connectDB();

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV !== "production"){
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

}

// EXPORT SERVER FOR VERCEL
export default server;
