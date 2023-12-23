import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  content: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
