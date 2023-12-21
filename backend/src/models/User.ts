import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 14 },
  password: { type: String, required: true, minLength: 4 },
  partyID: { type: String },
});

export default mongoose.model("User", UserSchema);
