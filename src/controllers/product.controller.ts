import catchAsyncError from "src/middleware/catchAsyncError";
import ApiFutures from "src/utils/apiFeatures";
import { Product } from "../models";

export const getAllProducNonSort = catchAsyncError(async (_req, res, _next) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    message: "get products successfully!!",
    products,
  });
});

export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = req.body.resultPerPage || 20;
  const productsCount = await Product.countDocuments();

  const apiFeatures = await new ApiFutures(Product.find({}), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = apiFeatures.query;
  const filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

export const createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];
});
