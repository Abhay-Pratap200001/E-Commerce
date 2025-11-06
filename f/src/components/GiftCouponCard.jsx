import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCardStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, removeCoupon, applyCoupon, isCouponApplied, getMyCoupon } = useCartStore();

  // Fetch user's available coupon when component mounts
  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  // Auto-fill coupon input if already applied
  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!userInputCode.trim()) return;
    await applyCoupon(userInputCode.trim());
  };

  // Remove coupon
  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label className="block text-sm font-medium text-gray-300">
        Have a gift card or coupon?
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter code"
          value={userInputCode}
          onChange={(e) => setUserInputCode(e.target.value)}
          className="flex-1 rounded-lg border border-gray-600 bg-gray-800 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 px-3 py-2"
        />

        {/* Apply Coupon Button */}
        <motion.button
          onClick={handleApplyCoupon}
          disabled={isCouponApplied}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
            isCouponApplied ? "bg-gray-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400"}`}
          whileHover={!isCouponApplied ? { scale: 1.05 } : {}}
          whileTap={!isCouponApplied ? { scale: 0.97 } : {}}>
          {isCouponApplied ? "Applied" : "Apply"}
        </motion.button>
      </div>

      {/* Show active coupon */}
      {coupon && (
        <div className="mt-3 border-t border-gray-700 pt-3 space-y-2">
          <p className="text-gray-300 text-sm">
            Applied{" "}
            <span className="text-emerald-400 font-medium">{coupon.code}</span> —{" "}
            {coupon.discountPercentage}% off
          </p>

          {/* ✅ Remove Coupon Button */}
          <motion.button
            onClick={handleRemoveCoupon}
            className="w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
