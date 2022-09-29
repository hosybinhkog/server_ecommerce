import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentPost = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  },
  { timestamps: true }
);

export default mongoose.model("comment_post", CommentPost);
