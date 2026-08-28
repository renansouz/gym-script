# ADR 001: Separation of Execise Definitions and Set Performance

## Context

The core requirements of the "Body" pillar is to track pysical progression over time (progressive overload).

Initially we considered storing weight and repetitions directly within an `Exercise` entity. However, this creates a "Static Data" problem: updating the weight for today's session would overwrite the historical data from the previous session, making it impossible to generate progress charts or identify Personal Records(PRs).

## Decision

We will decouple the "Definition" of an exercise from the "Performance" of that exercise.

1. **Exercise Entity:** Acts as a library (e.g., "Bench Press). It contains metadata like name, muscle group, and intructions.
2. **Set Entity:** Acts as a historical record. Every time a user performs a set a new record is created containing:

- Reference to the Exercise ID.
- Weight lifted.
- Repetitions completed.
- Timestamp.

## Reasoning

- **Data Integrity:** We preserve every lift ever recorded.
- **Analytics:** We can calculate PRs, total volume, and frequency by querying the `Set` table.
- **FLexibility:** A user can add the same Exercise to multiple Workout Templates without duplicating data.

## Consequences

- The data base will grow in sizemore quickly (one row per set), but modern databases handle millions of rows easily
- The UI must be designed to fetch the "Latest Set" or "Best Set" for a specific Exercise to show the user their previous performance during a workout.
