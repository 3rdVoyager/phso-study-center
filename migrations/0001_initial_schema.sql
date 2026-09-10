-- Migration number: 0001 	 2026-09-08T23:45:24.625Z
-- This is the initial schema for the PHSO Study Center DB.

CREATE TABLE resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  event TEXT,
  season TEXT,
  division TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL
);

CREATE INDEX resources_event_idx
  ON resources(event);

CREATE INDEX resources_season_idx
  ON resources(season);

CREATE INDEX resources_division_idx
  ON resources(division);