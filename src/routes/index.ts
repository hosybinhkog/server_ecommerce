import express from "express";
import orderRoute from "./orderRoute";
import paymentRoute from "./paymentRoute";
import productRoute from "./productRoute";
import userRouter from "./userRoute";

const router = express.Router();
router.use("/api/v1/product", productRoute);
router.use("/api/v1/user", userRouter);
router.use("/api/v1/order", orderRoute);
router.use("/api/v1/payment", paymentRoute);

export default router;
