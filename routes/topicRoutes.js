import express from 'express';
import { getTopics, toggleSubTopicComplete, getProgress } from '../controllers/topicController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTopics);
router.patch('/subtopic/:subTopicId/toggle', toggleSubTopicComplete);
router.get('/progress', getProgress);

export default router;