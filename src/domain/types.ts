export interface User {
  id: string; //UUID
  name: string;
  email: string;
  height?: number;
  gender?: string;
  createdAt: Date;
}

export interface WeightLog {
  id: string;
  userId: string;
  value: number;
  date: Date;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  isCustom: boolean; // True if user created it, False if it's default app exercise
}

export interface Set {
  id: string;
  sessionId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  isWarmup: boolean;
  timestamp: Date;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  templateId?: string;
  startTime: Date;
  endTime: Date;
}