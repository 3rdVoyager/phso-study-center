-- Migration number: 0002
-- Add resource editing, soft deletion, and audit history.

ALTER TABLE resources ADD COLUMN updated_at TEXT;
ALTER TABLE resources ADD COLUMN updated_by TEXT;
ALTER TABLE resources ADD COLUMN deleted_at TEXT;
ALTER TABLE resources ADD COLUMN deleted_by TEXT;

UPDATE resources
SET updated_at = created_at
WHERE updated_at IS NULL;

CREATE INDEX resources_deleted_at_idx
  ON resources(deleted_at);

CREATE TABLE resource_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (
    action IN ('created', 'updated', 'deleted', 'restored')
  ),
  snapshot_json TEXT NOT NULL,
  changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by TEXT NOT NULL
);

CREATE INDEX resource_history_resource_idx
  ON resource_history(resource_id, changed_at);
