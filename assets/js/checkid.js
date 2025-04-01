        function checkID() {
            let idCard = document.getElementById("idCard").value;
            let resultTable = document.querySelector("#result tbody");
            let reportNow = document.querySelector(".report-now");
            let apiUrl = "https://script.google.com/macros/s/AKfycbyXIpdKy5QRwuVG9rAffwPMJ4iLukxPyQu2DUzUzU7bS0wXNJAIpobRL4sIzFzvCngw/exec";
            let resultDiv = document.getElementById("result"); // ตัวแปรสำหรับ div ที่จะแสดงผล

            // กำหนดวันที่และเวลาปัจจุบัน
            let now = new Date();
            let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            let thaiDate = now.toLocaleDateString('th-TH', options).replace(" ", " ").replace(",", ""); // ให้แสดงเป็นรูปแบบไทย
            reportNow.textContent = `วันที่ตรวจสอบ ${thaiDate} น.`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    resultTable.innerHTML = ""; // ล้างข้อมูลเก่าก่อนแสดงผลใหม่
                    let found = data.find(member => member.id === idCard);
                    if (found) {
                        resultTable.innerHTML = `
                            <tr>
                                <td>1</td>
                                <td class="text-left">${found.name}</td>
                                <td>${found.id}</td>
                                <td>${found.party}</td>
                                <td>${found.pid}</td>
                                <td>${found.dateIn}</td>
                                <td>${found.dateOut || '-'}</td>
                                <td>${found.cause || '-'}</td>
                            </tr>
                        `;
                    } else {
                        resultTable.innerHTML = `
                            <tr>
                                <td>1</td>
                                <td class="text-left"></td>
                                <td>${idCard}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>ไม่พบข้อมูล</td>
                            </tr>
                        `;
                    }

                    // แสดงผลการตรวจสอบโดยการเพิ่ม class "active"
                    resultDiv.classList.add("active");
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
