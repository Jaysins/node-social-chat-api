import { Router } from 'express';
import friendController from '../controllers/friend.controller';
const router = Router();


router.post('/requests', friendController.sendRequest);
router.get('/requests', friendController.getRequests);
router.post('/requests/:id/respond', friendController.respondToRequest);


router.get('/all', friendController.getFriends);


export default router;
