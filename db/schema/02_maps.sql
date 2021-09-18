DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  longitude DOUBLE PRECISION NOT NULL,
  lantitude DOUBLE PRECISION NOT NULL,
  isPublic BOOLEAN NOT NULL DEFAULT TRUE,
  created_on TIMESTAMP NOT NULL DEFAULT NOW(),
  zoom_level INTEGER NOT NULL
);
