import express from 'express';
import { chat } from '../controllers/aiagent.js';

const router = express.Router();

// rotta index con parametro ricerca
router.post('/chat', [ chat]);

export default router;