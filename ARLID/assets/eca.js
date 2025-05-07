const partyMap = {
  dem: "ประชาธิปไตย",
  pfp: "เสรีประชาชน",
  nfp: "อนาคตใหม่",
  eca: "คณะกรรมการการเลือกตั้ง"
};

const query = new URLSearchParams(window.location.search);
const key = Object.keys(partyMap).find(k => query.has(k));
const currentParty = partyMap[key];
document.getElementById("party-title").textContent = "ข้อมูลพรรค: " + (currentParty || "ไม่พบพรรค");

const scriptURL = 'https://script.google.com/macros/s/AKfycbwUY78FvPyV6QHElIjTDpZIfgMe0FKRZdobDFomjkEQrdha5T6GVQQBy3Xi_Odrb6AG/exec';
let allMembers = []; // เก็บสมาชิกทั้งหมด

async function fetchData() {
  if (!currentParty) return;

  // ?eca เห็นทุกพรรค → ไม่กรอง
  const url = `${scriptURL}?action=read${key === "eca" ? "" : "&party=" + encodeURIComponent(currentParty)}`;
  const res = await fetch(url);
  const data = await res.json();
  allMembers = data; // เก็บไว้ใช้กับ dropdown

  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = '';

  data.forEach((item, index) => {
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

  // เมื่อเลือกชื่อ → อัปเดตช่อง id
  nameSelect.addEventListener("change", () => {
    const selectedId = nameSelect.value;
    idInput.value = selectedId;
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

function removeRow(btn) {
  const tr = btn.closest("tr");
  tr.remove();
}

// เริ่มโหลดข้อมูลเมื่อหน้าเว็บโหลด
fetchData();
