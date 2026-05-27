import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { UserService } from '../services/db.service';

const router = Router();

// GET /api/users — admin only
router.get('/', authenticate, requireAdmin, (_req: Request, res: Response) => {
  return res.json({ data: UserService.findAll() });
});

// POST /api/users — admin: create user
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const { userId, email, password, role, firstName, lastName, department } = req.body as Record<string, string>;

  if (!userId || !email || !password || !role || !firstName || !lastName) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Missing required fields.' });
  }
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ code: 'INVALID_ROLE', message: "Role must be 'admin' or 'user'." });
  }

  const existing = UserService.findByUserId(userId.trim());
  if (existing) {
    return res.status(409).json({ code: 'USER_EXISTS', message: 'A user with that userId already exists.' });
  }

  const hashedPw = await bcrypt.hash(password, 10);
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  const user = UserService.create({
    userId: userId.trim(),
    email: email.trim(),
    password: hashedPw,
    role: role as 'admin' | 'user',
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    department: (department || 'General').trim(),
    joinedAt: new Date().toISOString(),
    avatar: initials,
    active: true,
  });

  return res.status(201).json(user);
});

// PATCH /api/users/:id — admin: toggle active, change role
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as Record<string, unknown>;

  // Hash password if being updated
  if (typeof updates.password === 'string') {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updated = UserService.update(id, updates as never);
  if (!updated) return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found.' });

  return res.json(updated);
});

// DELETE /api/users/:id — admin only
router.delete('/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (req.user?.sub === id) {
    return res.status(400).json({ code: 'SELF_DELETE', message: 'You cannot delete your own account.' });
  }

  const deleted = UserService.delete(id);
  if (!deleted) return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found.' });

  return res.status(204).send();
});

export default router;
