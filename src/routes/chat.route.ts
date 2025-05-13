import { Router } from 'express';
import chatController from '../controllers/chat.controller';
const router = Router();

router.post('/create', chatController.startChat);
router.get('/all', chatController.getAllChats);
router.get('/:id', chatController.getChatHistory);


export default router;
