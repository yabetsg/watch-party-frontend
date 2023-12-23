import express from "express";
import { authorize } from "../middleware/authorize";
import { CustomRequest } from "../types";
const router = express.Router();

//au
router.post("/", authorize, async (req:CustomRequest, res) => {
  const user = req.user;
  res.status(200).json(user);
});

export default router;
