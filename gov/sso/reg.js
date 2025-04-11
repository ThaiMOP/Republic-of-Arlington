  const checkbox = document.getElementById("myCheck");
  const button1 = document.getElementById("nextBtn1");
  const buttonA = document.getElementById("goPage1");
  const button2 = document.getElementById("nextBtn2");
  const buttonB = document.getElementById("goPage2");
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");
  const page3 = document.getElementById("page-3");
  const warn = document.getElementById("warn");
  const randomText = document.getElementById("randomText");
  const input = document.getElementById("data-num");
  const saveButton = document.getElementById("save");

  checkbox.addEventListener("change", function () {
    button1.disabled = !this.checked;
    button1.style.backgroundColor = this.checked ? "#029d00" : "#1cc61c";
  });

  button1.addEventListener("click", () => {
    if (!button1.disabled) {
      page1.classList.add("hidden");
      page2.classList.remove("hidden");
    }
  });

  buttonA.addEventListener("click", () => {
    page2.classList.add("hidden");
    page1.classList.remove("hidden");
  });

  button2.addEventListener("click", function () {
    const inputs = page2.querySelectorAll("input");
    let allFilled = true;

    inputs.forEach(input => {
      if (input.value.trim() === "") {
        allFilled = false;
      }
    });

    const pw1 = document.getElementById("password1").value;
    const pw2 = document.getElementById("password2").value;
    const pwValid = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(pw1);

    if (!allFilled) {
      warn.textContent = "กรุณากรอกข้อมูลให้ครบ";
    } else if (pw1 !== pw2) {
      warn.textContent = "รหัสผ่านไม่ตรงกัน";
    } else if (!pwValid) {
      warn.textContent = "รหัสผ่านไม่ถูกต้อง (ต้องมี a-z, A-Z, 0-9 อย่างน้อย 6 ตัว)";
    } else {
      warn.textContent = "";
      page2.classList.add("hidden");
      page3.classList.remove("hidden");
    }
  });



  buttonB.addEventListener("click", () => {
    page3.classList.add("hidden");
    page2.classList.remove("hidden");
  });

  function generateRandomCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678998765432100123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  let code = generateRandomCode();
  randomText.textContent = code;

  input.addEventListener("input", function () {
    if (input.value === code) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  });

  const scriptURL = 'https://script.google.com/macros/s/AKfycbyUgL9FXNW_KeqqVdJ1VVNAck5W7J0aq3Oopw-xquftvqtHsFeWi88lGLB9YVogWpyf5w/exec';
  const form = document.forms['hello-sheet'];

  form.addEventListener('submit', e => {
  e.preventDefault();  // ยกเลิกการ submit โดยอัตโนมัติ
  if (page3.classList.contains('hidden')) return;  // ถ้าไม่ใช่หน้าสุดท้าย อย่าให้ส่งข้อมูล
  
  saveButton.disabled = true;
  saveButton.textContent = "กำลังส่ง...";

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
      form.reset();
      code = generateRandomCode();
      randomText.textContent = code;
      saveButton.textContent = "บันทึก >";
      saveButton.disabled = true;
      page3.classList.add("hidden");
      page2.classList.remove("hidden");
    })
    .catch(error => {
      console.error('❌ Error!', error.message);
      alert("❌ ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่");
      saveButton.textContent = "บันทึก >";
      saveButton.disabled = false;
    });
});
