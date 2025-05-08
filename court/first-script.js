function learnMore() {
  alert("ระบบข้อมูลเพิ่มเติมอยู่ระหว่างการพัฒนา");
}

document.addEventListener("DOMContentLoaded", function () {
  const submenuParents = document.querySelectorAll('.has-submenu > a');

  submenuParents.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // ป้องกันการเปิดลิงก์
      const parentLi = this.parentElement;
      parentLi.classList.toggle('open');

      // ปิดเมนูอื่น (optional)
      submenuParents.forEach(otherLink => {
        if (otherLink !== this) {
          otherLink.parentElement.classList.remove('open');
        }
      });
    });
  });
});
