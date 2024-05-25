import mongoose from "mongoose";

const { Schema } = mongoose;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    require: true,
  },
  date: {
    require: true,
    type: String,
  },
  from: {
    require: true,
    type: String,
  },
  to: {
    require: true,
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Participants",
    },
  ],
});

export default mongoose.model("Event", EventSchema);
