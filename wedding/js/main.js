/**
 * main.js — Countdown Timer, RSVP validation, Guestbook manager, Scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. COUNTDOWN TIMER
     ================================================================ */
  const countdownContainer = document.getElementById('countdown');
  if (countdownContainer) {
    const targetDateStr = countdownContainer.getAttribute('data-date');
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timerInterval);
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        return;
      }

      // Calculations
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Pad with zero
      const pad = n => String(n).padStart(2, '0');

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);
    };

    updateCountdown(); // Run instantly
    const timerInterval = setInterval(updateCountdown, 1000);
  }

  /* ================================================================
     2. GUESTBOOK / WISHES MANAGER
     ================================================================ */
  const wishesListContainer = document.getElementById('wishesList');

  // Default placeholder wishes if none exist in localStorage
  const defaultWishes = [
    {
      name: "Ahmad Faisal",
      status: "attending",
      message: "Wishing you both a lifetime of love, laughter, and happiness. May your love grow stronger each passing day!"
    },
    {
      name: "Nurul Aina",
      status: "attending",
      message: "Congratulations to Faris & Elysa! So happy for you two. Looking forward to the big day!"
    },
    {
      name: "Daniel Harris",
      status: "declining",
      message: "Congratulations guys! I am so sorry I cannot attend due to work travel, but wishing you both a blessed wedding and marriage life!"
    }
  ];

  // Load and display wishes
  const renderWishes = () => {
    if (!wishesListContainer) return;

    let savedRsvps = [];
    try {
      savedRsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
    } catch (e) {
      savedRsvps = [];
    }

    // Combine local wishes (newest first) and defaults
    const allWishes = [...savedRsvps, ...defaultWishes];
    wishesListContainer.innerHTML = '';

    allWishes.forEach(wish => {
      const wishCard = document.createElement('div');
      wishCard.className = 'wish-card';

      const isAttending = wish.status === 'attending';
      const statusLabel = isAttending ? 'Attending' : 'Declining';
      const statusClass = isAttending ? 'attending' : 'declining';

      wishCard.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(wish.name)}</span>
          <span class="wish-status ${statusClass}">${statusLabel}</span>
        </div>
        <p class="wish-text">"${escapeHtml(wish.message)}"</p>
      `;

      wishesListContainer.appendChild(wishCard);
    });
  };

  // Helper function to escape HTML to prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial render
  renderWishes();

  /* ================================================================
     3. RSVP FORM & SUCCESS MODAL
     ================================================================ */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessModal = document.getElementById('rsvpSuccessModal');
  const closeRsvpModalBtn = document.getElementById('closeRsvpModal');
  const dismissRsvpModalBtn = document.getElementById('dismissRsvpModal');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const nameInput    = document.getElementById('rsvp-name');
      const emailInput   = document.getElementById('rsvp-email');
      const statusSelect = document.getElementById('rsvp-status');
      const guestsSelect = document.getElementById('rsvp-guests');
      const dietInput     = document.getElementById('rsvp-diet');
      const messageInput  = document.getElementById('rsvp-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const status = statusSelect.value;
      const guests = guestsSelect.value;
      const diet = dietInput.value.trim();
      const message = messageInput.value.trim();

      // Basic validation checks
      let isValid = true;

      if (!name) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      } else {
        removeError(nameInput);
      }

      if (!email || !validateEmail(email)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        removeError(emailInput);
      }

      if (!status) {
        showError(statusSelect, 'Please select attendance');
        isValid = false;
      } else {
        removeError(statusSelect);
      }

      if (!message) {
        showError(messageInput, 'Please send a wish message');
        isValid = false;
      } else {
        removeError(messageInput);
      }

      if (!isValid) return;

      // Create new RSVP wish
      const newRsvp = {
        name,
        email,
        status,
        guests: status === 'attending' ? guests : '0',
        diet: diet || 'None',
        message,
        timestamp: new Date().getTime()
      };

      // Save to localStorage
      try {
        const savedRsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
        savedRsvps.unshift(newRsvp); // Add to beginning of array
        localStorage.setItem('wedding_rsvps', JSON.stringify(savedRsvps));
      } catch (err) {
        console.error('Error saving RSVP data:', err);
      }

      // Reset form fields
      rsvpForm.reset();

      // Render updated list of wishes
      renderWishes();

      // Show success modal
      if (rsvpSuccessModal) {
        rsvpSuccessModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close success modal
  const closeModal = () => {
    if (rsvpSuccessModal) {
      rsvpSuccessModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  closeRsvpModalBtn?.addEventListener('click', closeModal);
  dismissRsvpModalBtn?.addEventListener('click', closeModal);

  // Helper validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(inputElement, msg) {
    inputElement.style.borderColor = '#E2564B';
    inputElement.style.boxShadow = '0 0 10px rgba(226, 86, 75, 0.2)';
    
    // Add custom placeholder text representing the error to guide the user
    if (!inputElement.value) {
      inputElement.placeholder = msg;
    }
  }

  function removeError(inputElement) {
    inputElement.style.borderColor = '';
    inputElement.style.boxShadow = '';
  }

  /* ================================================================
     4. SCROLL REVEAL ANIMATIONS
     ================================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

});
