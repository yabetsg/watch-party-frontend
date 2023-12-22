import express from "express";
import { Request, Response, NextFunction } from "express";
import Party from "../models/Party";
import { authorize } from "../middleware/authorize";
const router = express.Router();

router.post("/:id", authorize, async (req: Request, res: Response) => {
  const partyID = req.params.id;
  if (!partyID) {
    return res.status(400).json({ error: "Party ID is required" });
  }
  try {
    const newParty = new Party({
      partyID,
      videoID: null,
    });
    await newParty.save();
    res.status(200).json({ message: "Party Created", data: newParty });
  } catch (err) {
    console.error("Error creating party:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
