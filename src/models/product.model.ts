import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required!!!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!!"],
    },
    price: {
      type: Number,
      required: [true, "Price is required!!"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    rating: {
      type: Number,
      default: 0,
    },
    imgs: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [
      {
        username: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("product", Product);
