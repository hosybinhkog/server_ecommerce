import express from "express";
import userRouter from "./userRoute";

const router = express.Router();
router.use("/user", userRouter);

export default router;
