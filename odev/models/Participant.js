import mongoose from "mongoose";

const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
});

export default mongoose.model("Participant", ParticipantSchema);
