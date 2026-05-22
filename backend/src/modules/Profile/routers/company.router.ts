import { Router } from "express";
import { authenticate, requireRole } from "../../../middlewares/auth";
import { uploadCompanyProfile } from "../../../middlewares/upload";
import {
  getCompanyProfile,
  getCompanyProfileById,
  updateCompanyProfile,
  upsertCompanyLocation,
  getCompanyMembers,
  addCompanyMember,
  updateCompanyMember,
  removeCompanyMember,
} from "../controllers/company.controller";

const router = Router();

router.get("/profile", authenticate, requireRole("company"), getCompanyProfile);
router.get("/profile/:id", authenticate, getCompanyProfileById);

router.patch("/profile", authenticate, requireRole("company"), uploadCompanyProfile, updateCompanyProfile);

router.post("/profile/location", authenticate, requireRole("company"), upsertCompanyLocation);

router.get("/profile/members", authenticate, requireRole("company"), getCompanyMembers);
router.post("/profile/members", authenticate, requireRole("company"), addCompanyMember);
router.patch("/profile/members/:memberId", authenticate, requireRole("company"), updateCompanyMember);
router.delete("/profile/members/:memberId", authenticate, requireRole("company"), removeCompanyMember);

export default router;