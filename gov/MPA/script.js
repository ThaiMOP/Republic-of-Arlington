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
        option.value = `${person.id}`;
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

  // ตรวจสอบว่า plot-status มีหรือยัง ถ้ายังให้สร้างใหม่
  let statusBox = document.getElementById("plot-status");
  if (!statusBox) {
    statusBox = document.createElement("div");
    statusBox.id = "plot-status";
    statusBox.className = "status-box";
    plotSelect.parentNode.insertBefore(statusBox, plotSelect.nextSibling);
  } else {
    statusBox.textContent = "";
    statusBox.className = "status-box";
  }

  // Add event listener ใหม่
  plotSelect.addEventListener("change", async () => {
    const statusBox = document.getElementById("plot-status");
    const selectedPlot = plotSelect.value;
    const selectedSubdistrict = document.getElementById("subdistrict-select").value;
    const loadingPopup = document.getElementById("loading-popup");
  
    if (!selectedPlot) return;
  
    // แสดง popup
    loadingPopup.style.display = "flex";
  
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
  
      const match = data.find(row =>
        row[4] === selectedSubdistrict &&
        row[5] === selectedPlot
      );
  
      if (match) {
        statusBox.textContent = "ไม่ว่าง";
        statusBox.className = "status-reserved";
      } else {
        statusBox.textContent = "ว่าง";
        statusBox.className = "status-available";
      }
  
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      statusBox.textContent = "เกิดข้อผิดพลาด";
      statusBox.className = "status-suspended";
    } finally {
      // ปิด popup ไม่ว่าจะสำเร็จหรือ error
      loadingPopup.style.display = "none";
    }
  });


}


// ✅ ติดตั้งครั้งเดียวเมื่อ DOM โหลด
function setupPlotChangeEvent() {
  const plotSelect = document.getElementById("plot-select");
  plotSelect.addEventListener("change", async () => {
    const statusBox = document.getElementById("plot-status");
    const selectedPlot = plotSelect.value;
    const selectedSubdistrict = document.getElementById("subdistrict-select").value;
  
    try {
      const response = await fetch(API_URL);
      const data = await response.json(); // เป็น array ของ array
  
      const isOccupied = data.some(entry =>
        entry[4] === selectedSubdistrict && // ตำบล
        entry[5] === selectedPlot            // แปลงที่ดิน
      );
  
      if (isOccupied) {
        statusBox.textContent = "ไม่ว่าง";
        statusBox.className = "status-reserved";
      } else {
        statusBox.textContent = "ว่าง";
        statusBox.className = "status-available";
      }
  
    } catch (error) {
      console.error("Error fetching plot status:", error);
      statusBox.textContent = "เกิดข้อผิดพลาด";
      statusBox.className = "status-suspended";
    }
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

document.querySelector('.menu-toggle').addEventListener('click', function () {
  const icon = this.querySelector('i');
  const nav = document.querySelector('nav');

  // เช็คว่า icon เป็น bars หรือไม่
  const isBars = icon.classList.contains('fa-bars');

  if (isBars) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
    nav.style.display = 'block';
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
    nav.style.display = 'none';
  }
});


// จัดการการคลิกเมนูแบบฟอร์ม
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.dropdown-toggle');
  const menu = document.querySelector('.dropdown-menu');

  toggle.addEventListener('click', function (e) {
    e.preventDefault(); // ป้องกันการ jump ไปยัง #
    menu.classList.toggle('show');
  });
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
});

  // เปิด login popup
  document.getElementById('login').addEventListener('click', function () {
    document.getElementById('login-section').style.display = 'block';
  });

  // ปิด login popup ด้วยปุ่ม x
  document.getElementById('close-popup').addEventListener('click', function () {
    document.getElementById('login-section').style.display = 'none';
  });

  // ตรวจสอบการเข้าสู่ระบบ
  document.getElementById('login-btn').addEventListener('click', function () {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (username === 'admin' && password === 'arlington140568') {
      alert('เข้าสู่ระบบสำเร็จ!');
      
      // ซ่อนทุก admin-section
      document.querySelectorAll('.admin-section').forEach(el => {
        el.style.display = 'none';
      });

      // แสดง dashboard
      document.getElementById('admin-dashboard').style.display = 'block';
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  });

  document.getElementById('save-settings-btn').addEventListener('click', function () {
    const status = document.getElementById('registration-status').value;
    const submitBtn = document.getElementById('submit-btn');

    if (status === 'open') {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  });
  document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('login-section').style.display = 'none';
  });
