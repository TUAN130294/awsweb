document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Terminal Typing Effect ---
    const terminalText = document.querySelector('.typed-text');
    const commands = [
        { text: "/init", wait: 1000 },
        { text: "Tôi muốn làm app quản lý quán cà phê", wait: 2000 },
        { text: "/plan", wait: 1000 },
        { text: "Khách order tại bàn, nhân viên bếp nhận đơn", wait: 2000 },
        { text: "/design", wait: 1000 },
        { text: "/visualize", wait: 1000 },
        { text: "/code phase-1", wait: 2000 },
        { text: "/run", wait: 3000 }
    ];
    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeTerminal() {
        const currentCmd = commands[cmdIndex];

        if (isDeleting) {
            terminalText.textContent = currentCmd.text.substring(0, charIndex - 1);
            charIndex--;
        } else {
            terminalText.textContent = currentCmd.text.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 50;

        if (!isDeleting && charIndex === currentCmd.text.length) {
            typeSpeed = currentCmd.wait;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            typeSpeed = 500;
        }

        setTimeout(typeTerminal, typeSpeed);
    }

    // Start typing
    if (terminalText) typeTerminal();


    // --- 2. 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // --- 3. Scroll Reveal Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Inject CSS for visible class
    const style = document.createElement('style');
    style.innerHTML = `
        .visible { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);

    // --- 4. Command Modal Logic ---
    const modal = document.getElementById('cmd-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalWhen = document.getElementById('modal-when');
    const modalAI = document.getElementById('modal-ai');
    const modalExample = document.getElementById('modal-example');

    const cmdData = {
        'init': {
            title: '/init',
            when: 'Dùng lệnh này ĐẦU TIÊN khi bạn muốn bắt đầu một dự án mới hoàn toàn.',
            ai: 'AI sẽ tạo cấu trúc thư mục, thiết lập môi trường, tạo file SPECS.md để bắt đầu.',
            example: 'user: /init'
        },
        'plan': {
            title: '/plan',
            when: 'Khi bạn có ý tưởng nhưng chưa biết bắt đầu từ đâu. Hoặc muốn thêm tính năng mới.',
            ai: 'AI sẽ phỏng vấn bạn 3 câu hỏi (Deep Interview) để hiểu rõ yêu cầu, sau đó viết bản kế hoạch chi tiết.',
            example: 'user: /plan\nAI: Bạn muốn làm app gì? Ai là người dùng chính?'
        },
        'design': {
            title: '/design',
            when: 'Sau khi đã có kế hoạch (/plan), bạn cần thiết kế chi tiết (Database, API, Luồng đi).',
            ai: 'AI sẽ tạo file DESIGN.md, vẽ sơ đồ Database Schema, và liệt kê các màn hình cần làm.',
            example: 'user: /design\nAI: Đã tạo bảng Users, Products, Orders.'
        },
        'visualize': {
            title: '/visualize',
            when: 'Khi bạn muốn hình dung giao diện trông như thế nào trước khi code.',
            ai: 'AI sẽ mô tả chi tiết màu sắc, bố cục, font chữ, hoặc tạo file HTML mockup cơ bản.',
            example: 'user: /visualize\nAI: Giao diện dùng màu xanh Navy chủ đạo, font Inter...'
        },
        'code': {
            title: '/code',
            when: 'Khi mọi thứ đã sẵn sàng, bạn muốn AI bắt tay vào viết code thực tế.',
            ai: 'AI sẽ code từng file một, báo cáo tiến độ (Task 1/5 done), và hỏi bạn xác nhận sau mỗi bước quan trọng.',
            example: 'user: /code phase-1\nAI: Đang viết file index.html...'
        },
        'run': {
            title: '/run',
            when: 'Khi muốn chạy thử ứng dụng xem nó hoạt động thế nào.',
            ai: 'AI sẽ chạy lệnh start server (npm run dev) và mở trình duyệt cho bạn.',
            example: 'user: /run\nAI: App đang chạy tại localhost:3000'
        },
        'debug': {
            title: '/debug',
            when: 'Khi gặp lỗi hoặc app chạy không đúng ý.',
            ai: 'AI sẽ đọc log lỗi, phân tích nguyên nhân, và tự động sửa code cho bạn.',
            example: 'user: /debug "Nút đăng nhập không bấm được"\nAI: Đã fix lỗi sự kiện onclick.'
        },
        'next': {
            title: '/next',
            when: 'Khi bạn bị kẹt, không biết phải làm gì tiếp theo.',
            ai: 'AI sẽ đọc lại toàn bộ dự án và gợi ý bước tiếp theo hợp lý nhất.',
            example: 'user: /next\nAI: Bạn đã code xong Backend. Bước tiếp theo nên làm Frontend.'
        },
        'brainstorm': {
            title: '/brainstorm',
            when: 'Khi bạn bí ý tưởng, cần một luồng gió mới.',
            ai: 'AI đóng vai chuyên gia sáng tạo, gợi ý 10 ý tưởng dựa trên keyword của bạn.',
            example: 'user: /brainstorm "App hẹn hò cho chó mèo"'
        },
        'audit': {
            title: '/audit',
            when: 'Trước khi release, muốn kiểm tra xem code có an toàn/tối ưu không.',
            ai: 'AI quét toàn bộ code, chấm điểm bảo mật, hiệu năng và chỉ ra chỗ cần sửa.',
            example: 'user: /audit\nAI: Phát hiện vi lỗ hổng SQL Injection tại line 45.'
        },
        'test': {
            title: '/test',
            when: 'Muốn đảm bảo tính năng chạy đúng, không bug ngầm.',
            ai: 'AI tự viết Test Case và chạy Unit Test cho toàn bộ dự án.',
            example: 'user: /test\nAI: Đã chạy 50 test. Pass: 49. Fail: 1.'
        },
        'deploy': {
            title: '/deploy',
            when: 'Khi app đã xong, muốn đưa lên mạng cho cả thế giới dùng.',
            ai: 'AI tự động build, cấu hình server (Vercel/Netlify/VPS) và trả về link web.',
            example: 'user: /deploy\nAI: App đã online tại: https://thao-coffee.vercel.app'
        },
        'refactor': {
            title: '/refactor',
            when: 'Khi code chạy được nhưng nhìn "rối rắm", khó bảo trì.',
            ai: 'AI viết lại code cho gọn, sạch, dễ đọc hơn mà không làm thay đổi tính năng.',
            example: 'user: /refactor payment.js\nAI: Đã tối ưu function logic, giảm 50 dòng code thừa.'
        },
        'save_brain': {
            title: '/save-brain',
            when: 'Kết thúc buổi làm việc, muốn lưu lại mọi kiến thức đã học.',
            ai: 'AI tổng hợp các rule, pattern mới vào "Bộ não", để lần sau thông minh hơn.',
            example: 'user: /save-brain\nAI: Đã lưu kiến thức Module User vào Knowledge Base.'
        },
        'help': {
            title: '/help',
            when: 'Khi bạn không biết dùng lệnh gì, hoặc cần hướng dẫn.',
            ai: 'AI hiển thị menu trợ giúp với tất cả các lệnh có sẵn và gợi ý phù hợp với tình huống hiện tại.',
            example: 'user: /help\nAI: 📋 Bạn đang ở giai đoạn Code. Có thể dùng:\n- /run: Chạy thử app\n- /debug: Nếu có lỗi'
        },
        'recap': {
            title: '/recap',
            when: 'Khi bạn quay lại sau một thời gian và quên đang làm gì.',
            ai: 'AI đọc lại toàn bộ context của dự án và tóm tắt tiến độ cho bạn.',
            example: 'user: /recap\nAI: Dự án KFood đang ở Phase 2. Bạn đã làm xong Menu, đang làm Order.'
        }
    };

    window.openCmdModal = (cmd) => {
        const data = cmdData[cmd];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalWhen.textContent = data.when;
        modalAI.textContent = data.ai;
        modalExample.textContent = data.example;

        modal.classList.add('active');
    };

    window.closeCmdModal = () => {
        modal.classList.remove('active');
    };

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCmdModal();
    });
});

// Copy Installation Command
function copyInstallCmd() {
    const cmdText = document.getElementById('install-cmd').innerText;
    navigator.clipboard.writeText(cmdText).then(() => {
        const btn = document.querySelector('.cmd-copy-btn');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i data-lucide="check"></i> Đã Copy';
        btn.style.background = '#4ade80';
        btn.style.color = '#000';
        lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '#333';
            btn.style.color = '#fff';
            lucide.createIcons();
        }, 2000);
    });
}

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Auto-run animations on load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
});

/* --- 5. MAGIC CURSOR LOGIC (SAFE MODE) --- */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// EMERGENCY FALLBACK: Force show content
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('active');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 500);
});
