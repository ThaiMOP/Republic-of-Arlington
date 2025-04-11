
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
