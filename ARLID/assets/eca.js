const scriptURL = "https://script.google.com/macros/s/AKfycbz1VfPPJlh09E0JdwvhtIikVhGVbFQfx3lfixlI3PJbVjFOSN0hQ3Yt8rcjoWCg7pI/exec";
const params = new URLSearchParams(window.location.search);
const key = [...params.keys()][0]; // เช่น ?dem → key = "dem"

const partyMap = {
  dem: "ประชาธิปไตย",
  pfp: "เสรีประชาชน",
  nfp: "อนาคตใหม่",
  eca: "คณะกรรมการการเลือกตั้ง"
};

const currentParty = partyMap[key] || null;
let allMembers = [];
let currentData = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("party-name").textContent = currentParty || "ไม่ทราบชื่อพรรค";
  fetchData();

  document.getElementById("add-row").addEventListener("click", addRow);
  document.getElementById("save-data").addEventListener("click", saveData);
});

async function fetchData() {
  if (!currentParty) return;

  // 1. ข้อมูลทุกคนสำหรับ dropdown
  const allRes = await fetch(`${scriptURL}?action=read&party=*`);
  allMembers = await allRes.json();

  // 2. ข้อมูลเฉพาะพรรค (หรือทั้งหมดถ้า ?eca)
  const url = `${scriptURL}?action=read${key === "eca" ? "" : "&party=" + encodeURIComponent(currentParty)}`;
  const partyRes = await fetch(url);
  currentData = await partyRes.json();

  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = '';

  currentData.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><input type="text" value="${item.name}" /></td>
      <td><input type="text" value="${item.id}" readonly /></td>
      <td><button onclick="removeRow(this)">ลบ</button></td>
    `;

    tbody.appendChild(tr);
  });
}

function addRow() {
  const tbody = document.querySelector("#data-table tbody");
  const index = tbody.rows.length + 1;

  const tr = document.createElement("tr");

  const nameSelect = document.createElement("select");
  nameSelect.innerHTML = `<option value="">-- เลือกชื่อ --</option>` +
    allMembers.map(m => `<option value="${m.id}">${m.name}</option>`).join("");

  const idInput = document.createElement("input");
  idInput.type = "text";
  idInput.readOnly = true;

  nameSelect.addEventListener("change", () => {
    const selected = allMembers.find(m => m.id === nameSelect.value);
    idInput.value = selected ? selected.id : "";
  });

  tr.innerHTML = `
    <td>${index}</td>
    <td></td>
    <td></td>
    <td><button onclick="removeRow(this)">ลบ</button></td>
  `;

  tr.children[1].appendChild(nameSelect);
  tr.children[2].appendChild(idInput);
  tbody.appendChild(tr);
}

function removeRow(button) {
  button.closest("tr").remove();
}

async function saveData() {
  const rows = Array.from(document.querySelectorAll("#data-table tbody tr"));
  const data = rows.map(row => {
    const nameInput = row.querySelector("td:nth-child(2) input, select");
    const idInput = row.querySelector("td:nth-child(3) input");
    return {
      party: currentParty,
      name: nameInput.value,
      id: idInput.value
    };
  });

  const res = await fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({ action: "write", data }), // เปลี่ยนจาก "save" เป็น "write"
    headers: { "Content-Type": "application/json" }
  });

  const responseText = await res.text();

  let result;
  try {
      result = JSON.parse(responseText);
  } catch (err) {
      console.error("Invalid JSON response:", responseText);
      alert("เกิดข้อผิดพลาดจากฝั่งเซิร์ฟเวอร์ ❌");
      return;
  }
  
  if (result.status === "success") {
      alert("บันทึกข้อมูลสำเร็จ ✅");
      fetchData(); // refresh ข้อมูล
  } else {
      alert("เกิดข้อผิดพลาด: " + (result.message || "ไม่ทราบสาเหตุ"));
  }
  fetchData(); // refresh ข้อมูล
}
