import React from 'react'
import toast from 'react-hot-toast'
import { ShoppingCart } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import { motion } from 'framer-motion'
import { useCartStore } from '../stores/useCardStore'

const ProductCard = ({ product }) => {
	const { user } = useUserStore()
	const { addToCart } = useCartStore()

	const handleAddToCart = () => {
		if (!user) {
			toast.error('Please log in first', { id: 'login' })
		} else {
			addToCart(product)
			toast.success('Added to cart', { icon: '🛒' })
		}
	}

	return (
		<motion.div
			className="flex flex-col relative overflow-hidden rounded-2xl border border-emerald-700/30 
			bg-gradient-to-b from-gray-950 via-black to-gray-900 shadow-[0_0_15px_rgba(16,185,129,0.1)]
			hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-2 
			w-full max-w-xs"
			whileHover={{ scale: 1.03 }}>
			{/* Product Image */}
			<div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
				<img
					className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
					src={product.image}
					alt={product.name}/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
			</div>

			{/* Info Section */}
			<div className="p-5 flex flex-col justify-between flex-1">
				<h5 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-1">
					{product.name}
				</h5>

				<p className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
					₹{product.price}
				</p>

				{/* Add to Cart Button */}
				<motion.button
					whileTap={{ scale: 0.95 }}
					onClick={handleAddToCart}
					className="mt-4 flex items-center justify-center w-full rounded-lg bg-emerald-600/90 
					px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]
					hover:bg-emerald-700 hover:shadow-[0_0_20px_rgba(16,185,129,0.8)]
					transition-all duration-300">
					<ShoppingCart size={20} className="mr-2" />
					Add to Cart
				</motion.button>
			</div>
		</motion.div>
	)
}

export default ProductCard
