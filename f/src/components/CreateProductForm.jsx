import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Tag, FileText, DollarSign, Layers } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {

  // state to store form input data
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });


  // access createProduct function and loading state from Zustand store
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // send product data to backend
      await createProduct(newProduct);
      setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
    } catch {
      console.log("error creating a product");
    }
  };


  // handle image upload and convert it to base64 string
  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader(); // used to read file content
      reader.onloadend = () => {
        // set base64 image data into form state
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // convert file → base64 format
    }
  };


  return (
    <div className="flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-10 relative">

      {/* Heading */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}>
        <h2 className="text-3xl font-extrabold text-emerald-500 tracking-tight">
          Create a New Product
        </h2>
        <p className="mt-2 text-sm text-emerald-400">Add your product details below</p>
      </motion.div>


      {/* Form Container */}
      <motion.div
        className="mt-10 mx-auto w-full sm:max-w-md md:max-w-lg lg:max-w-xl
          rounded-2xl border border-emerald-300 shadow-[0_0_50px_rgba(16,185,129,0.9)]
          backdrop-blur-lg bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}>
        {/* Emerald glow line on top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

        <div className="relative z-10 py-8 px-6 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-emerald-500">Product Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                  className="block w-full px-3 py-2 pl-10 bg-gray-900 border border-emerald-600 rounded-md shadow-[inset_0_0_8px_rgba(16,185,129,0.8)] text-emerald-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 hover:shadow-[inset_0_0_12px_rgba(16,255,129,1)] hover:bg-gradient-to-tl hover:from-gray-800 hover:to-gray-900 sm:text-sm"/>
              </div>
            </div>


            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-emerald-500">Description</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-emerald-500" />
                </div>
                <textarea
                  required
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  className="block w-full px-3 py-2 pl-10 bg-gray-900 border border-emerald-600 rounded-md shadow-[inset_0_0_8px_rgba(16,185,129,0.8)] text-emerald-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 hover:shadow-[inset_0_0_12px_rgba(16,255,129,1)] hover:bg-gradient-to-tl hover:from-gray-800 hover:to-gray-900 sm:text-sm"/>
              </div>
            </div>


            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-emerald-500">Price</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Enter product price"
                  className="block w-full px-3 py-2 pl-10 bg-gray-900 border border-emerald-600 rounded-md shadow-[inset_0_0_8px_rgba(16,185,129,0.8)] text-emerald-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 hover:shadow-[inset_0_0_12px_rgba(16,255,129,1)] hover:bg-gradient-to-tl hover:from-gray-800 hover:to-gray-900 sm:text-sm"/>
              </div>
            </div>



            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-emerald-500">Category</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-emerald-500" />
                </div>
                <select
                  required
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-gray-900 border border-emerald-600 rounded-md shadow-[inset_0_0_8px_rgba(16,185,129,0.8)] text-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 hover:shadow-[inset_0_0_12px_rgba(16,255,129,1)] hover:bg-gradient-to-tl hover:from-gray-800 hover:to-gray-900 sm:text-sm">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>



            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-emerald-500">Product Image</label>
              <div className="mt-2 flex items-center space-x-3">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}/>
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-400">
                  <Upload className="h-5 w-5 mr-2" /> Upload
                </label>
                {newProduct.image && (
                  <span className="text-sm text-emerald-400">Image selected ✅</span>
                )}
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-md font-semibold text-white bg-gradient-to-r from-emerald-800 via-emerald-300 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.7)] relative overflow-hidden disabled:opacity-60 group">
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Product
                  <span className="absolute top-0 left-[-50%] w-1/2 h-full bg-white opacity-20 transform -skew-x-12 animate-shimmer pointer-events-none"></span>
                </>
              )}
            </button>


            {/* shimmer effect keyframes */}
            <style>
              {`
              @keyframes shimmer {
                0% { left: -50%; }
                100% { left: 150%; }
              }
              .animate-shimmer {
                animation: shimmer 1.4s linear infinite;
              }
              `}
            </style>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProductForm;
