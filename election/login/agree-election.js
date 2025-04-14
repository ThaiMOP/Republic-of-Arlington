
// การอนุญาติใช้ปุ่มเลือกตั้ง

  const redirectMap = {
    generalElection: '/election/ge.html',
    hrElection: '/election/hre.html',
    senateElection: '/election/se.html',
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
