import express from "express";
import { userController } from "src/controllers";
import { isAuthenticated, authorizeRoles } from "src/middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/logout", userController.logout);
userRouter.post("/change-password", userController.forgotPassword);
userRouter.put("/password/reset/:token", userController.resetPassword);
userRouter.get("/me", isAuthenticated, userController.getUserDetails);
userRouter.put(
  "/password/update",
  isAuthenticated,
  userController.updatePassword
);

userRouter.put("/me/update", isAuthenticated, userController.updateProfile);
userRouter.get(
  "/admin/users",
  isAuthenticated,
  authorizeRoles("admin"),
  userController.getSingleUser
);

userRouter.put(
  "admin/user:id",
  isAuthenticated,
  authorizeRoles("admin"),
  userController.updateUserRole
);

userRouter.delete(
  "admin/user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  userController.deleteUser
);

export default userRouter;
