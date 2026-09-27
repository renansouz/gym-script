import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export const WorkoutService = {
  startSession: async (userId: string) => {
    const db = await SQLite.openDatabaseAsync('dale_db');
    const id = Crypto.randomUUID();
    const startTime = new Date().toISOString();
    
    await db.runAsync(
      'INSERT INTO workout_sessions (id, user_id, start_time) VALUES (?, ?, ?)',
      [id, userId, startTime]
    );
    return id;
  },

  addSet: async (sessionId: string, exerciseId: string, weight: number, reps: number) => {
    const db = await SQLite.openDatabaseAsync('dale_db');
    const id = Crypto.randomUUID();
    const timestamp = new Date().toISOString();

    await db.runAsync(
      'INSERT INTO sets (id, session_id, exercise_id, weight, reps, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      [id, sessionId, exerciseId, weight, reps, timestamp]
    );
    return id;
  },

  finishSession: async (sessionId: string) => {
    const db = await SQLite.openDatabaseAsync('dale_db');
    const endTime = new Date().toISOString();
    await db.runAsync(
      'UPDATE workout_sessions SET end_time = ? WHERE id = ?',
      [endTime, sessionId]
    );
  }
};