function learnMore() {
  alert("ระบบข้อมูลเพิ่มเติมอยู่ระหว่างการพัฒนา");
}

document.addEventListener("DOMContentLoaded", function () {
  const submenuParents = document.querySelectorAll('.has-submenu > a');

  submenuParents.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const parentLi = this.parentElement;

      // toggle เมนูของตัวเอง
      parentLi.classList.toggle('open');

      // ปิดเมนูอื่นที่ไม่เกี่ยวข้อง (ไม่ใช่ตัวเองหรือเมนูลูก/เมนูพ่อ)
      submenuParents.forEach(otherLink => {
        const otherLi = otherLink.parentElement;

        if (
          otherLi !== parentLi &&
          !parentLi.contains(otherLi) &&
          !otherLi.contains(parentLi)
        ) {
          otherLi.classList.remove('open');
        }
      });
    });
  });
});

fetch('https://script.google.com/macros/s/AKfycbwwEAafwcl4m4uwl3z_AEa0uDgzyZAyDCiDHhk7W-SFyj-7MUfQ8gdFysO0zqM9vkip/exec')
.then(response => response.json())  // แปลงข้อมูลจาก JSON เป็น Object
.then(newsData => {
    const newsListEl = document.getElementById("news-list");

    newsData.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
      <a href="${item.linkto}" target="_blank">${item.name}</a> 
      <span class="news-date">(${item.date})</span>
    `;
        newsListEl.appendChild(li);
    });
})
.catch(error => {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร:', error);
});
