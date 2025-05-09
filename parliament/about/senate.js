const apiUrl = "https://script.google.com/macros/s/AKfycbwRCnPqo0coL9xj8kj3TlZyOg5mgfBgR2e2z8cr2Os7A8UV_RkmwUdMgOkLkP43dlwe/exec";
const select = document.getElementById("batchSelect");
const memberList = document.getElementById("memberList");
let allData = [];

async function fetchData() {
  try {
    document.getElementById("loader").style.display = "flex";

    const res = await fetch(apiUrl);
    const data = await res.json();
    allData = data;

    const batches = [...new Set(data.map(item => item.batch))];
    select.innerHTML = "";
    batches.forEach(batch => {
      const option = document.createElement("option");
      option.value = batch;
      option.textContent = batch;
      select.appendChild(option);
    });

    showMembers(select.value);
  } catch (err) {
    memberList.innerHTML = "<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    console.error(err);
  } finally {
    document.getElementById("loader").style.display = "none";
  }
}

function showMembers(batch) {
  memberList.innerHTML = "";
  const filtered = allData.filter(item => item.batch === batch);

  filtered.forEach((item, index) => {
    const statusColor = item.status === "ดำรงตำแหน่ง" ? "#00a52a" : "#ff0000";

    const box = document.createElement("div");
    box.className = "profile-box";
    box.innerHTML = `
      <h2>${item.no}. ${item.name}</h2>
      <p style="color: ${item.color};">${item.party}</p>
      <p>สภาผู้แทนราษฎร ${item.batch}</p>
      <p>วาระ ${item.start} - ${item.end}</p>
      <p style="color: ${statusColor};">${item.status}</p>
    `;
    memberList.appendChild(box);
  });
}

select.addEventListener("change", () => {
  showMembers(select.value);
});

fetchData();
