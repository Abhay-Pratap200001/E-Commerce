import { asynHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/api.Error.js";
import cloudinary from "../lib/Cloudinary.js";
import { redis } from "../lib/redis.js";

//product creating controller
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};




export const getAllProducts = asynHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("error in getall product", error.message);
    throw new ApiError(500, "server error", error.message);
  }  
});  





export const getProductsByCategory = asynHandler(async(req, res) => {
    const {category} = req.params
    try {
        const products = await Product.find({category})
        res.json({products})
    } catch (error) {
        throw new ApiError(500, "server error");        
    }
});



// Adding featured product into redis
export const getFeaturedProducts = asynHandler(async (_, res) => {
  try {
    let featuredProducts = null;
    try {
      featuredProducts = await redis.get("featured_Products");
      console.log("Redis fetched:", featuredProducts ? "✅ Cached data found" : "❌ No cache");
    } catch (redisErr) {
    }

    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    //  Fetch from MongoDB
    const dbProducts = await Product.find({ isFeatured: true }).lean();
    console.log("Mongo found:", dbProducts.length, "featured products");

    if (!dbProducts || dbProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    //  Save to Redis cache (if connected)
    try {
      await redis.set("featured_Products", JSON.stringify(dbProducts));
      console.log("✅ Featured products cached in Redis");
    } catch (cacheErr) {
      console.warn("⚠️ Redis cache set failed:", cacheErr.message);
    }

    res.json(dbProducts);
  } catch (error) {
    console.error("❌ Error in getFeaturedProducts controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});






export const getRecommendedProducts = asynHandler(async(req, res) => {

    try {
        const products = await Product.aggregate([
            {
                $sample: {size:7}
            },    

            {
               $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }    
            }    
        ])    
        res.json(products)
    } catch (error) {  
       throw new ApiError(500, "server error");        
    }   
});    





export const toggleFeaturedProduct = asynHandler(async(req, res) =>{
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save()
            await updateFeaturedProductsCache()
            res.json(updatedProduct)
        }else{
            throw new ApiError(404, "Product not found");
        }
    } catch (error) {
      console.log("Error in toggleFeaturedProduct controller", error.message);
        throw new ApiError(500, "Server error");        
    }
});





async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!redis) return;
    await redis.set("featured_Products", JSON.stringify(featuredProducts));
    console.log("✅ Featured products cache updated");
  } catch (error) {
    console.log("⚠️ Redis cache update failed:", error.message);
    // do NOT throw, just log — avoid breaking toggle route
  }
}




export const deleteProduct = asynHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        const result = await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Cloudinary delete result:", result);
      } catch (error) {
        throw new ApiError(500, "Failed to delete image from Cloudinary");
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log("Error in deleteProduct controller:", error.message);
    throw new ApiError(500, "Server error");
  }
});
