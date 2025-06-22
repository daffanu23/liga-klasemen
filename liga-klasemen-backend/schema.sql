DROP TABLE IF EXISTS standings_driver;
DROP TABLE IF EXISTS standings_team;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS seasons;

CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,
    year INT NOT NULL, 
    name VARCHAR(100) NOT NULL UNIQUE -- Nama musim kita buat unik
);

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    principal VARCHAR(255)
);

CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    nationality VARCHAR(100)
);

CREATE TABLE standings_team (
    standing_id SERIAL PRIMARY KEY,
    season_id INT NOT NULL REFERENCES seasons(season_id),
    team_id INT NOT NULL REFERENCES teams(team_id),
    points INT NOT NULL,
    position INT NOT NULL,
    UNIQUE (season_id, position) -- Posisi dalam satu musim harus unik
);

CREATE TABLE standings_driver (
    standing_id SERIAL PRIMARY KEY,
    season_id INT NOT NULL REFERENCES seasons(season_id),
    driver_id INT NOT NULL REFERENCES drivers(driver_id),
    team_id INT NOT NULL REFERENCES teams(team_id),
    points INT NOT NULL,
    position INT NOT NULL,
    UNIQUE (season_id, position) -- Posisi dalam satu musim harus unik
);