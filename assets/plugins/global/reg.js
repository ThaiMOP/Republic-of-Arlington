document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("root");

    root.innerHTML = `
        <div class="d-flex flex-column flex-root h-100">
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="card rounded-3 w-md-550px shadow">
                    <div class="card-body d-flex flex-column p-10 p-lg-20 pb-lg-10">
                        <img src="/assets/img/eca-login.png">
                        <h2 style="text-align: center;">ระบบฐานข้อมูลพรรคการเมือง</h2>
                        <ul class="t-step">
                          <li class="active"><span>ลงทะเบียน</span></li>
                          <li class=""><span>เลือกวิธีเข้าระบบ</span></li>
                          <li class=""><span>ตรวจสอบข้อมูล</span></li>
                        </ul>
                        <form id="form" method="POST">
                          <label for="party">พรรคการเมือง</label>
                          <input type="radio" class="party" name="party" id="party" value="ภูมิใจไทย">
                          <input type="radio" class="party" name="party" id="party" value="ประชาธิปไตย">
                          <input type="radio" class="party" name="party" id="party" value="เพื่อธรรม">
                          
                          <label for="password1">รหัสผ่าน</label>
                          <input type="password" id="password1" name="password1" placeholder="กรอกรหัสผ่าน" required>
                          
                          <label for="password2">ยืนยันรหัสผ่าน</label>
                          <input type="password" id="password2" name="password2" placeholder="ยืนยันรหัสผ่าน" required>
                          
                          <button type="submit" id="submit-button loginButton"class="btn btn-primary button is-primary" fdprocessedid="w8vfi">ถัดไป</button>
                          <button class="button is-danger" style="display:none;">Cancel</button>
                        </form>
                        <div id="message" style=" display: none;width:0; height:0; opacity:0; "></div>
                    </div>
                </div>
            </div>
        </div>
    `;
});
