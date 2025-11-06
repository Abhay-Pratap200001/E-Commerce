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



  featchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
      toast.success("Success fully get all products", {id: 'login'});
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch product",);
    }
  },


  featchProductsByCategory: async (Category) => {
    set({loading: true})
    try {
      const response = await axios.get(`/products/category/${Category}`)
      set({products: response.data.products, loading: false})
    } catch (error) {
      set({error: "Failed to fetch products", loading: false});
      toast.error(error.response.data.error || 'Failed to fetch Products')      
    }
  },



 deleteProduct: async (productId) => {
  set({ loading: true });
  try {
    await axios.delete(`/products/${productId}`);
    set((state) => ({
      products: state.products.filter((p) => p._id !== productId),
      loading: false,
    }));

    toast.success("🗑️ Product deleted successfully!", {id: 'login'});
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.error || "Failed to delete product", {id: 'login'});
  }
},


 	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product),

				loading: false,
			}));
      
       if (response.data.isFeatured) {
      toast.success("⭐ Product marked as Featured successfully!");
    } else {
      toast("⭐ Product unfeatured successfully");
    }
      
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},


  fetchFeaturedProducts: async () => {
    set({loading: true})
    try {
      const response = await axios.get("/products/featured")
      set({products: response.data, loading: false})
    } catch (error) {
      console.log(error, "error while featching featured product");
    }
  }

}));
