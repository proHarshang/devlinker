import { Router } from 'express';

import { handleRefresh, loginUser, registerUser } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', handleRefresh);

export default router;
