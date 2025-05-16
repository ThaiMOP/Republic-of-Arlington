const API_URL = "https://script.google.com/macros/s/AKfycbyh8Qf_Pmdf0GLniYvKdnWZacxeLJnkuO3nBG00fZGwU9yJZkU-1yLnKCximfkmQj6g/exec";

let globalData = null;

document.addEventListener("DOMContentLoaded", () => {
  loadDataJson();
  loadRegistrations();
  setupFormSubmission();
});

function loadDataJson() {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      globalData = data;
      const personSelect = document.getElementById("person-select");
      data.persons.forEach((person) => {
        const option = document.createElement("option");
        option.value = person.id;
        option.textContent = person.name;
        option.dataset.district = person.district;
        option.dataset.province = person.province;
        personSelect.appendChild(option);
      });

      personSelect.addEventListener("change", handlePersonChange);
    });
}

function handlePersonChange(event) {
  const selectedOption = event.target.selectedOptions[0];
  const district = selectedOption.dataset.district;
  const province = selectedOption.dataset.province;

  document.getElementById("district-display").value = district;
  document.getElementById("province-display").value = province;

  // Update subdistricts
  const subdistrictSelect = document.getElementById("subdistrict-select");
  subdistrictSelect.innerHTML = '<option value="">-- กรุณาเลือกตำบล/แขวง --</option>';
  const subdistricts = globalData.subdistricts[district] || [];

  subdistricts.forEach((sub) => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subdistrictSelect.appendChild(opt);
  });
  subdistrictSelect.disabled = subdistricts.length === 0;

  // Enable plot-select
  const plotSelect = document.getElementById("plot-select");
  plotSelect.disabled = false;
  plotSelect.innerHTML = `
    <option value="">-- กรุณาเลือกแปลงที่ดิน --</option>
    <option value="001">001</option>
    <option value="002">002</option>
    <option value="003">003</option>
    <option value="004">004</option>
    <option value="005">005</option>
    <option value="006">006</option>
    <option value="007">007</option>
    <option value="008">008</option>
    <option value="009">009</option>
    <option value="010">010</option>
    <option value="011">011</option>
    <option value="012">012</option>
    <option value="013">013</option>
    <option value="014">014</option>
    <option value="015">015</option>
    <option value="016">016</option>
  `;

  plotSelect.addEventListener("change", () => {
    const statusBox = document.getElementById("plot-status");
    const status = getRandomStatus(); // mock logic
    statusBox.textContent = status.label;
    statusBox.className = status.className;
  });
}

function getRandomStatus() {
  const statusList = [
    { label: "ว่าง", className: "status-available" },
    { label: "จองแล้ว", className: "status-reserved" },
    { label: "ระงับ", className: "status-suspended" },
  ];
  return statusList[Math.floor(Math.random() * statusList.length)];
}

function setupFormSubmission() {
  const form = document.getElementById("land-registration-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const personSelect = document.getElementById("person-select");
    const subdistrict = document.getElementById("subdistrict-select").value;
    const plot = document.getElementById("plot-select").value;
    const statusText = document.getElementById("plot-status").textContent;

    const selected = personSelect.selectedOptions[0];
    const data = {
      person_id: personSelect.value,
      name: selected.textContent,
      district: selected.dataset.district,
      province: selected.dataset.province,
      subdistrict: subdistrict,
      plot: plot,
      status: statusText,
      timestamp: new Date().toLocaleString(),
    };

    fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // use "cors" if your GAS allows it
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    alert("ส่งข้อมูลสำเร็จ");
    form.reset();
    document.getElementById("plot-status").textContent = "";
    loadRegistrations(); // reload table
  });
}

function loadRegistrations() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((rows) => {
      const tbody = document.getElementById("registrations-table-body");
      tbody.innerHTML = "";
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    });
}
