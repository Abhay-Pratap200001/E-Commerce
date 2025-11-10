import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  // initial states
  cart: [],
  total: 0,
  subtotal: 0,



  // Get Cart Items
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.error || "Error while fetching cart");
    }
  },





  // Add Product to Cart
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });

      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);

        const newCart = existingItem ? prevState.cart.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });

      get().calculateTotals();
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error while adding product");
    }
  },




  // Remove Product from Cart
  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing item");
    }
  },






  // Update Quantity
  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }

      await axios.put(`/cart/${productId}`, { quantity });

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating quantity");
    }
  },





  // Clear Cart
  clearCart: async () => {
    set({ cart: [], total: 0, subtotal: 0 });
    toast.success("Cart cleared");
  },





  // Calculate Totals
  calculateTotals: () => {
    const { cart } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal;

    set({ subtotal, total });
  },
}));
