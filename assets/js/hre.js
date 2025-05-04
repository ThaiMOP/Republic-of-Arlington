function updateElectionStatus() {
  const electionTag = document.querySelector("[data-election]");
  if (!electionTag) return;

  const now = new Date();
  const startTime = new Date(2025, 4, 4, 6, 0, 0);  // 5 พ.ค. 06:00
  const endTime = new Date(2025, 4, 4, 20, 59, 45); // 5 พ.ค. 15:59:45

  let nextState = "";
  if (now < startTime) {
    nextState = "before";
  } else if (now >= startTime && now <= endTime) {
    nextState = "during";
  } else {
    nextState = "after";
  }

  const currentState = electionTag.getAttribute("data-state");
  if (currentState === nextState) return; // ไม่ต้องเปลี่ยนถ้า state เดิม

  electionTag.setAttribute("data-state", nextState);

  if (nextState === "before") {
    electionTag.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`;
  } else if (nextState === "during") {
    electionTag.innerHTML = `<div class="eca-btn">เข้าระบบใช้สิทธิเลือกตั้ง</div>`;
    electionTag.querySelector(".eca-btn").addEventListener("click", function () {
      window.location.href = "/election/hr-election.html";
    });
  } else {
    electionTag.innerHTML = `<h1>บัดนี้ถึงเวลาปิดการออกเสียงลงคะแนนแล้ว ให้ปิดการออกเสียงลงคะแนน</h1>`;
  }
}
