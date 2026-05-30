import { Router, Request, Response } from 'express';
import { getUniversities, getUniversityByDomain } from '../services/universityService';

const router = Router();

// GET /api/universities - List all universities
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await getUniversities();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/universities/lookup?email=user@school.ac.ke
router.get('/lookup', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email parameter required' });
    }

    const result = await getUniversityByDomain(email);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
