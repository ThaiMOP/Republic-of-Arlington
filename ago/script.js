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
