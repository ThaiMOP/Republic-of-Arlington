function hideLoader() {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.display = "none";
  }, 1000); // ซ่อนหลัง 1 วินาที
}
