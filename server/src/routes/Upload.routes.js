import express from "express";
import { verifyToken } from "../controllers/User.controllers.js";

const router = express.Router();

// Upload route for medical documents
router.post("/documents", verifyToken, async (req, res) => {
    try {
        // For demo purposes, simulate document analysis
        const { files } = req.body;
        
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files provided for upload"
            });
        }

        // Generate random analysis results for demo
        const riskLevels = ["Low", "Moderate", "High"];
        const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        
        const analysisResults = {
            analysisId: `analysis_${Date.now()}`,
            summary: "AI analysis completed successfully using advanced medical document processing",
            riskLevel: randomRisk,
            confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
            recommendations: [
                "Continue current medication as prescribed by your physician",
                "Schedule follow-up appointment within 2-3 months",
                "Monitor blood pressure weekly and record readings",
                "Maintain current diet and exercise routine",
                "Consider consulting a nutritionist for optimal diet planning"
            ],
            keyFindings: [
                "Blood pressure: 120/80 mmHg (Normal range)",
                "Cholesterol levels: 180 mg/dL (Optimal)",
                "Blood sugar: 95 mg/dL (Within healthy limits)",
                "Heart rate: 72 bpm (Normal)",
                "BMI: 23.5 (Healthy weight range)"
            ],
            processedFiles: files.length,
            processingTime: "47 seconds",
            timestamp: new Date().toISOString()
        };

        res.json({
            success: true,
            message: "Medical documents analyzed successfully",
            results: analysisResults
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Upload analysis failed",
            error: error.message
        });
    }
});

// Get analysis history
router.get("/history", verifyToken, async (req, res) => {
    try {
        // In a real application, fetch from database
        const history = [
            {
                id: "1",
                date: new Date().toISOString(),
                documentType: "Blood Test Results",
                status: "Analyzed",
                riskLevel: "Low"
            }
        ];

        res.json({
            success: true,
            history
        });
    } catch (error) {
        console.error("History error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get history",
            error: error.message
        });
    }
});

export default router;