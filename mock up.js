window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });



const productBtn  = document.getElementById('productBtn');
const productMenu = document.getElementById('productMenu');

productBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = productMenu.classList.toggle('open');
  productBtn.classList.toggle('open', isOpen);
});


document.addEventListener('click', () => {
  productMenu.classList.remove('open');
  productBtn.classList.remove('open');
});


productMenu.addEventListener('click', e => e.stopPropagation());


(function initWordSwitcher() {
  const track = document.getElementById('wordTrack');
  if (!track) return;

  const words = track.querySelectorAll('.word');
  const total = words.length;
  let current = 0;

  const clone = words[0].cloneNode(true);
  track.appendChild(clone);

  setInterval(() => {
    current++;

  const wordHeight = track.children[0].offsetHeight;
track.style.transform = `translateY(-${current * wordHeight}px)`;
   
    if (current === total) {
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform  = 'translateY(0%)';
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



(function initScrollReveal() {
  const blocks = document.querySelectorAll('.feature-block');
  if (!blocks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.18 });

  blocks.forEach(b => io.observe(b));
})();



(function initFlowCanvas() {
  const canvas = document.getElementById('flowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W   = 300;
  const H   = 300;
  canvas.width  = W;
  canvas.height = H;


 const nodes = [
    { x: 36,  y: 180, label: 'Customer' },
    { x: 110, y: 100, label: 'POS'      },
    { x: 190, y: 190, label: 'Gateway'  },
    { x: 264, y: 110, label: 'Bank'     },
  ];

 
  const segments = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];


  const particles = [];
  for (let i = 0; i < 18; i++) {
    const seg = Math.floor(Math.random() * segments.length);
    particles.push({
      seg,
      t:       Math.random(),            // 0 = start of segment, 1 = end
      speed:   0.0035 + Math.random() * 0.004,
      size:    2 + Math.random() * 1.8,
      alpha:   0.45 + Math.random() * 0.55,
    });
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);


    segments.forEach(s => {
      const a = nodes[s.from];
      const b = nodes[s.to];

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(255, 122, 0, 0.15)';
      ctx.lineWidth   = 2;
      ctx.setLineDash([5, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // ── Move & draw particles ──
    particles.forEach(p => {
      p.t += p.speed;
      if (p.t >= 1) {
        p.t = 0;
    
        p.seg = (p.seg + 1) % segments.length;
      }

      const seg = segments[p.seg];
      const a   = nodes[seg.from];
      const b   = nodes[seg.to];
      const x   = lerp(a.x, b.x, p.t);
      const y   = lerp(a.y, b.y, p.t);

      // Soft outer glow
      const grd = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4.5);
      grd.addColorStop(0, `rgba(255, 122, 0, ${p.alpha * 0.28})`);
      grd.addColorStop(1, 'rgba(255, 122, 0, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, p.size * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 122, 0, ${p.alpha})`;
      ctx.fill();
    });

   
    nodes.forEach(n => {
      
      ctx.beginPath();
      ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 122, 0, 0.07)';
      ctx.fill();

      
      ctx.beginPath();
      ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
      ctx.fillStyle   = 'white';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 122, 0, 0.65)';
      ctx.lineWidth   = 1.8;
      ctx.stroke();

      ctx.fillStyle  = 'rgba(45, 15, 47, 0.42)';
      ctx.font       = '600 10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign  = 'center';
      ctx.fillText(n.label, n.x, n.y + 34);
    });

    requestAnimationFrame(drawFrame);
  }

  drawFrame();
})();

(function initShield() {
  const orbit = document.getElementById('shieldOrbit');
  if (!orbit) return;

 
  const count  = 6;
  const radius = 96; 

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    // Position in % relative to the 220px container
    const cx = 50 + (Math.cos(angle) * radius / 2.2);
    const cy = 50 + (Math.sin(angle) * radius / 2.2);

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(255, 122, 0, 0.6);
      top:  ${cy}%;
      left: ${cx}%;
      transform: translate(-50%, -50%);
    `;
    orbit.appendChild(dot);
  }
})();


(function initSettlementBars() {
  const scene = document.getElementById('settleScene');
  if (!scene) return;

  let fired = false;

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || fired) return;
    fired = true;

    const bars = scene.querySelectorAll('.s-bar');

    bars.forEach((bar, idx) => {
      const targetH = bar.getAttribute('data-h'); 
      // Stagger each bar by 80ms
      setTimeout(() => {
        bar.style.height = targetH + '%';
      }, idx * 80);
    });

 
    const check = document.getElementById('settleCheck');
    if (check) {
      setTimeout(() => {
        check.classList.add('show');
      }, bars.length * 80 + 300);
    }

    io.unobserve(scene);
  }, { threshold: 0.25 });

  io.observe(scene);
})();


(function initCtaForm() {
  const btn = document.getElementById('ctaBtn');
  const btnText = document.getElementById('ctaBtnText');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const fields = document.querySelectorAll('.cta-form input, .cta-form select');
    let allGood  = true;

    fields.forEach(field => {
      if (!field.value.trim()) {
        allGood = false;
        field.style.borderColor = '#ef4444';
        field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.12)';
        // Reset after 1.8 seconds
        setTimeout(() => {
          field.style.borderColor = '';
          field.style.boxShadow   = '';
        }, 1800);
      }
    });

    if (allGood) {
      btnText.textContent   = "✓ We'll be in touch!";
      btn.style.background  = '#16a34a';
      btn.style.boxShadow   = '0 8px 24px rgba(22,163,74,0.28)';
      setTimeout(() => {
        btnText.textContent  = 'Register your business →';
        btn.style.background = '';
        btn.style.boxShadow  = '';
      }, 3000);
    }
  });
})();
const companyBtn = document.getElementById('companyBtn');
const companyMenu = document.getElementById('companyMenu');

if (companyBtn && companyMenu) {
  companyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = companyMenu.classList.toggle('open');
    companyBtn.classList.toggle('open', isOpen);
  });
}
document.addEventListener('click', () => {
  if (companyMenu) companyMenu.classList.remove('open');
  if (companyBtn) companyBtn.classList.remove('open');
});