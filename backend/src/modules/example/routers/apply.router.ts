import express from "express";
import {createApplyController, updateApplyStatusController, getIncomingApplicantsController} from "../controllers/apply.controller";

const router = express.Router();

router.post("/", createApplyController);
router.patch("/:id/status", updateApplyStatusController);
router.get("/company/:companyId", getIncomingApplicantsController);

export default router;