// Shared <dialog>-based image lightbox, used by the Gallery and CustomerStories
// blocks. Handles open/close, backdrop click, Escape, focus-restore, and
// (when prevSelector/nextSelector are given) prev/next navigation with an
// optional fade transition and caption/counter text.
function initDialogLightbox({
  dialogId,
  imageId,
  captionId,
  counterId,
  closeSelector,
  prevSelector,
  nextSelector,
  triggerSelector,
  indexAttr,
  slides,
  fade,
}) {
  const dialog = document.getElementById(dialogId);
  const img = document.getElementById(imageId);
  const caption = captionId ? document.getElementById(captionId) : null;
  const counter = counterId ? document.getElementById(counterId) : null;
  const closeBtn = dialog.querySelector(closeSelector);
  const prevBtn = prevSelector ? dialog.querySelector(prevSelector) : null;
  const nextBtn = nextSelector ? dialog.querySelector(nextSelector) : null;

  let current = 0;
  let opener = null;

  function apply() {
    img.src = slides[current].src;
    img.alt = slides[current].alt || '';
    if (caption) caption.textContent = slides[current].alt || '';
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  function show(idx, animate = false) {
    current = ((idx % slides.length) + slides.length) % slides.length;
    if (animate && fade) {
      img.classList.add('fade');
      setTimeout(() => {
        apply();
        img.classList.remove('fade');
      }, 180);
    } else {
      apply();
    }
  }

  document.querySelectorAll(triggerSelector).forEach(btn => {
    btn.addEventListener('click', () => {
      opener = btn;
      show(Number(btn.getAttribute(indexAttr)));
      dialog.showModal();
      closeBtn.focus();
    });
  });

  dialog.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', e => {
    if (prevBtn && e.key === 'ArrowLeft') show(current - 1, true);
    if (nextBtn && e.key === 'ArrowRight') show(current + 1, true);
    if (e.key === 'Escape') dialog.close();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1, true));
  if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1, true));
}
