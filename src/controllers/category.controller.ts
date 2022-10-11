import cloundinary from "cloudinary";
import ErrorHandler from "../utils/errorHandle";
import catchAsyncError from "../middleware/catchAsyncError";
import { Category } from "../models";

export const getCategories = catchAsyncError(async (_req, res, _next) => {
  const categories = await Category.find({});
  const categoriesCount = await Category.count();
  res.status(200).json({
    categories,
    message: "get categories successfully",
    success: true,
    categoriesCount,
  });
});

export const getCategoryById = catchAsyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new ErrorHandler("Category not found", 404));
  return res.status(200).json({
    success: true,
    message: "get category sucessfully!!!",
    category,
  });
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new ErrorHandler("Category not found", 404));
  if (req.body.img !== undefined) {
    await cloundinary.v2.uploader.destroy(category!.img!.public_id);

    const result = await cloundinary.v2.uploader.upload(req.body.img, {
      folder: "categories",
    });

    req.body.img = { public_id: result.public_id, url: result.secure_url };
  }

  const updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  await updateCategory?.save();

  res.status(200).json({
    success: true,
    updateCategory,
    message: "update category success",
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
