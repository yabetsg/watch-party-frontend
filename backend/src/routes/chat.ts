import express from "express";
import { authorize } from "../middleware/authorize";
import { get_chat, update_chat } from "../controllers/chatController";


const router = express.Router();

// router.get("/:partyID/chat",authorize,get_chat);
// router.patch("/:partyID/chat",authorize,update_chat);


export default router;
