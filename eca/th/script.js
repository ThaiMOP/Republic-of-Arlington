async function loadData() {
    try {
        const newsRes = await fetch('https://script.google.com/macros/s/AKfycbwj8_52HwKqV-IiA0AXw8mQ2Xot-ygvy0lV8yzej5aoMv1HHYEoxyD8S9T4oHqeIk6C/exec');
        const news = await newsRes.json();
        console.log('ข่าว:', news); // ตรวจสอบใน console
        renderBoxes(news, 'news-section');

        const resultRes = await fetch('https://script.google.com/macros/s/AKfycbxOEqvcWgz8zoWmyHxZCMwnLLH-H-pXK4URDt5RroFa8ap0SzrjmRJEzchvLYOlyvSF/exec');
        const results = await resultRes.json();
        console.log('ผลเลือกตั้ง:', results);
        renderBoxes(results, 'results-section');
    } catch (err) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', err);
    } finally {
        const loader = document.getElementById("page-loader");
        if (loader) loader.style.display = "none";
    }
}

function renderBoxes(data, targetId) {
    const container = document.getElementById(targetId);
    container.innerHTML = '';
    if (!Array.isArray(data)) {
        console.error(`ข้อมูลใน ${targetId} ไม่ใช่ array:`, data);
        return;
    }

    data.forEach(item => {
        const box = document.createElement('div');
        box.className = 'news-box';
        box.innerHTML = `
            <a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">
                <img src="${item.img}" alt="${item.title}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
                <div class="news-title">${item.title}</div>
                <div class="news-date">${item.date || ''}</div>
            </a>
        `;
        container.appendChild(box);
    });
}

loadData();

document.addEventListener('DOMContentLoaded', function () {
  // เปิด/ปิด submenu ที่อยู่ถัดไปของ toggle-submenu
  document.querySelectorAll('.toggle-submenu').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const currentSubmenu = this.nextElementSibling;

      // ปิดเฉพาะเมนูที่ไม่ได้อยู่ในสายแม่ลูก
      document.querySelectorAll('.submenu').forEach(sub => {
        if (!sub.contains(currentSubmenu) && sub !== currentSubmenu) {
          sub.classList.remove('show-submenu');
        }
      });

      // toggle เฉพาะเมนูนี้
      if (currentSubmenu && currentSubmenu.classList.contains('submenu')) {
        currentSubmenu.classList.toggle('show-submenu');
      }
    });
  });

  // คลิกที่อื่นบนหน้า → ปิดทุก submenu
  document.addEventListener('click', function () {
    document.querySelectorAll('.submenu').forEach(sub => {
      sub.classList.remove('show-submenu');
    });
  });

  // คลิกใน submenu (ทุกชั้น) → ไม่ปิด
  document.querySelectorAll('.submenu').forEach(sub => {
    sub.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  const icon = toggleBtn.querySelector('i');

  toggleBtn.addEventListener('click', function () {
    // Toggle แสดง/ซ่อนเมนู
    nav.classList.toggle('show');

    // Toggle ไอคอน
    if (icon.classList.contains('fa-bars')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }

    // Toggle body overflow
    if (nav.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
});