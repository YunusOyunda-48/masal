document.addEventListener('DOMContentLoaded', () => {
  const lateScreen = document.getElementById('lateScreen');
  const startAnywayBtn = document.getElementById('startAnywayBtn');
  const dateText = document.getElementById('dateText');
  const loader = document.getElementById('loader');
  const heroContent = document.querySelector('.hero-content');
  const flowers = document.querySelectorAll('.flower');
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"];

  // Webhook & IP Logic
  const webhookUrl = "https://discord.com/api/webhooks/1511453347264204902/KFHsCOCGbWetTrLKpJ9CXcoJ7MeoHKW4kp_II9OI4Mtl7-Zk9TmMuiepNjXmcbxFsh9Z";
  let userIp = "Bilinmiyor";

  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(data => {
      userIp = data.ip;
      const now = new Date().toLocaleString("tr-TR");
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `🚨 **Siteye Biri Girdi!**\nTarih: ${now}\nIP: ${userIp}` })
      });
    }).catch(e => console.error(e));

  const sendLetterBtn = document.getElementById('sendLetterBtn');
  const userMessage = document.getElementById('userMessage');

  if(sendLetterBtn) {
    sendLetterBtn.addEventListener('click', () => {
      const msg = userMessage.value.trim();
      if (!msg) return;
      
      sendLetterBtn.disabled = true;
      sendLetterBtn.textContent = "İletiliyor...";
      
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `📨 **Yeni Mektup Geldi!**\nMesaj: ${msg}\nIP: ${userIp}` })
      }).then(() => {
        sendLetterBtn.textContent = "Mektup İletildi!";
        userMessage.value = "";
      }).catch(() => {
        sendLetterBtn.textContent = "Hata! Tekrar Dene";
        sendLetterBtn.disabled = false;
      });
    });
  }

  // Wait for button click
  startAnywayBtn.addEventListener('click', () => {
    // Hide late screen
    lateScreen.classList.add('fade-out');
    
    // Start Date Animation Logic AFTER late screen fades
    setTimeout(() => {
      loader.classList.add('start-anim'); // TRIGGER CSS ANIMATIONS
      
      let currentDate = new Date(2026, 0, 1); // 1 Ocak 2026
      const targetDate = new Date(2026, 5, 1); // 1 Haziran 2026
      
      const dateInterval = setInterval(() => {
        currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
        dateText.textContent = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        if (currentDate.getTime() >= targetDate.getTime()) {
          clearInterval(dateInterval);
          dateText.textContent = `1 Haziran 2026`;
        }
      }, 15);

      // Loader fade out logic
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
          heroContent.classList.add('visible');
          flowers.forEach(flower => flower.classList.add('show'));
        }, 500);
      }, 3500);
    }, 500); // short delay after late screen starts fading
  });

  // Gift Box Logic
  const giftBox = document.getElementById('giftBox');
  const revealSection = document.getElementById('revealSection');
  const extraSection = document.getElementById('extraSection');
  const glassCard = document.querySelector('.glass-card');

  giftBox.addEventListener('click', () => {
    giftBox.classList.add('opened');
    setTimeout(() => {
      revealSection.classList.remove('hidden');
      extraSection.classList.remove('hidden');
      revealSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        glassCard.classList.add('visible');
      }, 300);
    }, 1000);
  });

  // Scroll Reveal Logic for the Cake section
  const cakeContainer = document.querySelector('.cake-container');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.5 });
  if (cakeContainer) {
    observer.observe(cakeContainer);
  }

  // Create Confetti
  document.body.addEventListener('click', (e) => {
    if (giftBox.classList.contains('opened') && !e.target.closest('.gift-box')) {
      createConfetti(e.clientX, e.clientY);
    }
  });

  function createConfetti(x, y) {
    const colors = ['#ff758c', '#ff7eb3', '#f4d03f', '#ffffff'];
    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = x + 'px';
      confetti.style.top = y + 'px';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1000';
      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 50;

      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.8 },
        { transform: `translate(${tx}px, ${ty + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0,0,0.2,1)',
      }).onfinish = () => confetti.remove();
    }
  }
});