const seasons = [1, 2, 3, 4, 5, 7, 8];
const seasonSelect = document.getElementById("season-select");
const typeSelect = document.getElementById("type-select");
const tbody = document.getElementById("standings-body");
const thead = document.getElementById("table-head");

// Isi dropdown musim
seasons.forEach(season => {
  const option = document.createElement("option");
  option.value = season;
  option.textContent = `Season ${season}`;
  seasonSelect.appendChild(option);
});

// Fungsi untuk ambil dan tampilkan data
function fetchStandings() {
  const season = seasonSelect.value;
  const type = typeSelect.value;

  let url = `http://localhost:3000/seasons/${season}/${type}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = "";
      thead.innerHTML = "";

      if (type === "drivers") {
        thead.innerHTML = `
          <th>Pos</th>
          <th>Driver</th>
          <th>Team</th>
          <th>Points</th>
        `;

        data.sort((a, b) => b.points - a.points).forEach((entry, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.driver}</td>
            <td>${entry.team}</td>
            <td>${entry.points}</td>
          `;
          tbody.appendChild(tr);
        });

      } else if (type === "teams") {
        thead.innerHTML = `
          <th>Pos</th>
          <th>Team</th>
          <th>Points</th>
        `;

        data.sort((a, b) => b.points - a.points).forEach((entry, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.team}</td>
            <td>${entry.points}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    })
    .catch(err => {
      console.error("Gagal mengambil data:", err);
    });
}

// Default load
seasonSelect.addEventListener("change", fetchStandings);
typeSelect.addEventListener("change", fetchStandings);

// Load awal
seasonSelect.value = seasons[0];
typeSelect.value = "drivers";
fetchStandings();
