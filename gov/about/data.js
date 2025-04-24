const apiBase = "https://script.google.com/macros/s/AKfycbz4HTJGGsTfFU-bMimmTwodWy8gxPwIVwJ1OEG-e7pjcrCuRFSlsKzIefXJSPwWPG5X/exec";

    async function fetchCategories() {
      // คุณอาจต้องเปลี่ยนเป็น apiBase + "?mode=category-list" ถ้า API รองรับ
      const res = await fetch(apiBase);
      const data = await res.json();
      const categories = [...new Set(data.map(d => d.category).filter(Boolean))];

      if (!categories.includes("ทำเนียบคณะรัฐมนตรี")) {
        categories.push("ทำเนียบคณะรัฐมนตรี");
      }

      populateCategories(categories);
    }

    function populateCategories(categories) {
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
      categorySelect.addEventListener("change", onCategoryChange);
      onCategoryChange(); // default
    }

    async function onCategoryChange() {
      const selectedCategory = document.getElementById("category").value;
      const setSelect = document.getElementById("set");
      const actualCategory = selectedCategory === "ทำเนียบคณะรัฐมนตรี" ? "คณะรัฐมนตรี" : selectedCategory;

      const res = await fetch(`${apiBase}?category=${encodeURIComponent(actualCategory)}`);
      let data = await res.json();

      if (actualCategory === "คณะรัฐมนตรี" && selectedCategory === "คณะรัฐมนตรี") {
        const maxSet = Math.max(...data.map(d => +d.set));
        const filtered = data.filter(d => +d.set === maxSet);
        setSelect.innerHTML = "";
        setSelect.disabled = true;
        renderData(filtered, true);
        return;
      }

      const sets = [...new Set(data.map(d => d.set))];
      setSelect.innerHTML = sets.map(s => `<option value="${s}">ชุด ${s}</option>`).join("");
      setSelect.disabled = false;

      setSelect.onchange = () => {
        const selectedSet = setSelect.value;
        const filtered = data.filter(d => d.set == selectedSet);
        renderData(filtered, false);
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
          row.innerHTML += item
            ? createBox(item)
            : `<div class="box" style="visibility: hidden;"></div>`;
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

    fetchCategories();
