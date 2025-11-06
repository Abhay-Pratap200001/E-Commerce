import Coupon from "../models/coupon.model.js";
import { ApiError } from "../utils/api.Error.js";
import { asynHandler } from "../utils/asyncHandler.js ";

//sending coupons to user as request
export const getCoupon = asynHandler(async(req, res) =>{
    try {
        const coupon = await Coupon.findOne({userId: req.user._id, isActive:true})
        res.json(coupon || null)
    } catch (error) {
        throw new ApiError(500, "erro in getting coupon server erro");
        
    }
})


export const validateCoupon = asynHandler(async (req, res) => {
try {
	
	const { code } = req.body;
	console.log("Received body:", req.body);
    console.log("User ID:", req.user?._id);
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});