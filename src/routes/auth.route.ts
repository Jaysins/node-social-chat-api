import { Router } from 'express';
import userController from '../controllers/user.controller';
const router = Router();


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
router.post('/profile/update', userController.updateProfile);

export default router;
