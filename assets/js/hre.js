  const electionElement = document.querySelector('[data-election]');

  // กำหนดเวลาเปิดและปิด
  const openTime = new Date('2025-05-09T06:00:00+07:00');  // เวลาเปิด 6.00 น.
  const closeTime = new Date('2025-05-09T15:59:45+07:00'); // เวลา 20.00 น.

  function updateElectionStatus() {
    const now = new Date();

    if (now < openTime) {
      // ยังไม่ถึงเวลาเลือกตั้ง
      electionElement.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`;
    } else if (now >= openTime && now <= closeTime) {
      // อยู่ในช่วงเวลาเลือกตั้ง
      electionElement.innerHTML = `<div class="eca-btn" onclick="window.location.href='/election/hr-election.html'">เข้าระบบใช้สิทธิเลือกตั้ง</div>`;
    } else {
      // เลยเวลาเลือกตั้งแล้ว
      electionElement.innerHTML = `<h1>บัดนี้ถึงเวลาปิดการออกเสียงลงคะแนนแล้ว ให้ปิดการออกเสียงลงคะแนน</h1>`;
    }
  }

  // อัปเดตทันทีเมื่อโหลดหน้า และตั้งเวลาอัปเดตทุกๆ 1 นาที
  updateElectionStatus();
  setInterval(updateElectionStatus, 60 * 1000);
