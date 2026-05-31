import { Router, Request, Response } from 'express';
import { getUserStats, resetDailySwipes, updateUserProfile } from '../services/userService';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/user/stats - Get dashboard stats
router.get('/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await getUserStats(userId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/user/reset-swipes - Reset daily swipes (for testing)
router.post('/reset-swipes', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await resetDailySwipes(userId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // DEV ONLY: Skip database for dev users
    if (userId.startsWith('dev-')) {
      return res.json({ 
        success: true, 
        message: 'Profile updated (dev mode)',
        profile: req.body
      });
    }
    
    const { displayName, bio, faculty, yearOfStudy, interests, gender } = req.body;
    
    const result = await updateUserProfile(userId, {
      display_name: displayName,
      bio,
      faculty,
      year_of_study: yearOfStudy ? parseInt(yearOfStudy) : undefined,
      interests,
      gender
    });
    
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
