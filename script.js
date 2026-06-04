/* ============================================================
   GOWTHAM KUMAR D — PORTFOLIO SCRIPTS
   ============================================================ */

'use strict';

/* ---------- LOADING SCREEN ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.removeAttribute('data-loading');
    }
  }, 2000);
});

/* ---------- CUSTOM CURSOR ---------- */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .cert-card, .achievement-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ---------- BACKGROUND CANVAS ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '59,130,246' : '139,92,246';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateCanvas);
}

resizeCanvas();
initParticles();
animateCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

/* ---------- NAVBAR ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) link.classList.add('active');
      else link.classList.remove('active');
    }
  });
}

/* ---------- TYPING ANIMATION ---------- */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Full Stack Developer',
  'PHP & MySQL Expert',
  'UI/UX Enthusiast',
  'Python Developer',
  'Problem Solver',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false, typingTimeout;

function typeWriter() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingTimeout = setTimeout(typeWriter, 500);
      return;
    }
    typingTimeout = setTimeout(typeWriter, 45);
  } else {
    typedEl.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      typingTimeout = setTimeout(typeWriter, 1800);
      return;
    }
    typingTimeout = setTimeout(typeWriter, 90);
  }
}
setTimeout(typeWriter, 2200);

/* ---------- ANIMATED COUNTERS ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const step = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ---------- SCROLL ANIMATIONS (AOS-like) ---------- */
const aosElements = document.querySelectorAll('[data-aos]');

function checkAOS() {
  aosElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const delay = parseInt(el.dataset.aosDelay) || 0;
    if (rect.top < window.innerHeight - 60) {
      setTimeout(() => el.classList.add('aos-animate'), delay);
    }
  });
}

// Counters
const counterEls = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// Skill bars
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const width = fill.dataset.width;
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

window.addEventListener('scroll', checkAOS, { passive: true });
window.addEventListener('resize', checkAOS, { passive: true });
checkAOS();

/* ---------- SMOOTH SECTION SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ---------- DARK / LIGHT TOGGLE ---------- */
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
let isDark = true;

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('dark-mode', isDark);
  document.body.classList.toggle('light-mode', !isDark);
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  isDark = false;
  document.body.classList.remove('dark-mode');
  document.body.classList.add('light-mode');
  themeIcon.className = 'fas fa-moon';
}

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('backend/contact.php', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Failed to send');
      }
    } catch (err) {
      formStatus.className = 'form-status error';
      formStatus.textContent = '✗ Failed to send. Please try emailing directly at gowthamkumard6@gmail.com';
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 6000);
  });
}

/* ---------- PROJECT CARD TILT EFFECT ---------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ---------- CERT CARD HOVER SHIMMER ---------- */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.1s linear; pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ---------- INTERSECTION OBSERVER FOR SECTION ENTRANCE ---------- */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

console.log('%c Gowtham Kumar D — Portfolio ', 'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: bold;');
console.log('%c Built with HTML • CSS • JavaScript ', 'color: #8b5cf6; font-style: italic;');
