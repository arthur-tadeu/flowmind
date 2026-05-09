export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  labels: string[];
  timeSpent: number;
  isTimerRunning: boolean;
  createdAt: number;
  completedAt?: number;
  userId?: string;
}

export interface Column {
  id: Status;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];
