import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.Error.js";
import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/sripe.js";
import order from "../models/order.model.js";

// CREATE STRIPE CHECKOUT SESSION
export const createCheckoutSession = asynHandler(async (req, res) => {
  try {
    /*
       STEP 1: Get required data from frontend
      ------------------------------------------------
      -> products: list of products user is purchasing (with price, quantity, etc.)
      -> couponCode: (optional) discount code entered by user
      -> req.user: available because of protectRoute middleware, contains logged-in user's info
    */
    const { products, couponCode } = req.body; // coming from frontend body (POST request)

    // STEP 2: Validate that products array is valid (not empty)
    if (!Array.isArray(products) || products.length === 0) {
      throw new ApiError(400, "Invalid or empty products array");
    }

    let totalAmount = 0; // Will store total price of all items (in cents 💲→¢)

    /*
       STEP 3: Prepare Stripe Line Items
      ------------------------------------------------
      -> Stripe requires "line_items" to know what user is buying.
      -> Each item must include name, price (in cents), quantity, and image.
      -> Stripe accepts prices in CENTS, so we multiply by 100.
      -> totalAmount is used later to calculate total price and apply discounts.
    */
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // Convert dollars → cents
      totalAmount += amount * product.quantity; // Add to total amount based on quantity

      return {
        price_data: {
          currency: "usd", // Stripe expects 3-letter currency code
          product_data: {
            name: product.name, // Product name shown on Stripe checkout
            images: [product.image], // Product image for checkout UI
          },
          unit_amount: amount, // Price per unit (in cents)
        },
        quantity: product.quantity, // Quantity user wants to buy
      };
    });

    /*
       STEP 4: Check if user entered a valid coupon code
      ------------------------------------------------
      -> We find coupon in MongoDB where:
          - code matches the user's entered couponCode
          - userId matches the logged-in user (so coupon is user-specific)
          - isActive is true (not expired or deactivated)
      -> If found, apply discountPercentage to totalAmount.
    */
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id, // user info comes from protectRoute middleware
        isActive: true,
      });

      // If valid coupon found → apply discount on total
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    /*
       STEP 5: Create Checkout Session in Stripe
      ------------------------------------------------
      -> This creates a payment session on Stripe's server.
      -> Stripe will handle UI, payments, and redirects.
      -> We also pass metadata (user info, product info, coupon) to Stripe.
      -> After successful payment, Stripe will redirect back to our frontend success page.
    */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pay_by_bank", "paypal"], // Supported payment options
      line_items: lineItems, // Products user is purchasing (created above)
      mode: "payment", // One-time payment mode
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancle`,

      // If coupon exists, send discount to Stripe
      discounts: coupon ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage), // helper fn below
            },
          ] : [],

      // Metadata → stored on Stripe; used later in webhook to identify order details
      metadata: {
        userId: req.user._id.toString(), // logged-in user's MongoDB ID
        couponCode: couponCode || "", // optional coupon code
        products: JSON.stringify(
          products.map((p) => ({ id: p._id, // product ID from MongoDB
            quantity: p.quantity, price: p.price, }))
        ),
      },
    });



    /*
       STEP 6: Loyalty reward → if total purchase >= $200
      ------------------------------------------------
      -> Stripe uses cents, so 20000 = $200.
      -> If user spends more than $200, we create a new coupon for them.
      -> Uses helper function createNewCoupon(userId)
    */
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    /*
       STEP 7: Send back response to frontend
      ------------------------------------------------
      -> session.id: required by frontend to redirect user to Stripe checkout page.
      -> totalAmount: converted back to dollars for display.
    */
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("Error processing checkout:", error);
    throw new ApiError(500, "Error processing checkout");
  }
});


/* ---------------------------------------------------------------------
    HELPER FUNCTION #1
   ---------------------------------------------------------------------
   createStripeCoupon(discountPercentage)
   → Creates a temporary coupon on Stripe (for checkout screen visuals)
   → Called inside: createCheckoutSession()
   → Stripe coupons only exist on Stripe, not our DB
--------------------------------------------------------------------- */
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage, // how much discount to apply
    duration: "once", // one-time use only
  });
  return coupon.id; // returns the coupon ID to Stripe session
}

/* ---------------------------------------------------------------------
    HELPER FUNCTION #2
   ---------------------------------------------------------------------
   createNewCoupon(userId)
   → Creates a new coupon in MongoDB for the user as a reward.
   → Called inside: createCheckoutSession() (if totalAmount >= 20000)
   → Gives 10% off for next purchase, valid for 30 days.
--------------------------------------------------------------------- */
async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // random coupon code
    discountPercentage: 10, // 10% discount
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // valid for 30 days
    userId: userId, // assigned to current logged-in user
  });

  await newCoupon.save(); // save coupon to MongoDB collection
  return newCoupon;
}








// Controller: checkoutSuccess
export const checkoutSuccess = asynHandler(async (req, res) => {
  try {
    /*
       STEP 1: Extract Stripe Session ID from frontend request
      ------------------------------------------------
      -> sessionId is sent from frontend after successful payment redirect.
      -> We’ll use it to verify payment and fetch details from Stripe.
    */
    const { sessionId } = req.body;

    // Fetch the full session details from Stripe servers
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    /*
       STEP 2: Verify if payment was successful
      ------------------------------------------------
      -> session.payment_status can be:
         - 'paid' → payment done successfully
         - 'unpaid' / 'pending' → not completed
      -> Only proceed if payment_status === 'paid'
    */
    if (session.payment_status === "paid") {

      /*
         STEP 3: Deactivate used coupon (if any)
        ------------------------------------------------
        -> When user applies a coupon, we stored it in metadata (in createCheckoutSession).
        -> Now, we’ll find that coupon in MongoDB and mark it as inactive (so it can’t be reused).
      */
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,  // coupon code stored in metadata
            userId: session.metadata.userId,    // user ID stored in metadata
          },
          { isActive: false }                   // mark coupon as used
        );
      }

      /*
        📦 STEP 4: Create a new Order in MongoDB
        ------------------------------------------------
        -> session.metadata.products was stored as a JSON string in checkout creation.
        -> Parse it to get array of products (each with id, price, quantity)
        -> Then create new Order document linked to user.
      */
      const products = JSON.parse(session.metadata.products);

      const newOrder = new order({
        user: session.metadata.userId, // user ID from Stripe metadata

        // products array: map each product with productId, quantity, and price
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),

        totalAmount: session.amount_total / 100, // Stripe returns cents, convert to dollars
        stripeSessionId: sessionId, // to avoid duplicate orders in future
      });

      // Save order in MongoDB
      await newOrder.save();

      /*
        ✅ STEP 5: Respond to frontend
        ------------------------------------------------
        -> Send success message with newly created order ID
        -> This confirms payment and order creation success
      */
      res.status(200).json({
        success: true,
        message: "Payment successful, order created and coupon deactivated (if used).",
        orderId: newOrder._id,
      });
    }

  } catch (error) {
    console.log("❌ Error processing checkout success:", error);
    throw new ApiError(500, "Error processing checkout success");
  }
});


/*

🧠 Example Flow (Full Journey)

1️⃣ User adds items to cart and clicks “Buy Now.”
⬇️
2️⃣ Frontend sends { products, couponCode } → createCheckoutSession.
⬇️
3️⃣ Backend creates Stripe session → returns session.id.
⬇️
4️⃣ Frontend redirects user to Stripe Checkout (payment).
⬇️
5️⃣ After successful payment → Stripe redirects frontend → sends { sessionId } → checkoutSuccess.
⬇️
6️⃣ Backend verifies payment → creates Order in DB → deactivates Coupon.
⬇️
7️⃣ User sees “Payment Successful” page 🎉

*/