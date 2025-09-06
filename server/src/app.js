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

// Import routes following the new API structure
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import oauthRoutes from './routes/OAuth.routes.js';
import passport from './controllers/OAuth.controllers.js';

// Initialize Passport
app.use(passport.initialize());

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// API routes following the specification
app.use('/api/auth', authRoutes);        // Authentication
app.use('/api/patient', patientRoutes);  // Patient profile management  
app.use('/api/documents', documentsRoutes); // Document upload and analysis
app.use('/api/auth', oauthRoutes);       // OAuth authentication

// Legacy upload route for backwards compatibility
import uploadRoutes from './routes/Upload.routes.js';
app.use('/api/upload', uploadRoutes);

export { app };
