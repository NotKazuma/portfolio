document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       STICKY HEADER & SCROLL BEHAVIOR
       ========================================================================== */
    const header = document.getElementById('header');
    const scrollDownBtn = document.querySelector('.scroll-down a');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       SCROLL SECTION ACTIVE HIGHLIGHT & REVEAL ANIMATIONS
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Scroll active link highlight
    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('data-sec') === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: "-90px 0px -20% 0px"
    });

    sections.forEach(section => activeLinkObserver.observe(section));

    // Scroll reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       DYNAMIC MENU CATEGORIES FILTER
       ========================================================================== */
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade-out state first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    if (category === 'all' || cardCategory === category) {
                        card.classList.remove('hidden');
                        // Fade back in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       TESTIMONIALS CAROUSEL SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetInterval();
        });
    });

    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    startInterval();

    // Pause slider on hover
    const sliderContainer = document.querySelector('.testimonials-slider-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startInterval);

    /* ==========================================================================
       RESERVATION SYSTEM & VALIDATION
       ========================================================================== */
    const dateInput = document.getElementById('booking-date');
    const bookingForm = document.getElementById('booking-form');
    const submitBtn = document.getElementById('booking-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalDismiss = document.getElementById('modal-dismiss');
    
    // Set date min to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Helper: Valid email check
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Helper: Valid US phone check (simple check for 10 digits)
    const isValidPhone = (phone) => {
        const clean = phone.replace(/\D/g, '');
        return clean.length >= 10;
    };

    // Error UI management
    const showError = (input, show) => {
        const group = input.closest('.form-group');
        if (show) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
    };

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hasErrors = false;
        
        // Validate Name
        const nameEl = document.getElementById('booking-name');
        if (!nameEl.value.trim()) {
            showError(nameEl, true);
            hasErrors = true;
        } else {
            showError(nameEl, false);
        }

        // Validate Email
        const emailEl = document.getElementById('booking-email');
        if (!emailEl.value.trim() || !isValidEmail(emailEl.value)) {
            showError(emailEl, true);
            hasErrors = true;
        } else {
            showError(emailEl, false);
        }

        // Validate Phone
        const phoneEl = document.getElementById('booking-phone');
        if (!phoneEl.value.trim() || !isValidPhone(phoneEl.value)) {
            showError(phoneEl, true);
            hasErrors = true;
        } else {
            showError(phoneEl, false);
        }

        // Validate Guests
        const guestsEl = document.getElementById('booking-guests');
        if (!guestsEl.value) {
            showError(guestsEl, true);
            hasErrors = true;
        } else {
            showError(guestsEl, false);
        }

        // Validate Date
        const dateEl = document.getElementById('booking-date');
        if (!dateEl.value) {
            showError(dateEl, true);
            hasErrors = true;
        } else {
            showError(dateEl, false);
        }

        // Validate Time
        const timeEl = document.getElementById('booking-time');
        if (!timeEl.value) {
            showError(timeEl, true);
            hasErrors = true;
        } else {
            showError(timeEl, false);
        }

        if (hasErrors) return;

        // Perform mock API submission loading
        submitBtn.disabled = true;
        btnText.textContent = "Processing reservation...";
        spinner.classList.remove('hidden');

        setTimeout(() => {
            // Mock reservation completion success
            submitBtn.disabled = false;
            btnText.textContent = "Confirm Table Reservation";
            spinner.classList.add('hidden');
            
            // Format reservation date elegantly for receipt
            const dateObj = new Date(dateEl.value);
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);

            // Populate booking modal details
            document.getElementById('sum-name').textContent = nameEl.value;
            document.getElementById('sum-datetime').textContent = `${formattedDate} at ${timeEl.value}`;
            document.getElementById('sum-guests').textContent = guestsEl.value === '1' ? '1 Person' : `${guestsEl.value} People`;
            document.getElementById('sum-email').textContent = emailEl.value;
            
            // Generate a random confirmation number
            const codeNum = Math.floor(10000 + Math.random() * 90000);
            document.getElementById('sum-code').textContent = `#RST-${codeNum}`;

            // Open booking success modal
            modalOverlay.classList.add('active');

            // Reset form fields
            bookingForm.reset();
        }, 1500);
    });

    // Close Modal Functions
    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    modalClose.addEventListener('click', closeModal);
    modalDismiss.addEventListener('click', closeModal);
    
    // Close modal if user clicks on backdrop blur area
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    /* ==========================================================================
       NEWSLETTER CAPTURE
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const originalText = input.placeholder;
        
        input.disabled = true;
        input.value = "Subscription Successful!";
        input.style.color = '#c5a880';
        newsletterForm.querySelector('button').disabled = true;

        setTimeout(() => {
            input.disabled = false;
            input.value = "";
            input.style.color = '';
            input.placeholder = originalText;
            newsletterForm.querySelector('button').disabled = false;
        }, 3000);
    });

});
