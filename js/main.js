/**
 * main.js — Nav, mobile menu, page loader, timecode
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- DEVICE TYPE DETECTION & DISPLAY ---- */
  const deviceStatus = document.getElementById('device-status');
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                   || (window.matchMedia("(max-width: 860px)").matches && ('ontouchstart' in window || navigator.maxTouchPoints > 0));

  if (isMobile) {
    document.body.classList.add('device-mobile');
    if (deviceStatus) deviceStatus.textContent = 'MOBILE_MODE';
  } else {
    document.body.classList.add('device-desktop');
    if (deviceStatus) deviceStatus.textContent = 'DESKTOP_MODE';
  }

  /* ---- PAGE LOADER ---- */
  const loader = document.getElementById('page-loader');
  if (loader) {
    const loaderBar = loader.querySelector('.loader-bar');
    if (loaderBar) {
      // Bar animation starts on next frame
      requestAnimationFrame(() => {
        loaderBar.style.width = '100%';
      });
    }

    // Hide loader after a delay, then remove from DOM after transition
    const hideLoader = () => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });
    };
    // Set a timeout to start the hiding process
    setTimeout(hideLoader, 1600);
  }

  /* ---- STICKY HEADER SHADOW ---- */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ---- MOBILE MENU ---- */
  const menuBtn  = document.getElementById('menuBtn');
  const navlinks = document.getElementById('navlinks');
  if (menuBtn && navlinks) {
    menuBtn.addEventListener('click', () => {
      navlinks.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });

    navlinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navlinks.classList.remove('open');
        menuBtn.classList.remove('open');
      });
    });
  }

  /* ---- TIMECODE COUNTER (requestAnimationFrame) ---- */
  const tc = document.getElementById('timecode');
  if (tc) {
    let frame = 0;
    const fps = 24;
    const frameDuration = 1000 / fps;
    let lastTime = 0;

    const pad = (n) => String(n).padStart(2, '0');

    function updateCounter(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= frameDuration) {
        lastTime = timestamp - (elapsed % frameDuration);
        frame++;

        const f = frame % fps;
        const totalSec = Math.floor(frame / fps);
        const s = totalSec % 60;
        const m = Math.floor(totalSec / 60) % 60;
        const h = Math.floor(totalSec / 3600);
        tc.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
      }
      requestAnimationFrame(updateCounter);
    }
    requestAnimationFrame(updateCounter);
  }

});
