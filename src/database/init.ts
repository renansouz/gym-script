import * as SQLite from 'expo-sqlite'

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('dale_db');

  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
        height REAL
      );

      CREATE TABLE IF NOT EXISTS weight_logs (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        value REAL NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        target_muscle TEXT NOT NULL, 
        is_custom INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS workout_sessions (
        id TEXT PRIMARY KEY NOT NULL, 
        user_id TEXT NOT NULL, 
        start_time TEXT NOT NULL, 
        end_time TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS sets (
        id TEXT PRIMARY KEY NOT NULL,
        session_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        is_warmup INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES workout_sessions (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );
    `);

    const firstCheck = await db.getAllAsync<{count: number}>('SELECT COUNT(*) as count FROM exercises');
    if (firstCheck[0].count === 0) {
      await db.execAsync(`
        INSERT INTO EXERCISES (id, name, target_muscle, is_custom) VALUES
        ('1', 'Bench Press', 'Chest', 0),
        ('2', 'Squat', 'Legs', 0),
        ('3', 'Deadlift', 'Back', 0),
        ('4', 'Overhead Press', 'Shoulders', 0);
      `)
    }
}