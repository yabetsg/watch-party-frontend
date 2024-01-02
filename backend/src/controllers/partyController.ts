import { Request, Response, NextFunction } from "express";
import Party from "../models/Party";
import { CustomRequest } from "../types";
import User from "../models/User";

export const create_party = async (req: CustomRequest, res: Response) => {
  const partyID = req.params.id;
  const { user } = req.user as { user: { _id: string; username: string } };
  if (!partyID) {
    return res.status(400).json({ error: "Party ID is required" });
  }
  try {
    const newParty = new Party({
      partyID,
      videoID: "",
      participants: 1,
      host: user.username,
    });
    await newParty.save();
    await User.findByIdAndUpdate(user._id, {
      $set: { partyID },
    }).exec();
    res.status(200).json({ message: "Party Created", data: newParty });
  } catch (err) {
    console.error("Error creating party:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// return current party details saved in cookies else otherwise query for it

export const get_party_info = async (req: CustomRequest, res: Response) => {
  const partyID = req.params.id;
  let savedParty;
  if (
    req.cookies.currentParty !== undefined &&
    req.cookies.currentParty !== null
  ) {
    savedParty = req.cookies.currentParty;
  }

  if (!savedParty) {
    const partyInfo = await Party.findOne({ partyID }).exec();

    if (!partyInfo) {
      return res.status(404).json({ message: "Party doesn't exist" });
    }
    return res.status(200).json({ data: partyInfo });
  }

  res.json({
    data: savedParty,
  });
};

export const get_participants = async (req: CustomRequest, res: Response) => {
  const partyID = req.params.id;
  const party = await Party.findOne({ partyID }, "host -_id");
  const users = await User.find(
    {
      partyID: partyID,
    },
    "username"
  );

  res.json({
    users,
    party,
  });
};

export const update_party = async (req: CustomRequest, res: Response) => {
  const partyID = req.params.id;
  const { user } = req.user as { user: { _id: string } };
  const youtubeID = req.body.youtubeID ? req.body.youtubeID : null;
  const host = req.body.newHost;
  const joining = req.body.join;

  const leaving = req.body.leave;
  let updatedParty;
  let updatedUser;

  try {
    if (youtubeID) {
      updatedParty = await Party.findOneAndUpdate(
        {
          partyID,
        },
        {
          $set: { videoID: youtubeID },
        },
        { new: true }
      );
    } else if (host) {
      updatedParty = await Party.findOneAndUpdate(
        { partyID },
        { $set: { host } },
        { new: true }
      );
    } else if (joining) {
      // check if user has already joined
      const partyExists = await Party.findOne({ partyID }).exec();

      if (!partyExists) {
        return res.status(404).json({ message: "Party doesn't exist" });
      }

      const userExists = await User.findOne({
        _id: user._id,
        partyID,
      }).exec();

      if (userExists) {
        const currentParty = req.cookies.currentParty
          ? JSON.parse(req.cookies.currentParty)
          : null;

        return res.json({
          data: currentParty,
        });
      } else {
        updatedParty = await Party.findOneAndUpdate(
          {
            partyID: partyID,
          },
          {
            $inc: { participants: 1 },
          },
          { new: true }
        );

        updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            $set: { partyID: partyID },
          },
          { new: true }
        );
      }
    } else if (leaving) {
      updatedParty = await Party.findOneAndUpdate(
        {
          partyID: partyID,
        },
        {
          $inc: { participants: -1 },
        },
        { new: true }
      );

      updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $set: { partyID: null },
        },
        { new: true }
      );

      if (updatedParty?.participants === 0) {
        await Party.deleteOne({ partyID });
        res.cookie("currentParty", "", { expires: new Date(0) });
        return res.status(200);
      }
    }
    console.log(updatedParty);

    res.cookie("currentParty", JSON.stringify(updatedParty));
    req.partyInfo = updatedParty ? updatedParty : undefined;

    return res.status(200).json({
      updatedParty,
      updatedUser,
    });
  } catch (err) {
    console.error("Error updating party:", err);
    res.status(500).json({
      message: "Error updating party:" + err,
      error: "Internal Server Error",
    });
  }
};
