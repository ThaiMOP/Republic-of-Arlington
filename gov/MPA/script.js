// DOM Elements
const personSelect = document.getElementById('person-select');
const districtDisplay = document.getElementById('district-display');
const provinceDisplay = document.getElementById('province-display');
const subdistrictSelect = document.getElementById('subdistrict-select');
const plotSelect = document.getElementById('plot-select');
const plotStatus = document.getElementById('plot-status');
const submitBtn = document.getElementById('submit-btn');
const registrationsTable = document.getElementById('registrations-table').getElementsByTagName('tbody')[0];
const registrationForm = document.getElementById('land-registration-form');

let initialData = {};
let landStatus = {};
let registrations = []; // ตัวแปร global สำหรับเก็บข้อมูล

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwy66i66j_0VXPu2ZhFg2Q2Mmf3D2Ylg-i3EGlJxDkkiNmNF4VYLEoR4PrNrZoscdWR/exec';

// เมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', init);

// 🧠 ฟังก์ชันหลัก เรียกใช้เมื่อโหลดหน้าเว็บ
async function init() {
  try {
    await fetchInitialData(); // โหลด data.json
    await loadData();         // โหลดข้อมูลจองจาก Google Sheet
    setupEventListeners();    // ตั้งค่าการคลิกต่าง ๆ
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", err);
    alert("ไม่สามารถโหลดข้อมูลเริ่มต้นได้");
  }
}

// โหลดข้อมูลจาก data.json
function fetchInitialData() {
  return fetch('data.json')
    .then(res => res.json())
    .then(data => {
      initialData = data;
    });
}

// โหลดข้อมูลจาก Google Sheets
function loadData() {
  return fetch(`${GAS_URL}?action=loadData`)
    .then(res => res.json())
    .then(data => {
      window.appData = {
        persons: initialData.persons,
        subdistricts: initialData.subdistricts,
        registrations: data.registrations,
        landStatus: initializeLandStatus()
      };
      updateLandStatusFromRegistrations();
      populatePersonSelect();
      renderRegistrationsTable();
    });
}

// สร้างแผนที่สถานะแปลงที่ดินเริ่มต้น
function initializeLandStatus() {
  const statusMap = {};
  for (const [district, subdistricts] of Object.entries(initialData.subdistricts)) {
    subdistricts.forEach(sub => {
      statusMap[`${district}-${sub}`] = { plots: Array(8).fill('available') }; // A-H
    });
  }
  return statusMap;
}

// อัปเดตสถานะแปลงจากข้อมูลการจอง
function updateLandStatusFromRegistrations() {
    registrations = window.appData.registrations;
    landStatus = window.appData.landStatus;

    registrations.forEach(reg => {
        const key = `${reg.district}-${reg.subdistrict}`;
        if (reg.plot && typeof reg.plot === 'string' && landStatus[key]) {
            const plotIndex = reg.plot.charCodeAt(0) - 65;
            landStatus[key].plots[plotIndex] = reg.status;
        } else {
            console.warn('ข้อมูล plot ไม่ถูกต้องหรือ key ไม่ถูกต้อง:', reg);
        }
    });
}

// ฟังก์ชันโหลดข้อมูล
function loadData() {
    fetch(`${GAS_URL}?action=loadData`)
        .then(res => res.json())
        .then(data => {
            window.appData = {
                persons: initialData.persons,
                subdistricts: initialData.subdistricts,
                registrations: data.registrations,
                landStatus: initializeLandStatus()
            };
            updateLandStatusFromRegistrations();  // เรียกที่นี่หลังกำหนด window.appData
            populatePersonSelect();
            renderRegistrationsTable();
        })
        .catch(err => {
            console.error('โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ:', err);
            alert('ไม่สามารถโหลดข้อมูลได้ในขณะนี้');
        });
}

// ตั้งค่า event เมื่อผู้ใช้ใช้งาน UI
function setupEventListeners() {
  personSelect.addEventListener('change', function () {
    const personId = parseInt(this.value);
    const person = initialData.persons.find(p => p.id === personId);
    if (person) {
      districtDisplay.value = person.district;
      provinceDisplay.value = person.province;
      subdistrictSelect.disabled = false;
      populateSubdistrictSelect(person.district);
    } else {
      districtDisplay.value = '';
      provinceDisplay.value = '';
      subdistrictSelect.disabled = true;
      subdistrictSelect.innerHTML = '<option value="">-- กรุณาเลือกตำบล/แขวง --</option>';
      plotSelect.disabled = true;
      plotSelect.innerHTML = '<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>';
      plotStatus.textContent = '';
    }
  });

  subdistrictSelect.addEventListener('change', function () {
    const district = districtDisplay.value;
    const subdistrict = this.value;
    if (district && subdistrict) {
      plotSelect.disabled = false;
      populatePlotSelect(district, subdistrict);
    } else {
      plotSelect.disabled = true;
      plotSelect.innerHTML = '<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>';
      plotStatus.textContent = '';
    }
  });

  plotSelect.addEventListener('change', function () {
    const district = districtDisplay.value;
    const subdistrict = subdistrictSelect.value;
    const plot = this.value;
    updatePlotStatusDisplay(district, subdistrict, plot);
  });

  registrationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    registerLand();
  });
}

// เติม dropdown "ชื่อผู้จอง"
function populatePersonSelect() {
  personSelect.innerHTML = '<option value="">-- กรุณาเลือกชื่อผู้จอง --</option>';
  initialData.persons.forEach(person => {
    const option = document.createElement('option');
    option.value = person.id;
    option.textContent = person.name;
    personSelect.appendChild(option);
  });
}

// เติม dropdown "ตำบล/แขวง"
function populateSubdistrictSelect(district) {
  subdistrictSelect.innerHTML = '<option value="">-- กรุณาเลือกตำบล/แขวง --</option>';
  initialData.subdistricts[district]?.forEach(subdistrict => {
    const option = document.createElement('option');
    option.value = subdistrict;
    option.textContent = subdistrict;
    subdistrictSelect.appendChild(option);
  });
}

// เติม dropdown "แปลงที่ดิน"
function populatePlotSelect(district, subdistrict) {
  plotSelect.innerHTML = '<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>';
  const key = `${district}-${subdistrict}`;
  if (landStatus[key]) {
    for (let i = 0; i < 8; i++) {
      const letter = String.fromCharCode(65 + i); // A-H
      const option = document.createElement('option');
      option.value = letter;
      option.textContent = `แปลง ${letter}`;
      plotSelect.appendChild(option);
    }
  }
}

// แสดงสถานะแปลง
function updatePlotStatusDisplay(district, subdistrict, plot) {
  const key = `${district}-${subdistrict}`;
  const plotIndex = plot.charCodeAt(0) - 65;
  if (landStatus[key]) {
    const status = landStatus[key].plots[plotIndex];
    plotStatus.textContent = '';
    plotStatus.className = '';
    if (status === 'available') {
      plotStatus.textContent = 'สถานะ: ว่าง';
      plotStatus.classList.add('status-available');
    } else if (status === 'reserved') {
      plotStatus.textContent = 'สถานะ: ถูกจอง';
      plotStatus.classList.add('status-reserved');
    } else if (status === 'suspended') {
      plotStatus.textContent = 'สถานะ: ระงับ';
      plotStatus.classList.add('status-suspended');
    }
  }
}

// จองแปลงที่ดิน
function registerLand() {
  const personId = parseInt(personSelect.value);
  const person = initialData.persons.find(p => p.id === personId);
  const district = districtDisplay.value;
  const subdistrict = subdistrictSelect.value;
  const plot = plotSelect.value;

  if (!person || !district || !subdistrict || !plot) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const alreadyRegistered = registrations.some(reg => reg.personId === personId);
  if (alreadyRegistered) {
    alert('บุคคลนี้ได้จองที่ดินแล้ว');
    return;
  }

  const key = `${district}-${subdistrict}`;
  const plotIndex = plot.charCodeAt(0) - 65;

  if (landStatus[key]?.plots[plotIndex] !== 'available') {
    alert('แปลงที่ดินนี้ไม่สามารถจองได้');
    return;
  }

  const registration = {
    id: Date.now(),
    personId: person.id,
    personName: person.name,
    district,
    province: person.province,
    subdistrict,
    plot,
    status: 'reserved',
    registrationDate: new Date().toISOString()
  };

  fetch(`${GAS_URL}?action=saveRegistration`, {
    method: 'POST',
    body: JSON.stringify(registration),
    headers: { 'Content-Type': 'application/json' }
  }).then(() => {
    alert('การจองที่ดินเสร็จสมบูรณ์');
    loadData();
    registrationForm.reset();
    subdistrictSelect.disabled = true;
    plotSelect.disabled = true;
    plotStatus.textContent = '';
  });
}


    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const response = await fetch(`${GAS_URL}?action=loadData`);
        const result = await response.json();
        renderTable(result.registrations);
      } catch (err) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', err);
        alert('ไม่สามารถโหลดข้อมูลจากระบบได้');
      }
    });

    function renderTable(registrations) {
      const tbody = document.getElementById('registrations-table-body');
      tbody.innerHTML = '';

      registrations.forEach(reg => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${reg['ID']}</td>
          <td>${reg['ชื่อ-นามสกุล']}</td>
          <td>${reg['อำเภอ']}</td>
          <td>${reg['จังหวัด']}</td>
          <td>${reg['ตำบล']}</td>
          <td>แปลง ${reg['แปลงที่ดิน']}</td>
          <td>${getStatusText(reg['สถานะ'])}</td>
          <td>${formatDate(reg['เวลา'])}</td>
        `;
        tbody.appendChild(row);
      });
    }

    function getStatusText(status) {
      return {
        reserved: 'ถูกจอง',
        suspended: 'ระงับ'
      }[status] || 'ว่าง';
    }

    function formatDate(isoString) {
      const d = new Date(isoString);
      return d.toLocaleString('th-TH', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    }
