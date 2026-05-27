import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import recordsRoutes from './routes/records.routes';
import { authenticate } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & parsing ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: ['http://localhost:4200', 'http://localhost:4201'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auth/me', authenticate); // protect /me sub-route
app.use('/api/users', usersRoutes);
app.use('/api/records', recordsRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ── 404 fallback ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Endpoint not found.' });
});

app.listen(PORT, () => {
  console.log(`\n🛡️  RoleGuard API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`\n   Demo credentials (password: password123)`);
  console.log(`   Admin: userId=admin`);
  console.log(`   User:  userId=priya\n`);
});

export default app;
