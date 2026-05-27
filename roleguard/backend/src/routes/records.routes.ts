import { Router, Request, Response } from 'express';
import { authenticate, simulateDelay } from '../middleware/auth.middleware';
import { RecordService } from '../services/db.service';

const router = Router();

// GET /api/records?delay=2000
// Delay param demonstrates async loading on the Angular dashboard
router.get('/', authenticate, simulateDelay, (req: Request, res: Response) => {
  const role = req.user!.role;
  const records = RecordService.findAll(role);

  return res.json({
    data: records,
    meta: {
      total: records.length,
      role,
      accessNote:
        role === 'admin'
          ? 'Admin: showing all records including restricted ones.'
          : 'User: showing public records only. Restricted records are hidden.',
    },
  });
});

export default router;
