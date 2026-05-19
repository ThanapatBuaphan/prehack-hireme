import { Router } from "express";
import { 
    getCompanyProfile,
    getCompanyProfileById,
    updateCompanyProfile
 } from "../controllers/company.controller";

 const router = Router();

router.get('/company', getCompanyProfile);
router.get('/company/:id', getCompanyProfileById);
router.patch('/company', updateCompanyProfile);

export default router;