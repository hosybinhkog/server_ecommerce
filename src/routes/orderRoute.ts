import express from "express";
import {
  isAuthenticated as isAuthenticatedUser,
  authorizeRoles,
} from "../middleware/auth";
import { orderController } from "../controllers";

const orderRoute = express.Router();

orderRoute.post("/new", isAuthenticatedUser, orderController.newOrder);

orderRoute.get("/me", isAuthenticatedUser, orderController.myOrdersMe);

orderRoute.get(
  "/admin",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.getAllOrders
);

orderRoute.put(
  "/admin/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.updateOrder
);

orderRoute.delete(
  "/admin/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.deleteOrder
);

orderRoute.get("/:id", isAuthenticatedUser, orderController.getSingleOrder);

orderRoute.get(
  "/updateStatus/:id",
  isAuthenticatedUser,
  orderController.updateStatus
);

export default orderRoute;
