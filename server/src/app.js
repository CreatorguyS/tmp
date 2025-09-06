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
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
            if (!origin) return callback(null, true);
            
            if (whitelist.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(
                    new Error(
                        "Blocked by cors origin. You are not allowed to access this!"
                    ),
                    false
                );
            }
        },
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

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Import and use routes (placeholder for future routes)
// app.use('/api/users', userRoutes);

export { app };
