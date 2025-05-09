
const routes = {
    webportal: "webportal",
    change: "change",
    election: "/election/login/callback",
    stable: "stable",
    edit: "data",
    honour: "honour",
    ocs: "/ocs/"
};

document.getElementById("ilovemenu").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && routes[btn.id]) {
        window.location.href = routes[btn.id];
    }
});

document.getElementById("row").addEventListener("click", function () {
    const menu = document.getElementById("ilovemenu");
    const menu0 = document.querySelector('div[data-menu="0"]');
    const menu1 = document.querySelector('div[data-menu="1"]');

    if (!menu0) {
        // เพิ่ม menu0 และลบ menu1
        const clone = menu1.cloneNode(true);
        clone.setAttribute("data-menu", "0");
        menu.replaceChild(clone, menu1);
    }
});

document.getElementById("column").addEventListener("click", function () {
    const menu = document.getElementById("ilovemenu");
    const menu0 = document.querySelector('div[data-menu="0"]');
    const menu1 = document.querySelector('div[data-menu="1"]');

    if (!menu1) {
        // เพิ่ม menu1 และลบ menu0
        const clone = menu0.cloneNode(true);
        clone.setAttribute("data-menu", "1");
        menu.replaceChild(clone, menu0);
    }
});

const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get('access_token');

function logout() {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('election_user_data');
    window.location.href = '/ARLID/';
}

if (accessToken) {
    localStorage.setItem('discord_token', accessToken);
}

const token = accessToken || localStorage.getItem('discord_token');

if (token) {
    fetch('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้จาก Discord API');
            }
            return res.json();
        })
        .then(user => {
            const discordId = user.id;

            // แสดงรูป avatar ตามปกติ
            document.getElementById('avatar').src =
                `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

            // ดึงข้อมูลจาก Google Apps Script
            fetch('https://script.google.com/macros/s/AKfycbwjrpH1eFzb6pO5Pl0yLBQfTTjVJgTf8xztO6n2B0OA-cxha3fdYweSJLx97DmdZgEg/exec')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('ไม่สามารถดึงข้อมูลจาก Google Script');
                    }
                    return res.json();
                })
                .then(data => {

                    // หา user ที่ตรงกับ Discord ID
                    const matchedUser = data.find(entry => entry.id === discordId);

                    if (matchedUser) {
                      // เพิ่ม avatar และ discord info เข้า matchedUser
                      matchedUser.avatar = user.avatar;
                      matchedUser.username = user.username;
                      matchedUser.discriminator = user.discriminator;
                    
                      // เก็บเฉพาะข้อมูลของ user คนเดียว
                      localStorage.setItem('election_user_data', JSON.stringify(matchedUser));
                    
                      const fullName = `${matchedUser.prefix}${matchedUser.fname} ${matchedUser.lname}`;
                      document.getElementById('username').textContent = fullName;
                    } else {
                      // fallback
                      document.getElementById('username').textContent =
                        `${user.username}#${user.discriminator}`;
                    }


                })
                .catch(err => {
                    console.error('เกิดข้อผิดพลาดระหว่างดึงข้อมูล Google Script:', err);
                });
        })
        .catch(err => {
            console.error('เกิดข้อผิดพลาดระหว่างดึงโปรไฟล์ Discord:', err);
            document.body.innerHTML = '<p>เกิดข้อผิดพลาดในการตรวจสอบข้อมูลผู้ใช้</p>';
        });
} else {
    document.body.innerHTML = '<p>ไม่พบ access token</p>';
}

// จัดการ dropdown โปรไฟล์
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
