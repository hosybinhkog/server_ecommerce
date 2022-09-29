import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    username: {
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
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "topic",
    },
  },
  { timestamps: true }
);

export default mongoose.model("post", Post);
