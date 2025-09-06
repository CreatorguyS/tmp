import Patient from "../models/Patient.models.js";

// Get or create patient profile for current user
export const getPatientProfile = async (req, res) => {
    try {
        let patient = await Patient.findOne({ userId: req.userId });
        
        // Create patient profile if it doesn't exist
        if (!patient) {
            patient = new Patient({
                userId: req.userId,
                consents: [] // Initialize with empty consents array
            });
            await patient.save();
        }

        res.status(200).json({
            success: true,
            patient: patient
        });
    } catch (error) {
        console.error("Get patient profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get patient profile",
            error: error.message,
        });
    }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Validate enum fields if provided
        const validEnums = {
            gender: ['male', 'female', 'other', 'prefer-not-to-say'],
            smokingStatus: ['never', 'former', 'current'],
            alcoholConsumption: ['none', 'occasional', 'moderate', 'heavy'],
            exerciseFrequency: ['none', 'rarely', 'weekly', 'daily'],
            maritalStatus: ['single', 'married', 'divorced', 'widowed', 'partnered']
        };

        for (const [field, validValues] of Object.entries(validEnums)) {
            if (updates[field] && !validValues.includes(updates[field])) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid value for ${field}. Must be one of: ${validValues.join(', ')}`
                });
            }
        }

        // Handle consents separately if provided
        if (updates.consents) {
            for (const consent of updates.consents) {
                if (!consent.consentType || !consent.status) {
                    return res.status(400).json({
                        success: false,
                        message: "Each consent must have consentType and status"
                    });
                }
                if (!['granted', 'revoked'].includes(consent.status)) {
                    return res.status(400).json({
                        success: false,
                        message: "Consent status must be 'granted' or 'revoked'"
                    });
                }
                // Set dateRecorded if not provided
                if (!consent.dateRecorded) {
                    consent.dateRecorded = new Date();
                }
            }
        }

        const patient = await Patient.findOneAndUpdate(
            { userId: req.userId },
            updates,
            { new: true, runValidators: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Patient profile updated successfully",
            patient: patient
        });
    } catch (error) {
        console.error("Update patient profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update patient profile",
            error: error.message,
        });
    }
};