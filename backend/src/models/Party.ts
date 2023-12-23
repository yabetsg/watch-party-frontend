import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PartySchema = new Schema({
  partyID: { type: String, required: true },
  videoID: { type: String },
  participants: { type: Number, required:true },
});

export default mongoose.model("Party", PartySchema);
