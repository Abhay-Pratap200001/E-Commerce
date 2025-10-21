import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is must required"],
      minlength: [6, "Password must be atleast 6 character"],
    },
    
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },

        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Make sure this matches your actual product model name
        },
      },
    ],

  },
  { timestamps: true }
);

// Encrypt password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 7);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
