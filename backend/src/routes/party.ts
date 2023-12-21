import express from "express";
import { Request, Response, NextFunction } from "express";
const router = express.Router();

router.post("/:id", async(req: Request, res: Response) => {
  const partyID = req.params.id;
  res.status(200).json(partyID)
});

export default router;
