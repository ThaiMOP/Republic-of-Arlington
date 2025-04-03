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

document.getElementById("พรรคเพื่อธรรม").addEventListener("click", function() {
    let target = document.getElementById("พรรคภูมิใจไทย");
    target.value = target.value === "X" ? "" : "X";
});

document.getElementById("พรรคภูมิใจไทย").addEventListener("click", function() {
    let target = document.getElementById("ไม่เลือกพรรคใด");
    target.value = target.value === "X" ? "" : "X";
});

document.getElementById("ไม่เลือกพรรคใด").addEventListener("click", function() {
    this.value = this.value === "X" ? "" : "X";
});

document.getElementById("พรรคประชาธิปไตย").addEventListener("click", function() {
    this.value = this.value === "X" ? "" : "X";
});

// document.querySelectorAll('input.value[type="text"]').forEach(input => {
//   input.addEventListener('click', function() {
//     this.value = this.value === "X" ? "" : "X";
//   });
// });
// --------------------------------------------
        document.getElementById("form").addEventListener("submit", function (e) {
          e.preventDefault(); // Prevent the default form submission
          document.getElementById("message").textContent = "กำลังบันทึก...";
          document.getElementById("message").style.display = "block";
          document.getElementById("submit-button").disabled = true;
  
          // Collect the form data
          var formData = new FormData(this);
          var keyValuePairs = [];
          for (var pair of formData.entries()) {
            keyValuePairs.push(pair[0] + "=" + pair[1]);
          }
  
          var formDataString = keyValuePairs.join("&");
  
          // Send a POST request to your Google Apps Script
          fetch(
            "https://script.google.com/macros/s/AKfycbzyYwv0eKvmhjwa5SSTGf9FTFFsCHEjPm9qqV64HSVYAkBGx3oyciWjnp-WdLK21Wu8/exec",
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
              // Check if the request was successful
              if (response) {
                return response; // Assuming your script returns JSON response
              } else {
                throw new Error("Failed to submit the form.");
              }
            })
            .then(function (data) {
                // แสดงข้อความสำเร็จ
                document.getElementById("message").textContent = "Data submitted successfully!";
                document.getElementById("message").style.display = "block";
                document.getElementById("message").style.backgroundColor = "green";
                document.getElementById("message").style.color = "beige";
                document.getElementById("submit-button").disabled = false;
                document.getElementById("form").reset();
            
                // รอ 2.6 วินาทีแล้วเปลี่ยนหน้า
                setTimeout(function () {
                    window.location.href = "/election/next";
                }, 500);
            })

            .catch(function (error) {
              // Handle errors, you can display an error message here
              console.error(error);
              document.getElementById("message").textContent =
                "An error occurred while submitting the form.";
              document.getElementById("message").style.display = "block";
            });
        });
