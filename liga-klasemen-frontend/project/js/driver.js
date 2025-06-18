const seasons = [1, 2, 3, 4, 5, 7, 8];
const yearSelect = document.getElementById("year-select");
const driverTbody = document.querySelector("#standings-table tbody");

// Isi dropdown musim
seasons.forEach(season => {
  const option = document.createElement("option");
  option.value = season;
  option.textContent = `Season ${season}`;
  yearSelect.appendChild(option);
});

// Saat musim dipilih
yearSelect.addEventListener("change", () => {
  const season = yearSelect.value;
  fetch(`http://localhost:3000/seasons/${season}/drivers`)
    .then(response => response.json())
    .then(data => {
      driverTbody.innerHTML = "";
      data.sort((a, b) => b.points - a.points);
      data.forEach((driver, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${driver.driver}</td>
          <td>${driver.team}</td>
          <td>${driver.points}</td>
        `;
        driverTbody.appendChild(tr);
      });
    })
    .catch(error => console.error("Gagal mengambil data driver:", error));
});

// Default: tampilkan season pertama
yearSelect.value = seasons[0];
yearSelect.dispatchEvent(new Event("change"));
