document.querySelectorAll('[data-wb-slider]').forEach(function (root) {
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.wb-slider__tab'));
  var slides = Array.prototype.slice.call(root.querySelectorAll('.wb-slider__slide'));
  if (!tabs.length || !slides.length) return;

  var current = 0;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === current);
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      show(i);
    });
  });

  if (root.dataset.autoplay === 'true' && slides.length > 1) {
    var speed = parseInt(root.dataset.autoplaySpeed, 10) || 6000;
    setInterval(function () {
      show(current + 1);
    }, speed);
  }
});
