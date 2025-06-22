const { Pool } = require('pg');

const pool = new Pool();

async function seedDatabase() {
    console.log('Memulai proses seeding data...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        console.log('Menghapus data lama dari tabel...');
        await client.query('TRUNCATE TABLE seasons, teams, drivers, standings_team, standings_driver RESTART IDENTITY CASCADE');

        // --- Data Seasons ---
        console.log('Memasukkan data seasons...');
        // KOREKSI: Memberi nama unik untuk setiap musim
        const seasonsData = [
            { year: 2024, name: 'FRLWRX Season 7 (Soon)' },
            { year: 2024, name: 'FRLWRX Season 8 (Soon)' },
            { year: 2025, name: 'FRLWRX Season 9' },
        ];
        const insertedSeasons = await Promise.all(seasonsData.map(s => client.query('INSERT INTO seasons(year, name) VALUES($1, $2) RETURNING season_id, name', [s.year, s.name])));
        const seasonIdMap = insertedSeasons.reduce((map, result) => { map[result.rows[0].name] = result.rows[0].season_id; return map; }, {});
        console.log('Data seasons berhasil dimasukkan.');

        // --- Data Teams ---
        console.log('Memasukkan data teams...');
        const teamsData = [
            { name: 'Daffa Racing Rally TTA', principal: 'Dappa' },
            { name: 'Nekoyo Performance Team', principal: '??' },
            { name: 'IDGP Team Staynight With NDC', principal: '??' },
            { name: 'ZNP Trabas Team', principal: '??' },
            { name: 'Jagonya Entok Vazter', principal: 'Elfin' },
            { name: 'Team Quadrant X JER', principal: 'Rifqy' },
            { name: 'LS Motorsport', principal: '??' },
            { name: 'Veloce Racing Team', principal: 'Rifqy' },
        ];
        const insertedTeams = await Promise.all(teamsData.map(t => client.query('INSERT INTO teams(name, principal) VALUES($1, $2) RETURNING team_id, name', [t.name, t.principal])));
        const teamIdMap = insertedTeams.reduce((map, result) => { map[result.rows[0].name] = result.rows[0].team_id; return map; }, {});
        console.log('Data teams berhasil dimasukkan.');

        // --- Data Master Pembalap ---
        console.log('Memasukkan data drivers...');
        const driversData = [
            { name: 'Dappa', nationality: 'IDN' }, { name: 'Dipsy', nationality: 'IDN' },
            { name: 'Dashimo Florence', nationality: 'IDN' }, { name: 'Anthoine Fasta', nationality: 'IDN' },
            { name: 'Rafif', nationality: 'IDN' }, { name: 'Candra', nationality: 'IDN' },
            { name: 'Fixxed It', nationality: 'IDN' }, { name: 'Walker Around', nationality: 'IDN' },
            { name: 'Pierre Legachy', nationality: 'IDN' }, { name: 'Naufal Satria', nationality: 'IDN' },
            { name: 'Ace Kubo', nationality: 'IDN' }, { name: 'Zoros Roros', nationality: 'IDN' },
            { name: 'Zuyu', nationality: 'IDN' }, { name: 'Shandy', nationality: 'IDN' },
            { name: 'Syarif Khilmy', nationality: 'IDN' }, { name: 'Ardra Naufal', nationality: 'IDN' }
        ];
        const insertedDrivers = await Promise.all(driversData.map(d => client.query('INSERT INTO drivers(name, nationality) VALUES($1, $2) RETURNING driver_id, name', [d.name, d.nationality])));
        const driverIdMap = insertedDrivers.reduce((map, res) => { map[res.rows[0].name] = res.rows[0].driver_id; return map; }, {});
        console.log('Data drivers berhasil dimasukkan.');

        // --- Data Klasemen Tim Season 9 ---
        console.log('Memasukkan data klasemen Tim Season 9...');
        // KOREKSI: Memperbaiki posisi yang ganda
        const standingsS9_Teams = [
            { position: 1, team_name: 'Daffa Racing Rally TTA', points: 34 },
            { position: 2, team_name: 'Jagonya Entok Vazter', points: 25 },
            { position: 3, team_name: 'IDGP Team Staynight With NDC', points: 14 },
            { position: 4, team_name: 'Veloce Racing Team', points: 14 },
            { position: 5, team_name: 'LS Motorsport', points: 9 },
            { position: 6, team_name: 'Team Quadrant X JER', points: 7 },
            { position: 7, team_name: 'Nekoyo Performance Team', points: 4 },
            { position: 8, team_name: 'ZNP Trabas Team', points: 4 },
        ];
        await Promise.all(
            standingsS9_Teams.map(st => client.query('INSERT INTO standings_team(season_id, team_id, position, points) VALUES($1, $2, $3, $4)', [seasonIdMap['FRLWRX Season 9'], teamIdMap[st.team_name], st.position, st.points]))
        );
        console.log('Data klasemen Tim Season 9 berhasil dimasukkan.');

        // --- Data Klasemen Pembalap Season 9 ---
        console.log('Memasukkan data klasemen Pembalap Season 9...');
        const standingsS9_Drivers = [
            { position: 1, driver_name: 'Dappa', team_name: 'Daffa Racing Rally TTA', points: 21 },
            { position: 2, driver_name: 'Pierre Legachy', team_name: 'Jagonya Entok Vazter', points: 18 },
            { position: 3, driver_name: 'Dipsy', team_name: 'Daffa Racing Rally TTA', points: 13 },
            { position: 4, driver_name: 'Syarif Khilmy', team_name: 'Veloce Racing Team', points: 11 },
            { position: 5, driver_name: 'Rafif', team_name: 'IDGP Team Staynight With NDC', points: 10 },
            { position: 6, driver_name: 'Zuyu', team_name: 'LS Motorsport', points: 9 },
            { position: 7, driver_name: 'Ace Kubo', team_name: 'Team Quadrant X JER', points: 7 },
            { position: 8, driver_name: 'Naufal Satria', team_name: 'Jagonya Entok Vazter', points: 7 },
            { position: 9, driver_name: 'Candra', team_name: 'IDGP Team Staynight With NDC', points: 4 },
            { position: 10, driver_name: 'Anthoine Fasta', team_name: 'Nekoyo Performance Team', points: 4 },
            { position: 11, driver_name: 'Walker Around', team_name: 'ZNP Trabas Team', points: 3 },
            { position: 12, driver_name: 'Ardra Naufal', team_name: 'Veloce Racing Team', points: 3 },
            { position: 13, driver_name: 'Fixxed It', team_name: 'ZNP Trabas Team', points: 1 },
            { position: 14, driver_name: 'Dashimo Florence', team_name: 'Nekoyo Performance Team', points: 0 },
            { position: 15, driver_name: 'Zoros Roros', team_name: 'Team Quadrant X JER', points: 0 },
            { position: 16, driver_name: 'Shandy', team_name: 'LS Motorsport', points: 0 },
        ];
        await Promise.all(
            standingsS9_Drivers.map(st => {
                const seasonID = seasonIdMap['FRLWRX Season 9'];
                const driverID = driverIdMap[st.driver_name];
                const teamID = teamIdMap[st.team_name];
                // KOREKSI: Perintah SQL menggunakan parameter $1, $2, dst. untuk keamanan
                return client.query('INSERT INTO standings_driver(season_id, driver_id, team_id, position, points) VALUES($1, $2, $3, $4, $5)', [seasonID, driverID, teamID, st.position, st.points]);
            })
        );
        console.log('Data klasemen Pembalap Season 9 berhasil dimasukkan.');
        
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