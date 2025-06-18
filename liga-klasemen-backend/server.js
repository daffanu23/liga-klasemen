const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080', // ganti sesuai asal frontend
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'rahasiaSuperAman',
  resave: false,
  saveUninitialized: false
}));

const pool = new Pool({
  user: 'daffa',
  host: 'localhost',
  database: 'liga_klasemen',
  password: 'admin123',
  port: 5432,
});

console.log("🔐 CONNECTED AS USER: daffa");

app.get('/seasons/:id/drivers', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`
    SELECT drivers.name AS driver, teams.name AS team, drivers.points
    FROM drivers
    JOIN teams ON drivers.team_id = teams.id
    WHERE drivers.season_id = $1
    ORDER BY drivers.points DESC
  `, [id]);
  res.json(result.rows);
});

app.get('/seasons/:id/teams', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`
    SELECT teams.name AS team, tsp.points
    FROM team_season_points tsp
    JOIN teams ON tsp.team_id = teams.id
    WHERE tsp.season_id = $1
    ORDER BY tsp.points DESC
  `, [id]);
  res.json(result.rows);
});

// ===========================
// Auth: Login Admin
// ===========================

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ message: 'User tidak ditemukan' });

  const match = password === user.password; // bisa ganti bcrypt.compare di masa depan
  if (!match) return res.status(401).json({ message: 'Password salah' });

  req.session.user = { id: user.id, username: user.username };
  res.json({ message: 'Login berhasil' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logout berhasil' });
  });
});

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// ===========================
// API Tambah Berita (Admin only)
// ===========================

app.post('/api/news', isAuthenticated, async (req, res) => {
  const { title, summary, slug, image_url, content } = req.body;
  await pool.query(
    `INSERT INTO news (title, summary, slug, image_url, content)
     VALUES ($1, $2, $3, $4, $5)`,
    [title, summary, slug, image_url, content]
  );
  res.json({ message: 'Berita ditambahkan' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API jalan di http://localhost:${PORT}`);
});
