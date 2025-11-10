
import dotenv from "dotenv";
import { ApiError } from "../utils/api.Error.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { stripe } from "../lib/sripe.js";
import Order from "../models/order.model.js";
dotenv.config();


// CREATE STRIPE CHECKOUT SESSION
export const createCheckoutSession = asynHandler(async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Invalid or empty products array");
  }

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
        images: [product.image],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity || 1,
  }));



// creating payment session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    metadata: {
      userId: req.user._id.toString(),
      products: JSON.stringify(
        products.map((p) => ({ id: p._id, quantity: p.quantity, price: p.price}))
      ),
    },
  });

  res.status(200).json({
    url: session.url,
  });
});




// CHECKOUT SUCCESS AFTER PAYMENT 
export const checkoutSuccess = asynHandler(async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const products = JSON.parse(session.metadata.products);

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({product: product.id, quantity: product.quantity, price: product.price})),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Payment successful and order created.",
        orderId: newOrder._id,
      });
    } else {
      throw new ApiError(400, "Payment not completed");
    }
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
});
