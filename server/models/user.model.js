import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  otpCode: { type: String }, // store OTP
  otpExpires: { type: Date }, // expiry time
});

export default mongoose.model("User", userSchema);
