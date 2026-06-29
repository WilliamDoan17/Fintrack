# TRIGGERS

This document describes the PostgreSQL triggers in Fintrack's Supabase database.

---

## Conventions

- Triggers call dedicated trigger functions (one function per responsibility)

---

## Update Trigger (AM-4)

**Function**: `on_update()`

**Handling**:

- **On UPDATE**: fires — updates the `updated_at` column of the row to `now()`
