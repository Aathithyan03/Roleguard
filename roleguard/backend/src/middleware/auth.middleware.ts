import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  sub: string;
  userId: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'roleguard-super-secret-key-2024';

export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ code: 'MISSING_TOKEN', message: 'Authorization token required.' });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ code: 'INVALID_TOKEN', message: 'Token is invalid or expired.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ code: 'FORBIDDEN', message: 'Admin access required.' });
    return;
  }
  next();
}

/**
 * Delay middleware — pass ?delay=ms to any endpoint to simulate latency.
 * Used by the Angular app to showcase async loading UI.
 */
export function simulateDelay(req: Request, _res: Response, next: NextFunction): void {
  const delay = Math.min(parseInt((req.query.delay as string) || '0', 10), 5000);
  if (delay > 0) {
    setTimeout(next, delay);
  } else {
    next();
  }
}
