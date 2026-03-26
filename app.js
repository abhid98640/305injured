// ═══════════════════════════════════════════
//  305INJURED — App JS
// ═══════════════════════════════════════════

// ── Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(0,0,0,0.97)';
  } else {
    navbar.style.background = 'rgba(0,0,0,0.85)';
  }
});

// ── Testimonial video cards → open modal with real video
const modalVideo       = document.getElementById('modalVideo');
const modalPlaceholder = document.getElementById('modalPlaceholder');

// Map data-video values to actual src (add more as you have files)
const videoSources = {
  'assets/testi-1.mp4': 'assets/testi-1.mp4',
  'assets/testi-2.mp4': 'assets/testi-2.mp4',
  'assets/testi-3.mp4': 'assets/testi-3.mp4',
};

document.querySelectorAll('.video-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const key = thumb.dataset.video;
    const src = videoSources[key];
    if (src) {
      modalVideo.src = src;
      modalVideo.style.display = 'block';
      modalPlaceholder.style.display = 'none';
      modalVideo.play();
    } else {
      modalVideo.style.display = 'none';
      modalPlaceholder.style.display = 'flex';
    }
    document.getElementById('videoModal').classList.add('open');
  });
});

function closeModal() {
  document.getElementById('videoModal').classList.remove('open');
  modalVideo.pause();
  modalVideo.src = '';
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Form submit (demo)
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Submitted — We\'ll Call You Shortly';
  btn.style.background = '#1a7a1a';
  btn.disabled = true;
  e.target.reset();
}

// ── Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Intersection observer for fade-in animations
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.empathy-card, .testi-card, .area-card, .attorney-copy, .attorney-photo-wrap'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  io.observe(el);
});
