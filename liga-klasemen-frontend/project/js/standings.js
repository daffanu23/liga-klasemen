document.addEventListener("DOMContentLoaded", () => {
    const seasonSelect = document.getElementById('season-select');
    const typeSelect = document.getElementById('type-select');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('standings-body');
    const API_BASE_URL = 'http://localhost:3000/api';

    let seasonsData = []; // Variabel untuk menyimpan data musim (termasuk tahun)

    // FUNGSI 1: Mengambil data klasemen dari API berdasarkan pilihan dropdown
    async function fetchAndDisplayStandings() {
        // Ambil 'value' dari dropdown musim, yaitu TAHUN
        const selectedYear = seasonSelect.value;
        const type = typeSelect.value; // 'team' atau 'driver'
        
        // Cari nama musim lengkap dari data yang kita simpan, untuk kasus "Soon..."
        const selectedSeasonInfo = seasonsData.find(s => s.year == selectedYear && s.name === seasonSelect.options[seasonSelect.selectedIndex].text);

        if (!selectedYear || !selectedSeasonInfo) {
            updateTable(type, []); // Kosongkan tabel jika tidak ada pilihan valid
            return;
        }

        // Jangan ambil data jika musimnya adalah "Soon..."
        if (selectedSeasonInfo.name.includes("Soon")) {
            updateTable(type, []);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/standings/${type}/${selectedYear}`);
            if (!response.ok) throw new Error('Gagal mengambil data dari server');
            
            const data = await response.json();
            updateTable(type, data); // Kirim data ke fungsi untuk update tabel
        } catch (error) {
            console.error('Error fetching standings:', error);
            tableHead.innerHTML = '';
            tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Gagal memuat data.</td></tr>`;
        }
    }

    // FUNGSI 2: Memperbarui tampilan tabel (header dan isi)
    function updateTable(type, data) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (type === 'team') {
            tableHead.innerHTML = `<th>Posisi</th><th>Tim</th><th>Poin</th>`;
            if (data && data.length > 0) {
                data.forEach(item => {
                    tableBody.innerHTML += `<tr><td>${item.position}</td><td>${item.team_name}</td><td>${item.points}</td></tr>`;
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="3">Data klasemen tim belum tersedia.</td></tr>`;
            }
        } else { // type === 'driver'
            tableHead.innerHTML = `<th>Posisi</th><th>Pembalap</th><th>Tim</th><th>Poin</th>`;
            if (data && data.length > 0) {
                 data.forEach(item => {
                    tableBody.innerHTML += `<tr><td>${item.position}</td><td>${item.driver_name}</td><td>${item.team_name}</td><td>${item.points}</td></tr>`;
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="4">Data klasemen pembalap belum tersedia.</td></tr>`;
            }
        }
    }

    // FUNGSI 3: Mengisi dropdown pilihan musim dari API
    async function populateSeasonSelector() {
        try {
            const response = await fetch(`${API_BASE_URL}/seasons`);
            const seasons = await response.json();
            seasonsData = seasons; // Simpan data musim lengkap
            
            seasonSelect.innerHTML = '';
            if (seasons.length > 0) {
                 seasons.forEach(season => {
                    // Teks = nama musim, value = tahun
                    const option = new Option(season.name, season.year);
                    seasonSelect.add(option);
                });
                // Setelah musim terisi, langsung panggil fungsi untuk memuat data pertama kali
                fetchAndDisplayStandings();
            }
        } catch(error) {
             console.error('Error fetching seasons:', error);
             seasonSelect.innerHTML = '<option>Gagal memuat musim</option>';
        }
    }

    // Tambahkan event listener untuk KEDUA dropdown
    seasonSelect.addEventListener('change', fetchAndDisplayStandings);
    typeSelect.addEventListener('change', fetchAndDisplayStandings);

    // Titik awal: Panggil fungsi untuk mengisi pilihan musim saat halaman dibuka
    populateSeasonSelector();
});