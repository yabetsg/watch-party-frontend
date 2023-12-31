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

const router = express.Router();

router.post("/:id", authorize, create_party);

router.get("/:id", get_party_info);

router.get("/:id/users", get_participants);

router.patch("/:id", authorize, update_party);

export default router;
