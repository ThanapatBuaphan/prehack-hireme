import express from "express";
import { createApplyController } from "../controllers/apply.controller";

const router = express.Router();

router.post("/", createApplyController);

export default router;