DROP TABLE IF EXISTS audit_history CASCADE;
CREATE TABLE audit_history (
  id SERIAL PRIMARY KEY NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  column_name VARCHAR(255) NOT NULL,
  old_value VARCHAR(255) NOT NULL,
  new_value VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
