import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCardStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";


const OrderSummary = () => {
  // extract info from store
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSaving = savings.toFixed(2);

  const handleStripePayment = async () => {
  try {
    // const stripe = stripePromise
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    // Redirect user to Stripe Checkout page
    window.location.href = res.data.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};

  

  return (
    <motion.div
      className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <p className="text-lg font-semibold text-emerald-400">Order Summary</p>

      <div className="space-y-3">
        <dl className="flex justify-between text-sm text-gray-300">
          <dt>Original price</dt>
          <dd>₹{formattedSubtotal}</dd>
        </dl>

        {/* if savings is greater then 0 sgow saving */}
        {savings > 0 && (
          <dl className="flex justify-between text-sm text-emerald-400">
            <dt>Savings</dt>
            <dd>- ₹{formattedSaving}</dd>
          </dl>
        )}

        {/* if coupon and iscouponApplied then show coupon code */}
        {coupon && isCouponApplied && (
          <dl className="flex justify-between text-sm text-emerald-400">
            <dt>Coupon ({coupon.code})</dt>
            <dd>₹{coupon.discountPercentage}%</dd>
          </dl>
        )}

        <dl className="flex justify-between border-t border-gray-700 pt-3 text-base font-bold">
          <dt>Total</dt>
          <dd className="text-emerald-400">₹{formattedTotal}</dd>
        </dl>
      </div>

      <motion.button
        className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 transition-all"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStripePayment}>
        Proceed to Checkout
      </motion.button>

      <div className="text-center text-sm text-gray-400">
        or{" "}
        <Link
          to="/"
          className="text-emerald-400 underline hover:text-emerald-300">
          Continue Shopping <MoveRight size={14} className="inline ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderSummary;


