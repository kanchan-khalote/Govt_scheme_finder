import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middlewares/auth.js';
import { askQuestion } from '../controllers/chatControllers.js';

const router = Router();

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: {message: 'Bahut zyada sawaal hogye h ruk jao abhi, 1 min baad try karna ab, thik haiii!!!'}
});

router.post('/', protect, chatLimiter, askQuestion);

export default router;