import express from "express";
import {createApplyController, updateApplyStatusController} from "../controllers/apply.controller";

const router = express.Router();

router.post("/", createApplyController);
router.patch("/:id/status", updateApplyStatusController);

export default router;