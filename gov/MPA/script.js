// URL ของ Google Apps Script Web App
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

let persons = [];
let subdistricts = {};

// โหลดข้อมูล JSON ภายนอก
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    persons = data.persons;
    subdistricts = data.subdistricts;
    populatePersons();
  });

// ใส่รายชื่อผู้จองลงใน select
function populatePersons() {
  const select = document.getElementById('person-select');
  persons.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.name;
    select.appendChild(option);
  });
}

// เมื่อเลือกผู้จอง
document.getElementById('person-select').addEventListener('change', function () {
  const person = persons.find(p => p.id == this.value);
  if (person) {
    document.getElementById('district-display').value = person.district;
    document.getElementById('province-display').value = person.province;
    populateSubdistricts(person.district);
  }
});

// เติมตำบลเมื่อรู้เขต
function populateSubdistricts(district) {
  const subSelect = document.getElementById('subdistrict-select');
  subSelect.innerHTML = '<option value="">-- กรุณาเลือกตำบล/แขวง --</option>';
  subSelect.disabled = false;

  (subdistricts[district] || []).forEach(sd => {
    const option = document.createElement('option');
    option.value = sd;
    option.textContent = sd;
    subSelect.appendChild(option);
  });

  document.getElementById('plot-select').innerHTML =
    '<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>';
  document.getElementById('plot-select').disabled = true;
  document.getElementById('plot-status').textContent = '';
}

// เมื่อเลือกตำบล → สร้างแปลงที่ดินจำลอง
document.getElementById('subdistrict-select').addEventListener('change', function () {
  const plotSelect = document.getElementById('plot-select');
  plotSelect.innerHTML = '<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>';
  plotSelect.disabled = false;

  // สมมุติแปลงที่ดินเป็น A, B, C
  ['A', 'B', 'C'].forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = `แปลง ${p}`;
    plotSelect.appendChild(option);
  });

  document.getElementById('plot-status').textContent = '';
});

// ตรวจสอบสถานะเมื่อเลือกแปลง
document.getElementById('plot-select').addEventListener('change', function () {
  const statusDiv = document.getElementById('plot-status');
  const plot = this.value;

  fetch(`${GOOGLE_SCRIPT_URL}?action=check&plot=${encodeURIComponent(plot)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'available') {
        statusDiv.textContent = 'สถานะ: ว่าง';
        statusDiv.className = 'status-available';
      } else if (data.status === 'reserved') {
        statusDiv.textContent = 'สถานะ: ถูกจองแล้ว';
        statusDiv.className = 'status-reserved';
      } else {
        statusDiv.textContent = 'สถานะ: ไม่ทราบ';
        statusDiv.className = 'status-suspended';
      }
    });
});

// ส่งฟอร์ม
document.getElementById('land-registration-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const personId = document.getElementById('person-select').value;
  const person = persons.find(p => p.id == personId);
  const subdistrict = document.getElementById('subdistrict-select').value;
  const plot = document.getElementById('plot-select').value;

  if (!person || !subdistrict || !plot) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const payload = {
    action: 'register',
    id: person.id,
    name: person.name,
    district: person.district,
    province: person.province,
    subdistrict,
    plot
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert('ลงทะเบียนสำเร็จ');
        loadRegistrations();
      } else {
        alert('ไม่สามารถลงทะเบียนได้');
      }
    });
});

// โหลดตารางผู้ลงทะเบียน
function loadRegistrations() {
  fetch(`${GOOGLE_SCRIPT_URL}?action=list`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('registrations-table-body');
      tbody.innerHTML = '';
      data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${entry.id}</td>
          <td>${entry.name}</td>
          <td>${entry.district}</td>
          <td>${entry.province}</td>
          <td>${entry.subdistrict}</td>
          <td>${entry.plot}</td>
          <td class="${entry.status === 'ว่าง' ? 'status-available' : 'status-reserved'}">${entry.status}</td>
        `;
        tbody.appendChild(row);
      });
    });
}

window.onload = loadRegistrations;
