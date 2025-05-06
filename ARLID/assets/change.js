const apiUrl = "https://script.google.com/macros/s/AKfycbwjrpH1eFzb6pO5Pl0yLBQfTTjVJgTf8xztO6n2B0OA-cxha3fdYweSJLx97DmdZgEg/exec";

const discordToken = localStorage.getItem('discord_token');
const userDataEncoded = localStorage.getItem('election_user_data');
let userData = null;

if (!discordToken || !userDataEncoded) {
    document.body.innerHTML = "<p>กรุณาเข้าสู่ระบบก่อน</p>";
    throw new Error("No user data");
}

userData = JSON.parse(userDataEncoded);
const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;

document.querySelectorAll(".avatar").forEach(img => {
    img.src = avatarUrl;
});

function renderUserData() {
    document.getElementById("personalInfo").innerHTML = `
    <p>ชื่อ - สกุล (ไทย): <span>${userData.prefix}${userData.fname} ${userData.lname}</span></p>
    <p>วัน/เดือน/ปีเกิด: ${userData.dateofbirth}</p>
    <p>เพศ: ${userData.gender}</p>
    <p>สัญชาติ: ${userData.nationality}</p>
    <p>ศาสนา: ${userData.religion}</p>
    <p><button onclick="showEditForm()">แก้ไขข้อมูล</button></p>
  `;

    document.getElementById("addressInfo").innerHTML = `
    <p>บ้านเลขที่: ${userData.house_number}</p>
    <p>ตำบล: ${userData.subdistrict}</p>
    <p>อำเภอ: ${userData.district}</p>
    <p>จังหวัด: ${userData.province}</p>
  `;
}

function showEditForm() {
    const formHtml = `
    <p>ชื่อ: <input type="text" id="fname" value="${userData.fname}"></p>
    <p>นามสกุล: <input type="text" id="lname" value="${userData.lname}"></p>
    <p>วันเกิด: <input type="date" id="dateofbirth" value="${userData.dateofbirth}"></p>
    <p>เพศ: <input type="text" id="gender" value="${userData.gender}"></p>
    <p>สัญชาติ: <input type="text" id="nationality" value="${userData.nationality}"></p>
    <p>ศาสนา: <input type="text" id="religion" value="${userData.religion}"></p>
    <p><button onclick="submitEdit()">บันทึกการแก้ไข</button></p>
  `;
    document.getElementById("personalInfo").innerHTML = formHtml;
}

async function submitEdit() {
    const updatedData = {
        id: userData.id,
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        dateofbirth: document.getElementById("dateofbirth").value,
        gender: document.getElementById("gender").value,
        nationality: document.getElementById("nationality").value,
        religion: document.getElementById("religion").value,
    };

    const formBody = Object.entries(updatedData)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join('&');

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formBody
        });

        const responseText = await response.text();

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (err) {
            console.error("Invalid JSON response:", responseText);
            alert("เกิดข้อผิดพลาดจากฝั่งเซิร์ฟเวอร์ ❌");
            return;
        }

        if (result.status === "success") {
            localStorage.setItem("election_user_data", JSON.stringify({ ...userData, ...updatedData }));
            alert("บันทึกสำเร็จ ✅");
            location.reload();
        } else {
            alert("เกิดข้อผิดพลาด: " + result.message);
        }
    } catch (err) {
        alert("การเชื่อมต่อผิดพลาด ❌");
        console.error(err);
    }
}

// เรียกใช้เมื่อโหลด
renderUserData();
