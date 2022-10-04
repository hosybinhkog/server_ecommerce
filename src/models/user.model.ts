require("dotenv").config();
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      minLength: [4, "Tên phải nhiều hơn 4 chữ"],
      maxLength: [30, "Tối ta 30 chữ"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [validator.isEmail, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "Mật khẩu phải lớn hơn 8 chữ"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

User.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY_TOKEN as string, {
    expiresIn: process.env.EXPIRES_IN_SECONDS,
  });
};

User.methods.comparePassword = async function (passwordInput: string) {
  return await bcrypt.compare(passwordInput, this.password);
};

User.methods.getResetPasswordToken = async function () {
  const resetToken = await crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("users", User);
