import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const catchAsyncError =
  (
    theFunc: (
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
      res: Response<any, Record<string, any>>,
      next: NextFunction
    ) => any
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

export default catchAsyncError;
