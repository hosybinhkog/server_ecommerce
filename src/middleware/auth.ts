require("dotenv").config();
import catchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/errorHandle";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { NextFunction, Request, Response } from "express";

export const isAuthenticated = catchAsyncError(async (req, _, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("You not logging! login now....", 401));
  }

  const decodedToken = await jwt.verify(
    token,
    process.env.SECRET_KEY_TOKEN as string
  );

  // @ts-ignore
  req.user = await User.findById(decodedToken.id);
  next();
});

// @ts-ignore
export const authorizeRoles = (...roles) => {
  return (req: Request, _: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.user.role)) {
      return next(
        // @ts-ignore
        new ErrorHandler(`Role ${req.user.role} is not allowed`, 403)
      );
    }

    next();
  };
};

export const checkUser = catchAsyncError(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      return next();
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.SECRET_KEY_TOKEN as string
    );

    // @ts-ignore
    req.user = await User.findById(decodedToken.id);
    next();
  }
);
