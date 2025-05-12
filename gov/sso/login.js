document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const userData = {
    username: username,
    password: password
  };

  fetch('users.json')
    .then(response => response.json())
    .then(data => {
      const user = data.users.find(user => 
        (user.username === username || user.citizenId === username) && 
        user.password === password
      );

      if (user) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').textContent = 'เข้าสู่ระบบสำเร็จ!';
        // เปลี่ยนหน้า หรือ redirect ได้ที่นี่
      } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
      }
    })
    .catch(error => {
      console.error('เกิดข้อผิดพลาด:', error);
      document.getElementById('message').textContent = 'ไม่สามารถโหลดข้อมูลได้';
    });
});
