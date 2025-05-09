// การอนุญาตใช้ปุ่มเลือกตั้ง

const redirectMap = {
  generalElection: '/election/ge.html',
  hrElection: '/election/hre.html',
  senateElection: '/election/se.html',
  report: '/election/event',
  check: '/election/enqelection-local'
};

// ดึงข้อมูลผู้ใช้จาก localStorage
const userData = JSON.parse(localStorage.getItem('election_user_data') || '{}');

// กำหนดว่าเปิดปุ่มไหนบ้างในระบบ (เปิด/ปิด manual)
const electionStatus = {
  generalElection: false,  // ❌ ยังไม่เปิด
  hrElection: true,        // ✅ เปิดแล้ววู้ว
  senateElection: false    // ❌ ยังไม่เปิด
};

// เปิดปุ่มเฉพาะกรณีที่ผู้ใช้มีสิทธิ์ + ระบบเปิดใช้งาน
const enabledButtons = {
  generalElection: userData.right === 'มี' && electionStatus.generalElection,
  hrElection: true,
  senateElection: userData.right === 'มี' && electionStatus.senateElection,
  report: true,
  check: true
};

// วนลูปกำหนดสถานะให้แต่ละปุ่ม
Object.entries(redirectMap).forEach(([id, url]) => {
  const btn = document.getElementById(id);
  if (!btn) return; // ✅ ป้องกันกรณี element ไม่เจอ

  if (!enabledButtons[id]) {
    btn.disabled = true;
    btn.classList.add('disabled'); // แนะนำถ้ามีสไตล์ใน CSS
  } else {
    btn.disabled = false;
    btn.addEventListener('click', () => {
      window.location.href = url;
    });
  }
});
