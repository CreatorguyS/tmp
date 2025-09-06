import express from "express";
import passport from "../controllers/OAuth.controllers.js";
import { handleOAuthSuccess, handleOAuthFailure } from "../controllers/OAuth.controllers.js";

const router = express.Router();

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { 
        failureRedirect: "/api/auth/failure",
        session: false 
    }),
    handleOAuthSuccess
);

// GitHub OAuth routes
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"],
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github", { 
        failureRedirect: "/api/auth/failure",
        session: false 
    }),
    handleOAuthSuccess
);

// OAuth failure route
router.get("/failure", handleOAuthFailure);

export default router;