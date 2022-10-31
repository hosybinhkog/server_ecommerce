require("dotenv").config();
import catchAsyncError from "../middleware/catchAsyncError";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
  apiVersion: "2022-08-01",
});

export const processPayment = catchAsyncError(async (req, res, _next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});
export const sendStripeApiKey = catchAsyncError(async (_req, res, _next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
