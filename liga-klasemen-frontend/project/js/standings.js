document.addEventListener("DOMContentLoaded", () => {
    const seasonSelect = document.getElementById('season-select');
    const typeSelect = document.getElementById('type-select');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('standings-body');
    const API_BASE_URL = 'http://localhost:3000/api';

    // FUNGSI 1: Mengambil data klasemen dari API
    async function fetchAndDisplayStandings() {
        const season = seasonSelect.value;
        const type = typeSelect.value; // 'team' atau 'driver'

        if (!season || season === 'loading') {
            tableBody.innerHTML = '<tr><td colspan="4">Pilih musim yang valid.</td></tr>';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/standings/${type}/${season}`);
            if (!response.ok) throw new Error('Gagal mengambil data dari server');
            
            const data = await response.json();
            updateTable(type, data);
        } catch (error) {
            console.error('Error fetching standings:', error);
            tableHead.innerHTML = '';
            tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Gagal memuat data. Periksa koneksi ke backend.</td></tr>`;
        }
    }

    // FUNGSI 2: Memperbarui tampilan tabel (header dan isi)
    function updateTable(type, data) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (type === 'team') {
            tableHead.innerHTML = `<th>Posisi</th><th>Tim</th><th>Poin</th>`;
            if (data.length > 0) {
                data.forEach(item => {
                    tableBody.innerHTML += `<tr><td>${item.position}</td><td>${item.team_name}</td><td>${item.points}</td></tr>`;
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="3">Data klasemen tim tidak ditemukan.</td></tr>`;
            }
        } else { // type === 'driver'
            tableHead.innerHTML = `<th>Posisi</th><th>Pembalap</th><th>Tim</th><th>Poin</th>`;
             if (data.length > 0) {
                // Kode untuk menampilkan data pembalap (jika sudah ada)
            } else {
                tableBody.innerHTML = `<tr><td colspan="4">Data klasemen pembalap belum tersedia.</td></tr>`;
            }
        }
    }

    // FUNGSI 3: Mengisi dropdown pilihan musim
    async function populateSeasonSelector() {
        try {
            const response = await fetch(`${API_BASE_URL}/seasons`);
            if (!response.ok) throw new Error('Gagal mengambil daftar musim');

            const seasons = await response.json();
            seasonSelect.innerHTML = ''; // Hapus pesan "Memuat musim..."

            if (seasons.length > 0) {
                seasons.forEach(season => {
                    const option = new Option(season.name, season.year); // Teks, nilai
                    seasonSelect.add(option);
                });
                // Setelah musim terisi, langsung panggil fungsi untuk memuat data pertama kali
                fetchAndDisplayStandings();
            } else {
                seasonSelect.innerHTML = '<option>Tidak ada musim</option>';
            }
        } catch (error) {
            console.error('Error populating seasons:', error);
            seasonSelect.innerHTML = '<option>Gagal memuat</option>';
        }
    }

    // --- PENYAMBUNG ACARA ---
    // Tambahkan event listener agar setiap kali pilihan diubah, data dimuat ulang
    seasonSelect.addEventListener('change', fetchAndDisplayStandings);
    typeSelect.addEventListener('change', fetchAndDisplayStandings);

    // --- TITIK AWAL ---
    // Saat halaman pertama kali dimuat, panggil fungsi untuk mengisi pilihan musim
    populateSeasonSelector();
});