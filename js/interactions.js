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
  try {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      if (el) revealObserver.observe(el);
    });
  } catch (e) {
    console.error('Scroll reveal observer failed:', e);
  }

  /* ================================================================
     3. ACTIVE NAV LINK — highlights current section
  ================================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navlinks a');

  if (sections.length > 0 && navLinks.length > 0) {
    try {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const activeLink = document.querySelector(`.navlinks a[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });

      sections.forEach(s => navObserver.observe(s));
    } catch (e) {
      console.error('Nav observer failed:', e);
    }
  }

  /* ================================================================
     4. TYPING EFFECT — hero role line
  ================================================================ */
  const roleEl = document.getElementById('role-typing');
  if (roleEl) {
    const roles = ['Teacher', 'Video Editor', 'Web Developer', 'Digital Creator'];
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    roleEl.appendChild(cursor);

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentRole = roles[roleIndex];
      let typeSpeed = isDeleting ? 55 : 95;

      if (isDeleting) {
        roleEl.firstChild.nodeValue = currentRole.slice(0, --charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typeSpeed = 500; // Pause before typing new role
        }
      } else {
        roleEl.firstChild.nodeValue = currentRole.slice(0, ++charIndex);
        if (charIndex === currentRole.length) {
          isDeleting = true;
          typeSpeed = 1800; // Pause before deleting
        }
      }
      setTimeout(type, typeSpeed);
    }

    // Insert text node before the cursor and start
    roleEl.insertBefore(document.createTextNode(''), cursor);
    setTimeout(type, 800);
  }

  /* ================================================================
     5. ANIMATED SKILL BARS — fire when resume section visible
  ================================================================ */
  const resumeCard = document.querySelector('.resume-card');
  if (resumeCard) {
    // Set CSS custom property for each bar
    const bars = resumeCard.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width') || '0%';
      bar.style.setProperty('--target-w', targetWidth);
      bar.style.width = '0'; // Start at 0
    });

    try {
      const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('skills-animated');
            skillsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      skillsObserver.observe(resumeCard);
    } catch (e) {
      console.error('Skills observer failed:', e);
    }
  }

  /* ================================================================
     6. RESUME CARD ACCENT LINE — reveal on scroll
  ================================================================ */
  try {
    const resumeCardReveal = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          resumeCardReveal.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.resume-card').forEach(c => {
      if (c) resumeCardReveal.observe(c);
    });
  } catch (e) {
    console.error('Resume card reveal observer failed:', e);
  }

  /* ================================================================
     7. CONTACT FORM — AJAX submit via FormSubmit.co → aimanskspp@gmail.com
  ================================================================ */
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('#submitBtn');
    const formAction = form.action || 'https://formsubmit.co/aimanskspp@gmail.com';

    if (submitBtn) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Client-side validation
        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const messageInput = form.querySelector('[name="message"]');
        if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
          return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        try {
          const formData = new FormData(form);
          const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const nextUrl = form.querySelector('[name="_next"]')?.value || 'thanks.html';
          window.location.href = nextUrl;

        } catch (error) {
          console.error('Form submission failed:', error);
          submitBtn.textContent = '✕ Failed — Try Again';
          submitBtn.classList.add('error');
          submitBtn.disabled = false;

          setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.classList.remove('error');
          }, 3500);
        }
      });
    }
  }
  /* ================================================================
     8. SHOWCASE CATEGORY FILTER
  ================================================================ */
  const filterWrapper = document.querySelector('.showcase-filters');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterWrapper && projectCards.length > 0) {
    const filterBtns = filterWrapper.querySelectorAll('.filter-btn');
    const allBtn = filterWrapper.querySelector('[data-filter="all"]');
    const videoBtn = filterWrapper.querySelector('[data-filter="video"]');
    const webBtn = filterWrapper.querySelector('[data-filter="web"]');

    // Update counts dynamically
    if (allBtn) {
      allBtn.textContent = `ALL // ${String(projectCards.length).padStart(2, '0')}`;
    }
    if (videoBtn) {
      const videoCount = document.querySelectorAll('.project-card[data-category="video"]').length;
      videoBtn.textContent = `VIDEOS // ${String(videoCount).padStart(2, '0')}`;
    }
    if (webBtn) {
      const webCount = document.querySelectorAll('.project-card[data-category="web"]').length;
      webBtn.textContent = `WEBSITES // ${String(webCount).padStart(2, '0')}`;
    }

    // Attach event listeners
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        // Toggle active button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter and animate cards
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          const shouldShow = (filterValue === 'all' || cardCategory === filterValue);

          // Use a transition-based approach for smoother animations
          if (shouldShow) {
            card.classList.remove('hide');
            requestAnimationFrame(() => {
              card.classList.remove('fade-out');
            });
          } else {
            card.classList.add('fade-out');
            card.addEventListener('transitionend', () => {
              card.classList.add('hide');
            }, { once: true });
          }
        });
      });
    });
  }

});
