/**
 * modal.js — Video modal open/close for the Showcase section
 */

document.addEventListener('DOMContentLoaded', () => {

  const videoModal  = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalClose  = document.getElementById('modalClose');
  if (!videoModal) return;

  const modalOverlay = videoModal.querySelector('.modal-overlay');

  const fallbackLink = document.getElementById('modalFallbackLink');

  let activeElementBeforeModal = null;

  function openVideo(videoId, triggerEl) {
    activeElementBeforeModal = triggerEl || document.activeElement;
    modalIframe.src = `https://drive.google.com/file/d/${videoId}/preview`;
    if (fallbackLink) {
      fallbackLink.href = `https://drive.google.com/file/d/${videoId}/view?usp=sharing`;
    }
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalClose?.focus(), 100);
  }

  function closeVideo() {
    videoModal.classList.remove('open');
    modalIframe.src = '';
    document.body.style.overflow = '';
    if (activeElementBeforeModal) {
      activeElementBeforeModal.focus();
    }
  }

  // Attach to every project card
  document.querySelectorAll('.project-card').forEach(card => {
    const videoId = card.getAttribute('data-video-id');
    if (!videoId) return;

    card.querySelector('.thumb-container')?.addEventListener('click', (e) => openVideo(videoId, e.currentTarget));
    card.querySelector('.play-trigger')?.addEventListener('click', e => {
      e.preventDefault();
      openVideo(videoId, e.currentTarget);
    });
  });

  modalClose?.addEventListener('click', closeVideo);
  modalOverlay?.addEventListener('click', closeVideo);

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideo();
  });

});
