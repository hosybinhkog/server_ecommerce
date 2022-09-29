import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Topic = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    img: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    tag: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("topic", Topic);
