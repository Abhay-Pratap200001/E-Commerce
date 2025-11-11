import React, { useEffect } from 'react'
import ProductTypes from '../components/ProductTypes';

import jeans from "../assets/jeans.jpg";
import tshirts from "../assets/tshirts.jpg";
import shoes from "../assets/shoes.jpg";
import glasses from "../assets/glasses.png"; 
import jackets from "../assets/jackets.jpg";
import suits from "../assets/suits.jpg";
import bags from "../assets/bags.jpg";
import watches from "../assets/watches.webp"
import hoodies from "../assets/hoodies.webp"
import accessories from "../assets/accessories.jpg"
import perfumes from "../assets/perfumes.webp"
import haircare from "../assets/haircare.webp"
import skincare from "../assets/skincare.jpg"
import electronics from "../assets/electronics.avif"
import { useProductStore } from '../stores/useProductStore';
import FeaturedProducts from '../components/FeaturedProducts';


  const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: jeans },
  { href: "/t-shirts", name: "T-Shirts", imageUrl: tshirts },
  { href: "/shoes", name: "Shoes", imageUrl: shoes },
  { href: "/glasses", name: "Glasses", imageUrl: glasses },
  { href: "/jackets", name: "Jackets", imageUrl: jackets },
  { href: "/suits", name: "Suits", imageUrl: suits },
  { href: "/bags", name: "Bags", imageUrl: bags },
  { href: "/watches", name: "Watches", imageUrl: watches },
  { href: "/hoodies", name: "Hoodies", imageUrl: hoodies },
  { href: "/accessories", name: "Accessories", imageUrl: accessories },
  { href: "/perfumes", name: "Perfumes", imageUrl: perfumes },
  { href: "/haircare", name: "haircare", imageUrl: haircare },
  { href: "/skincare", name: "skincare", imageUrl: skincare },
  { href: "/electronics", name: "electronics", imageUrl: electronics },

];




const HomePages = () => {

  const {fetchFeaturedProducts, products, loading} = useProductStore()

  useEffect(()=>{
    fetchFeaturedProducts()
  },[fetchFeaturedProducts])

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          Explore Our Category
        </h1>
        <p className='text-center text-xl text-gray-300 mb-12'>
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white'>
          {categories.map((category) => (
            <ProductTypes key={category.name} category={category}/>
          ))}
        </div>

          {!loading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

      </div>
    </div>
  )
}

export default HomePages