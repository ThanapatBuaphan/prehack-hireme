import { Router } from "express";
import { searchPosts, getPostById } from "../controllers/search.controller";

const router = Router();

router.get("/", searchPosts);

router.get("/:id", getPostById);

export default router;
