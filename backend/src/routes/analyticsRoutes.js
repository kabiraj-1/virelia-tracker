import express from 'express';
import { 
  getUserAnalytics, 
  getLocationAnalytics,
  getSocialAnalytics 
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/user', getUserAnalytics);
router.get('/location', getLocationAnalytics);
router.get('/social', getSocialAnalytics);

export default router;