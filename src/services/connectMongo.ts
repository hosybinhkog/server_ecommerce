require("dotenv").config();
import mongoose from "mongoose";

const db = () => {
  mongoose
    .connect(`${(process.env.URL_CONNECT_DB as string) || ""}`)
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.log(`Connect Mongo is error ::: ${error.message}`);
    });
};

export default db;
