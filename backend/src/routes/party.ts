import express from "express";
import { Request, Response, NextFunction } from "express";
import Party from "../models/Party";
import { authorize } from "../middleware/authorize";
import { CustomRequest } from "../types";
import User from "../models/User";
const router = express.Router();
//TODO: Join room after refresh
//create new party
router.post("/:id", authorize, async (req: Request, res: Response) => {
  const partyID = req.params.id;
  if (!partyID) {
    return res.status(400).json({ error: "Party ID is required" });
  }
  try {
    const newParty = new Party({
      partyID,
      videoID: null,
      participants: 1,
    });
    await newParty.save();
    res.status(200).json({ message: "Party Created", data: newParty });
  } catch (err) {
    console.error("Error creating party:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// return current party saved in cookies
router.get("/", async (req: CustomRequest, res) => {
  const currentParty = req.cookies.currentParty
    ? JSON.parse(req.cookies.currentParty)
    : null;

  res.json({
    data: currentParty,
  });
});

// join/leave party
router.put("/:id", authorize, async (req: CustomRequest, res: Response) => {
  const partyId = req.params.id;
  const user = req.user as { user: { _id: string } };

  try {
    const updatedParty = await Party.findOneAndUpdate(
      {
        partyID: partyId,
      },
      {
        $inc: { participants: 1 },
      },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      user.user._id,
      {
        $set: { partyID: partyId },
      },
      { new: true }
    );
    res.cookie("currentParty", JSON.stringify(updatedParty));
    req.partyInfo = updatedParty ? updatedParty : undefined;

    res.json({
      updatedParty,
      updatedUser,
    });
  } catch (err) {
    console.error("Error creating party:", err);
    res.status(500).json({
      message: "Error creating party:" + err,
      error: "Internal Server Error",
    });
  }
});

export default router;
