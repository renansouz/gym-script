# ADR 002: Tech Stack selection for MVP

## Context

I need a technology stack that allows for rapid development, zero initial cost, and a high-quality mobile experience (Andriod/IOS) for use in a gym environment.

## Decision

I'll use **React Native with Expo** for mobile development and **SQLite (expo-sqlite)** for local data persistence.

## Reasoning

1. **React Native/Expo:** Leverages TypeScript/React expertise, provides a fast feedback loop with Fast Refresh, and simplifies mobile deployment.
2. **SQLite:** The most robust solution for offline storage. It ensures users can log workouts without an internet connection.
3. **TypeScript:** Ensures type safety across body/mind/nutrition data models, preventing runtime errors as the schema evolves.

## consequences

- The app will focus on local-first usage.
- Multi-user data synchronization (e.g., Me seeing Someone else's data) will require a future cloud synchronization layer (like Supabase).
