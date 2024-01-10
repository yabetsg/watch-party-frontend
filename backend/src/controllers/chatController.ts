import Chat from "../models/Chat";
import Message from "../models/Message";
import { CustomRequest } from "../types";
import { Request, Response, NextFunction } from "express";

export const get_chat = async (req: CustomRequest, res: Response) => {
  const partyID = req.params.partyID;

  const chat = await Chat.findOne({ partyID }).exec();

  return res.json({ chat });
};

export const update_chat = async (req: CustomRequest, res: Response) => {
  // const { user } = req.user as { user: { _id: string; username: string } };
  const { message, partyID } = req.body;
  console.log(message);
  
  try {
    await Chat.findOneAndUpdate(
      { partyID },
      { $push: { messages: message } }
    ).exec();
    return res.status(200).json({ msg: "saved chat" });
  } catch (err) {
    res.status(500).json("sum wrong");
    console.log(err);
  }
};
