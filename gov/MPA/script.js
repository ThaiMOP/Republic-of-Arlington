// DOM Elements
const personSelect = document.getElementById('person-select');
const districtDisplay = document.getElementById('district-display');
const provinceDisplay = document.getElementById('province-display');
const subdistrictSelect = document.getElementById('subdistrict-select');
const plotSelect = document.getElementById('plot-select');
const plotStatus = document.getElementById('plot-status');
const submitBtn = document.getElementById('submit-btn');
// ใช้ querySelector เพื่อความปลอดภัยและอ่านง่าย
const registrationsTableBody = document.querySelector('#registrations-table tbody');

if (!registrationsTableBody) {
    console.error("ไม่พบ element #registrations-table tbody");
} else {
    // ใช้งาน registrationsTableBody ได้เลย
}
const registrationForm = document.getElementById('land-registration-form');

// URL ของ Google Apps Script Web App
const GAS_URL = 'https://script.google.com/macros/s/AKfycbx0wLkpEzMSIHVNPrz4NvkG518SUCWaI-CssxoSMUbrmDBRyTa8tZqu-7nxeL1Hxtyp/exec'; // ⚠️ แทนที่เป็น URL จริงของคุณ

let landStatus = {};
let registrations = [];
let initialData = null;

// Initialize the application
function init() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            initialData = data;
            loadData(); // โหลดข้อมูลจาก Google Sheets
            populatePersonSelect();
        })
        .catch(error => {
            console.error("เกิดข้อผิดพลาด:", error);
            alert('ไม่สามารถโหลดข้อมูลเริ่มต้นได้');
        });
}

// Load data from Google Sheets via Google Apps Script (POST)
function loadData() {
    fetch(GAS_URL, {
        method: 'POST',
        body: new URLSearchParams({ action: 'loadData' }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(res => res.json())
    .then(data => {
        registrations = data.registrations || [];
        landStatus = initializeLandStatus();
        updateLandStatusFromRegistrations();
        renderRegistrationsTable();
    })
    .catch(err => {
        console.error('โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ:', err);
        alert('ไม่สามารถโหลดข้อมูลการจองได้ในขณะนี้');
    });
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
    const alreadyRegistered = registrations.some(reg => reg.personId == personId);
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
    fetch(GAS_URL, {
        method: 'POST',
        body: new URLSearchParams({
            action: 'saveRegistration',
            data: JSON.stringify(registration)
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(() => {
        alert('การจองที่ดินเสร็จสมบูรณ์');
        loadData(); // โหลดข้อมูลใหม่
        registrationForm.reset();
        subdistrictSelect.disabled = true;
        plotSelect.disabled = true;
        plotStatus.textContent = '';
    })
    .catch(err => {
        console.error('เกิดข้อผิดพลาดในการบันทึก:', err);
        alert('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    });
}
