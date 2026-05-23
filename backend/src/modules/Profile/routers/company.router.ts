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
  getCompanyPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/company.controller";

const router = Router();

// Profile
router.get("/profile",           authenticate, requireRole("company"), getCompanyProfile);
router.get("/profile/:id",       getCompanyProfileById);
router.patch("/profile",         authenticate, requireRole("company"), uploadCompanyProfile, updateCompanyProfile);
router.post("/profile/location", authenticate, requireRole("company"), upsertCompanyLocation);

// Members
router.get("/profile/members",                 authenticate, requireRole("company"), getCompanyMembers);
router.post("/profile/members",                authenticate, requireRole("company"), addCompanyMember);
router.patch("/profile/members/:memberId",     authenticate, requireRole("company"), updateCompanyMember);
router.delete("/profile/members/:memberId",    authenticate, requireRole("company"), removeCompanyMember);

router.get("/posts",             authenticate, requireRole("company"), getCompanyPosts);
router.post("/posts",            authenticate, requireRole("company"), createPost);
router.patch("/posts/:postId",   authenticate, requireRole("company"), updatePost);
router.delete("/posts/:postId",  authenticate, requireRole("company"), deletePost);

export default router;