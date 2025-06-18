const { Pool } = require('pg');

// PERBAIKAN: Konfigurasi koneksi juga diambil otomatis dari environment variables
const pool = new Pool();

async function seedDatabase() {
    console.log('Memulai proses seeding data...');
    const client = await pool.connect();

    try {
        // ... sisa kode seed.js biarkan sama persis seperti sebelumnya ...
        await client.query('BEGIN');

        console.log('Menghapus data lama dari tabel...');
        await client.query('TRUNCATE TABLE seasons, teams, standings_team RESTART IDENTITY CASCADE');

        console.log('Memasukkan data seasons...');
        const seasonsData = [
            { year: 2021, name: 'FRLWRX Season 1' },
            { year: 2022, name: 'FRLWRX Season 2' },
        ];
        const insertedSeasons = await Promise.all(
            seasonsData.map(s => client.query('INSERT INTO seasons(year, name) VALUES($1, $2) RETURNING season_id, year', [s.year, s.name]))
        );
        const seasonIdMap = insertedSeasons.reduce((map, result) => {
            map[result.rows[0].year] = result.rows[0].season_id;
            return map;
        }, {});
        console.log('Data seasons berhasil dimasukkan.');

        console.log('Memasukkan data teams...');
        const teamsData = [
            { name: 'Mercedes-AMG Petronas', principal: 'Toto Wolff' },
            { name: 'Oracle Red Bull Racing', principal: 'Christian Horner' },
            { name: 'Scuderia Ferrari', principal: 'Frédéric Vasseur' },
            { name: 'McLaren F1 Team', principal: 'Andrea Stella' },
        ];
        const insertedTeams = await Promise.all(
            teamsData.map(t => client.query('INSERT INTO teams(name, principal) VALUES($1, $2) RETURNING team_id, name', [t.name, t.principal]))
        );
        const teamIdMap = insertedTeams.reduce((map, result) => {
            map[result.rows[0].name] = result.rows[0].team_id;
            return map;
        }, {});
        console.log('Data teams berhasil dimasukkan.');

        console.log('Memasukkan data klasemen Season 1...');
        const standingsS1 = [
            { position: 1, team_name: 'Mercedes-AMG Petronas', points: 613 },
            { position: 2, team_name: 'Oracle Red Bull Racing', points: 585 },
            { position: 3, team_name: 'Scuderia Ferrari', points: 323 },
            { position: 4, team_name: 'McLaren F1 Team', points: 275 },
        ];

        await Promise.all(
            standingsS1.map(st => {
                const seasonID = seasonIdMap[2021];
                const teamID = teamIdMap[st.team_name];
                return client.query(
                    'INSERT INTO standings_team(season_id, team_id, position, points) VALUES($1, $2, $3, $4)',
                    [seasonID, teamID, st.position, st.points]
                );
            })
        );
        console.log('Data klasemen Season 1 berhasil dimasukkan.');
        
        await client.query('COMMIT');
        console.log('🎉 Proses seeding database selesai dengan sukses!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Gagal melakukan seeding database:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase();