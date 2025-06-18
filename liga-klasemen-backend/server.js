const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// PERBAIKAN: Konfigurasi koneksi akan diambil otomatis dari environment variables
// (PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT yang ada di docker-compose.yml)
const pool = new Pool();

// API BARU: Untuk mengambil daftar semua musim
app.get('/api/seasons', async (req, res) => {
    try {
        const result = await pool.query('SELECT year, name FROM seasons ORDER BY year DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching seasons:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API untuk klasemen TIM
app.get('/api/standings/team/:year', async (req, res) => {
    const { year } = req.params;
    try {
        const query = `
            SELECT st.position, t.name AS team_name, st.points
            FROM standings_team st
            JOIN teams t ON st.team_id = t.team_id
            JOIN seasons s ON st.season_id = s.season_id
            WHERE s.year = $1
            ORDER BY st.position ASC;
        `;
        const result = await pool.query(query, [year]);
        res.json(result.rows);
    } catch (error) {
        console.error(`Error fetching team standings for year ${year}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API untuk klasemen PEMBALAP (placeholder)
app.get('/api/standings/driver/:year', async (req, res) => {
    res.json([]); 
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server siap di http://localhost:${port}`);
});