async function fetchData() {
  try {
    document.getElementById("loader").style.display = "flex"; // แสดง loader

    const res = await fetch(apiUrl);
    const data = await res.json();
    allData = data;

    const batches = [...new Set(data.map(item => item.batch))];
    select.innerHTML = "";
    batches.forEach(batch => {
      const option = document.createElement("option");
      option.value = batch;
      option.textContent = batch;
      select.appendChild(option);
    });

    showMembers(select.value);
  } catch (err) {
    memberList.innerHTML = "<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    console.error(err);
  } finally {
    document.getElementById("loader").style.display = "none"; // ซ่อน loader เมื่อโหลดเสร็จ
  }
}
