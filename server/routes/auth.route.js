import express from "express";
import {
  registerUser,
  resendOTP,
  verifyOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser); // sends OTP
router.post("/verify-otp", verifyOTP); // verifies OTP
router.post("/resend-otp", resendOTP);

export default router;
