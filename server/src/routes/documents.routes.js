import express from "express";
import multer from "multer";
import { verifyToken } from "../controllers/User.controllers.js";
import {
    uploadDocuments,
    getDocumentStatus,
    getOcrText,
    getAnalysis,
    cancelDocument,
    retryDocument,
    getHistory,
    exportCSV,
    exportPDF,
    submitFlag,
    shareDocument
} from "../controllers/Document.controllers.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // max 10 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
        }
    }
});

// Document routes
router.post("/upload", verifyToken, upload.array('files', 10), uploadDocuments);
router.get("/:id/status", verifyToken, getDocumentStatus);
router.get("/:id/ocrText", verifyToken, getOcrText);
router.get("/:id/analysis", verifyToken, getAnalysis);
router.post("/:id/cancel", verifyToken, cancelDocument);
router.post("/:id/retry", verifyToken, retryDocument);

// History and export routes
router.get("/history", verifyToken, getHistory);  // GET /api/history with query params
router.get("/export/csv", verifyToken, exportCSV);
router.get("/export/pdf/:id", verifyToken, exportPDF);

// Flag and share routes
router.post("/flags", verifyToken, submitFlag);
router.post("/share/:id", verifyToken, shareDocument);

export default router;