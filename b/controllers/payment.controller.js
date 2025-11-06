import dotenv from "dotenv";
import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.Error.js";
import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/sripe.js";
import Order from '../models/order.model.js'

dotenv.config();

// CREATE STRIPE CHECKOUT SESSION
export const createCheckoutSession = asynHandler(async (req, res) => {
  const { products, couponCode } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Invalid or empty products array");
  }

  let totalAmount = 0;

  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100);
    totalAmount += amount * product.quantity;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity || 1,
    };
  });
  

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});

    if (coupon) {
      totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    discounts: coupon ? [{coupon: await createStripeCoupon(coupon.discountPercentage)}] : [],

    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
      products: JSON.stringify(products.map((p) => ({id: p._id, quantity: p.quantity, price: p.price}))
      ),
    },
  });

  if (totalAmount >= 20000) {
    await createNewCoupon(req.user._id);
  }

  res.status(200).json({
    url: session.url,
    totalAmount: totalAmount / 100,
  });
});






export const checkoutSuccess = asynHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new ApiError(400, "Missing session ID");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.payment_status !== "paid") {
    throw new ApiError(400, "Payment not completed");
  }

  //  Step 1: Check if order already exists for this session
  const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
  if (existingOrder) {
    return res.status(200).json({
      success: true,
      message: "Order already exists for this payment session.",
      orderId: existingOrder._id,
    });
  }

  //  Step 2: Safe parse products
  let products = [];
  try {
    products = JSON.parse(session.metadata.products || "[]");
  } catch (err) {
    console.error("Error parsing products:", err);
    products = [];
  }

  //  Step 3: Deactivate used coupon
  if (session.metadata.couponCode) {
    await Coupon.findOneAndUpdate(
      {
        code: session.metadata.couponCode,
        userId: session.metadata.userId,
      },
      { isActive: false }
    );
  }

  //  Step 4: Create order
  const newOrder = new Order({
    user: session.metadata.userId,
    products: products.map((product) => ({
      product: product.id,
      quantity: product.quantity,
      price: product.price,
    })),
    totalAmount: session.amount_total / 100,
    stripeSessionId: sessionId,
  });

  await newOrder.save();

  res.status(200).json({
    success: true,
    message: "Payment successful, order created, and coupon deactivated if used.",
    orderId: newOrder._id,
  });
});




// HELPER FUNCTIONS
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}



async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId,
  });

  await newCoupon.save();
  return newCoupon;
}









// // CREATE STRIPE CHECKOUT SESSION
// export const createCheckoutSession = asynHandler(async (req, res) => {
//   try {
//     const { products, couponCode } = req.body; // coming from frontend body (POST request)

//     if (!Array.isArray(products) || products.length === 0) {
//       throw new ApiError(400, "Invalid or empty products array");
//     }

//     let totalAmount = 0; 
//     const lineItems = products.map((product) => {
//       const amount = Math.round(product.price * 100); // Convert dollars → cents
//       totalAmount += amount * product.quantity; // Add to total amount based on quantity

//       return {
//         price_data: {currency: "usd", 
//           product_data: {name: product.name, images: [product.image]},
//           unit_amount: amount, 
//         },
//         quantity: product.quantity, 
//       };
//     });


//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});

//       if (coupon) {
//         totalAmount -= Math.round(
//           (totalAmount * coupon.discountPercentage) / 100
//         );
//       }
//     }


//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
//       discounts: coupon
//         ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
//         : [],
//       metadata: {
//         userId: req.user._id.toString(),
//         couponCode: couponCode || "",
//         products: JSON.stringify(
//           products.map((p) => ({
//             id: p._id,
//             quantity: p.quantity,
//             price: p.price,
//           }))
//         ),
//       },
//     });

//     res
//       .status(200)
//       .json({
//         id: session.id,
//         url: session.url,
//         totalAmount: totalAmount / 100,
//       });
//   } catch (error) {
//     console.log("Error processing checkout:", error);
//     throw new ApiError(500, "Error processing checkout");
//   }
// });


// async function createStripeCoupon(discountPercentage) {
//   const coupon = await stripe.coupons.create({
//     percent_off: discountPercentage, // how much discount to apply
//     duration: "once", // one-time use only
//   });
//   return coupon.id; // returns the coupon ID to Stripe session
// }


// async function createNewCoupon(userId) {
//   const newCoupon = new Coupon({
//     code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // random coupon code
//     discountPercentage: 10, // 10% discount
//     expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // valid for 30 days
//     userId: userId, // assigned to current logged-in user
//   });
//   console.log("Creating new coupon for user:", userId);

//   await newCoupon.save(); // save coupon to MongoDB collection
//   return newCoupon;
// }







// // controller for payment checkout
// export const checkoutSuccess = asynHandler(async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Payment not completed" });
//     }

    
//     // Avoid duplicate order creation
//     const existingOrder = await order.findOne({ stripeSessionId: sessionId });
//     if (existingOrder) {
//       return res.status(200).json({
//         success: true,
//         message: "Order already exists.",
//         orderId: existingOrder._id,
//       });
//     }


//     // Deactivate used coupon (if any)
//     if (session.metadata.couponCode) {
//       await Coupon.findOneAndUpdate(
//         {
//           code: session.metadata.couponCode,
//           userId: session.metadata.userId,
//         },
//         { isActive: false }
//       );
//     }


//     const products = JSON.parse(session.metadata.products);

//     const newOrder = new order({
//       user: session.metadata.userId,
//       products: products.map((p) => ({
//         product: p.id,
//         quantity: p.quantity,
//         price: p.price,
//       })),
//       totalAmount: session.amount_total / 100,
//       stripeSessionId: sessionId,
//     });

//     await newOrder.save();

//     // Create loyalty coupon after successful payment
//     if (session.amount_total >= 200) {
//       await createNewCoupon(session.metadata.userId);
//     }

//     res.status(200).json({
//       success: true,
//       message:
//         "Payment successful, order created and coupon deactivated (if used).",
//       orderId: newOrder._id,
//     });
//   } catch (error) {
//     console.log("❌ Error processing checkout success:", error);
//     throw new ApiError(500, "Error processing checkout success");
//   }
// });


// export const checkoutSuccess = async (req, res) => {
// 	try {
// 		const { sessionId } = req.body;
// 		const session = await stripe.checkout.sessions.retrieve(sessionId);

// 		if (session.payment_status === "paid") {
// 			if (session.metadata.couponCode) {
// 				await Coupon.findOneAndUpdate(
// 					{
// 						code: session.metadata.couponCode,
// 						userId: session.metadata.userId,
// 					},
// 					{
// 						isActive: false,
// 					}
// 				);
// 			}

// 			// create a new Order
// 			const products = JSON.parse(session.metadata.products);
// 			const newOrder = new order({
// 				user: session.metadata.userId,
// 				products: products.map((product) => ({
// 					product: product.id,
// 					quantity: product.quantity,
// 					price: product.price,
// 				})),
// 				totalAmount: session.amount_total / 100, // convert from cents to dollars,
// 				stripeSessionId: sessionId,
// 			});

// 			await newOrder.save();

// 			res.status(200).json({
// 				success: true,
// 				message: "Payment successful, order created, and coupon deactivated if used.",
// 				orderId: newOrder._id,
// 			});
// 		}
// 	} catch (error) {
// 		console.error("Error processing successful checkout:", error);
// 		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
// 	}
// };

// async function createStripeCoupon(discountPercentage) {
// 	const coupon = await stripe.coupons.create({
// 		percent_off: discountPercentage,
// 		duration: "once",
// 	});

// 	return coupon.id;
// }

// async function createNewCoupon(userId) {
// 	await Coupon.findOneAndDelete({ userId });

// 	const newCoupon = new Coupon({
// 		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
// 		discountPercentage: 10,
// 		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
// 		userId: userId,
// 	});

// 	await newCoupon.save();

// 	return newCoupon;
// }