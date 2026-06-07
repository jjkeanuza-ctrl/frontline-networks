/* ── FRONTLINE NETWORKS — SHARED JS ── */

/* ── PARTICLE BACKGROUND ── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.4 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.45 + 0.08;
      this.color = Math.random() > 0.75 ? '#4fc3f7' : '#c8cdd8';
    };
    this.reset();
    this.x = Math.random() * (W || window.innerWidth);
    this.y = Math.random() * (H || window.innerHeight);
  }

  function init(n) {
    particles = [];
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) p.reset();
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.07;
          ctx.strokeStyle = '#4fc3f7';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize();
  init(80);
  draw();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    init(80);
    draw();
  });
})();

/* ── SCROLL REVEAL ── */
(function() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
})();

/* ── ACTIVE NAV LINK ── */
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

/* ── SERVER STATUS CHECKER ──
   When you have your server:
   1. Replace SERVER_IP with your GMOD server IP
   2. Replace SERVER_PORT with your port (usually 27015)
   3. Set up the Cloudflare Worker (ask for the code when ready)
   4. Replace WORKER_URL with your worker URL
*/
const SERVER_CONFIG = {
  ip: 'YOUR_SERVER_IP',       // e.g. '123.456.789.0'
  port: 27015,                 // your GMOD server port
  workerUrl: null              // e.g. 'https://fl-status.yourname.workers.dev'
};

async function fetchServerStatus() {
  const statusEls = document.querySelectorAll('[data-server-status]');
  const playerEls = document.querySelectorAll('[data-server-players]');
  const maxEls    = document.querySelectorAll('[data-server-maxplayers]');
  if (!statusEls.length) return;

  // No worker configured yet — show offline
  if (!SERVER_CONFIG.workerUrl || SERVER_CONFIG.ip === 'YOUR_SERVER_IP') {
    setOffline(statusEls, playerEls, maxEls);
    return;
  }

  try {
    const res = await fetch(SERVER_CONFIG.workerUrl, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (data.online) {
      statusEls.forEach(el => {
        el.textContent = 'Online';
        el.className = el.className.replace('status-offline','status-live');
      });
      playerEls.forEach(el => el.textContent = data.players ?? '0');
      maxEls.forEach(el => el.textContent = data.maxplayers ?? '0');
      document.querySelectorAll('[data-status-dot]').forEach(d => {
        d.classList.remove('dot-offline'); d.classList.add('dot-live');
      });
    } else {
      setOffline(statusEls, playerEls, maxEls);
    }
  } catch {
    setOffline(statusEls, playerEls, maxEls);
  }
}

function setOffline(statusEls, playerEls, maxEls) {
  statusEls.forEach(el => { el.textContent = 'Offline'; });
  playerEls.forEach(el => { el.textContent = '0'; });
  maxEls.forEach(el => { el.textContent = '0'; });
  document.querySelectorAll('[data-status-dot]').forEach(d => {
    d.classList.remove('dot-live'); d.classList.add('dot-offline');
  });
}

fetchServerStatus();
// Refresh status every 60 seconds
setInterval(fetchServerStatus, 60000);
