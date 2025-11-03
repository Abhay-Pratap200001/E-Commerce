import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const  useCartStore = create ((set, get) => ({
    // intial states of cart
    cart:[],
    coupon:null,
    total:0,
    subtotal:0,
    isCouponApplied:false,


    //getting the card Items
    getCardItems: async() => {
        try {
            const res = await axios.get("/cart");
            set({cart: res.data});
            get().calculateTotals() //calling fun to calculate total of product price
        } catch (error) {
            set({cart:[]})
            toast.error(error.res.data.error || "Error while featching card")
        }
    },




    //adding product into card
    addToCart: async(product)=>{
        try {
            // sendig product id
            await axios.post("/cart", {productId:product._id})

            //increment the qunatity of product
            set((prevState) => {
                // find cartid which is equal to product id
                const existinItem = prevState.cart.find((item) => item._id === product._id)

                // cart id is equal to product id them increase the quantity buy one of product id else  give cart and quantity of product
                const newCart = existinItem ? prevState.cart.map((item) => (item._id === product._id ? {...item, quantity: item.quantity + 1}: item)) : [...prevState.cart, {...product, quantity:1}]
                return {cart: newCart}
            })
            get().calculateTotals()  // for calculating the price
        } catch (error) {
            toast.error(error.response.data.message || "Error while adding product")   
        }
    },





    removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { data: { productId } });
    set((prevState) => ({cart: prevState.cart.filter((item) => item._id !== productId)}));
    get().calculateTotals(); 
},





updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
        get().removeFromCart(productId); // if product qunatity is less then 0 then remove product from card
        return;
    }

    //else sending productId and quantity of product
    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({ cart: prevState.cart.map((item) => item._id === productId ? { ...item, quantity } : item)}));
    get().calculateTotals(); // for update total after quantity change
},




    //calculating the product price
    calculateTotals: () => {
        const {cart, coupon} = get()
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        let total = subtotal

        // if there is coupon then divide the price of price.dicount from 100
        if (coupon) {
            const discount = subtotal * (coupon.discount/ 100)
            total  = subtotal - discount
        }

       set({ subtotal, total })

    },

}))