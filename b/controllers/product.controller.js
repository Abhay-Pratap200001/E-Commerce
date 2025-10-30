import { asynHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/api.Error.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/Cloudinary.js";



export const createProduct = asynHandler(async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "product",
      });
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
    throw new ApiError(500, "server errro");
  }
});  



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
        res.json(products)
    } catch (error) {
        throw new ApiError(500, "server error");        
    }
})



export const getFeaturedProducts = asynHandler(async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_Products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }  

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      throw new ApiError(404, "No featured product found");
    }  

    await redis.set("featured_Products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    throw new ApiError(500, "server error");
  }  
});  



export const getRecommendedProducts = asynHandler(async(req, res) => {

    try {
        const products = await Product.aggregate([
            {
                $sample: {size:3}
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
})    



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
        throw new ApiError(500, "Server error");        
    }
}) 



async function updateFeaturedProductsCache( ) {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean()
       await redis.set("featured_Products", JSON.stringify(featuredProducts));
    } catch (error) {
        throw new ApiError(500, "error while updating cache function");
        
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
    }  
    try {
      await cloudinary.uploader.destroy(`product/${publicId}`);
      console.log("images had delete from coudinary");
    } catch (error) {
        throw new ApiError(404, "failed to delet image");
        
    }    

    await Product.findByIdAndDelete(req.params.id);
  } catch (error) {
    throw new ApiError(500, "server error");
    
  }  
});  
