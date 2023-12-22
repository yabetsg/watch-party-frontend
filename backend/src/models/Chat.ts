import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    partyID:{type:mongoose.Types.ObjectId,ref:"Party"},
    messages:[{type:mongoose.Types.ObjectId,ref:"Message"}],
});

export default mongoose.model("Chat",ChatSchema)