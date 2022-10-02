import express from "express";
import { paymentController } from "../controllers";
import { isAuthenticated as isAuthenticatedUser } from "../middleware/auth";

const paymentRoute = express.Router();

paymentRoute.post(
  "/payment/process",
  isAuthenticatedUser,
  paymentController.processPayment
);
paymentRoute.get(
  "/stripapikey",
  isAuthenticatedUser,
  paymentController.sendStripeApiKey
);

export default paymentRoute;
