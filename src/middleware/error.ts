import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandle";

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.code = err.code || 500;
  err.message = err.message || "Error server internal";

  if (err.name === "CastError") {
    const message = "Resource not found Invalid:" + err.path;
    err = new ErrorHandler(message, 404);
  }

  if (err.code === 11000) {
    const message = "email is doulecap";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "jsonWebTokenError") {
    const message = "Json web token is valid try again.";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "TokenExpiredError.";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.code).json({
    success: false,
    message: err.message,
    code: err.code,
  });
};

export default errorMiddleware;
