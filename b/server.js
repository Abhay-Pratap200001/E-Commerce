import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.Route.js'
import { connectDB } from './lib/dbConncrtion.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 2000
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)


connectDB().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });

    // server error handling
    server.on("error", (error) => {
      console.error("❌ Server Error:", error);
      process.exit(1); // Exit the app if server fails
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit app if DB connection fails
  });

