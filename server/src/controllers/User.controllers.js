import User from "../models/User.models.js";
import jwt from "jsonwebtoken";

// JWT secret - in production, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "healthspectrum_secret_key_2024";
const JWT_EXPIRES_IN = "7d";

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Set cookie with JWT token
const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    
    res.cookie("authToken", token, cookieOptions);
};

// Register new user
export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Create new user
        const user = new User({ email, password, name });
        await user.save();

        // Generate token and set cookie
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message,
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token and set cookie
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

// Logout user
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("authToken");
        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message,
        });
    }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user",
            error: error.message,
        });
    }
};

// Verify token middleware
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};