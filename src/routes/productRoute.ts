import express from "express";
import { productController } from "../controllers";
import {
  isAuthenticated as isAuthenticatedUser,
  authorizeRoles,
} from "../middleware/auth";

const productRoute = express.Router();
productRoute.get("/None", productController.getAllProducNonSort);

productRoute.get("/", productController.getAllProducts);

productRoute.get(
  "/admin",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.getProductsAdmin
);

productRoute.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.createProduct
);

productRoute.put(
  "/review",
  isAuthenticatedUser,
  productController.createProductReview
);

productRoute.get("/reviews", productController.getProductReviews);

productRoute.delete(
  "/reviews",
  isAuthenticatedUser,
  productController.deleteReview
);

productRoute.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.updateProduct
);
productRoute.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.deleteProduct
);
productRoute.get("/:id", productController.getProductDetails);

export default productRoute;
