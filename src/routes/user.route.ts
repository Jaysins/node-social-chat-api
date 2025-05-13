import { Router } from 'express';
import userController from '../controllers/user.controller';
const router = Router();

router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);

export default router;
