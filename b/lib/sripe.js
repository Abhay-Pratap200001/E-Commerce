// Import Stripe SDK to interact with Stripe payment API
import Stripe from "stripe";

import dotenv from 'dotenv';
dotenv.config();

// Create a Stripe instance using your secret key (kept hidden in .env)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ This instance is now ready to be used anywhere for creating payment sessions or processing charges
