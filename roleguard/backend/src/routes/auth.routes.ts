import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from '../services/db.service';
import { signToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { userId, password } = req.body as { userId?: string; password?: string };

  if (!userId || !password) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'userId and password are required.' });
  }

  const user = UserService.findByUserId(userId.trim());
  if (!user) {
    return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' });
  }

  if (!user.active) {
    return res.status(403).json({ code: 'ACCOUNT_DISABLED', message: 'Your account has been disabled.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' });
  }

  const token = signToken({ sub: user.id, userId: user.userId, role: user.role });
  const { password: _p, ...safeUser } = user;

  return res.json({
    token,
    user: safeUser,
    expiresIn: 28800,
  });
});

// GET /api/auth/me  — returns current user from token
router.get('/me', (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ code: 'MISSING_TOKEN', message: 'No token provided.' });
  }

  // Token already verified by authenticate middleware on this route if mounted with it
  const user = req.user ? UserService.findById(req.user.sub) : null;
  if (!user) return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found.' });

  return res.json(user);
});

export default router;
