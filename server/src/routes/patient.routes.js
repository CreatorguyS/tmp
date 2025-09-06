import express from "express";
import { verifyToken } from "../controllers/User.controllers.js";
import { getPatientProfile, updatePatientProfile } from "../controllers/Patient.controllers.js";

const router = express.Router();

// Patient profile routes
router.get("/me", verifyToken, getPatientProfile);    // GET /api/patient/me
router.put("/me", verifyToken, updatePatientProfile); // PUT /api/patient/me

export default router;