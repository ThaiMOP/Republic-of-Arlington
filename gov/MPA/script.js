document.addEventListener("DOMContentLoaded", () => {
  const personSelect = document.getElementById("person-select");
  const districtDisplay = document.getElementById("district-display");
  const provinceDisplay = document.getElementById("province-display");
  const subdistrictSelect = document.getElementById("subdistrict-select");
  const plotSelect = document.getElementById("plot-select");
  const plotStatus = document.getElementById("plot-status");

  // แปลงที่ดิน A-H
  const plots = ["A", "B", "C", "D", "E", "F", "G", "H"];

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      data.persons.forEach(person => {
        const option = document.createElement("option");
        option.value = person.id;
        option.textContent = person.name;
        personSelect.appendChild(option);
      });

      personSelect.addEventListener("change", () => {
        const personId = parseInt(personSelect.value);
        if (!personId) {
          districtDisplay.value = "";
          provinceDisplay.value = "";
          subdistrictSelect.innerHTML = `<option value="">-- กรุณาเลือกตำบล/แขวง --</option>`;
          subdistrictSelect.disabled = true;
          plotSelect.innerHTML = `<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>`;
          plotSelect.disabled = true;
          plotStatus.textContent = "";
          return;
        }

        const person = data.persons.find(p => p.id === personId);
        districtDisplay.value = person.district;
        provinceDisplay.value = person.province;

        const subdistricts = data.subdistricts[person.district] || [];
        subdistrictSelect.innerHTML = `<option value="">-- กรุณาเลือกตำบล/แขวง --</option>`;
        subdistricts.forEach(sd => {
          const option = document.createElement("option");
          option.value = sd;
          option.textContent = sd;
          subdistrictSelect.appendChild(option);
        });
        subdistrictSelect.disabled = subdistricts.length === 0;

        plotSelect.innerHTML = `<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>`;
        plotSelect.disabled = true;
        plotStatus.textContent = "";
      });

      subdistrictSelect.addEventListener("change", () => {
        const subdistrict = subdistrictSelect.value;
        if (!subdistrict) {
          plotSelect.innerHTML = `<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>`;
          plotSelect.disabled = true;
          plotStatus.textContent = "";
          return;
        }

        plotSelect.innerHTML = `<option value="">-- กรุณาเลือกแปลงที่ดิน --</option>`;
        plots.forEach(plot => {
          const option = document.createElement("option");
          option.value = plot;
          option.textContent = `แปลง ${plot}`;
          plotSelect.appendChild(option);
        });
        plotSelect.disabled = false;
        plotStatus.textContent = "";
      });

      plotSelect.addEventListener("change", () => {
        const plot = plotSelect.value;
        if (!plot) {
          plotStatus.textContent = "";
          return;
        }

        // สถานะแปลงที่ดิน (สุ่มตัวอย่าง)
        const status = Math.random() < 0.5 ? "ว่าง" : "จองแล้ว";
        plotStatus.textContent = `สถานะแปลงที่ดิน: ${status}`;
        plotStatus.style.color = status === "ว่าง" ? "green" : "red";
      });

      document.getElementById("land-registration-form").addEventListener("submit", e => {
        e.preventDefault();

        const personId = parseInt(personSelect.value);
        const subdistrict = subdistrictSelect.value;
        const plot = plotSelect.value;

        if (!personId || !subdistrict || !plot) {
          alert("กรุณาเลือกข้อมูลให้ครบทุกช่อง");
          return;
        }

        if (plotStatus.textContent.includes("จองแล้ว")) {
          alert("แปลงที่ดินนี้ถูกจองแล้ว กรุณาเลือกแปลงอื่น");
          return;
        }

        alert(`ยืนยันการจองแปลงที่ดิน ${plot} สำเร็จ`);
        // TODO: เพิ่มการบันทึกข้อมูล
      });
    })
    .catch(err => {
      console.error("ไม่สามารถโหลดไฟล์ data.json ได้", err);
    });
});
