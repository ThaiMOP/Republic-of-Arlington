function updateElectionStatus() { 
    const electionTag = document.querySelector("[data-election]"); 
    if (!electionTag) return; 

    const now = new Date();
    const startTime = new Date(2025, 3, 19, 6, 0, 0);  // 4 เม.ย. 2025 เวลา 06:00 (UTC+7)
    const endTime = new Date(2025, 3, 19, 15, 59, 45); // 4 เม.ย. 2025 เวลา 15:59 (UTC+7)

    if (now < startTime) { 
        electionTag.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`; 
    } else if (now >= startTime && now <= endTime) { 
        electionTag.innerHTML = `<div class="eca-btn" onclick="window.location.href='/election/hr-election.html'">เข้าระบบใช้สิทธิเลือกตั้ง</div>`; 
    } else { 
        electionTag.innerHTML = `<h1>บัดนี้ถึงเวลาปิดการออกเสียงลงคะแนนแล้ว ให้ปิดการออกเสียงลงคะแนน</h1>`; 
    } 
} 

updateElectionStatus();  
setInterval(updateElectionStatus, 1000);

    document.querySelector(".eca-btn").addEventListener("click", function() {
        window.location.href = "/election/hr-election.html";
    });
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("contextmenu", function(event) {
                event.preventDefault();
            });
        });
    });
