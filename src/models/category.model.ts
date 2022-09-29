import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
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
    shortDescription: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("category", Category);
