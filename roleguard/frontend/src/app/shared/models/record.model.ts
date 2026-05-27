// src/app/shared/models/record.model.ts

export type RecordStatus = 'completed' | 'in-progress' | 'review' | 'pending';
export type RecordPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AppRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  status: RecordStatus;
  priority: RecordPriority;
  assignedTo: string;
  createdAt: string;
  accessLevel: 'all' | 'admin';
}

export interface RecordsResponse {
  data: AppRecord[];
  meta: {
    total: number;
    role: string;
    accessNote: string;
  };
}
