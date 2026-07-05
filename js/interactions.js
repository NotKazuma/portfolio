/**
 * interactions.js
 * Scroll reveal · Active nav · Typing effect · Skill bars · Cursor spotlight · Contact form
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. CURSOR SPOTLIGHT (desktop only) - Optimized with requestAnimationFrame
  ================================================================ */
  if (document.body.classList.contains('device-desktop')) {
    const spot = document.createElement('div');
    spot.className = 'cursor-spotlight';
    document.body.appendChild(spot);
    
    let mouseX = 0;
    let mouseY = 0;
    let isPending = false;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isPending) {
        requestAnimationFrame(() => {
          spot.style.left = `${mouseX}px`;
          spot.style.top  = `${mouseY}px`;
          isPending = false;
        });
        isPending = true;
      }
    }, { passive: true });
  }

  /* ================================================================
     2. SCROLL REVEAL — simple elements
  ================================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* ================================================================
     3. ACTIVE NAV LINK — highlights current section
  ================================================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navlinks a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.navlinks a[href="#${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));

  /* ================================================================
     4. TYPING EFFECT — hero role line
  ================================================================ */
  const roleEl = document.getElementById('role-typing');
  if (roleEl) {
    const roles  = ['Teacher', 'Video Editor', 'Web Developer', 'Digital Creator'];
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    roleEl.appendChild(cursor);

    let ri = 0, ci = 0, deleting = false;

    function type() {
      const current = roles[ri];
      if (deleting) {
        roleEl.firstChild.nodeValue = current.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 500); return; }
      } else {
        roleEl.firstChild.nodeValue = current.slice(0, ++ci);
        if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
      }
      setTimeout(type, deleting ? 55 : 95);
    }

    // Insert text node before the cursor
    roleEl.insertBefore(document.createTextNode(''), cursor);
    setTimeout(type, 800);
  }

  /* ================================================================
     5. ANIMATED SKILL BARS — fire when resume section visible
  ================================================================ */
  const resumeCard = document.querySelector('.resume-card');
  if (resumeCard) {
    // Set CSS custom property for each bar
    resumeCard.querySelectorAll('.bar-fill').forEach(bar => {
      const target = bar.getAttribute('data-width') || bar.style.width || '0%';
      bar.style.setProperty('--target-w', target);
      bar.style.width = '0';   // start at 0
    });

    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('skills-animated');
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillsObserver.observe(resumeCard);
  }

  /* ================================================================
     6. RESUME CARD ACCENT LINE — reveal on scroll
  ================================================================ */
  const resumeCardReveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); resumeCardReveal.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.resume-card').forEach(c => resumeCardReveal.observe(c));

  /* ================================================================
     7. CONTACT FORM — AJAX submit via FormSubmit.co → aimanskspp@gmail.com
  ================================================================ */
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (form && submitBtn) {


    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client-side validation
      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      if (!name || !email || !message) return;

      // Loading state
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      const formAction = 'https://formsubmit.co/aimanskspp@gmail.com';

      try {
        const data = new FormData(form);
        const res  = await fetch(formAction, {
          method:  'POST',
          body:    data,
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          window.location.href = form.querySelector('[name="_next"]').value || 'thanks.html';
        } else {
          throw new Error('Server error');
        }
      } catch {
        submitBtn.textContent = '✕ Failed — Try Again';
        submitBtn.style.borderColor = '#c0392b';
        submitBtn.style.color = '#c0392b';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }, 3500);
      }
    });
  }

  /* ================================================================
     8. SHOWCASE CATEGORY FILTER
  ================================================================ */
  const filterWrapper = document.querySelector('.showcase-filters');
  const projectCards  = document.querySelectorAll('.project-card');

  if (filterWrapper && projectCards.length > 0) {
    // Update counts dynamically
    const allCount   = projectCards.length;
    const videoCount = document.querySelectorAll('.project-card[data-category="video"]').length;
    const webCount   = document.querySelectorAll('.project-card[data-category="web"]').length;

    const pad = n => String(n).padStart(2, '0');
    filterWrapper.querySelector('[data-filter="all"]').textContent   = `ALL // ${pad(allCount)}`;
    filterWrapper.querySelector('[data-filter="video"]').textContent = `VIDEOS // ${pad(videoCount)}`;
    filterWrapper.querySelector('[data-filter="web"]').textContent   = `WEBSITES // ${pad(webCount)}`;

    // Attach event listeners
    const filterBtns = filterWrapper.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        // Toggle active button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter and animate cards
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            // First display it in the grid layout (remove .hide)
            card.classList.remove('hide');
            // Give browser a frame to layout before fading in
            setTimeout(() => {
              card.classList.remove('fade-out');
            }, 30);
          } else {
            // Start the fade-out scaling animation
            card.classList.add('fade-out');
            // Once transition finishes, hide from grid (display: none)
            setTimeout(() => {
              if (card.classList.contains('fade-out')) {
                card.classList.add('hide');
              }
            }, 300);
          }
        });
      });
    });
  }

});
