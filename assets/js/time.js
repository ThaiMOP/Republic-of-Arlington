function updateTime() {
    const timeElement = document.getElementById("time");
    const now = new Date();
    const formattedTime = now.toLocaleTimeString(); // เวลา HH:MM:SS ตามระบบ
    timeElement.textContent = formattedTime;
}

// อัปเดตทุกวินาที
setInterval(updateTime, 1000);

// เรียกใช้ครั้งแรกทันที
updateTime();
