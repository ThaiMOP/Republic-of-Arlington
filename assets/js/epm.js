    window.onload = function () {
        const query = window.location.search.substring(1); // เช่น 'admin' หรือ 'dem'
        const container = document.getElementById("iframe-container");

        // ถ้าไม่มี query string -> กลับไปหน้า dashboard
        if (!query) {
        window.location.href = "dashboard.html";
        return;
        }

        // ข้อมูล iframe
        const iframeData = {
        dem: "https://docs.google.com/spreadsheets/d/18DiM43jKe4cKTQ1yIANusTh7_YI8mY4tWEloVL-VrdI/edit?usp=sharing?gid=0#gid=0",
        bjt: "https://docs.google.com/spreadsheets/d/1oXV_rB1ooFxqrSiAbABQJ563SDl_t7voyiQClsH7Vc4/edit?usp=sharing?gid=0#gid=0",
        pt:  "https://docs.google.com/spreadsheets/d/17fOu6b1l_PCFKNzjyeER1xpRFr0odHX3iU2Wf8O2LEY/edit?usp=sharing?gid=0#gid=0"
        };

        // สร้าง iframe function
        function createIframe(id, src) {
        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.width = "100%";
        iframe.height = "600";
        iframe.style.border = "1px solid #ccc";
        iframe.setAttribute("data-party", id);
        container.appendChild(iframe);
        }

        // ถ้าเป็น admin → แสดงทั้งหมด
        if (query === "admin") {
        for (const key in iframeData) {
            createIframe(key, iframeData[key]);
        }
        } else if (iframeData[query]) {
        // ถ้าเป็นชื่อพรรคที่รู้จัก → แสดงเฉพาะตัวนั้น
        createIframe(query, iframeData[query]);
        } else {
        // ถ้าไม่ตรงอะไรเลย → กลับไป dashboard เช่นกัน
        window.location.href = "dashboard.html";
        }
    };
