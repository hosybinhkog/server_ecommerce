import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Product = new Schema({
  name: {
    type: String,
    required: [true, ""],
  },
});
