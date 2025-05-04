function updateElectionStatus() { 
    const electionTag = document.querySelector("[data-election]"); 
    if (!electionTag) return; 

    const now = new Date();
    const startTime = new Date(2025, 4, 5, 6, 0, 0);  // 4 เม.ย. 2025 เวลา 06:00 (UTC+7)
    const endTime = new Date(2025, 4, 5, 15, 59, 45); // 4 เม.ย. 2025 เวลา 15:59 (UTC+7)

    if (now < startTime) { 
        electionTag.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`; 
    } else if (now >= startTime && now <= endTime) { 
        electionTag.innerHTML = `<div class="eca-btn" onclick="window.location.href='/election/hr-election.html'">เข้าระบบใช้สิทธิเลือกตั้ง</div>`; 
    } else { 
        electionTag.innerHTML = `<h1>บัดนี้ถึงเวลาปิดการออกเสียงลงคะแนนแล้ว ให้ปิดการออกเสียงลงคะแนน</h1>`; 
    } 
} 

updateElectionStatus();  
setInterval(updateElectionStatus, 1000);

    document.querySelector(".eca-btn").addEventListener("click", function() {
        window.location.href = "/election/hr-election.html";
    });
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("img").forEach(img => {
            img.addEventListener("contextmenu", function(event) {
                event.preventDefault();
            });
        });
    });


  const token = localStorage.getItem('discord_token');

  function logout() {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('election_user_data');
    window.location.href = '/election/login/logout.html';
  }

  if (token) {
    let discordUserId = null;

    // เรียก API Discord เพื่อเอาข้อมูลผู้ใช้
    fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
      discordUserId = user.id;

      document.getElementById('avatar').src =
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
      document.getElementById('username').textContent =
        `${user.username}#${user.discriminator}`;

      // เรียก API Google Script เพื่อตรวจสอบสิทธิ์
      return fetch('https://script.google.com/macros/s/AKfycbzPzIuqdd2fBRd9z0ZQ8v9UIbxs5t9KP4F8LFHj_RdHbDnvfUVrljP6Ams_yMNXW5lC/exec');
    })
    .then(res => res.json())
    .then(data => {
      const matchedUser = data.find(entry => entry.id === discordUserId);

      if (matchedUser) {
        // เก็บข้อมูลใน localStorage
        localStorage.setItem('election_user_data', JSON.stringify(matchedUser));

        // แสดงสิทธิ์
        const rightText = matchedUser.right === 'มี'
          ? 'คุณมีสิทธิ์เลือกตั้ง'
          : 'คุณไม่มีสิทธิ์เลือกตั้งหรือยังไม่ลงทะเบียน';

        const infoBox = document.querySelector('[data-election]');
        infoBox.innerHTML = `
          <p><strong>ชื่อ:</strong> ${matchedUser.fname} ${matchedUser.lname}</p>
          <p><strong>จังหวัด:</strong> ${matchedUser.province}</p>
          <p><strong>เขต:</strong> ${matchedUser.zone}</p>
          <p><strong>สิทธิ์:</strong> ${rightText}</p>
        `;
      } else {
        document.querySelector('[data-election]').innerHTML =
          '<p style="color:red;">ไม่พบข้อมูลของคุณในระบบเลือกตั้ง</p>';
      }
    })
    .catch(err => {
      console.error(err);
      document.body.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูลสิทธิ์เลือกตั้ง</p>';
    });
  } else {
    document.body.innerHTML = '<p>กรุณาเข้าสู่ระบบผ่าน Discord ก่อน</p>';
  }

  const profileContainer = document.getElementById('profileContainer');
  const profileBox = document.getElementById('profileBox');

  profileContainer.addEventListener('click', () => {
    profileBox.classList.toggle('show');
  });

  window.addEventListener('click', (e) => {
    if (!profileContainer.contains(e.target)) {
      profileBox.classList.remove('show');
    }
  });
