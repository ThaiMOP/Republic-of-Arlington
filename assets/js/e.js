function updateElectionStatus() { 
    const electionTag = document.querySelector("[data-election]"); 
    if (!electionTag) return; 

    const now = new Date();
    const startTime = new Date(2025, 3, 4, 1, 0, 0);  // 2 เม.ย. 2025 เวลา 06:00 (UTC+7)
    const endTime = new Date(2025, 3, 4, 16, 59, 59); // 2 เม.ย. 2025 เวลา 16:59 (UTC+7)

    if (now < startTime) { 
        electionTag.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`; 
    } else if (now >= startTime && now <= endTime) { 
        electionTag.innerHTML = `<div class="eca-btn" onclick="window.location.href='/election/pe'">เข้าระบบใช้สิทธิเลือกตั้ง</div>`; 
    } else { 
        electionTag.innerHTML = `<h1>สิ้นสุดเวลาใช้สิทธิออกเสียงลงคะแนนแล้ว</h1>`; 
    } 
} 

updateElectionStatus();  
setInterval(updateElectionStatus, 1000);

    document.querySelector(".eca-btn").addEventListener("click", function() {
        window.location.href = "/election/pe";
    });
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("contextmenu", function(event) {
                event.preventDefault();
            });
        });
    });
