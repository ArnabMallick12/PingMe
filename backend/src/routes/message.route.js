import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getUsers , getMessages, sendMessage} from '../controllers/message.controller.js';

const router  = express.Router();

router.get('/users',protectRoute,getUsers)
router.get('/:user',protectRoute,getMessages)   
router.post('/send/:id',protectRoute,sendMessage)

export default router;