import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password must be at least 6 characters long"],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            trim: true,
            maxLength: [50, "Name cannot exceed 50 characters"],
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true,
        },
        githubId: {
            type: String,
            sparse: true,
            unique: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();
    
    try {
        const saltRounds = 12;
        this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.passwordHash);
    } catch (error) {
        throw new Error("Password comparison failed");
    }
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.passwordHash;
    return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;