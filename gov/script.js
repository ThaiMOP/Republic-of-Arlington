function toggleMenu() {
  const menu = document.querySelector('nav ul');
  const icon = document.querySelector('.menu-toggle i');
  menu.classList.toggle('active');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
}
