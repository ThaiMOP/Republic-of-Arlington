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
                    <a href="board-of-director.html">คณะกรรมการการเลือกตั้ง</a>
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
    </nav

    <!-- Loader ทั้งหน้า -->
    <div id="page-loader">
        <div class="spinner"></div>
    </div>
    <main>
        <div class="banner-wrapper">
            <img src="/assets/img/gcenter/ยินดีต้อนรับเข้าสู่เว็บไซต์ศูนย์ราชการนฤเบศร์ธรรมนคร.png" alt="Election Commission Banner" class="banner-image" width="100%">
        </div>
        
        <section class="section-block">
            <h2>คำวินิจฉัย กกต.</h2>
            <p>การตัดสินใจตามกฎหมายเลือกตั้งของคณะกรรมการการเลือกตั้ง ที่มีผลบังคับใช้ในกระบวนการเลือกตั้ง</p>
        </section>

        <section class="section-block">
            <h2>ข่าวล่าสุด</h2>
            <div class="news-container" id="news-section"></div>
        </section>

        <section class="section-block">
            <h2>ข้อมูลผลเลือกตั้ง และเขตเลือกตั้ง</h2>
            <div class="news-container" id="results-section"></div>
        </section>
    </main>

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

    // ฟังก์ชันโหลดข้อมูล
    async function loadData() {
        try {
            const newsRes = await fetch('https://script.google.com/macros/s/AKfycbwj8_52HwKqV-IiA0AXw8mQ2Xot-ygvy0lV8yzej5aoMv1HHYEoxyD8S9T4oHqeIk6C/exec');
            const news = await newsRes.json();
            renderBoxes(news, 'news-section');
            
            const resultRes = await fetch('https://script.google.com/macros/s/AKfycbxOEqvcWgz8zoWmyHxZCMwnLLH-H-pXK4URDt5RroFa8ap0SzrjmRJEzchvLYOlyvSF/exec');
            const results = await resultRes.json();
            renderBoxes(results, 'results-section');
        } catch (err) {
            console.error('โหลดข้อมูลไม่สำเร็จ:', err);
        } finally {
            document.getElementById("page-loader").style.display = "none";
        }
    }

    function renderBoxes(data, targetId) {
        const container = document.getElementById(targetId);
        container.innerHTML = '';
        data.forEach(item => {
            const box = document.createElement('div');
            box.className = 'news-box';
            box.innerHTML = `
                <a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">
                    <img src="${item.img}" alt="${item.title}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
                    <div class="news-title">${item.title}</div>
                    <div class="news-date">${item.date}</div>
                </a>
            `;
            container.appendChild(box);
        });
    }

    loadData();  // เรียกใช้ฟังก์ชัน
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
