const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        message: "Email, username, and password are required",
      });
    }

    const user = new User({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
    });
    await user.save();


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists`,
      });
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }


    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //  Store refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(decoded.id)

    res.json({ accessToken: newAccessToken });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};
