import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCardStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import { useEffect } from "react";

const CartPage = () => {
  // getting all cart from store
  const { cart, getCartItems } = useCartStore();

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="py-10 md:py-16 text-white min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-8 flex flex-col lg:flex-row lg:items-start lg:gap-10">
          <motion.div
            className="w-full lg:max-w-3xl xl:max-w-4xl space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}

            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {cart.length > 0 && (
            <motion.div
              className="w-full mt-10 lg:mt-0 lg:w-1/3 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <OrderSummary />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

// Reusable Empty Cart UI
const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-6 py-20 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900 to-black shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}>
    <ShoppingCart className="h-20 w-20 text-emerald-400" />
    <h3 className="text-2xl font-semibold text-white">Your cart is empty</h3>
    <p className="text-gray-400 text-sm">
      Looks like you haven’t added anything yet.
    </p>
    <Link
      className="mt-2 rounded-lg bg-emerald-500 px-6 py-2 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
      to="/">
      Start Shopping
    </Link>
  </motion.div>
);
