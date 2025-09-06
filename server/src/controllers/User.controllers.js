import User from "../models/User.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

// Temporary in-memory storage for development with pre-populated demo users
const users = new Map();

// Pre-populate with demo users for testing
const initializeDemoUsers = async () => {
    const bcrypt = await import('bcrypt');
    const demoUsers = [
        {
            email: 'demo@healthspectrum.com',
            password: 'demo123',
            name: 'Demo User'
        },
        {
            email: 'patient@example.com', 
            password: 'patient123',
            name: 'John Patient'
        },
        {
            email: 'test@test.com',
            password: 'test123',
            name: 'Test User'
        }
    ];

    for (const userData of demoUsers) {
        const hashedPassword = await bcrypt.default.hash(userData.password, 12);
        const user = {
            _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            isVerified: true,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        users.set(userData.email, user);
    }
    console.log('✅ Demo users initialized:', demoUsers.map(u => u.email).join(', '));
};

// Initialize demo users
initializeDemoUsers();

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
        if (users.has(email)) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user object
        const userId = Date.now().toString();
        const user = {
            _id: userId,
            email,
            password: hashedPassword,
            name,
            isVerified: false,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Store user
        users.set(email, user);

        // Generate token and set cookie
        const token = generateToken(userId);
        setTokenCookie(res, token);

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse,
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

        // Find user
        const user = users.get(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Update last login
        user.lastLogin = new Date();
        users.set(email, user);

        // Generate token and set cookie
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse,
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
        // Find user by ID in our in-memory storage
        let foundUser = null;
        for (const user of users.values()) {
            if (user._id === req.userId) {
                foundUser = user;
                break;
            }
        }

        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Remove password from response
        const userResponse = { ...foundUser };
        delete userResponse.password;

        res.status(200).json({
            success: true,
            user: userResponse,
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