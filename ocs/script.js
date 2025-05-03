const apiUrl = 'https://script.google.com/macros/s/AKfycbz5rAImc01ROl3HYfmMu4Vgx9uNH8jMZxCCPynhz4k8Niw0oT2UZBSXwsDKurg33Sa9PQ/exec';
const loader = document.getElementById("loader");
const toastContainer = document.getElementById("toast-container");
let dataList = [];
let currentIndex = 0;
const itemsPerPage = 10;

// เรียกใช้เมื่อโหลดหน้าเสร็จ
document.addEventListener("DOMContentLoaded", () => {
    loader.style.display = "flex";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            dataList = data;

            // แสดง 2 รายการแรก
            const postList = document.getElementById("postList");
            const topTwo = data.slice(0, 2);

            topTwo.forEach(item => {
                const html = `
                  <div class="post-thumbnail-entry">
                    <div class="type">
                      <span class="type01">ประเภท</span>
                      <span class="type02">${item.type}</span>
                    </div>
                    <div class="post-thumbnail-content">
                      <a target="_blank" href="${item.link}" class="m-b-10 icon-padding" style="font-size: 14px;">${item.name}</a>
                      <a href="javascript:;" class="post-copy" title="คัดลอกชื่อเรื่องและลิงค์" data-document-title="${item.name}" data-document-link="${item.link}" style="font-size: 14px;">
                        <i class="fas fa-copy"></i>
                      </a>
                      <div class="m-t-10">
                        <span class="post-date"><i class="far fa-clock"></i> ${item.date}</span>
                        <span class="post-category"><i class="fas fa-file-alt"></i> ฉบับที่ ${item.issue} ${item.type}</span>
                      </div>
                    </div>
                  </div>
                `;
                postList.insertAdjacentHTML("beforeend", html);
            });

            // ลิงก์ไปหน้าทั้งหมด
            const moreHtml = `
                <div class="post-thumbnail-entry">
                  <a href="#list-tab" style="font-size: 14px;">
                    <i class="fa fa-book m-r-10 b-b-0"></i>ราชกิจจานุเบกษาล่าสุด ๑๐๐ รายการ
                  </a>
                </div>
              `;
            postList.insertAdjacentHTML("beforeend", moreHtml);

            // แสดง 10 รายการแรกในส่วน post-list
            renderItems();
        })
        .finally(() => {
            loader.style.display = "none";
        });

    document.getElementById("loadMoreBtn").addEventListener("click", () => {
        renderItems();
    });
});

// แสดงข้อมูลแบบแบ่งหน้าใน post-list
function renderItems() {
    const container = document.getElementById("post-list");
    const nextItems = dataList.slice(currentIndex, currentIndex + itemsPerPage);

    nextItems.forEach(item => {
        const html = `
              <div class="post-thumbnail-entry blogBox moreBox">
                <div class="post-thumbnail-content">
                  <a target="_blank" href="${item.link}" class="m-b-10" style="font-size: 14px;"> ${item.name}</a>
                  <a href="javascript:;" class="post-copy" title="คัดลอกชื่อเรื่องและลิงค์" data-document-title="${item.name}" data-document-link="${item.link}" style="font-size: 14px;">
                    <i class="fas fa-copy"></i>
                  </a>
                  <div class="m-t-10">
                    <span class="post-date"><i class="far fa-clock"></i> ${item.date}</span>
                    <span class="post-category"><i class="fas fa-file-alt m-r-5"></i>ฉบับ ${item.issue} ${item.type}</span>
                    <span class="post-category"><a target="_blank" href="${item.link}" style="font-size: 14px;"><i class="fas fa-file-pdf"></i> ดูรายละเอียด</a></span>
                  </div>
                </div>
              </div>`;
        container.insertAdjacentHTML("beforeend", html);
    });

    currentIndex += itemsPerPage;

    if (currentIndex >= dataList.length) {
        document.getElementById("loadMoreBtn").style.display = "none";
    }
}

// คัดลอกข้อความ
document.addEventListener("click", function (event) {
    if (event.target.closest(".post-copy")) {
        const copyBtn = event.target.closest(".post-copy");
        const title = copyBtn.getAttribute("data-document-title");
        const link = copyBtn.getAttribute("data-document-link");

        navigator.clipboard.writeText(`${title} ${link}`)
            .then(() => {
                showToast("คัดลอกชื่อเรื่องและลิงก์เรียบร้อยแล้ว");
            })
            .catch(err => {
                console.error("เกิดข้อผิดพลาดในการคัดลอก: ", err);
            });
    }
});

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
