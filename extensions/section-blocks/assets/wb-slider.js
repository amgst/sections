document.querySelectorAll('[data-wb-slider]').forEach(function (root) {
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.wb-slider__tab'));
  var slides = Array.prototype.slice.call(root.querySelectorAll('.wb-slider__slide'));
  var prevBtn = root.querySelector('[data-slide-prev]');
  var nextBtn = root.querySelector('[data-slide-next]');
  var status = root.querySelector('.wb-slider__sr-status');
  if (!tabs.length || !slides.length) return;

  var current = 0;
  var timer = null;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index, announce) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === current);
      tab.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    if (announce && status) {
      status.textContent = 'Slide ' + (current + 1) + ' of ' + slides.length + ': ' + slides[current].getAttribute('aria-label');
    }
  }

  function goTo(index) {
    show(index, true);
    restartAutoplay();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      goTo(i);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { goTo(current - 1); }
    else if (e.key === 'ArrowRight') { goTo(current + 1); }
  });

  var autoplayEnabled = root.dataset.autoplay === 'true' && slides.length > 1 && !reducedMotion;
  var speed = parseInt(root.dataset.autoplaySpeed, 10) || 6000;

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function startAutoplay() {
    if (!autoplayEnabled || timer || document.hidden) return;
    timer = setInterval(function () { show(current + 1, true); }, speed);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (autoplayEnabled) {
    startAutoplay();
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
  }
});
