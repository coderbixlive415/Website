// ═══════════════════════════════════════════════
// PayCliq — mock up.js
// ═══════════════════════════════════════════════

// ── 1. NAVBAR scroll shadow ───────────────────
window.addEventListener('scroll', () => {
  const pill = document.querySelector('.nav-pill');
  if (pill) pill.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── 2. DROPDOWNS (Products + Company) ─────────────────────
const productBtn = document.getElementById('productBtn');
const productMenu = document.getElementById('productMenu');

const companyBtn = document.getElementById('companyBtn');
const companyMenu = document.getElementById('companyMenu');

function closeAllDropdowns() {
  if (productMenu) productMenu.classList.remove('open');
  if (productBtn) productBtn.classList.remove('open');
  if (companyMenu) companyMenu.classList.remove('open');
  if (companyBtn) companyBtn.classList.remove('open');
}

// Products Dropdown
if (productBtn && productMenu) {
  productBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDropdowns();           // Close other dropdowns
    const isOpen = productMenu.classList.toggle('open');
    productBtn.classList.toggle('open', isOpen);
  });
  
  productMenu.addEventListener('click', e => e.stopPropagation());
}

// Company Dropdown
if (companyBtn && companyMenu) {
  companyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDropdowns();           // Close other dropdowns
    const isOpen = companyMenu.classList.toggle('open');
    companyBtn.classList.toggle('open', isOpen);
  });
  
  companyMenu.addEventListener('click', e => e.stopPropagation());
}

// Close dropdowns when clicking anywhere outside
document.addEventListener('click', () => {
  closeAllDropdowns();
});

// ── 3. WORD SWITCHER ─────────────────────────
(function initWordSwitcher() {
  const track = document.getElementById('wordTrack');
  if (!track) return;
  
  const words = track.querySelectorAll('.word');
  const total = words.length;
  let current = 0;

  // Clone first word for seamless loop
  const clone = words[0].cloneNode(true);
  track.appendChild(clone);

  setInterval(() => {
    current++;
    const wordHeight = track.children[0].offsetHeight;
    track.style.transform = `translateY(-${current * wordHeight}px)`;

    if (current === total) {
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateY(0)';
        current = 0;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.transition = '';
          });
        });
      }, 460);
    }
  }, 2000);
})();

// ── 4. SCROLL REVEAL — feature cards ─────────
(function initScrollReveal() {
  const blocks = document.querySelectorAll('.feature-block');
  if (!blocks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  blocks.forEach(b => io.observe(b));
})();

// ── 5. FLOW CANVAS ───────────────────────────
(function initFlowCanvas() {
  const canvas = document.getElementById('flowCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const W = 300, H = 300;
  canvas.width = W; 
  canvas.height = H;

  const nodes = [
    { x: 36, y: 200, label: 'Customer' },
    { x: 110, y: 110, label: 'POS' },
    { x: 196, y: 196, label: 'Gateway' },
    { x: 270, y: 108, label: 'Bank' },
  ];

  const segments = [{ from:0, to:1 }, { from:1, to:2 }, { from:2, to:3 }];

  const particles = [];
  for (let i = 0; i < 18; i++) {
    particles.push({
      seg: Math.floor(Math.random() * segments.length),
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      size: 2 + Math.random() * 2,
      alpha: 0.45 + Math.random() * 0.55,
    });
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dashed path lines
    segments.forEach(s => {
      const a = nodes[s.from], b = nodes[s.to];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(255,122,0,0.15)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Move & draw particles
    particles.forEach(p => {
      p.t += p.speed;
      if (p.t >= 1) {
        p.t = 0;
        p.seg = (p.seg + 1) % segments.length;
      }
      const s = segments[p.seg];
      const a = nodes[s.from], b = nodes[s.to];
      const x = lerp(a.x, b.x, p.t);
      const y = lerp(a.y, b.y, p.t);

      // Glow
      const grd = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4.5);
      grd.addColorStop(0, `rgba(255,122,0,${p.alpha * 0.3})`);
      grd.addColorStop(1, 'rgba(255,122,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, p.size * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Core particle
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,122,0,${p.alpha})`;
      ctx.fill();
    });

    // Node circles
    nodes.forEach(n => {
      // Halo
      ctx.beginPath();
      ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,122,0,0.07)';
      ctx.fill();

      // White dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,122,0,0.65)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(45,15,47,0.45)';
      ctx.font = '600 10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 34);
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── 6. SHIELD PARTICLES ───────────────────────
(function initShield() {
  const orbit = document.getElementById('shieldOrbit');
  if (!orbit) return;
  
  const count = 6;
  const radius = 96;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    const cx = 50 + (Math.cos(angle) * radius / 2.2);
    const cy = 50 + (Math.sin(angle) * radius / 2.2);
    
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(255,122,0,0.65);
      top: ${cy}%; left: ${cx}%;
      transform: translate(-50%, -50%);
    `;
    orbit.appendChild(dot);
  }
})();

// ── 7. SETTLEMENT BARS ────────────────────────
(function initSettlementBars() {
  const scene = document.getElementById('settleScene');
  if (!scene) return;
  
  let fired = false;
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || fired) return;
    fired = true;

    scene.querySelectorAll('.s-bar').forEach((bar, idx) => {
      setTimeout(() => {
        bar.style.height = bar.getAttribute('data-h') + '%';
      }, idx * 80);
    });

    const check = document.getElementById('settleCheck');
    if (check) {
      const barCount = scene.querySelectorAll('.s-bar').length;
      setTimeout(() => check.classList.add('show'), barCount * 80 + 300);
    }
    io.unobserve(scene);
  }, { threshold: 0.25 });

  io.observe(scene);
})();

// ── 8. CTA FORM VALIDATION ────────────────────
(function initCtaForm() {
  const btn = document.getElementById('ctaBtn');
  const btnText = document.getElementById('ctaBtnText');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const fields = document.querySelectorAll('.cta-form input, .cta-form select');
    let allGood = true;

    fields.forEach(f => {
      if (!f.value.trim()) {
        allGood = false;
        f.style.borderColor = '#ef4444';
        f.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
        setTimeout(() => { 
          f.style.borderColor = ''; 
          f.style.boxShadow = ''; 
        }, 1800);
      }
    });

    if (allGood) {
      btnText.textContent = "✓ We'll be in touch!";
      btn.style.background = '#16a34a';
      btn.style.boxShadow = '0 8px 24px rgba(22,163,74,0.28)';

      setTimeout(() => {
        btnText.textContent = 'Register your business →';
        btn.style.background = '';
        btn.style.boxShadow = '';
      }, 3000);
    }
  });
})();