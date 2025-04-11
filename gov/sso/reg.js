
  const checkbox = document.getElementById("myCheck");
  const button1 = document.getElementById("nextBtn1");
  const button2 = document.getElementById("nextBtn2");
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");

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
