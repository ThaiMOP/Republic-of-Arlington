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


  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("โหลดไฟล์ JSON ไม่สำเร็จ");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // ตอนนี้คุณสามารถใช้ data.persons และ data.subdistricts ได้
      // ตัวอย่าง:
      data.persons.forEach(person => {
        console.log(`${person.name} อยู่จังหวัด ${person.province}`);
      });
    })
    .catch(error => {
      console.error("เกิดข้อผิดพลาด:", error);
    });

// URL ของ Google Apps Script Web App
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzbQQhen16FufMcfn3JC_ry_wyeqSlmUvhVNkDcMxgo-I5Kjlt3KOoqIm6BG2ipgW65/exec'; // ⚠️ แทนที่เป็น URL จริงของคุณ

// สถานะแปลงที่ดิน (จะโหลดจาก Google Sheet)
let landStatus = {};
let registrations = [];

// Initialize the application
function init() {
    loadData(); // โหลดข้อมูลจาก Google Sheets
    setupEventListeners();
}

// สร้างข้อมูลเริ่มต้นของสถานะที่ดินทั้งหมดให้เป็น 'available'
function initializeLandStatus() {
    const statusMap = {};

    for (const [district, subdistricts] of Object.entries(initialData.subdistricts)) {
        subdistricts.forEach(subdistrict => {
            const key = `${district}-${subdistrict}`;
            statusMap[key] = {
                plots: Array(8).fill('available') // แปลง A-H
            };
        });
    }

    return statusMap;
}

// Load data from Google Sheets via Google Apps Script
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
            updateLandStatusFromRegistrations();
            populatePersonSelect();
            renderRegistrationsTable();
        })
        .catch(err => {
            console.error('โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ:', err);
            alert('ไม่สามารถโหลดข้อมูลได้ในขณะนี้');
        });
    // อัปเดตสถานะที่ดินจากข้อมูลการจอง
    function updateLandStatusFromRegistrations() {
        registrations = window.appData.registrations;
        landStatus = window.appData.landStatus;
    
        registrations.forEach(reg => {
            const key = `${reg.district}-${reg.subdistrict}`;
            
            // ตรวจสอบว่า reg.plot มีค่าและเป็น string
            if (reg.plot && typeof reg.plot === 'string') {
                const plotIndex = reg.plot.charCodeAt(0) - 65;
                if (landStatus[key]) {
                    landStatus[key].plots[plotIndex] = reg.status;
                }
            } else {
                console.warn('ข้อมูล plot ไม่ถูกต้อง:', reg);
            }
        });
    }


}
// Setup event listeners
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

// Populate person select dropdown
function populatePersonSelect() {
    personSelect.innerHTML = '<option value="">-- กรุณาเลือกชื่อผู้จอง --</option>';
    initialData.persons.forEach(person => {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = person.name;
        personSelect.appendChild(option);
    });
}

// Populate subdistrict select dropdown
function populateSubdistrictSelect(district) {
    subdistrictSelect.innerHTML = '<option value="">-- กรุณาเลือกตำบล/แขวง --</option>';
    if (initialData.subdistricts[district]) {
        initialData.subdistricts[district].forEach(subdistrict => {
            const option = document.createElement('option');
            option.value = subdistrict;
            option.textContent = subdistrict;
            subdistrictSelect.appendChild(option);
        });
    }
}

// Populate plot select dropdown
function populatePlotSelect(district, subdistrict) {
    plotSelect.innerHTML = '<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>';
    const key = `${district}-${subdistrict}`;
    if (landStatus[key]) {
        for (let i = 0; i < 8; i++) {
            const plotLetter = String.fromCharCode(65 + i); // A-H
            const option = document.createElement('option');
            option.value = plotLetter;
            option.textContent = `แปลง ${plotLetter}`;
            plotSelect.appendChild(option);
        }
    }
}

// Update plot status display
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

// Register land
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

    // ตรวจสอบว่าคนนี้เคยจองแล้วหรือยัง
    const alreadyRegistered = registrations.some(reg => reg.personId === personId);
    if (alreadyRegistered) {
        alert('บุคคลนี้ได้ทำการจองที่ดินไว้แล้ว (1 คนจองได้ 1 แปลงเท่านั้น)');
        return;
    }

    // ตรวจสอบสถานะแปลง
    const key = `${district}-${subdistrict}`;
    const plotIndex = plot.charCodeAt(0) - 65;

    if (landStatus[key]?.plots[plotIndex] !== 'available') {
        alert('แปลงที่ดินนี้ไม่สามารถจองได้ในขณะนี้');
        return;
    }

    // สร้างข้อมูลการจอง
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

    // ส่งไป Google Sheets
    fetch(`${GAS_URL}?action=saveRegistration`, {
        method: 'POST',
        body: JSON.stringify(registration),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(() => {
        alert('การจองที่ดินเสร็จสมบูรณ์');
        loadData(); // โหลดข้อมูลใหม่
        registrationForm.reset();
        subdistrictSelect.disabled = true;
        plotSelect.disabled = true;
        plotStatus.textContent = '';
    });
}

// Render registrations table
function renderRegistrationsTable() {
    registrationsTable.innerHTML = '';
    registrations.forEach(reg => {
        const statusText = {
            'reserved': 'ถูกจอง',
            'suspended': 'ระงับ'
        }[reg.status] || 'ว่าง';

        const row = registrationsTable.insertRow();
        row.innerHTML = `
            <td>${reg.id}</td>
            <td>${reg.personName}</td>
            <td>${reg.district}</td>
            <td>${reg.province}</td>
            <td>${reg.subdistrict}</td>
            <td>แปลง ${reg.plot}</td>
            <td>${statusText}</td>
        `;
    });
}

// Save to Google Sheets (เฉพาะการจองล่าสุด)
function saveToGoogleSheet(registration) {
    fetch(`${GAS_URL}?action=saveRegistration`, {
        method: 'POST',
        body: new URLSearchParams({
            data: JSON.stringify(registration)
        })
    }).then(() => loadData());
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
