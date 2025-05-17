import { Router } from 'express';
import statsController from '../controllers/stat.controller';

const router = Router();
router.get('/dashboard', statsController.dashboard);
export default router;