document.addEventListener("DOMContentLoaded", () => {
  loadComponent("components/header.html", "#header");
  loadComponent("components/footer.html", "#footer");

  const dropdown = document.querySelector('.dropdown');
  
  if (dropdown) {
    dropdown.addEventListener('click', function (event) {
      event.stopPropagation(); // ป้องกันคลิกทะลุถึง document

      const dropdownContent = this.querySelector('.dropdown-content');
      if (dropdownContent) {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
      }
    });

    document.addEventListener('click', function (event) {
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      if (dropdownContent) {
        dropdownContent.style.display = 'none';
      }
    });
  }
});

function loadComponent(file, target) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.querySelector(target).innerHTML = data;
    })
    .catch(err => console.error("ไม่สามารถโหลด:", file, err));
}
