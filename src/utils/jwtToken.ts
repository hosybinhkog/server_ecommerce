import { Response } from "express";

const sendToken = async (user: any, statusCode: number, res: Response) => {
  const token = user?.getJWTToken();

  const options = {
    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    withCredentials: true,
  };

  return res.cookie("token", token, options).status(statusCode).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
