require("dotenv").config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressFileUpload from "express-fileupload";
import cloundinary from "cloudinary";

import connectMongo from "./services/connectMongo";
import router from "./routes";
import errorMiddleware from "./middleware/error";

const PORT = process.env.PORT;

console.log(PORT);

const main = async () => {
  const app = express();
  cloundinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  app.use(
    cors({
      origin: "http://localhost:6969",
      credentials: true,
    })
  );
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(expressFileUpload());

  app.use(router);
  app.use(errorMiddleware);
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
  });
};

main();
