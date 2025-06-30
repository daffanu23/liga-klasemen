// File: project/js/standings.js
// Logika baru untuk mengontrol tombol dan memuat data dari Supabase

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
    "https://kwjjrtfukjybwqwdequl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ampydGZ1a2p5Yndxd2RlcXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzAyMjQsImV4cCI6MjA2NjQwNjIyNH0.iAYjFovdfeG7P6lwHwNOlO3Apww1uoQ8jxzu3mnT8d8"
);

document.addEventListener("DOMContentLoaded", () => {
    // --- Referensi ke Elemen DOM ---
    const seasonSelectorContainer = document.getElementById('season-selector');
    const typeSelectorContainer = document.getElementById('type-selector');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('standings-body');

    // --- State & Data Aplikasi ---
    const availableSeasons = [1, 2, 3, 4, 5, 7, 8, 9];
    let currentSeason = 9; // Default musim terbaru
    let currentType = 'driver'; // Default klasemen pembalap

    // --- FUNGSI UTAMA ---

    async function fetchAndDisplayStandings() {
        const tableName = `${currentType}_season_${currentSeason}`;
        
        tableHead.innerHTML = '';
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Memuat data...</td></tr>`;

        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('Peringkat', { ascending: true });

            if (error) throw error;
            
            updateTable(currentType, data);
        } catch (error) {
            console.error(`Error fetching dari ${tableName}:`, error.message);
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: red;">Gagal memuat data.</td></tr>`;
        }
    }

    function updateTable(type, data) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (type === 'team') {
            tableHead.innerHTML = `<th>Peringkat</th><th>Tim</th><th>Poin</th>`;
            if (data && data.length > 0) {
                tableBody.innerHTML = data.map(item => `<tr><td>${item.Peringkat}</td><td>${item.Tim}</td><td>${item.Poin}</td></tr>`).join('');
            } else {
                tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Data tidak tersedia.</td></tr>`;
            }
        } else { // 'driver'
            tableHead.innerHTML = `<th>Peringkat</th><th>Pembalap</th><th>Tim</th><th>Poin</th>`;
            if (data && data.length > 0) {
                tableBody.innerHTML = data.map(item => `<tr><td>${item.Peringkat}</td><td>${item.Pembalap}</td><td>${item.Tim}</td><td>${item.Poin}</td></tr>`).join('');
            } else {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Data tidak tersedia.</td></tr>`;
            }
        }
    }
    
    // Fungsi untuk menandai tombol mana yang aktif
    function updateActiveButtons() {
        // Update tombol tipe (Pembalap/Tim)
        typeSelectorContainer.querySelectorAll('.filter-button').forEach(button => {
            button.classList.toggle('active', button.dataset.type === currentType);
        });

        // Update tombol musim
        seasonSelectorContainer.querySelectorAll('.filter-button').forEach(button => {
            button.classList.toggle('active', button.dataset.season == currentSeason);
        });
    }

    // --- INISIALISASI HALAMAN ---

    function initializePage() {
        // Buat tombol musim secara dinamis
        availableSeasons.forEach(season => {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.dataset.season = season;
            button.textContent = `Musim ${season}`;
            seasonSelectorContainer.appendChild(button);
        });

        // Tambahkan event listener untuk grup tombol musim
        seasonSelectorContainer.addEventListener('click', (e) => {
            if (e.target.matches('.filter-button[data-season]')) {
                currentSeason = e.target.dataset.season;
                fetchAndDisplayStandings();
                updateActiveButtons();
            }
        });

        // Tambahkan event listener untuk grup tombol tipe
        typeSelectorContainer.addEventListener('click', (e) => {
            if (e.target.matches('.filter-button[data-type]')) {
                currentType = e.target.dataset.type;
                fetchAndDisplayStandings();
                updateActiveButtons();
            }
        });
        
        // Atur tampilan awal
        updateActiveButtons();

        // Muat data untuk pertama kali
        fetchAndDisplayStandings();
    }

    initializePage();
});

