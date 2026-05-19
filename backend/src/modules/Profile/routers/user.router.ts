import { Router } from "express";
import {
    getUserProfile,
    getUserProfileById,
    updateUserProfile
} from '../controllers/user.controller'

const router = Router();

router.get('/profile', getUserProfile);
router.get('/profile/:id', getUserProfileById);
router.patch('/profile', updateUserProfile);

export default router;
