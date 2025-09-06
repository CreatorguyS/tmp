import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const whitelist = [
    process.env.CLIENT_BASE_URL,
    `https://${process.env.REPLIT_DEV_DOMAIN}`,
    'http://localhost:5000',
    'http://0.0.0.0:5000'
];

app.use(helmet());
app.use(
    cors({
        origin: true, // Allow all origins in development
        allowedHeaders: [
            "Content-Type",
            "Pragma",
            "Cache-Control",
            "Authorization",
            "Expires",
        ],
        credentials: true,
        methods: ["GET", "DELETE", "POST", "PUT", "PATCH"],
    })
);
app.use(cookieParser());
app.use(express.json());

// Import authentication routes
import userRoutes from './routes/User.routes.js';

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Authentication routes
app.use('/api/auth', userRoutes);

export { app };
