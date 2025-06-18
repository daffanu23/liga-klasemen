const seasons = [1, 2, 3, 4, 5, 7, 8]; // Ganti dengan angka ID season dari database
const yearSelectTeam = document.getElementById("year-select-team");
const teamTbody = document.querySelector("#teams-table tbody");

// Isi dropdown musim
seasons.forEach(seasonId => {
  const option = document.createElement("option");
  option.value = seasonId;
  option.textContent = `Season ${seasonId}`;
  yearSelectTeam.appendChild(option);
});

// Saat musim dipilih
yearSelectTeam.addEventListener("change", () => {
  const seasonId = yearSelectTeam.value;
  fetch(`http://localhost:3000/seasons/${seasonId}/teams`)
    .then(response => response.json())
    .then(data => {
      teamTbody.innerHTML = ""; // Kosongkan isi tabel

      // Urutkan berdasarkan poin tertinggi
      data.sort((a, b) => b.points - a.points);

      data.forEach((team, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${team.team}</td>
          <td>${team.points}</td>
        `;
        teamTbody.appendChild(tr);
      });
    })
    .catch(error => console.error("Gagal mengambil data tim:", error));
});

// Default tampilkan season pertama
yearSelectTeam.value = seasons[0];
yearSelectTeam.dispatchEvent(new Event("change"));
