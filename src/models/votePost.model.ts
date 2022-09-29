import mongoose from "mongoose";
const Schema = mongoose.Schema;

const votePost = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    upvote: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("votePost", votePost);
