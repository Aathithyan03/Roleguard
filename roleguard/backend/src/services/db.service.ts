import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../data/db.json');

export interface User {
  id: string;
  userId: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  department: string;
  joinedAt: string;
  avatar: string;
  active: boolean;
}

export interface Record {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'review' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  createdAt: string;
  accessLevel: 'all' | 'admin';
}

interface Database {
  users: User[];
  records: Record[];
}

function readDb(): Database {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as Database;
}

function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ── User operations ──────────────────────────────────────────────────────────

export const UserService = {
  findByUserId: (userId: string): User | undefined => {
    return readDb().users.find((u) => u.userId === userId);
  },

  findAll: (): Omit<User, 'password'>[] => {
    return readDb().users.map(({ password, ...u }) => u);
  },

  findById: (id: string): Omit<User, 'password'> | undefined => {
    const user = readDb().users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...safe } = user;
    return safe;
  },

  create: (userData: Omit<User, 'id'>): Omit<User, 'password'> => {
    const db = readDb();
    const newUser: User = { ...userData, id: `usr_${Date.now()}` };
    db.users.push(newUser);
    writeDb(db);
    const { password, ...safe } = newUser;
    return safe;
  },

  update: (id: string, updates: Partial<Omit<User, 'id'>>): Omit<User, 'password'> | null => {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates };
    writeDb(db);
    const { password, ...safe } = db.users[idx];
    return safe;
  },

  delete: (id: string): boolean => {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    db.users.splice(idx, 1);
    writeDb(db);
    return true;
  },
};

// ── Record operations ─────────────────────────────────────────────────────────

export const RecordService = {
  findAll: (role: string): Record[] => {
    const db = readDb();
    return role === 'admin'
      ? db.records
      : db.records.filter((r) => r.accessLevel === 'all');
  },
};
