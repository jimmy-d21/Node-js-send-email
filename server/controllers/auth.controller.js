import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Gmail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// REGISTER USER + SEND OTP EMAIL
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otpCode: otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // SEND OTP EMAIL
    await transporter.sendMail({
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <h2>Your Verification Code</h2>
        <p>Enter this code to verify your account:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESEND OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    // Generate NEW OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    user.otpCode = newOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // SEND OTP EMAIL
    await transporter.sendMail({
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your New Verification Code",
      html: `
        <h2>Your New Verification Code</h2>
        <h1 style="font-size: 32px; letter-spacing: 4px;">${newOTP}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
