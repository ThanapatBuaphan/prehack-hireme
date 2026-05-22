import { Router } from "express";
import { authenticate, requireRole } from "../../../middlewares/auth";
import { uploadUserProfile } from "../../../middlewares/upload";
import {
  getUserProfile,
  getUserProfileById,
  updateUserProfile,
  upsertUserLocation,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
} from "../controllers/user.controller";

const router = Router();

router.get("/profile", authenticate, requireRole("user"), getUserProfile);
router.get("/profile/:id", authenticate, getUserProfileById);


router.patch("/profile", authenticate, requireRole("user"), uploadUserProfile, updateUserProfile);


router.post("/profile/location", authenticate, requireRole("user"), upsertUserLocation);

router.post("/profile/education", authenticate, requireRole("user"), addEducation);
router.patch("/profile/education/:educationId", authenticate, requireRole("user"), updateEducation);
router.delete("/profile/education/:educationId", authenticate, requireRole("user"), deleteEducation);

router.post("/profile/work-experience", authenticate, requireRole("user"), addWorkExperience);
router.patch("/profile/work-experience/:workExpId", authenticate, requireRole("user"), updateWorkExperience);
router.delete("/profile/work-experience/:workExpId", authenticate, requireRole("user"), deleteWorkExperience);

export default router;
