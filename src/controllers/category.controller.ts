import cloundinary from "cloudinary";
import ErrorHandler from "../utils/errorHandle";
import catchAsyncError from "../middleware/catchAsyncError";
import { Category } from "../models";

export const getCategories = catchAsyncError(async (_req, res, _next) => {
  const categories = await Category.find({});

  res.status(200).json({
    categories,
    message: "get categories successfully",
    success: true,
  });
});

export const createCategory = catchAsyncError(async (req, res, next) => {
  const shortDescription =
    req.body.description.slice(50) || req.body.description;

  // @ts-ignore
  const user = req.user;
  if (!req.body.images) {
    // @ts-ginore
    const newCategory = await Category.create({
      shortDescription,
      user: user._id,
      ...req.body,
    });

    if (!newCategory)
      return next(new ErrorHandler("Create new category...", 400));

    res.status(200).json({
      newCategory,
      success: true,
      message: "Create category successfully!!!",
    });
  }

  const myCloud = await cloundinary.v2.uploader.upload(req.body.images, {
    folder: "categories",
    crop: "scale",
    width: 330,
  });

  const newCategory = await Category.create({
    img: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    shortDescription,
    user: user._id,
    ...req.body,
  });

  if (!newCategory)
    return next(new ErrorHandler("Create new category...", 400));

  res.status(200).json({
    newCategory,
    success: true,
    message: "Create category successfully!!!",
  });
});
