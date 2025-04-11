
  const checkbox = document.getElementById("myCheck");
  const button = document.getElementById("nextBtn");
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      button.disabled = false;
      button.style.backgroundColor = "#029d00";
    } else {
      button.disabled = true;
      button.style.backgroundColor = "#1cc61c";
    }
  });

  button.addEventListener("click", function () {
    if (!button.disabled) {
      page1.classList.add("hidden");
      page2.classList.remove("hidden");
    }
  });
