import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {

  // extract info from store to use in toogle featured and delete and show all products
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    // main container card
    <motion.div
      className="bg-[#0a0f0a] shadow-2xl rounded-2xl overflow-hidden max-w-6xl mx-auto mt-10 border border-green-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}>

      {/* Header section */}
      <div className="p-6 border-b border-green-900 bg-[#0d130d] flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Products List 🛒</h2>
        <p className="text-sm text-white">
          {products?.length || 0} total products
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-900">
          <thead className="bg-[#111a11]">
            <tr>
              {["Product", "Price", "Category", "Featured", "Actions"].map(
                (heading) => ( <th key={heading} className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-green-900">
            {products?.map((product) => (
              // animate each row
              <tr
                key={product._id}
                whileHover={{ scale: 1.02, backgroundColor: "#0f1b0f" }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="hover:bg-[#0f1b0f] cursor-pointer">

                {/* Product Image + Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-12 w-12 rounded-xl object-cover border border-green-700 shadow-md"
                      src={product.image}
                      alt={product.name}/>
                      
                    <div>
                      <p className="text-white font-medium text-sm">
                        {product.name}
                      </p>
                     
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-green-100 text-sm font-medium">
                  ₹{product.price.toFixed(2)}
                </td>

                {/* Category tag */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-medium bg-green-800/30 text-white rounded-full border border-green-700">
                    {product.category}
                  </span>
                </td>

                {/* Toggle Featured */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`p-2 rounded-full shadow-lg border border-green-700 transition-transform transform hover:scale-110 ${
                      product.isFeatured ? "bg-green-500 text-black" : "bg-transparent text-whitw hover:bg-green-600 hover:text-black"}`}
                    title={ product.isFeatured ? "Unmark as Featured" : "Mark as Featured"}>
                    <Star className="h-5 w-5" />
                  </button>
                </td>


                {/* Delete Button */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-500 hover:text-red-400 transition-transform transform hover:scale-110"
                    title="Delete Product">
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}


            {/* Empty state */}
            {products?.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-green-700 text-sm">
                  No products added yet 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsList;
