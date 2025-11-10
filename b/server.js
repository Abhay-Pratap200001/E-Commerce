import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"


import { connectDB } from "./lib/dbConncrtion.js";
import {errorHandler} from "./middleware/error.middleware.js"

// routes
import authRoutes from "./routes/auth.Route.js";
import productRoutes from "./routes/product.Route.js"
import cartRoutes from "./routes/cart.Route.js";
import analyticsRoutes from "./routes/analytic.Routes.js";
import paymentRoutes from "./routes/payment.Route.js"


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());


//all routes 
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "f/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "f", "dist", "index.html"));
  });
}
  
//  Error handler 
app.use(errorHandler);


// Connect DB and start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });

    // Handle runtime errors gracefully
    server.on("error", (error) => {
      console.error("❌ Server Error:", error);
      process.exit(1);
    });
  }).catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  });


