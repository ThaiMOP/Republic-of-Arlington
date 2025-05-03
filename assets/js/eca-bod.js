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
            <li><a href="/eca/th/">หน้าหลัก</a></li>
            <li>
                <a href="#" class="toggle-submenu">เกี่ยวกับ ▾</a>
                <div class="submenu">
                    <a href="">คณะกรรมการการเลือกตั้ง</a>
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
                    <a href="/eca/th/mp-election-results">ประกาศผลการเลือกตั้ง สส.</a>
                    <a href="/eca/th/checkidparty">ตรวจสอบการเป็นสมาชิกพรรคการเมือง</a>
                    <a href="/eca/th/dataparty">ข้อมูลพรรคการเมือง</a>
                </div>
            </li>
            <li><a href="#">ติดต่อ</a></li>
        </ul>
    </nav>

    <main class="container-a">
        <h1 style=" border-left: 4px solid #e9b913;padding-left: 1rem; " class="text_header">คณะกรรมการการเลือกตั้ง</h1>
        
        <div class="boxes">
          <div class="box" data-start-date="31 มีนาคม 2568">
            <img src="/assets/img/employee/Info_PS.png" alt="นายณภัทร สุวรรณสวัสดิ์">
            <div class="info">
              <h2>นายณภัทร สุวรรณสวัสดิ์</h2>
              <p>ประธานกรรมการการเลือกตั้ง</p>
              <p>ดำรงตำแหน่งตั้งแต่วันที่ 31 มีนาคม 2568</p>
              <p>(<span class="duration">กำลังคำนวณ...</span>)</p>
            </div>
          </div>
            
        </div>
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
