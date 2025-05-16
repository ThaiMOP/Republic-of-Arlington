// Slider auto
let slides = document.querySelectorAll('.slide');
let index = 0;
setInterval(() => {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}, 3000);

// Fetch ข่าวสาร
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('news-container');
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <img src="${item.image}" alt="ข่าว">
        <div class="content">
          <p>${item.detail}</p>
          <small>${item.date}</small><br>
          <a href="${item.link}" target="_blank">อ่านต่อ</a>
        </div>
      `;
      container.appendChild(card);
    });
  });

const menuToggle = document.getElementById('menu-toggle');
const menuHeader = document.getElementById('menu-header');
const icon = menuToggle.querySelector('i');

menuToggle.addEventListener('click', () => {
  menuHeader.classList.toggle('show');
  if (menuHeader.classList.contains('show')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});
