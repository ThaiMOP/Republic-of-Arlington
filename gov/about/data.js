
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

    // เพิ่ม "ทำเนียบคณะรัฐมนตรี" ลงใน dropdown ด้วย
    if (!categories.includes("ทำเนียบคณะรัฐมนตรี")) {
      categories.push("ทำเนียบคณะรัฐมนตรี");
    }

    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
    categorySelect.addEventListener("change", onCategoryChange);
    onCategoryChange(); // load default
  }

  function onCategoryChange() {
    const selectedCategory = document.getElementById("category").value;
    const setSelect = document.getElementById("set");

    // ถ้าเลือก "คณะรัฐมนตรี" → หาชุดที่มากที่สุด และแสดงเลย
    if (selectedCategory === "คณะรัฐมนตรี") {
      const relatedData = allData.filter(d => d.category === "คณะรัฐมนตรี");
      const maxSet = Math.max(...relatedData.map(d => +d.set));
      setSelect.innerHTML = "";
      setSelect.disabled = true;
      renderData(relatedData.filter(d => +d.set === maxSet), true);
      return;
    }

    // ถ้าเลือก "ทำเนียบคณะรัฐมนตรี" → filter ข้อมูลจาก category จริงคือ "คณะรัฐมนตรี"
    const realCategory = selectedCategory === "ทำเนียบคณะรัฐมนตรี" ? "คณะรัฐมนตรี" : selectedCategory;
    const relatedData = allData.filter(d => d.category === realCategory);
    const sets = [...new Set(relatedData.map(d => d.set))];

    setSelect.innerHTML = sets.map(s => `<option value="${s}">ชุด ${s}</option>`).join("");
    setSelect.disabled = false;

    setSelect.onchange = () => {
      const selectedSet = setSelect.value;
      const filtered = relatedData.filter(d => d.set === selectedSet);
      renderData(filtered, true);
    };
    setSelect.onchange(); // default
  }

  function renderData(data, isCabinetLike) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    const prime = data.find(d => d.position === "นายกรัฐมนตรี");
    const others = data.filter(d => d !== prime);

    if (prime) {
      const row1 = document.createElement("div");
      row1.className = "grid-row";
      row1.innerHTML = `
        <div class="hidden-box"></div>
        ${createBox(prime)}
        <div class="hidden-box"></div>
      `;
      container.appendChild(row1);
    }

    for (let i = 0; i < others.length; i += 3) {
      const row = document.createElement("div");
      row.className = "grid-row";
      for (let j = 0; j < 3; j++) {
        const item = others[i + j];
        if (item) {
          row.innerHTML += createBox(item);
        } else {
          row.innerHTML += `<div class="box" style="visibility: hidden;"></div>`;
        }
      }
      container.appendChild(row);
    }
  }

  function createBox(item) {
    return `
      <div class="box">
        <img src="${item.img || '#'}" alt="${item.name || ''}" style="width: 100%; height: auto;">
        <h3>${item.name || 'ไม่ทราบชื่อ'}</h3>
        <p><strong>${item.position || '-'}</strong></p>
        <p>เริ่ม: ${item.start || '-'}<br>สิ้นสุด: ${item.end || '-'}</p>
        ${item.link ? `<a href="${item.link}" target="_blank">ข้อมูลเพิ่มเติม</a>` : ""}
      </div>
    `;
  }
