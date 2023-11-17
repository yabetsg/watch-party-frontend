import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PartySchema = new Schema({
    partyID:{type:String},
    userID:{type:Schema.Types.ObjectId,ref:"User"},
    
});

export default mongoose.model("Party",PartySchema);