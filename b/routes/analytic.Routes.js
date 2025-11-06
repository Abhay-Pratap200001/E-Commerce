import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { getAnalyticsData, getDailySalesData } from '../controllers/analytic.controller.js'
import { ApiError } from '../utils/api.Error.js'

const router = express.Router()

//  Route: GET /analytics (protected + admin only)
router.get('/', protectRoute, adminRoute, async (req, res) => {
  try {
    //  Get overall analytics (total users, products, sales, revenue)
    const analyticsData = await getAnalyticsData();

    //  Get last 7 days' date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch sales & revenue for each day in this range
    const dailySalesData = await getDailySalesData(startDate, endDate);

    // Send both sets of data together
    res.json({
      analyticsData,
      dailySalesData
    });
  } catch (error) {
    throw new ApiError(500, "server error");
  }
});

export default router;
