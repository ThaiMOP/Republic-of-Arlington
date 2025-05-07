
document.addEventListener('DOMContentLoaded', function () {
    let partyData = [];
    let party = '';

    const dataTableBody = document.getElementById('data-table-body');
    const addRowButton = document.getElementById('add-row');
    const saveDataButton = document.getElementById('save-data');

    const urlParams = new URLSearchParams(window.location.search);
    const partyParam = urlParams.get('party');

    const partyMap = {
        dem: "ประชาธิปไตย",
        pfp: "เสรีประชาชน",
        nfp: "อนาคตใหม่",
        eca: "คณะกรรมการการเลือกตั้ง"
    };

    if (partyParam) {
        const partyName = partyMap[partyParam.toLowerCase()];
        if (partyName) {
            party = partyName;
            document.getElementById('party-title').textContent = `ข้อมูลพรรค: ${partyName}`;
            document.getElementById('party-name').textContent = `พรรค: ${partyName}`;
            loadPartyData(partyName);
        } else {
            document.getElementById('party-title').textContent = 'ไม่พบพรรค';
            document.getElementById('party-name').textContent = 'ไม่พบข้อมูลพรรค';
        }
    } else {
        document.getElementById('party-title').textContent = 'กรุณาเลือกพรรค';
        document.getElementById('party-name').textContent = 'ไม่มีข้อมูลพรรค';
    }

    function loadPartyData(partyName) {
        fetch(`https://script.google.com/macros/s/AKfycbzzBmXHrEVDom-e7AY7N9f19eIkkbGKneqB9f9r8hD6c_jMlHDjKW4KY0Xa-TPgGONp/exec?party=${partyName}`)
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched:', data);
                partyData = data;
                updateTable();
            })
            .catch(error => console.error('Error fetching data:', error));
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
                const index = button.getAttribute('data-index');
                partyData.splice(index, 1);
                updateTable();
            });
        });

        document.querySelectorAll('.name-input, .id-input').forEach(input => {
            input.addEventListener('input', function () {
                const index = input.getAttribute('data-index');
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
            party: party
        }));

        fetch('https://script.google.com/macros/s/AKfycbzzBmXHrEVDom-e7AY7N9f19eIkkbGKneqB9f9r8hD6c_jMlHDjKW4KY0Xa-TPgGONp/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSave)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('บันทึกข้อมูลสำเร็จ!');
                } else {
                    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                }
            })
            .catch(error => console.error('Error saving data:', error));
    });
});
