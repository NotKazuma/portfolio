/**
 * modal.js — Video modal open/close for the Showcase section
 */

document.addEventListener('DOMContentLoaded', () => {

  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalClose = document.getElementById('modalClose');
  const fallbackLink = document.getElementById('modalFallbackLink');

  if (!videoModal || !modalIframe || !modalClose) {
    console.error('Modal elements not found. Aborting modal script.');
    return;
  }

  const modalOverlay = videoModal.querySelector('.modal-overlay');
  let activeElementBeforeModal = null;

  function openVideo(videoId, triggerEl) {
    activeElementBeforeModal = triggerEl || document.activeElement;
    modalIframe.src = `https://drive.google.com/file/d/${videoId}/preview`;

    if (fallbackLink) {
      fallbackLink.href = `https://drive.google.com/file/d/${videoId}/view?usp=sharing`;
    }

    document.body.style.overflow = 'hidden';
    videoModal.classList.add('open');

    // Focus on the close button after the transition for accessibility
    videoModal.addEventListener('transitionend', () => {
      modalClose.focus();
    }, { once: true });
  }

  function closeVideo() {
    videoModal.classList.remove('open');
    document.body.style.overflow = '';

    // Stop the video by clearing the iframe src
    modalIframe.src = '';

    if (activeElementBeforeModal) {
      activeElementBeforeModal.focus();
    }
  }

  // Attach event listeners to project cards
  document.querySelectorAll('.project-card[data-video-id]').forEach(card => {
    const videoId = card.getAttribute('data-video-id');
    if (!videoId) return;

    const thumb = card.querySelector('.thumb-container');
    const playButton = card.querySelector('.play-trigger');

    if (thumb) {
      thumb.addEventListener('click', (e) => openVideo(videoId, e.currentTarget));
    }
    if (playButton) {
      playButton.addEventListener('click', (e) => {
        e.preventDefault();
        openVideo(videoId, e.currentTarget);
      });
    }
  });

  // Listeners for closing the modal
  if(modalClose) modalClose.addEventListener('click', closeVideo);
  if(modalOverlay) modalOverlay.addEventListener('click', closeVideo);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) {
      closeVideo();
    }
  });

});
