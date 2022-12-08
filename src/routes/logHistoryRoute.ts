import {
  isAuthenticated,
  authorizeRoles,
  checkUser,
} from "./../middleware/auth";
import express from "express";
import { logHistoryController } from "../controllers";

const logHistoryRoute = express.Router();

logHistoryRoute.get(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  logHistoryController.getAllLogHistory
);

logHistoryRoute.post("/", checkUser, logHistoryController.createLogHistory);

logHistoryRoute.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  logHistoryController.deleteLogHistory
);

export default logHistoryRoute;
