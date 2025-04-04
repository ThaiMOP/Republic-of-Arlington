document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("navbar");

    navbar.innerHTML = `
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
    `;
});

document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("header");

    header.innerHTML = `
        <div class="menu-toggle"><i class="fas fa-bars"></i></div>
        <img height="50px" src="https://rep-arlington.pages.dev/assets/img/eca.png" data-open="640">
        <h1>สำนักงานคณะกรรมการการเลือกตั้ง</h1>
        <div class="language-switch">TH | EN</div>
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

