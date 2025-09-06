import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: false,
        },
        originalName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        storagePath: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['uploaded', 'ocr', 'nlp', 'summary', 'failed', 'done'],
            default: 'uploaded',
        },
        error: {
            type: String,
            required: false,
        },
        stageETASeconds: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying by user and status
documentSchema.index({ userId: 1, status: 1 });
documentSchema.index({ userId: 1, createdAt: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;