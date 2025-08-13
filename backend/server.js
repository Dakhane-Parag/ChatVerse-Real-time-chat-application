import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

const app = express(); 
const server = http.createServer(app); //used to create a server but we are using http to create a server here because that server supports the socket.io package to be worked with.

export const io = new Server(server,{cors:{origin:"*"}});

export const userSocketMap = {};

io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("User Connected",userId);

  if(userId) userSocketMap[userId] =socket.id;
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("user disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    
  })
})
//Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: "*", credentials: true }));


//Routes
app.use("/api/status",(req,res) => res.send("Server is live"))
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);


//Db connection
await connectDB();

server.listen(PORT ,() => console.log("Server is running on PORT : " + PORT));