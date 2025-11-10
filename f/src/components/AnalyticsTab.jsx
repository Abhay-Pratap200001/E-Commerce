import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "./LoadingSpinner";


const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);


  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.log("Error while fetching analytics data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);


  if (isLoading) return <LoadingSpinner />;


  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-white font-sans">
      {/* HEADER */}
      <motion.h1
        className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        Admin Analytics Dashboard
      </motion.h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          glow="emerald"/>
          
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          glow="green"/>
          
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          glow="lime"/>
          
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          glow="emerald"/>
          
      </div>

      {/* CHART */}
      <motion.div
        className="rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-emerald-700/40 bg-gradient-to-br from-black via-gray-900 to-emerald-950"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <h2 className="text-xl font-semibold mb-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]">
          📊 Weekly Sales & Revenue Overview
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#14532d" />
            <XAxis
              dataKey="date"
              stroke="#16a34a"
              tick={{ fontSize: 12, fill: "#a7f3d0" }}/>

            <YAxis
              yAxisId="left"
              stroke="#10B981"
              tick={{ fontSize: 12, fill: "#a7f3d0" }}
              domain={[0, "auto"]}/>

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#34d399"
              tick={{ fontSize: 12, fill: "#a7f3d0" }}
              domain={[0, "auto"]}/>

            <Tooltip
              contentStyle={{
                backgroundColor: "#052e16",
                border: "1px solid #10B981",
                borderRadius: "10px",
                color: "#a7f3d0",
              }}/>

            <Legend wrapperStyle={{ color: "#a7f3d0" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5, fill: "#10B981" }}
              activeDot={{ r: 8, stroke: "#a7f3d0" }}
              name="Sales"/>

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 5, fill: "#34d399" }}
              activeDot={{ r: 8, stroke: "#86efac" }}
              name="Revenue ($)"/>

          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};


export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, glow }) => {
  const glowColor =
    glow === "emerald"
      ? "shadow-[0_0_25px_rgba(16,185,129,0.4)]"
      : glow === "lime"
      ? "shadow-[0_0_25px_rgba(163,230,53,0.4)]"
      : "shadow-[0_0_25px_rgba(34,197,94,0.4)]";

  return (
    <motion.div
      className={`relative bg-black/60 border border-emerald-700/40 rounded-2xl p-6 backdrop-blur-lg ${glowColor} hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.03 }}>
      <div className="flex justify-between items-center relative z-10"><div>
          <p className="text-sm text-emerald-300 font-medium uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
            {value}
          </h3>
        </div>
        <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-600/50">
          <Icon className="h-9 w-9 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        </div>
      </div>

      {/* Soft green glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-black opacity-30 rounded-2xl" />
    </motion.div>
  );
};
