import Coupon from "../models/coupon.model.js";
import { ApiError } from "../utils/api.Error.js";
import { asynHandler } from "../utils/asyncHandler.js";


export const getCoupon = asynHandler(async(req, res) =>{
    try {
        const coupon = await Coupon.findOne({userId: req.user._id, isActive:true})
        res.json(coupon || null)
    } catch (error) {
        throw new ApiError(500, "erro in getting coupon server erro");
        
    }
})


export const validateCoupon = asynHandler(async(req, res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code, userId:req.user._id, isActive})
        if (!coupon) {
            throw new ApiError(404, "Coupon not found");
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false
            await coupon.save()
            throw new ApiError(404, "coupon expired");           
        }

        res.json({message:'coupon is valid' , code: coupon.code, discountPercentage: coupon.discountPercentage})
    } catch (error) {
       throw new ApiError(500, "server error while validate coupon");
        
    }   
})