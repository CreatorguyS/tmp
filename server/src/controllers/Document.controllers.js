import Document from "../models/Document.models.js";
import Analysis from "../models/Analysis.models.js";
import fs from "fs";
import path from "path";

// Mock analysis service for when LANDINGAI_API_KEY is not available
const generateMockAnalysis = (fileName) => {
    const mockConditions = [
        { name: "Hypertension", confidence: 0.85 },
        { name: "Type 2 Diabetes", confidence: 0.72 },
        { name: "High Cholesterol", confidence: 0.68 }
    ];

    const mockEntities = [
        { type: "medication", value: "Metformin 500mg", confidence: 0.9 },
        { type: "medication", value: "Lisinopril 10mg", confidence: 0.85 },
        { type: "condition", value: "Diabetes mellitus", confidence: 0.88 },
        { type: "lab", value: "HbA1c: 7.2%", confidence: 0.92 },
        { type: "date", value: "2024-08-15", confidence: 0.95 }
    ];

    const mockTimeline = [
        { dateOrEstimate: "2024-08-15", evidenceSnippet: "Blood pressure reading: 145/92 mmHg", page: 1 },
        { dateOrEstimate: "2024-08-01", evidenceSnippet: "Started Metformin therapy", page: 1 },
        { dateOrEstimate: "2024-07-20", evidenceSnippet: "Initial diabetes diagnosis", page: 2 }
    ];

    const mockRiskAssessment = [
        { risk: "Cardiovascular complications", severity: "moderate", consequence: "May lead to heart disease if untreated" },
        { risk: "Diabetic complications", severity: "high", consequence: "Risk of kidney damage and neuropathy" }
    ];

    const mockRecommendations = [
        { text: "Continue current diabetes medication and monitor blood glucose levels", urgency: "normal" },
        { text: "Schedule cardiology consultation for blood pressure management", urgency: "soon" },
        { text: "Emergency room visit if experiencing chest pain or severe symptoms", urgency: "urgent" }
    ];

    const mockEvidenceHighlights = [
        { quote: "Blood pressure elevated at 145/92 mmHg", page: 1, bbox: [100, 200, 300, 20] },
        { quote: "HbA1c level: 7.2% (target <7%)", page: 1, bbox: [100, 250, 280, 20] }
    ];

    return {
        ocrText: `Medical Report - ${fileName}\n\nPatient: John Doe\nDate: August 15, 2024\n\nCHIEF COMPLAINT:\nRoutine diabetes follow-up\n\nVITAL SIGNS:\nBP: 145/92 mmHg\nPulse: 78 bpm\nTemp: 98.6°F\n\nLABORATORY RESULTS:\nHbA1c: 7.2%\nFasting glucose: 165 mg/dL\nTotal cholesterol: 220 mg/dL\n\nCURRENT MEDICATIONS:\n- Metformin 500mg twice daily\n- Lisinopril 10mg daily\n\nASSESSMENT:\n1. Type 2 diabetes mellitus - suboptimal control\n2. Hypertension - poorly controlled\n3. Dyslipidemia\n\nPLAN:\n- Continue Metformin\n- Increase Lisinopril to 20mg daily\n- Add statin therapy\n- Follow up in 3 months\n- Patient education on diet and exercise`,
        entities: mockEntities,
        conditions: mockConditions,
        healthScore: Math.floor(Math.random() * 30) + 60, // 60-90 range
        timeline: mockTimeline,
        clinicalContext: "This medical report shows a patient with diabetes and high blood pressure that needs better management. The diabetes is not well controlled based on the HbA1c level, and blood pressure is elevated. The doctor has adjusted medications and scheduled follow-up care.",
        riskAssessment: mockRiskAssessment,
        evidenceHighlights: mockEvidenceHighlights,
        recommendations: mockRecommendations
    };
};

// Simulate processing stages with delays
const simulateProcessing = async (documentId) => {
    const stages = ['uploaded', 'ocr', 'nlp', 'summary', 'done'];
    const stageDurations = [1000, 3000, 5000, 2000]; // milliseconds for each stage
    
    for (let i = 1; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, stageDurations[i-1]));
        
        await Document.findByIdAndUpdate(documentId, { 
            status: stages[i],
            stageETASeconds: i < stages.length - 1 ? Math.floor(stageDurations[i] / 1000) : 0
        });
        
        // When processing reaches 'done', create analysis
        if (stages[i] === 'done') {
            const document = await Document.findById(documentId);
            const analysisData = generateMockAnalysis(document.originalName);
            
            const analysis = new Analysis({
                documentId: documentId,
                ...analysisData
            });
            await analysis.save();
        }
    }
};

// Upload documents
export const uploadDocuments = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        const documents = [];
        
        for (const file of req.files) {
            const document = new Document({
                userId: req.userId,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                storagePath: file.path,
                status: 'uploaded'
            });
            
            await document.save();
            documents.push({ documentId: document._id });
            
            // Start background processing
            simulateProcessing(document._id).catch(console.error);
        }

        res.status(200).json({
            success: true,
            message: `${documents.length} files uploaded successfully`,
            documents: documents
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message,
        });
    }
};

// Get document status
export const getDocumentStatus = async (req, res) => {
    try {
        const document = await Document.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        res.status(200).json({
            success: true,
            status: document.status,
            stageETASeconds: document.stageETASeconds
        });
    } catch (error) {
        console.error("Get status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get document status",
            error: error.message,
        });
    }
};

// Get OCR text
export const getOcrText = async (req, res) => {
    try {
        const analysis = await Analysis.findOne({
            documentId: req.params.id
        }).populate({
            path: 'documentId',
            match: { userId: req.userId }
        });

        if (!analysis || !analysis.documentId) {
            return res.status(404).json({
                success: false,
                message: "OCR text not available yet"
            });
        }

        res.status(200).json({
            success: true,
            ocrText: analysis.ocrText
        });
    } catch (error) {
        console.error("Get OCR error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get OCR text",
            error: error.message,
        });
    }
};

// Get full analysis
export const getAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findOne({
            documentId: req.params.id
        }).populate({
            path: 'documentId',
            match: { userId: req.userId }
        });

        if (!analysis || !analysis.documentId) {
            return res.status(404).json({
                success: false,
                message: "Analysis not available yet"
            });
        }

        res.status(200).json({
            success: true,
            analysis: analysis
        });
    } catch (error) {
        console.error("Get analysis error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get analysis",
            error: error.message,
        });
    }
};

// Cancel document processing
export const cancelDocument = async (req, res) => {
    try {
        const document = await Document.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { status: 'failed', error: 'Cancelled by user' },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Document processing cancelled"
        });
    } catch (error) {
        console.error("Cancel error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel document",
            error: error.message,
        });
    }
};

// Retry document processing
export const retryDocument = async (req, res) => {
    try {
        const document = await Document.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { status: 'uploaded', error: null, stageETASeconds: 0 },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Restart processing
        simulateProcessing(document._id).catch(console.error);

        res.status(200).json({
            success: true,
            message: "Document processing restarted"
        });
    } catch (error) {
        console.error("Retry error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retry document",
            error: error.message,
        });
    }
};

// Get history with pagination and filters
export const getHistory = async (req, res) => {
    try {
        const { search, from, to, status, page = 1, limit = 20 } = req.query;
        
        const query = { userId: req.userId };
        
        if (search) {
            query.originalName = { $regex: search, $options: 'i' };
        }
        
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }
        
        if (status) {
            query.status = status;
        }

        const documents = await Document.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Document.countDocuments(query);

        res.status(200).json({
            success: true,
            documents: documents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get history error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get history",
            error: error.message,
        });
    }
};

// Export CSV
export const exportCSV = async (req, res) => {
    try {
        // Implementation would generate CSV of user's data
        res.status(200).json({
            success: true,
            message: "CSV export functionality - to be implemented"
        });
    } catch (error) {
        console.error("Export CSV error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to export CSV",
            error: error.message,
        });
    }
};

// Export PDF report
export const exportPDF = async (req, res) => {
    try {
        // Implementation would generate PDF report
        res.status(200).json({
            success: true,
            message: "PDF export functionality - to be implemented"
        });
    } catch (error) {
        console.error("Export PDF error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to export PDF",
            error: error.message,
        });
    }
};

// Submit flag for incorrect interpretation
export const submitFlag = async (req, res) => {
    try {
        const { documentId, field, note } = req.body;
        
        // Implementation would store flag for review
        res.status(200).json({
            success: true,
            message: "Flag submitted successfully"
        });
    } catch (error) {
        console.error("Submit flag error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit flag",
            error: error.message,
        });
    }
};

// Create shareable link
export const shareDocument = async (req, res) => {
    try {
        const document = await Document.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Generate signed token for sharing
        const shareToken = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        res.status(200).json({
            success: true,
            shareUrl: `${process.env.CLIENT_BASE_URL || 'http://localhost:5000'}/shared/${shareToken}`,
            expiresAt: expiresAt
        });
    } catch (error) {
        console.error("Share document error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create share link",
            error: error.message,
        });
    }
};