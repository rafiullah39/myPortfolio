// =========================================================
// SCROLLSPY NAV — sliding pill highlight + active section tracking
// =========================================================
const headerNav = document.getElementById('pillNav');
const allNavGroups = document.querySelectorAll('.pill-nav');
const sections = ['profile', 'projects', 'contact'].map(id => document.getElementById(id));

function setActiveNav(sectionId) {
  allNavGroups.forEach(group => {
    const links = group.querySelectorAll('.pill-link');
    const highlight = group.querySelector('.pill-highlight');
    let activeLink = null;

    links.forEach(link => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('active', isActive);
      if (isActive) activeLink = link;
    });

    if (activeLink && highlight) {
      const linkRect = activeLink.getBoundingClientRect();
      const groupRect = group.getBoundingClientRect();
      highlight.style.width = `${linkRect.width}px`;
      highlight.style.transform = `translateX(${linkRect.left - groupRect.left - 5}px)`;
      highlight.style.left = '5px';
    }
  });
}

// figure out which section is currently in view
function updateActiveSection() {
  const scrollPos = window.scrollY + 140;
  let current = 'profile';
  sections.forEach(sec => {
    if (sec && sec.offsetTop <= scrollPos) {
      current = sec.id;
    }
  });
  setActiveNav(current);
}

window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
window.addEventListener('load', updateActiveSection);

// run immediately too — without this, the highlight pill sits in its default
// CSS position while the hardcoded "active" link (dark text) may be a
// different one, making that link's text briefly invisible (dark-on-dark)
updateActiveSection();

// re-run once web fonts finish loading, since that can shift text widths
// (and therefore the pill highlight's position) after the initial calculation
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateActiveSection);
}
setTimeout(updateActiveSection, 400);

// =========================================================
// SCROLL REVEAL — fade/slide elements into view once
// =========================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// =========================================================
// LANGUAGE BARS — animate width fill when scrolled into view
// =========================================================
const langFills = document.querySelectorAll('.lang-fill');
const langObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pct = entry.target.dataset.pct || 0;
      entry.target.style.width = `${pct}%`;
      langObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

langFills.forEach(el => langObserver.observe(el));

// =========================================================
// HERO AVATAR — 3D tilt on mouse move (desktop only)
// =========================================================
const tiltWrap = document.getElementById('avatarTilt');
const tiltCard = tiltWrap ? tiltWrap.querySelector('.hero-avatar-card') : null;

if (tiltWrap && tiltCard && window.matchMedia('(hover: hover)').matches) {
  tiltWrap.addEventListener('mousemove', (e) => {
    const rect = tiltWrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
  });

  tiltWrap.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
  });
}

// subtle parallax on the background glow blobs, following the cursor
const glow1 = document.querySelector('.bg-glow--1');
const glow2 = document.querySelector('.bg-glow--2');

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const xPct = e.clientX / window.innerWidth - 0.5;
    const yPct = e.clientY / window.innerHeight - 0.5;
    if (glow1) glow1.style.transform = `translate(${xPct * 30}px, ${yPct * 30}px)`;
    if (glow2) glow2.style.transform = `translate(${xPct * -22}px, ${yPct * -22}px)`;
  });
}

// =========================================================
// CUSTOM CURSOR RING
// =========================================================
const cursorRing = document.getElementById('cursorRing');

if (cursorRing && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
    cursorRing.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorRing.style.opacity = '0';
  });

  const hoverTargets = document.querySelectorAll('a, button, .video-card, .skill-badge, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '48px';
      cursorRing.style.height = '48px';
      cursorRing.style.borderColor = 'var(--cyan)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '28px';
      cursorRing.style.height = '28px';
    });
  });
}

// =========================================================
// VIDEO LIGHTBOX
// =========================================================
const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxClose = document.getElementById('lightboxClose');
const videoCards = document.querySelectorAll('.video-card');

function openLightbox(src) {
  lightboxVideo.src = src;
  lightbox.classList.add('open');
  lightboxVideo.play().catch(() => {});
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();
  document.body.style.overflow = '';
}

videoCards.forEach(card => {
  card.addEventListener('click', () => openLightbox(card.dataset.video));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// "Start Reel" HUD link opens the first clip
const hudReel = document.getElementById('hudReel');
if (hudReel) {
  hudReel.addEventListener('click', () => {
    const firstClip = document.querySelector('.video-card');
    if (firstClip) openLightbox(firstClip.dataset.video);
  });
}

// "Skills & Spec" HUD link scrolls to the skills row
const hudSkills = document.getElementById('hudSkills');
if (hudSkills) {
  hudSkills.addEventListener('click', () => {
    document.querySelector('.skills-row').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// "Direct Ping" HUD link scrolls to contact and focuses the name field
const hudPing = document.getElementById('hudPing');
if (hudPing) {
  hudPing.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('fName').focus(), 500);
  });
}

// =========================================================
// GLOBAL ESC KEY — closes lightbox if open, otherwise scrolls to top
// =========================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('open')) {
      closeLightbox();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =========================================================
// MOBILE MENU TOGGLE — reveals the inline-style nav pill in header on small screens
// =========================================================
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    headerNav.classList.toggle('mobile-open');
  });
}

// =========================================================
// CONTACT FORM — builds a mailto: link (fully static, no backend)
// =========================================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fName').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const message = document.getElementById('fMessage').value.trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const mailtoLink = `mailto:rafiullahh2005@gmail.com?subject=${subject}&body=${body}`;

    formNote.textContent = 'Opening your email client…';
    formNote.style.color = 'var(--cyan)';
    window.location.href = mailtoLink;
  });
}
