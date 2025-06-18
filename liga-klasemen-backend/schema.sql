-- Buat tabel musim
CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- Buat tabel tim
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Buat tabel pembalap
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  season_id INTEGER REFERENCES seasons(id),
  points INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS team_season_points (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES seasons(id),
  team_id INTEGER REFERENCES teams(id),
  points INTEGER
);
