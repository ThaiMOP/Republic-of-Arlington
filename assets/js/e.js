function updateElectionStatus() { 
    const electionTag = document.querySelector("[data-election]"); 
    if (!electionTag) return; 

    const now = new Date(); 
    const startTime = new Date("2025-04-02T06:00:00"); 
    const endTime = new Date("2025-04-02T16:59:59"); 

    if (now < startTime) { 
        electionTag.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`; 
    } else if (now >= startTime && now <= endTime) { 
        electionTag.innerHTML = `<div class="eca-btn">เข้าระบบใช้สิทธิเลือกตั้ง</div>`; 
    } else { 
        electionTag.innerHTML = `<h1>สิ้นสุดเวลาใช้สิทธิออกเสียงลงคะแนนแล้ว</h1>`; 
    } 
} 

updateElectionStatus(); 
setInterval(updateElectionStatus, 30000);
