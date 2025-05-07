document.addEventListener('DOMContentLoaded', function () {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzzBmXHrEVDom-e7AY7N9f19eIkkbGKneqB9f9r8hD6c_jMlHDjKW4KY0Xa-TPgGONp/exec';
  const dataTableBody = document.getElementById('data-table-body');
  const addRowButton = document.getElementById('add-row');
  const saveDataButton = document.getElementById('save-data');

  let partyData = [];
  let currentParty = '';

  const partyMap = {
    dem: "ประชาธิปไตย",
    pfp: "เสรีประชาชน",
    nfp: "อนาคตใหม่",
    eca: "คณะกรรมการการเลือกตั้ง"
  };

  const urlParams = new URLSearchParams(window.location.search);
  const key = [...urlParams.keys()][0];
  currentParty = partyMap[key] || null;

  if (currentParty) {
    document.getElementById('party-title').textContent = `ข้อมูลพรรค: ${currentParty}`;
    document.getElementById('party-name').textContent = `พรรค: ${currentParty}`;
    loadPartyData();
  } else {
    document.getElementById('party-title').textContent = 'กรุณาเลือกพรรค';
    document.getElementById('party-name').textContent = 'ไม่ทราบชื่อพรรค';
  }

  function loadPartyData() {
    const url = `${scriptURL}?action=read&party=${encodeURIComponent(currentParty)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        partyData = data.map(item => ({ name: item.name, id: item.id }));
        updateTable();
      })
      .catch(err => console.error('โหลดข้อมูลล้มเหลว:', err));
  }

  function updateTable() {
    dataTableBody.innerHTML = '';
    partyData.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><input type="text" value="${row.name}" data-index="${index}" class="name-input"></td>
        <td><input type="text" value="${row.id}" data-index="${index}" class="id-input"></td>
        <td><button class="delete-row" data-index="${index}">ลบ</button></td>
      `;
      dataTableBody.appendChild(tr);
    });

    document.querySelectorAll('.delete-row').forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(button.getAttribute('data-index'));
        partyData.splice(index, 1);
        updateTable();
      });
    });

    document.querySelectorAll('.name-input, .id-input').forEach(input => {
      input.addEventListener('input', function () {
        const index = parseInt(input.getAttribute('data-index'));
        const field = input.classList.contains('name-input') ? 'name' : 'id';
        partyData[index][field] = input.value;
      });
    });
  }

  addRowButton.addEventListener('click', function () {
    partyData.push({ name: '', id: '' });
    updateTable();
  });

  saveDataButton.addEventListener('click', function () {
    const dataToSave = partyData.map(row => ({
      name: row.name,
      id: row.id,
      party: currentParty
    }));

    fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'write',
        data: dataToSave
      })
    })
      .then(res => res.text())
      .then(text => {
        alert('บันทึกข้อมูลแล้ว: ' + text);
        loadPartyData();
      })
      .catch(err => {
        console.error('เกิดข้อผิดพลาดในการบันทึก:', err);
        alert('เกิดข้อผิดพลาดในการบันทึก');
      });
  });
});
