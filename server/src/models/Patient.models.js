import mongoose from "mongoose";

const consentSchema = new mongoose.Schema({
    consentType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['granted', 'revoked'],
        required: true,
    },
    dateRecorded: {
        type: Date,
        default: Date.now,
    },
});

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        // Demographics
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        },
        
        // Contact Info
        phone: {
            type: String,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        emergencyContact: {
            name: String,
            relationship: String,
            phone: String,
        },
        
        // Vitals
        heightCm: {
            type: Number,
            min: 0,
        },
        weightKg: {
            type: Number,
            min: 0,
        },
        
        // Medical History
        allergies: [String],
        chronicDiseases: [String],
        currentMedications: [String],
        familyHistory: [String],
        
        // Lifestyle
        smokingStatus: {
            type: String,
            enum: ['never', 'former', 'current'],
        },
        alcoholConsumption: {
            type: String,
            enum: ['none', 'occasional', 'moderate', 'heavy'],
        },
        exerciseFrequency: {
            type: String,
            enum: ['none', 'rarely', 'weekly', 'daily'],
        },
        
        // Marital Status
        maritalStatus: {
            type: String,
            enum: ['single', 'married', 'divorced', 'widowed', 'partnered'],
        },
        
        // Consents
        consents: [consentSchema],
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
patientSchema.index({ userId: 1 });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;