document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("root");

    root.innerHTML = `
    <header>
        <div class="menu-toggle"><i class="fas fa-bars"></i></div>
        <img height="50px" src="https://rep-arlington.pages.dev/assets/img/eca.png" data-open="640">
        <h1>สำนักงานคณะกรรมการการเลือกตั้ง</h1>
        <div class="language-switch">TH | EN</div>
    </header>
    <nav>
        <ul>
            <li><a href="#">หน้าหลัก</a></li>
            <li>
                <a href="#" class="toggle-submenu">เกี่ยวกับ ▾</a>
                <div class="submenu">
                    <a href="#">คณะกรรมการการเลือกตั้ง</a>
                    <a href="#">สำนักงาน กกต.</a>
                    <a href="#">ทำเนียบผู้บริหาร</a>
                </div>
            </li>
            <li>
                <a href="#" class="toggle-submenu">ข่าวสาร ▾</a>
                <div class="submenu">
                    <a href="#">ข่าวประชาสัมพันธ์</a>
                </div>
            </li>
            <li>
                <a href="#" class="toggle-submenu">บริการข้อมูล ▾</a>
                <div class="submenu">
                    <a href="#" class="toggle-submenu">สถิติการเลือกตั้ง ▾</a>
                    <div class="submenu">
                        <a href="#">การเลือกตั้งสมาชิกสภาผู้แทนราษฎร</a>
                        <a href="#">การออกเสียงประชามติ</a>
                        <a href="#">การเลือกตั้งท้องถิ่น</a>
                        <a href="#">สถิติการวินิจฉัยชี้ขาดเรื่องคัดค้านการเลือกตั้ง</a>
                    </div>
                    <a href="/election/result">รายงานผลการนับคะแนน</a>
                    <a href="mp-election-results">ประกาศผลการเลือกตั้ง สส.</a>
                    <a href="checkidparty">ตรวจสอบการเป็นสมาชิกพรรคการเมือง</a>
                    <a href="#">ข้อมูลพรรคการเมือง</a>
                </div>
            </li>
            <li><a href="#">ติดต่อ</a></li>
        </ul>
    </nav>
    
    <div class="banner">
        <!--<img src="https://rep-arlington.pages.dev/assets/img/eca-banner.png" width="100%" alt="Election Commission Banner">-->
        <img src="https://rep-arlington.pages.dev/assets/img/eca-banner (1).png" width="100%" alt="Election Commission Banner">
    </div>

    <div class="container">
        <div class="box">
            <h2>นายณภัทร สุวรรณสวัสดิ์</h2>
            <p>คณะกรรมการการเลือกตั้ง</p>
        </div>
    </div>

    <div class="feedback">
        <p>ทุกความคิดเห็นของท่านมีความสำคัญ โปรดแสดงความคิดเห็นของท่าน <a href="#">ที่นี่</a></p>
    </div>

    <footer>
        <p>สำนักงานคณะกรรมการการเลือกตั้ง</p>
        <p><i class="fas fa-envelope"></i> infi.dopa.moi.my@gmail.com</p>
        <div class="footer-bottom">
            <a href="#">ข้อกำหนด เงื่อนไข และนโยบายส่วนตัว</a>
            <span>สงวนลิขสิทธิ์ 2025 - สำนักงานคณะกรรมการการเลือกตั้ง</span>
            <span>จำนวนผู้เข้าชมเว็บไซต์: <span id="totalVisits">0</span> | ขณะนี้มีผู้ชมออนไลน์: <span id="onlineUsers">0</span></span>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_jX8KHjTOD9fTawF-2pJSQG7AABeVAM5GZA&s" height="30">
            <img src="/assets/img/ISO9001.jpg" height="30">
        </div>
    </footer>
    `;
});


document.addEventListener("DOMContentLoaded", function () {
    const scriptContent = `
        document.querySelector('.menu-toggle').addEventListener('click', function() {
            let nav = document.querySelector('nav');
            let icon = this.querySelector('i');
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });

        document.querySelectorAll('.toggle-submenu').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                let submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    `;

    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.body.appendChild(script);
});

document.addEventListener("DOMContentLoaded", function () {
    const scriptContent = `
            if (localStorage.getItem("totalVisits")) {
                let visits = parseInt(localStorage.getItem("totalVisits")) + 1;
                localStorage.setItem("totalVisits", visits);
            } else {
                localStorage.setItem("totalVisits", 1);
            }
            document.getElementById("totalVisits").textContent = localStorage.getItem("totalVisits");
    
            function updateOnlineUsers() {
                sessionStorage.setItem("isOnline", "true");
    
                let onlineUsers = sessionStorage.getItem("onlineUsers") ? parseInt(sessionStorage.getItem("onlineUsers")) : 0;
                sessionStorage.setItem("onlineUsers", onlineUsers + 1);
                document.getElementById("onlineUsers").textContent = sessionStorage.getItem("onlineUsers");
            }
    
            function removeOnlineUser() {
                let onlineUsers = parseInt(sessionStorage.getItem("onlineUsers")) || 1;
                sessionStorage.setItem("onlineUsers", onlineUsers > 1 ? onlineUsers - 1 : 0);
            }
    
            updateOnlineUsers();
    
            window.addEventListener("beforeunload", removeOnlineUser);
            
            document.querySelector('img[alt="Election Commission Banner"]').addEventListener("click", function() {
                window.location.href = "/election/";
            });
    `;

    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.body.appendChild(script);
});
