import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getSchemes,
  getSchemeBySlug,
  getMatches,
} from '../controllers/schemeControllers.js';

const router = Router();

router.get('/', getSchemes);
router.get('/match', protect, getMatches);
router.get('/:slug', getSchemeBySlug);

export default router;