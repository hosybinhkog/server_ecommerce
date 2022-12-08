import cloundinary from "cloudinary";
import catchAsyncError from "../middleware/catchAsyncError";
import { loggerUserClick, Product } from "../models";
import ApiFutures from "../utils/apiFeatures";
import ErrorHandler from "../utils/errorHandle";

export const getAllProducNonSort = catchAsyncError(async (_req, res, _next) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    message: "get products successfully!!",
    products,
  });
});

export const getAllProducts = catchAsyncError(async (req, res, _next) => {
  const resultPerPage = req.body.resultPerPage || 20;
  const productsCount = await Product.countDocuments();

  let apiFeatures;
  console.log(req.query.category);
  if (req.query.category) {
    apiFeatures = await new ApiFutures(Product.find({}), req.query)
      .search()
      .categories()
      .filter()
      .pagination(resultPerPage);
  } else {
    apiFeatures = await new ApiFutures(Product.find({}), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
  }

  const products = await apiFeatures.query;
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

  if (typeof req.body.imgs === "string") {
    images.push(req.body.imgs);
  } else {
    images = req.body.imgs;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloundinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.imgs = imagesLinks;
  // @ts-ignore
  req.body.user = req.user.id;

  const newProduct = await Product.create(req.body);

  if (!newProduct)
    return next(new ErrorHandler("Create product is error", 500));

  res.status(200).json({
    success: true,
    newProduct,
    message: "create product successfully!!",
  });
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
  let updateProduct = await Product.findById(req.params.id);
  if (!updateProduct) return next(new ErrorHandler("Product not found", 404));

  let images = [];

  if (typeof req.body.imgs === "string") {
    images.push(req.body.imgs);
  } else {
    images = req.body.imgs;
  }

  if (images !== undefined) {
    for (let i = 0; i < images.length; i++) {
      if (updateProduct?.imgs[i]?.public_id)
        await cloundinary.v2.uploader.destroy(updateProduct.imgs[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloundinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.imgs = imagesLinks;
  }

  req.body.price = parseFloat(req.body.price);

  updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await updateProduct?.save();

  res.status(200).json({
    message: "Updated product successfully",
    updateProduct,
    success: true,
  });
});

export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const deleteProduct = await Product.findById(req.params.id);
  if (!deleteProduct) return next(new ErrorHandler("Product not found", 404));

  for (let i = 0; i < deleteProduct.imgs.length; i++) {
    await cloundinary.v2.uploader.destroy(deleteProduct.imgs[i].public_id);
  }

  await deleteProduct.remove();

  res.status(200).json({
    message: "Deleted product successfully",
    success: true,
  });
});

export const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("product is not found", 404));

  product.viewsCount++;
  await product.save();

  // @ts-ignore
  if (!req?.user?.id) {
    await loggerUserClick.create({
      idProduct: req?.params?.id,
      isNotLoggin: true,
    });
  } else {
    await loggerUserClick.create({
      idProduct: req?.params?.id,
      // @ts-ignore
      users: req?.user?.id,
    });
  }

  res.status(200).json({
    message: "get product details successfully",
    success: true,
    product,
  });
});

export const getProductsAdmin = catchAsyncError(async (_req, res, _next) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,

    message: "gets product successfully",
    products,
  });
});

export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  let images = [];

  if (typeof req.body.imgs === "string") {
    images.push(req.body.imgs);
  } else {
    images = req.body.imgs;
  }

  if (images !== undefined) {
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloundinary.v2.uploader.upload(images[i], {
        folder: "comments",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.imgs = imagesLinks;
  }

  const review = {
    // @ts-ignore
    userId: req.user._id as string,
    // @ts-ignore
    username: req.user.username as string,
    rating: Number(rating),
    comment: comment as string,
    // @ts-ignore
    url: req?.user?.avatar?.url as string,
    // @ts-ignore
    user: req.user.username as string,
    imgs: req.body.imgs,
  };

  const product = await Product.findById(productId);

  if (!product) return next(new ErrorHandler("Product is not found", 404));

  // @ts-ignore
  const isReview = product.reviews.find((rev) => rev.user === req.user._id);

  if (isReview) {
    product.reviews.forEach((rev) => {
      // @ts-ignore
      if (rev.user === req.user._id)
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => (avg += rev.rating));

  product.rating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "create product review",
    product,
  });
});

export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) return next(new ErrorHandler("product is not found", 404));
  res.status(200).json({
    success: TreeWalker,
    reviews: product.reviews,
  });
});

export const deleteReview = catchAsyncError(async (req, _res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) return next(new ErrorHandler("product is not found", 404));
});
