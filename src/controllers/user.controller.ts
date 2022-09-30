import crypto from "crypto";
import cloundinary from "cloudinary";

import { User } from "../models";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandle";
import sendToken from "../utils/jwtToken";
import { sendEmail } from "../utils/sendEmailChangeOrForgotPassword";

export const register = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloundinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { username, email, password } = req.body;
  const user = await User.create({
    username,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 200, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email/password...", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Wrong email or password", 401));
  }

  //@ts-ignore
  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Wrong email or password", 401));
  }

  sendToken(user, 200, res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully!!",
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // @ts-ignore
  const tokenReset = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}:/api/v1/user/password/reset/${tokenReset}`;

  const message = `Your password reset token is ${resetPasswordUrl} you have a link`;

  try {
    await sendEmail({
      email: user.email,
      suject: "Ecommerce",
      message,
      html: `<b>Changepassword Link: </b>${message}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("server internal :  " + error.message, 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordExpire: { $gt: Date.now() },
    resetPasswordToken,
  });

  if (!user) {
    return next(new ErrorHandler("User not found or not logged in", 404));
  }

  if (req.body.newPasssword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Comfirm password not matched", 400));
  }

  user.password = req.body.newPasssword;

  await user.save();

  sendToken(user, 200, res);
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    username: req.body.username,
    email: req.body.email,
  };

  if (req.body.avatar !== "" || !req.body.avatar) {
    // @ts-ignore
    const user = await User.findById(req.user.id);
    const imageId = user?.avatar?.public_id;

    await cloundinary.v2.uploader.destroy(imageId as string);
  }
});
