import express from "express";
import { categoryController } from "../controllers";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const categoryRoute = express.Router();

categoryRoute.get("/", categoryController.getCategories);
categoryRoute.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  categoryController.createCategory
);

export default categoryRoute;
