import React, { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { motion } from 'framer-motion'

const CategoryPage = () => {
	const { featchProductsByCategory, products } = useProductStore()
	const { category } = useParams()

	useEffect(() => {
		featchProductsByCategory(category)
	}, [featchProductsByCategory, category])

	return (
		<div className="min-h-screen  text-white">
			<div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				{/* Page Header */}
				<motion.h1
					className="text-center text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-wide mb-14
					drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					{category.charAt(0).toUpperCase() + category.slice(1)} Collection
				</motion.h1>

				{/* Product Grid */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					{products?.length === 0 ? (
						<div className="col-span-full text-center mt-20">
							<p className="text-2xl text-gray-400 italic">No products found in this category</p>
						</div>
					) : (
						products.map((product) => (<ProductCard key={product._id} product={product}/>))
					)}
				</motion.div>
			</div>
		</div>
	)
}

export default CategoryPage
