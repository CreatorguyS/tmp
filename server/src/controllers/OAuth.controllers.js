import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.models.js";
import jwt from "jsonwebtoken";

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

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this Google ID
                let user = await User.findOne({ 
                    $or: [
                        { googleId: profile.id },
                        { email: profile.emails[0].value }
                    ]
                });

                if (user) {
                    // User exists, update Google ID if not set
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: "oauth_user", // Placeholder password for OAuth users
                    isVerified: true, // Google accounts are pre-verified
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Configure GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || "dummy_client_id",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy_client_secret",
            callbackURL: "/api/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this GitHub ID
                let user = await User.findOne({ 
                    $or: [
                        { githubId: profile.id },
                        { email: profile.emails?.[0]?.value }
                    ]
                });

                if (user) {
                    // User exists, update GitHub ID if not set
                    if (!user.githubId) {
                        user.githubId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    githubId: profile.id,
                    name: profile.displayName || profile.username,
                    email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
                    password: "oauth_user", // Placeholder password for OAuth users
                    isVerified: true, // GitHub accounts are pre-verified
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// OAuth success handler
export const handleOAuthSuccess = (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_BASE_URL}/auth/sign-in?error=auth_failed`);
        }

        // Generate JWT token
        const token = generateToken(req.user._id);
        setTokenCookie(res, token);

        // Redirect to frontend
        res.redirect(`${process.env.CLIENT_BASE_URL}/?auth=success`);
    } catch (error) {
        console.error("OAuth success handler error:", error);
        res.redirect(`${process.env.CLIENT_BASE_URL}/auth/sign-in?error=server_error`);
    }
};

// OAuth failure handler
export const handleOAuthFailure = (req, res) => {
    res.redirect(`${process.env.CLIENT_BASE_URL}/auth/sign-in?error=auth_failed`);
};

export default passport;