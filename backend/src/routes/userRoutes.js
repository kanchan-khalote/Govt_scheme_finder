import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {getme, updateProfile} from "../controllers/userControllers.js";


const router = Router();

router.get('/me', protect, getme);
router.put('/profile', protect, updateProfile);

export default router;

