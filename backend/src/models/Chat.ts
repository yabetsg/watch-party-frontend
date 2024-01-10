import mongoose from "mongoose";
import Message from "./Message";

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  partyID: { type: String, ref: "Party" },
  messages: [
    Message.schema
  ],
});

export default mongoose.model("Chat", ChatSchema);
