import { Order, Product } from "../models";
import ErrorHandler from "../utils/errorHandle";
import catchAsyncError from "../middleware/catchAsyncError";

export async function updateStock(id: string, quanlity: number) {
  const product = await Product.findById(id);

  if (!product) return;
  product.Stock -= quanlity;
  await product.save({ validateBeforeSave: false });
}

export const newOrder = catchAsyncError(async (req, res, _next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    //@ts-ignore
    user: req.user._id,
  });

  res.status(200).json({
    succcess: true,
    order,
  });
});

export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) return next(new ErrorHandler("Order not found", 404));

  res.status(200).json({
    success: true,
    message: "get single order successfully",
    order,
  });
});

export const updateStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("order is not found", 404));

  order.orderStatus = order.orderStatus === "Success" ? "Process" : "Success";

  await order.save();

  res.status(200).json({
    success: true,
    order,
    message: "Update successfully",
  });
});

export const myOrders = catchAsyncError(async (req, res, _next) => {
  // @ts-ignore
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    message: "get my orders successfully",
    orders,
    success: true,
  });
});

export const myOrdersMe = catchAsyncError(async (req, res, _next) => {
  // @ts-ignore
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    message: "get my orders successfully",
    orders,
    success: true,
  });
});

export const getAllOrders = catchAsyncError(async (_req, res, _next) => {
  const orders = await Order.find({});
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice as number;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
    total: orders.length,
  });
});

export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order not found", 404));
  if ((order.orderStatus = "Delivered")) {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product?._id as string, item.quantity as number);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order not found", 404));

  await order.remove();

  res.status(200).json({
    success: true,
    message: "order delete success",
  });
});
