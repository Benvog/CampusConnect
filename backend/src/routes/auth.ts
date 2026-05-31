import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { signupUser, loginUser, logoutUser, verifyEmail } from '../services/authService';
import { SignupRequest, LoginRequest } from '../types/index';

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

// POST /api/auth/signup
router.post('/signup', [
  body('email').isEmail().withMessage('Valid email required'),
  // TEMP: Commented out .ac.ke restriction for testing
  // body('email').custom((value) => {
  //   if (!value.endsWith('.ac.ke')) {
  //     throw new Error('Only university emails (.ac.ke) allowed');
  //   }
  //   return true;
  // }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  // TEMP: Made optional for phase 1 signup - will be filled in /onboarding
  // body('displayName').notEmpty().withMessage('Display name required'),
  // body('faculty').notEmpty().withMessage('Faculty required'),
  // body('yearOfStudy').isInt({ min: 1, max: 7 }).withMessage('Year of study must be 1-7'),
  // body('universityId').notEmpty().withMessage('University required'),
  handleValidationErrors
], async (req: Request, res: Response) => {
  try {
    const result = await signupUser(req.body as SignupRequest);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
], async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body as LoginRequest);
    res.status(result.success ? 200 : 401).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', [
  body('email').isEmail().withMessage('Valid email required'),
  body('token').notEmpty().withMessage('Verification code required'),
  handleValidationErrors
], async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;
    const result = await verifyEmail(email, token);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const result = await logoutUser(token);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
