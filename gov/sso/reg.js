
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
    if (this.checked) {
      button1.disabled = false;
      button1.style.backgroundColor = "#029d00";
    } else {
      button1.disabled = true;
      button1.style.backgroundColor = "#1cc61c";
    }
  });

  button1.addEventListener("click", function () {
    if (!button1.disabled) {
      page1.classList.add("hidden");
      page2.classList.remove("hidden");
    }
  });

  buttonA.addEventListener("click", function () {
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
  
    if (!allFilled) {
      warn.textContent = "กรุณากรอกข้อมูลให้ครบ";
    } else {
      warn.textContent = "";
      page2.classList.add("hidden");
      page3.classList.remove("hidden");
    }
  });

  buttonB.addEventListener("click", function () {
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
  
  const code = generateRandomCode();
  randomText.textContent = code;
  
  input.addEventListener("input", function () {
    if (input.value === code) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  });

      const scriptURL = 'https://script.google.com/macros/s/AKfycbw-0FEBQCjcKOgn3NMHpdZOl0OdbsW9TsyPO_-x8uW-rEOoIHFUj0J43eNmkmBrK763EQ/exec';
      const form = document.forms['hello-sheet'];
    
      form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
          .then(response => {
            alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
            form.reset();
            // รีเซ็ตกลับหน้าแรกหากต้องการ
            document.getElementById("page-3").classList.add("hidden");
            document.getElementById("page-2").classList.remove("hidden");
          })
          .catch(error => {
            console.error('❌ Error!', error.message);
            alert("❌ ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่");
          });
      });
