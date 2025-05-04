function updateElectionStatus() {
  const electionTag = document.querySelector("[data-election]");
  if (!electionTag) return;

  const now = new Date();
  const startTime = new Date(2025, 4, 5, 6, 0, 0);  // 5 พ.ค. 2025 06:00
  const endTime = new Date(2025, 4, 5, 15, 59, 45); // 5 พ.ค. 2025 15:59:45

  let nextState = "";

  if (now < startTime) {
    nextState = "before";
  } else if (now >= startTime && now <= endTime) {
    nextState = "during";
  } else {
    nextState = "after";
  }

  const currentState = electionTag.getAttribute("data-state");
  if (currentState === nextState) return; // ไม่ต้องอัปเดตถ้าเหมือนเดิม

  electionTag.setAttribute("data-state", nextState); // บันทึกสถานะใหม่

  if (nextState === "before") {
    electionTag.innerHTML = `<h1>ยังไม่ถึงเวลาใช้สิทธิออกเสียงลงคะแนน</h1>`;
  } else if (nextState === "during") {
    electionTag.innerHTML = `<div class="eca-btn">เข้าระบบใช้สิทธิเลือกตั้ง</div>`;
    electionTag.querySelector(".eca-btn").addEventListener("click", function () {
      window.location.href = "/election/hr-election.html";
    });
  } else {
    electionTag.innerHTML = `<h1>บัดนี้ถึงเวลาปิดการออกเสียงลงคะแนนแล้ว ให้ปิดการออกเสียงลงคะแนน</h1>`;
  }
}
  document.addEventListener("DOMContentLoaded", function () {
    updateElectionStatus();
    setInterval(updateElectionStatus, 1000);

    // ปิดคลิกขวาบนภาพ
    document.querySelectorAll("img").forEach(img => {
      img.addEventListener("contextmenu", function (event) {
        event.preventDefault();
      });
    });

    const token = localStorage.getItem('discord_token');
    if (token) {
      let discordUserId = null;

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

          return fetch('https://script.google.com/macros/s/AKfycbzPzIuqdd2fBRd9z0ZQ8v9UIbxs5t9KP4F8LFHj_RdHbDnvfUVrljP6Ams_yMNXW5lC/exec');
        })
        .then(res => res.json())
        .then(data => {
          const matchedUser = data.find(entry => entry.id === discordUserId);

          if (matchedUser) {
            localStorage.setItem('election_user_data', JSON.stringify(matchedUser));

            const rightText = matchedUser.right === 'มี'
              ? 'คุณมีสิทธิ์เลือกตั้ง'
              : 'คุณไม่มีสิทธิ์เลือกตั้งหรือยังไม่ลงทะเบียน';

            const infoBox = document.querySelector('[data-election]');
            infoBox.innerHTML += `
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

    // จัดการโปรไฟล์ป๊อปอัป
    const profileContainer = document.getElementById('profileContainer');
    const profileBox = document.getElementById('profileBox');

    profileContainer?.addEventListener('click', () => {
      profileBox.classList.toggle('show');
    });

    window.addEventListener('click', (e) => {
      if (!profileContainer?.contains(e.target)) {
        profileBox.classList.remove('show');
      }
    });
  });

  function logout() {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('election_user_data');
    window.location.href = '/election/login/logout.html';
  }
