import crypto from "crypto";
import cloundinary from "cloudinary";

import { User } from "../models";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandle";
import sendToken from "../utils/jwtToken";
import { sendEmail } from "../utils/sendEmailChangeOrForgotPassword";

export const register = catchAsyncError(async (req, res, _next) => {
  const { username, email, password } = req.body;

  if (!req.body.avatar) {
    // @ts-ginore
    const user = await User.create({
      username,
      email,
      password,
      avatar: {
        public_id: Math.random().toString(),
        url: "https://res.cloudinary.com/hosybinh/image/upload/v1664697559/avatars/avatar_r6qdac.png",
      },
    });

    return sendToken(user, 200, res);
  }
  // @ts-ginore
  const myCloud = await cloundinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    username,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  return sendToken(user, 200, res);
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
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Wrong email or password", 401));
  }

  sendToken(user, 200, res);
});

export const logout = catchAsyncError(async (_req, res, _next) => {
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
  const user: any = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  console.log(user);

  // @ts-ignore
  const tokenReset = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl: string = `${req.protocol}://${req.get(
  //   "host"
  // )}/reset-password/${tokenReset}`;

  const resetPasswordUrl: string = `http://localhost:6969/reset-password/${tokenReset}`;

  const message: string = `Your password reset token is <a href="${resetPasswordUrl}">Click</a> you have a link`;

  try {
    await sendEmail({
      email: user.email,
      suject: "Ecommerce",
      message: `<b>Changepassword Link:${message} </b>`,
      html: `<b>Changepassword Link: ${message}</b>`,
    });

    return res.status(200).json({
      success: true,
      message,
      email: user.email,
      suject: "Ecommerce",
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

  console.log(req.body);

  if (req.body.newPasssword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Comfirm password not matched", 400));
  }

  user.password = req.body.newPasssword;

  await user.save();

  sendToken(user, 200, res);
});

export const updateProfile = catchAsyncError(async (req, res, _next) => {
  const newUserData = {
    username: req.body.username,
    email: req.body.email,
  };

  if (req.body.avatar !== undefined) {
    // @ts-ignore
    const user = await User.findById(req.user.id);
    const imageId = user?.avatar?.public_id;

    await cloundinary.v2.uploader.destroy(imageId as string);
    const myCloud = await cloundinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    // @ts-ignore
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  // @ts-ignore
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

export const getUserDetails = catchAsyncError(async (req, res, next) => {
  // @ts-ignore
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found or not logged in", 404));
  }

  res.status(200).json({
    success: true,
    user,
    message: "get user details successfully completed",
  });
});

export const getAllUser = catchAsyncError(async (_req, res, _next) => {
  const users = await User.find({});

  res.status(200).json({
    users,
    success: true,
    message: "get all users successfully",
  });
});

export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    user,
    message: "get user successfully",
    success: true,
  });
});

export const updateUserRole = catchAsyncError(async (req, res, _next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  if (!req.body.idUserUpdateRole) {
    // @ts-ignore
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "update role successfully",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.body.idUserUpdateRole,
    newUserData,
    {
      runValidators: true,
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    user,
    message: "update role successfully",
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const imageId = user?.avatar?.public_id;

  await cloundinary.v2.uploader.destroy(imageId as string);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  // @ts-ignore
  const user = await User.findById(req.user.id).select("+password");
  // @ts-ignore
  const isPasswordMatched = await user?.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password not match", 400));
  }

  if (user) {
    user.password = req.body.newPassword;

    await user.save();
  }

  sendToken(user, 200, res);
});
