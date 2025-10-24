import { ApiError } from "../utils/api.Error.js";
import { asynHandler } from "../utils/asyncHandler.js";
import Product from '../models/product.model.js'

export const addToCart = asynHandler(async(req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user

        const existingItem = user.cartItems.find(item => item.id === productId)
        if (existingItem) {
            existingItem.quantity += 1;
        }else{
            user.cartItems.push(productId)
        }

        await user.save()
        res.json(user.cartItems)

    } catch (error) {
        throw new ApiError(500, "Server error while adding cart");
    }  
})


export const getCartProducts = asynHandler(async(req, res) => {
    try {
        const products = await Product.find({_id: {$in: req.params.cartItems}})
        const cartItems = products.map((product)=>{
        const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id)
        return {...products.toJSON(), quantity: item.quantity};
        })
        res.json(cartItems)
    } catch (error) {
        throw new ApiError(500, "server error while geting cards");     
    }
})


export const removeAllFromCart = asynHandler(async(req, res) => {
    try {
        const {productId} = req.body
        const user = req.user
        if (!productId) {
            user.cartItems = []
        }else{
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        throw new ApiError(500, "server errro while removing cartItems");
        
    }
})


export const updateQuantity = asynHandler(async(req, res) => {
    try {
        const {id:productId} = req.params
        const {quantity} = req.body
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId)

        if (existingItem) {
            if (quantity === 0) { 
                user.cartItems = user.cartItems.filter((item) => item.id !== productId)  
                await user.save();
                return res.json(user.cartItems)
            }
            existingItem.quantity = quantity
            await user.save()
            res.json(user.cartItems)
        }else{
            throw new ApiError(404, "Product not found for update")
        }
    } catch (error) {
        throw new ApiError(500, "server error while updating product");
        
    }  
})

