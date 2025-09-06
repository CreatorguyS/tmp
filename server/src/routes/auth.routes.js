import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyToken,
} from "../controllers/User.controllers.js";

const router = express.Router();

// Auth routes following the API specification
router.post("/signup", registerUser);  // POST /api/auth/signup
router.post("/login", loginUser);      // POST /api/auth/login  
router.post("/logout", verifyToken, logoutUser);  // POST /api/auth/logout
router.get("/me", verifyToken, getCurrentUser);   // GET /api/auth/me

// Health check for auth system
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Authentication system is running",
        timestamp: new Date().toISOString(),
    });
});

export default router;