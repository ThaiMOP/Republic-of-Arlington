
// การอนุญาติใช้ปุ่มเลือกตั้ง

  const redirectMap = {
    generalElection: 'ge.html',
    hrElection: 'hre.html',
    senateElection: 'se.html',
    report: '/election/event',
    check: '/election/enqelection-local'
  };

  // 🔒 ปรับตรงนี้เพื่อเปิด/ปิดปุ่มแต่ละอัน
  // 🔒 ปรับตรงนี้เพื่อเปิด/ปิดปุ่มแต่ละอัน
  // 🔒 ปรับตรงนี้เพื่อเปิด/ปิดปุ่มแต่ละอัน

  const enabledButtons = {
    generalElection: false,
    hrElection: true,
    senateElection: false,
    report: true,
    check: true
  };

  Object.entries(redirectMap).forEach(([id, url]) => {
    const btn = document.getElementById(id);

    if (!enabledButtons[id]) {
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => {
        window.location.href = url;
      });
    }
  });
