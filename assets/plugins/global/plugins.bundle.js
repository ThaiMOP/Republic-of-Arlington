document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("root");

    root.innerHTML = `
        <div class="d-flex flex-column flex-root h-100">
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="card rounded-3 w-md-550px shadow">
                    <div class="card-body d-flex flex-column p-10 p-lg-20 pb-lg-10">
                        <img src="/assets/img/eca-login.png">
                        <h2 style="text-align: center;">ระบบฐานข้อมูลพรรคการเมือง</h2>
                        <label for="email2">อีเมล / ผู้ใช้งาน</label>
                        <input type="text" id="email2" placeholder="กรอกอีเมลหรือชื่อผู้ใช้" style="width: -webkit-fill-available; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 5px;">
                        
                        <label for="password2">รหัสผ่าน</label>
                        <input type="password" id="password2" placeholder="กรอกรหัสผ่าน" style="width: -webkit-fill-available; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 5px;">
            
                        <div style="text-align: right; margin-top: 10px;">
                            <a href="#" style="text-decoration: none; color: blue;">ลืมรหัสผ่าน ?</a>
                        </div>
                        
                        <button id="loginButton">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
});
