import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  messageID: { type: String },
  user: { type: String },
  content: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
