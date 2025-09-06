import mongoose from "mongoose";

const entitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['medication', 'symptom', 'date', 'lab', 'condition'],
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
});

const conditionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
});

const timelineItemSchema = new mongoose.Schema({
    dateOrEstimate: {
        type: String,
        required: true,
    },
    evidenceSnippet: {
        type: String,
        required: true,
    },
    page: {
        type: Number,
        required: false,
    },
});

const riskAssessmentSchema = new mongoose.Schema({
    risk: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        required: true,
    },
    consequence: {
        type: String,
        required: true,
    },
});

const evidenceHighlightSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    },
    bbox: {
        type: [Number], // [x, y, width, height]
        required: false,
    },
});

const recommendationSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    urgency: {
        type: String,
        enum: ['normal', 'soon', 'urgent'],
        required: true,
    },
});

const analysisSchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true,
            unique: true,
        },
        ocrText: {
            type: String,
            required: true,
        },
        entities: [entitySchema],
        conditions: [conditionSchema],
        healthScore: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
        },
        timeline: [timelineItemSchema],
        clinicalContext: {
            type: String,
            required: true,
        },
        riskAssessment: [riskAssessmentSchema],
        evidenceHighlights: [evidenceHighlightSchema],
        recommendations: [recommendationSchema],
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
analysisSchema.index({ documentId: 1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;