import order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/User.model.js";

export const getAnalyticsData = async () => {
  //  Total registered users
  const totalUsers = await User.countDocuments();

  // Total products in database
  const totalProducts = await Product.countDocuments();

  // Aggregate sales and revenue from Order collection
  const salesData = await order.aggregate([
    {
      $group: {
        _id: null, // we group all documents (no category)
        totalSales: { $sum: 1 }, // total number of orders
        totalRevenue: { $sum: '$totalAmount' } // sum of all order prices
      }
    }
  ]);

  // Handle case when there are no orders
  const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

  //  Return combined data
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue
  };
};




export const getDailySalesData = async (startDate, endDate) => {
  try {
    // Aggregate sales between given date range
    const dailySalesData = await order.aggregate([
      {
        $match: { // only include orders created within the range
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: { // group by date
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 }, // number of orders per day
          revenue: { $sum: "$totalAmount" } // total revenue per day
        }
      },
      { $sort: { _id: 1 } } // sort by date (ascending)
    ]);

    // 🗓️ Generate all dates between start and end
    const dateArray = getDateInRange(startDate, endDate);

    // 🧩 Map over each date and attach sales/revenue (0 if no data)
    return dateArray.map(date => {
      const foundData = dailySalesData.find(item => item._id === date);
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0
      };
    });
  } catch (error) {
    throw error;
  }
};




function getDateInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  // Loop until currentDate passes endDate
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]); // YYYY-MM-DD format
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
