import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PartySchema = new Schema({
  partyID: { type: String },
});

export default mongoose.model("Party", PartySchema);
