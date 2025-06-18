-- Menghapus tabel lama jika ada, agar kita mulai dari keadaan bersih
DROP TABLE IF EXISTS standings_team;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS seasons;

-- Membuat tabel untuk menyimpan data musim/season
-- Setiap musim punya ID unik.
CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- Membuat tabel master untuk semua tim
-- Setiap tim hanya akan ada satu kali di sini, dengan ID unik.
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    principal VARCHAR(255)
);

-- Membuat tabel untuk klasemen tim (team standings)
-- Tabel ini menghubungkan antara musim dan tim.
CREATE TABLE standings_team (
    standing_id SERIAL PRIMARY KEY,
    -- Menghubungkan ke tabel seasons
    season_id INT NOT NULL REFERENCES seasons(season_id),
    -- Menghubungkan ke tabel teams
    team_id INT NOT NULL REFERENCES teams(team_id),
    points INT NOT NULL,
    position INT NOT NULL,
    -- Mencegah ada tim yang sama dimasukkan dua kali dalam satu musim
    UNIQUE (season_id, team_id)
);