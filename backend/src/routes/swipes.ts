import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getDiscoveryProfiles, recordSwipe } from '../services/swipeService';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }
  next();
};

// GET /api/swipes/discover - Get profiles to swipe on
router.get('/discover', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getDiscoveryProfiles(userId, limit);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/swipes - Record a swipe
router.post('/', requireAuth, [
  body('swipedId').notEmpty().withMessage('Swiped user ID required'),
  body('direction').isIn(['like', 'pass', 'super_like']).withMessage('Direction must be like, pass, or super_like'),
  handleValidationErrors
], async (req: Request, res: Response) => {
  try {
    const swiperId = req.user!.id;
    const { swipedId, direction } = req.body;

    const result = await recordSwipe(swiperId, swipedId, direction);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
