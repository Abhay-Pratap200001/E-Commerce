import React from 'react'
import ProductTypes from '../components/ProductTypes';

import jeans from "../assets/jeans.jpg";
import tshirts from "../assets/tshirts.jpg";
import shoes from "../assets/shoes.jpg";
import glasses from "../assets/glasses.png"; // fixed here
import jackets from "../assets/jackets.jpg";
import suits from "../assets/suits.jpg";
import bags from "../assets/bags.jpg";


// ✅ Category data
const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: jeans },
  { href: "/t-shirts", name: "T-Shirts", imageUrl: tshirts },
  { href: "/shoes", name: "Shoes", imageUrl: shoes },
  { href: "/glasses", name: "Glasses", imageUrl: glasses },
  { href: "/jackets", name: "Jackets", imageUrl: jackets },
  { href: "/suits", name: "Suits", imageUrl: suits },
  { href: "/bags", name: "Bags", imageUrl: bags },
];

// const categories = [
//   { href: "/jeans", name: "Jeans", imageUrl: "/assets/jeans.jpg" },
//   { href: "/t-shirts", name: "T-shirts", imageUrl: "/assets/tshirts.jpg" },
//   { href: "/shoes", name: "Shoes", imageUrl: "/assets/shoes.jpg" },
//   { href: "/glasses", name: "Glasses", imageUrl: "/assets/glasses.png" },
//   { href: "/jackets", name: "Jackets", imageUrl: "/assets/jackets.jpg" },
//   { href: "/suits", name: "Suits", imageUrl: "/assets/suits.jpg" },
//   { href: "/bags", name: "Bags", imageUrl: "/assets/bags.jpg" },
// ];


const HomePages = () => {
  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
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
      </div>
    </div>
  )
}

export default HomePages