const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'daffa',
  host: 'localhost',
  database: 'liga_klasemen',
  password: 'admin123',
  port: 5432,
});

async function importSeason(filePath, seasonName) {
  const rawData = fs.readFileSync(filePath);
  const drivers = JSON.parse(rawData);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const seasonRes = await client.query(
      `INSERT INTO seasons (name) VALUES ($1) RETURNING id`,
      [seasonName]
    );
    const seasonId = seasonRes.rows[0].id;

    const teamMap = new Map();

    for (const d of drivers) {
      if (!teamMap.has(d.team)) {
        const teamRes = await client.query(
          `INSERT INTO teams (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
          [d.team]
        );
        teamMap.set(d.team, teamRes.rows[0].id);
      }

      await client.query(
        `INSERT INTO drivers (name, team_id, season_id, points) VALUES ($1, $2, $3, $4)`,
        [d.driver, teamMap.get(d.team), seasonId, d.points]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Season "${seasonName}" berhasil diimport`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal:', err);
  } finally {
    client.release();
  }
}

importSeason(path.join(__dirname, 'data', 'season1.json'), 'Season 1');
importSeason(path.join(__dirname, 'data', 'season2.json'), 'Season 2');
importSeason(path.join(__dirname, 'data', 'season3.json'), 'Season 3');
importSeason(path.join(__dirname, 'data', 'season4.json'), 'Season 4');
importSeason(path.join(__dirname, 'data', 'season5.json'), 'Season 5');
importSeason(path.join(__dirname, 'data', 'season7.json'), 'Season 7');
importSeason(path.join(__dirname, 'data', 'season8.json'), 'Season 8');