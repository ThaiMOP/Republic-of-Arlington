function updateElectionStatus() { 
    const electionTag = document.querySelector("[data-election]"); 
    if (!electionTag) return; 

    const now = new Date(); 
    const timezoneOffset = 7 * 60 * 60 * 1000; // Offset 7 ชั่วโมง (UTC+7)
    
    const startTime = new Date(Date.UTC(2025, 3, 2, 6, 0, 0) - timezoneOffset); 
    const endTime = new Date(Date.UTC(2025, 3, 2, 16, 59, 59) - timezoneOffset); 

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
