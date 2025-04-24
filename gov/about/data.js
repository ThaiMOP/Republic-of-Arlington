
    const apiUrl = "https://script.google.com/macros/s/AKfycbz4HTJGGsTfFU-bMimmTwodWy8gxPwIVwJ1OEG-e7pjcrCuRFSlsKzIefXJSPwWPG5X/exec";
    let allData = [];

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        allData = data;
        populateCategories(data);
      });

    function populateCategories(data) {
      const categories = [...new Set(data.map(d => d.category).filter(Boolean))];
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
      categorySelect.addEventListener("change", onCategoryChange);
      onCategoryChange(); // load default
    }

    function onCategoryChange() {
      const selectedCategory = document.getElementById("category").value;
      const setSelect = document.getElementById("set");

      const relatedData = allData.filter(d => d.category === selectedCategory);
      const sets = [...new Set(relatedData.map(d => d.set))];

      // ปรับ set dropdown
      if (selectedCategory === "คณะรัฐมนตรี") {
        const maxSet = Math.max(...relatedData.map(d => +d.set));
        setSelect.innerHTML = "";
        setSelect.disabled = true;
        renderData(relatedData.filter(d => +d.set === maxSet), true);
      } else {
        setSelect.innerHTML = sets.map(s => `<option value="${s}">ชุด ${s}</option>`).join("");
        setSelect.disabled = false;
        setSelect.onchange = () => {
          const selectedSet = setSelect.value;

          // พิเศษ: ถ้าเลือก "ทำเนียบนายกรัฐมนตรี" → ดึงข้อมูลจาก คณะรัฐมนตรีแทน
          if (selectedCategory === "ทำเนียบนายกรัฐมนตรี") {
            const cabinetData = allData.filter(d => d.category === "คณะรัฐมนตรี" && d.set === selectedSet);
            renderData(cabinetData, true);
          } else {
            const filtered = relatedData.filter(d => d.set === selectedSet);
            renderData(filtered, false);
          }
        };
        setSelect.onchange(); // load default
      }
    }

    function renderData(data, isCabinetLike) {
      const container = document.getElementById("container");
      container.innerHTML = "";

      if (isCabinetLike) {
        const prime = data.find(d => d.position === "นายกรัฐมนตรี");
        const others = data.filter(d => d !== prime);

        // แถวแรก = นายกอยู่กลาง
        const row1 = document.createElement("div");
        row1.className = "grid-row";
        row1.innerHTML = `
          <div class="hidden-box"></div>
          ${createBox(prime)}
          <div class="hidden-box"></div>
        `;
        container.appendChild(row1);

        data = others;
      }

      for (let i = 0; i < data.length; i += 3) {
        const row = document.createElement("div");
        row.className = "grid-row";
        for (let j = 0; j < 3; j++) {
          if (data[i + j]) row.innerHTML += createBox(data[i + j]);
        }
        container.appendChild(row);
      }
    }

    function createBox(item) {
      return `
        <div class="box">
          <img src="${item.img}" alt="${item.name}" style="width: 100%; height: auto;">
          <h3>${item.name}</h3>
          <p><strong>${item.position}</strong></p>
          <p>เริ่ม: ${item.start}<br>สิ้นสุด: ${item.end}</p>
          ${item.link ? `<a href="${item.link}" target="_blank">ข้อมูลเพิ่มเติม</a>` : ""}
        </div>
      `;
    }
