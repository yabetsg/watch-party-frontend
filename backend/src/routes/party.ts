import express from "express";
import { Request, Response, NextFunction } from "express";
import Party from "../models/Party";
import { authorize } from "../middleware/authorize";
import { CustomRequest } from "../types";
import User from "../models/User";
import {
  create_party,
  get_participants,
  get_party_info,
  update_party,
} from "../controllers/partyController";
import { get_chat, update_chat } from "../controllers/chatController";

const router = express.Router();

router.post("/:partyID", authorize, create_party);
router.get("/:partyID",authorize, get_party_info);
router.patch("/:partyID", authorize, update_party);

router.get("/:partyID/users",authorize, get_participants);



//party chat route

router.get("/:partyID/chat",authorize, get_chat);

router.patch("/:partyID/chat",authorize,update_chat);

export default router;
