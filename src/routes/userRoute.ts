import express, { Request, Response } from "express";

const userRouter = express.Router();

userRouter.get("/", (_: Request, res: Response) => {
  return res.status(200).json({
    message: "hello is router user",
  });
});

export default userRouter;
