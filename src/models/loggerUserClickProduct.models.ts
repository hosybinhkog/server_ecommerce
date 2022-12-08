import mongoose from "mongoose";
const schema = mongoose.Schema;

const loggerUserClick = new schema(
  {
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    isNotLoggin: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("loggeruserclick", loggerUserClick);
