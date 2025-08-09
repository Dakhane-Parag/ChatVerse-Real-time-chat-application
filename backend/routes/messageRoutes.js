import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getMessages, getUserBySidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";


const messageRouter = express.Router();

messageRouter.get("/users",protectRoute,getUserBySidebar);

messageRouter.get("/:id",protectRoute,getMessages);

messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);

messageRouter.post("/send/:id",protectRoute,sendMessage);

export default messageRouter;