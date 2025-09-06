import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyToken,
} from "../controllers/User.controllers.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.post("/logout", verifyToken, logoutUser);
router.get("/profile", verifyToken, getCurrentUser);

// Health check for auth system
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Authentication system is running",
        timestamp: new Date().toISOString(),
    });
});

export default router;