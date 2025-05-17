import { Router } from 'express';
import notificationController from '../controllers/notification.controller';

const router = Router();

router.get('/all',          notificationController.getNotifications);
router.put('/:id/read',  notificationController.markRead);
router.put('/read-all',  notificationController.markAllRead);

export default router;
