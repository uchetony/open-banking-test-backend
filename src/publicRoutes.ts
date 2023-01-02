import { Router } from 'express'
import { loginUser, createNewUser } from './handlers/user';
import { handleMonoWebhook } from './handlers/webhook';
import { verifyMonoWebhook } from './middlewares/verifyWebhook';

const router = Router();

router.post('/login', loginUser);
router.post('/register', createNewUser);

router.post('/webhook/mono', verifyMonoWebhook, handleMonoWebhook)

export default router;