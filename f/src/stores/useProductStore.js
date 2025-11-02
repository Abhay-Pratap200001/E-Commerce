import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
  // store state
  products: [], // all products will be stored here
  loading: false, // to show loading spinner

  // function to set all products (used when fetching)
  setProducts: (products) => set({ products }),

  // function to create a new product
  createProduct: async (productData) => {
    set({ loading: true }); // show loading

    try {
      // send product data to backend
      const res = await axios.post("/products", productData);

      // update products list with new one
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false, // stop loading
      }));

      toast.success("Product added!"); // show success message
    } catch (error) {
      // show error message if something goes wrong
      toast.error(error.response?.data?.error || "Failed to add product");
      set({ loading: false });
    }
  },
}));
