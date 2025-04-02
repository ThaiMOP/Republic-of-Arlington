document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("root");

    root.innerHTML = `
        <div style="max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center;">ระบบฐานข้อมูลพรรคการเมือง</h2>
            <label for="email2">อีเมล / ผู้ใช้งาน</label>
            <input type="text" id="email2" placeholder="กรอกอีเมลหรือชื่อผู้ใช้" style="width: -webkit-fill-available; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 5px;">
            
            <label for="password2">รหัสผ่าน</label>
            <input type="password" id="password2" placeholder="กรอกรหัสผ่าน" style="width: -webkit-fill-available; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 5px;">

            <div style="text-align: right; margin-top: 10px;">
                <a href="#" style="text-decoration: none; color: blue;">ลืมรหัสผ่าน ?</a>
            </div>
            
            <button id="loginButton" style="width: -webkit-fill-available; padding: 10px; margin-top: 10px; background-color: blue; color: white; border: none; border-radius: 5px; cursor: pointer;">
                เข้าสู่ระบบ
            </button>
        </div>
    `;
});
