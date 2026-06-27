// ========================
// CAO GLAMOROSA — app.js
// ========================

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// --- Sticky nav shadow on scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 60
    ? '0 4px 24px rgba(31,34,37,0.08)'
    : 'none';
});

// --- Form submission ---
const form = document.getElementById('consultation-form');
const formSuccess = document.getElementById('form-success');
// TODO: Thay thế bằng URL Web App của Google Apps Script sau khi bạn Deploy
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDE5FEBrHvhTmX69K9MRhcQr_Q56GeojQNFmbpktUpmMDloPQyjbFwJ4NMAB7oPMvz/exec'; 

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const channel = document.getElementById('channel').value;
    const timing = document.getElementById('timing').value;
    const note = document.getElementById('note').value.trim();
    
    if (!name || !phone || !email) {
      alert('Vui lòng nhập họ tên, số điện thoại và email.');
      return;
    }

    // Đổi text button để báo đang xử lý
    const submitBtn = document.getElementById('form-submit-btn');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Đang gửi...';
    submitBtn.disabled = true;

    try {
      if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
        // Tạo form data để gửi đi (Google Apps Script POST thường dễ nhận dạng URLSearchParams hơn JSON nếu k set up header phức tạp)
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('channel', channel);
        formData.append('timing', timing);
        formData.append('note', note);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Cần thiết để tránh lỗi CORS khi gọi Web App của Google
          body: formData,
        });
      }
      
      // Push GTM event
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'form_submit', channel: channel, timing: timing });
      }
      
      form.style.display = 'none';
      formSuccess.classList.remove('hidden');
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// --- Smooth anchor scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- GTM CTA tracking ---
document.querySelectorAll('[id$="-btn"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'cta_click', cta_id: btn.id, cta_text: btn.innerText });
    }
  });
});

// --- FAQ open tracking ---
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open && window.dataLayer) {
      window.dataLayer.push({ event: 'faq_open', question: item.querySelector('summary').innerText.trim() });
    }
  });
});

// --- Scroll depth tracking ---
const depthsTracked = {};
window.addEventListener('scroll', () => {
  const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  [25, 50, 75, 100].forEach(d => {
    if (pct >= d && !depthsTracked[d]) {
      depthsTracked[d] = true;
      if (window.dataLayer) window.dataLayer.push({ event: 'scroll_depth', depth: d });
    }
  });
});
