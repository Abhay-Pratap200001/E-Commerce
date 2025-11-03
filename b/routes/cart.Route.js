import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { addToCart, getCartProducts, updateQuantity, removeAllFromCart } from '../controllers/cart.controller.js'

const router = express.Router()

router.post('/', protectRoute, addToCart)
router.get('/', protectRoute, getCartProducts)
router.put('/:id', protectRoute, updateQuantity)
router.delete('/', protectRoute, removeAllFromCart)




export default router