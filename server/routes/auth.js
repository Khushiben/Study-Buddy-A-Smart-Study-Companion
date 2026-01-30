const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const crypto = require("crypto");

/// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({
      success: true,
      message: "Signup successful"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not registered"
      });
    }

    // --- NEW: Generate reset token ---
    const token = crypto.randomBytes(32).toString("hex");

    // OPTIONAL: Save token and expiry in user document (for real reset logic)
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // TEMP: Create a reset link (for testing/demo)
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // TEMP success response with link
    return res.json({
      success: true,
      message: "Password reset link sent",
      resetLink: resetLink // <-- this is for demo/testing
    });

    // LATER: you can replace with email logic
    // Example using nodemailer:
    /*
    const transporter = nodemailer.createTransport({ ... });
    await transporter.sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `<a href="${resetLink}">Click here to reset your password</a>`,
    });
    */

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and password required" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // token not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
