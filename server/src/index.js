import { app } from "./app.js";
import { connectdb, disconnectdb } from "./db/index.js";

let server;
const PORT = process.env.PORT || 3001;

// Start server first, then connect to database
app.on("error", (error) => {
    console.log("Server Error!!", error);
    throw error;
});

server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    
    // Try to connect to MongoDB after server starts
    connectdb()
        .then(() => {
            console.log("✅ MongoDB connected successfully");
        })
        .catch((error) => {
            console.log("⚠️  MongoDB connection failed:", error.message);
            console.log("Server will continue running without database");
        });
});

["SIGTERM", "SIGINT"].forEach((sig) =>
    process.on(sig, async () => {
        console.info(`Caught ${sig} dranning...`);
        await disconnectdb();
        server.close(() => process.exit(0));
    })
);
