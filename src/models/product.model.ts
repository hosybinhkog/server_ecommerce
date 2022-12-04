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
    category: {
      type: String,
    },
    Stock: {
      type: Number,
      default: 1,
      maxLength: 5,
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
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        username: {
          type: String,
          required: true,
          default: "No name",
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        user: {
          type: String,
        },
        url: {
          type: String,
        },
        userId: {
          type: String,
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
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("product", Product);
