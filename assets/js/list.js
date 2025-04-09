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
        dem: "https://docs.google.com/document/d/1f7YSM77z2MeSaFE85147XCDhjYf0yqut/edit?usp=sharing&ouid=100218822943281841336&rtpof=true&sd=true",
        bjt: "https://docs.google.com/document/d/1PCgIjzy3Vgzs4OQoFag9XJSPMBUkLPRl/edit?usp=sharing&ouid=100218822943281841336&rtpof=true&sd=true",
        pt:  "https://docs.google.com/document/d/1BeesuTjWRAoFzMXWSuNDj_YODa3sIDvZ/edit?usp=sharing&ouid=100218822943281841336&rtpof=true&sd=true"
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
