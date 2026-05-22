import express from "express";
import {
  createApplyController,
  deleteApplicationController,
  getAvailableJobPostsController,
  getIncomingApplicationsController,
} from "../controllers/easyApplication";

const router = express.Router();
export const jobPostRouter = express.Router();

router.post("/", createApplyController);
router.get("/user/:userId", getIncomingApplicationsController);
router.delete("/:applyId", deleteApplicationController);
jobPostRouter.get("/", getAvailableJobPostsController);

export default router;
