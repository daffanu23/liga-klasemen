import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Inisialisasi koneksi Supabase (kredensial Anda)
const supabase = createClient(
    "https://kwjjrtfukjybwqwdequl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ampydGZ1a2p5Yndxd2RlcXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzAyMjQsImV4cCI6MjA2NjQwNjIyNH0.iAYjFovdfeG7P6lwHwNOlO3Apww1uoQ8jxzu3mnT8d8"
);

// --- State Aplikasi ---
// Menyimpan pilihan user saat ini
let currentSeason = 9; // Default ke musim terbaru
let currentType = 'driver'; // Default ke klasemen pembalap
const availableSeasons = [1, 2, 3, 4, 5, 7, 8, 9]; // Musim yang tersedia, skip 6

// --- Elemen DOM ---
const seasonSelector = document.getElementById('season-selector');
const typeSelector = document.getElementById('type-selector');
const container = document.getElementById('klasemen-container');

// --- Fungsi Utama ---

/**
 * Mengambil dan menampilkan data klasemen berdasarkan state saat ini
 */
async function fetchAndDisplayStandings() {
    // 1. Tampilkan pesan loading
    container.innerHTML = `<p class="loading">Memuat data klasemen...</p>`;

    // 2. Buat nama tabel secara dinamis dari state
    const tableName = `${currentType}_season_${currentSeason}`;
    console.log(`Mencoba mengambil dari tabel: ${tableName}`);

    try {
        // 3. Ambil data dari Supabase
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('Peringkat', { ascending: true });

        if (error) {
            throw error;
        }

        // 4. Render tabel jika data ada
        renderTable(data);

    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        container.innerHTML = `<p class="error">Gagal memuat data untuk ${tableName}. Pastikan tabel ada dan periksa RLS.</p>`;
    }
}

/**
 * Merender data menjadi tabel HTML
 * @param {Array} data - Array objek data dari Supabase
 */
function renderTable(data) {
    if (!data || data.length === 0) {
        container.innerHTML = `<p class="loading">Tidak ada data untuk ditampilkan.</p>`;
        return;
    }

    // Tentukan header kolom berdasarkan tipe klasemen
    const nameHeader = currentType === 'driver' ? 'Pembalap' : 'Tim';
    const nameKey = currentType === 'driver' ? 'Pembalap' : 'Tim';

    // 5. Buat struktur tabel
    let htmlContent = `
      <table>
        <thead>
          <tr>
            <th>Peringkat</th>
            <th>${nameHeader}</th>
            <th>Poin</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Loop data untuk membuat baris tabel
    data.forEach(row => {
        htmlContent += `
            <tr>
                <td>${row.Peringkat}</td>
                <td>${row[nameKey]}</td>
                <td><strong>${row.Poin}</strong></td>
            </tr>
        `;
    });

    htmlContent += `</tbody></table>`;
    container.innerHTML = htmlContent;
}

/**
 * Mengatur tampilan tombol yang aktif
 * @param {HTMLElement} selector - Grup tombol (seasonSelector atau typeSelector)
 * @param {string} activeValue - Nilai data-atribute dari tombol yang harus aktif
 */
function updateActiveButtons(selector, activeValue) {
    selector.querySelectorAll('.filter-button').forEach(button => {
        const buttonValue = button.dataset.season || button.dataset.type;
        if (buttonValue === String(activeValue)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Fungsi untuk inisialisasi halaman
 */
function initialize() {
    // Buat tombol musim secara dinamis
    availableSeasons.forEach(season => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.dataset.season = season;
        button.textContent = `Musim ${season}`;
        seasonSelector.appendChild(button);
    });

    // Tambahkan event listener untuk tombol musim
    seasonSelector.addEventListener('click', (e) => {
        if (e.target.matches('.filter-button[data-season]')) {
            currentSeason = e.target.dataset.season;
            updateActiveButtons(seasonSelector, currentSeason);
            fetchAndDisplayStandings();
        }
    });

    // Tambahkan event listener untuk tombol tipe
    typeSelector.addEventListener('click', (e) => {
        if (e.target.matches('.filter-button[data-type]')) {
            currentType = e.target.dataset.type;
            updateActiveButtons(typeSelector, currentType);
            fetchAndDisplayStandings();
        }
    });
    
    // Atur tampilan awal
    updateActiveButtons(seasonSelector, currentSeason);
    updateActiveButtons(typeSelector, currentType);

    // Muat data untuk pertama kali
    fetchAndDisplayStandings();
}

// --- Jalankan Aplikasi ---
document.addEventListener('DOMContentLoaded', initialize);