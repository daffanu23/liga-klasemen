import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
    "https://kwjjrtfukjybwqwdequl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ampydGZ1a2p5Yndxd2RlcXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzAyMjQsImV4cCI6MjA2NjQwNjIyNH0.iAYjFovdfeG7P6lwHwNOlO3Apww1uoQ8jxzu3mnT8d8"
  );

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// =========================================================================
// === PERUBAHAN UNTUK HOSTING: Menggunakan Connection String            ===
// =========================================================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// ... Sisa kode API Anda tetap sama persis ...

// API untuk mengambil daftar musim
app.get('/api/seasons', async (req, res) => {
    try {
        const result = await pool.query('SELECT year, name FROM seasons ORDER BY year DESC, name ASC');
        res.json(result.rows);
    } catch (error) {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API untuk klasemen PEMBALAP
app.get('/api/standings/driver/:year', async (req, res) => {
    const { year } = req.params;
    try {
        const query = `
            SELECT 
                sd.position,
                d.name AS driver_name,
                t.name AS team_name,
                sd.points
            FROM standings_driver sd
            JOIN drivers d ON sd.driver_id = d.driver_id
            JOIN teams t ON sd.team_id = t.team_id
            JOIN seasons s ON sd.season_id = s.season_id
            WHERE s.year = $1
            ORDER BY sd.position ASC;
        `;
        const result = await pool.query(query, [year]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server siap di http://localhost:${port}`);
});