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
    <option value="แปลง 1">แปลง 1</option>
    <option value="แปลง 2">แปลง 2</option>
    <option value="แปลง 3">แปลง 3</option>
    <option value="แปลง 4">แปลง 4</option>
    <option value="แปลง 5">แปลง 5</option>
    <option value="แปลง 6">แปลง 6</option>
    <option value="แปลง 7">แปลง 7</option>
    <option value="แปลง 8">แปลง 8</option>
    <option value="แปลง 9">แปลง 9</option>
    <option value="แปลง 10">แปลง 10</option>
    <option value="แปลง 11">แปลง 11</option>
    <option value="แปลง 12">แปลง 12</option>
    <option value="แปลง 13">แปลง 13</option>
    <option value="แปลง 14">แปลง 14</option>
    <option value="แปลง 15">แปลง 15</option>
    <option value="แปลง 16">แปลง 16</option>
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
