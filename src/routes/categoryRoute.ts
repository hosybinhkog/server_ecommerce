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

categoryRoute.get("/:id", categoryController.getCategoryById);

categoryRoute.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  categoryController.updateCategory
);

export default categoryRoute;
