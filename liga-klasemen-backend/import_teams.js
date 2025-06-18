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

async function importTeamSeason(filePath, seasonName) {
  const rawData = fs.readFileSync(filePath);
  const teams = JSON.parse(rawData);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const seasonRes = await client.query(
      `SELECT id FROM seasons WHERE name = $1`,
      [seasonName]
    );
    if (seasonRes.rowCount === 0) throw new Error(`Season "${seasonName}" tidak ditemukan`);
    const seasonId = seasonRes.rows[0].id;

    for (const t of teams) {
      let teamId;
      const teamRes = await client.query(`SELECT id FROM teams WHERE name = $1`, [t.team]);

      if (teamRes.rowCount > 0) {
        teamId = teamRes.rows[0].id;
      } else {
        const insertTeam = await client.query(
          `INSERT INTO teams (name) VALUES ($1) RETURNING id`,
          [t.team]
        );
        teamId = insertTeam.rows[0].id;
        console.log(`ℹ️ Tim baru ditambahkan: ${t.team}`);
      }

      await client.query(
        `INSERT INTO team_season_points (season_id, team_id, points) VALUES ($1, $2, $3)`,
        [seasonId, teamId, t.points]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Data tim untuk ${seasonName} berhasil diimport`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal:', err.message);
  } finally {
    client.release();
  }
}

// Tambahkan semua musim yang kamu punya:
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason1.json'), 'Season 1');
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason2.json'), 'Season 2');
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason3.json'), 'Season 3');
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason4.json'), 'Season 4');
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason5.json'), 'Season 5');
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason7.json'), 'Season 7');
importTeamSeason(path.join(__dirname, 'data', 'TeamSeason8.json'), 'Season 8');
// (Tidak ada Season 6, sesuai info kamu sebelumnya)
