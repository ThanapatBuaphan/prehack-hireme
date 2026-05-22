import express from "express";
import {
  createApplyController,
  getIncomingApplicationsController,
} from "../controllers/easyApplication";

const router = express.Router();

router.post("/", createApplyController);
router.get("/user/:userId", getIncomingApplicationsController);

export default router;
