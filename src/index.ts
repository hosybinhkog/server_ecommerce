require("dotenv").config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressFileUpload from "express-fileupload";

import connectMongo from "./services/connectMongo";
import router from "./routes";

const PORT = process.env.PORT;

console.log(PORT);

const main = async () => {
  const app = express();
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

  app.use("/api/v1/", router);
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
  });
};

main();
