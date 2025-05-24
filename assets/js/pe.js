function updateClock() {
            const timeEl = document.querySelector("#time");
            const now = new Date();
            
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");

            timeEl.textContent = `${hours}:${minutes}:${seconds}`;
        }

        setInterval(updateClock, 1000);

        updateClock();

            document.querySelectorAll('input.value[type="text"]').forEach(input => {
              input.addEventListener('click', function() {
                this.value = this.value === "X" ? "" : "X";
              });
            });

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission
  document.getElementById("message").textContent = "กำลังบันทึก...";
  document.getElementById("message").style.display = "block";
  document.getElementById("submit-button").disabled = true;

  // Collect the form data
  var formData = new FormData(this);
  var keyValuePairs = [];

  for (var pair of formData.entries()) {
    keyValuePairs.push(pair[0] + "=" + encodeURIComponent(pair[1]));
  }

  // ดึง IP จาก API
  fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then((data) => {
      const ip = data.ip;
      keyValuePairs.push("ip=" + ip); // เพิ่ม IP เข้าไปในข้อมูล

      var formDataString = keyValuePairs.join("&");

      // ส่งไปยัง Google Apps Script
      return fetch(
        "https://script.google.com/macros/s/AKfycbwswWEeY8H7vmq6-Ccb1rr6uB9P5DyFiAm-eiBsDcWXB2zRlFIWllrCWQXz7_ZZbr7S/exec",
        {
          redirect: "follow",
          method: "POST",
          body: formDataString,
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }
      );
    })
    .then(function (response) {
      if (response) {
        return response;
      } else {
        throw new Error("Failed to submit the form.");
      }
    })
    .then(function () {
      document.getElementById("message").textContent = "Data submitted successfully!";
      document.getElementById("message").style.display = "block";
      document.getElementById("message").style.backgroundColor = "green";
      document.getElementById("message").style.color = "beige";
      document.getElementById("submit-button").disabled = false;
      document.getElementById("form").reset();

      setTimeout(function () {
        window.location.href = "/election/hrz-election.html";
      }, 500);
    })
    .catch(function (error) {
      console.error(error);
      document.getElementById("message").textContent = "An error occurred while submitting the form.";
      document.getElementById("message").style.display = "block";
    });
});
