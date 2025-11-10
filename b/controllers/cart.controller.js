import { ApiError } from "../utils/api.Error.js";
import { asynHandler } from "../utils/asyncHandler.js";
import Product from '../models/product.model.js'

export const addToCart = asynHandler(async(req, res) => {
    try {
        //getting product id and user id and keeping product it into  {productId} variable
        const {productId} = req.body;
        const user = req.user

        //if user.cartItems item.id is equal to product id increment it
        const existingItem = user.cartItems.find(item => item.id === productId)
        if (existingItem) {
            existingItem.quantity += 1;
        }else{
            //else if its empty add new product into card
            user.cartItems.push(productId)
        }

        await user.save()
        res.json(user.cartItems)

    } catch (error) {
        throw new ApiError(500, "Server error while adding cart");
    }  
})


export const getCartProducts = asynHandler(async (req, res) => {
  try {
    //  Extract product IDs from user's cart
    const productIds = req.user.cartItems.map((item) => item.id);

    //  Find all products that are in user's cart
    const products = await Product.find({ _id: { $in: productIds } });

    //  Combine product details with quantity
    const cartItems = products.map((product) => {
      // find cartItem which is equal to product
      const item = req.user.cartItems.find((cartItem) => cartItem.id === product._id.toString());

      // return product and qunatity of product
      return {...product.toJSON(),quantity: item.quantity};
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Server error while fetching cart items");
  }
});


// remove product from cart
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



export const updateQuantity = asynHandler(async (req, res) => {
  try {
    //getting product from id and quantity of product
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    //find cardItem which is equal to productId
    const existingItem = user.cartItems.find((item) => item.id.toString() === productId);

    if (existingItem) {
      //if quantity is  zero of product in cart then remove the product
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id.toString() !== productId);
      } else {
        // or add first quantity 
        existingItem.quantity = quantity;
      }
      await user.save();
      res.json(user.cartItems);
    } else {
      throw new ApiError(404, "Product not found for update");
    }
  } catch (error) {
    throw new ApiError(500, "Server error while updating product");
  }
});

