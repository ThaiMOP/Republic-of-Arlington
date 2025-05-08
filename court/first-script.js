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

