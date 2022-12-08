import mongoose from "mongoose";
const Schema = mongoose.Schema;

const logHistorySchema = new Schema(
  {
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    message: {
      type: String,
      required: true,
    },
    isNotLoggin: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("loghistory", logHistorySchema);
