import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  // The user who placed the order (relation to User model)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',          // Reference to User collection
    required: true
  },

  // List of products in the order
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',   // Reference to Product collection
        required: true
      },

      quantity: {
        type: Number,
        required: true,
        min: 1            // Must order at least 1 item
      },
      
      price: {
        type: Number,
        required: true,
        min: 0            // Price cannot be negative
      }
    }
  ],

  //  Total order value (sum of product price * quantity)
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Stripe session ID to track payment (unique per transaction)
  stripeSessionId: {
    type: String,
    unique: true
  }

}, { timestamps: true }); 

const Order = mongoose.model('Order', orderSchema);
export default Order;
