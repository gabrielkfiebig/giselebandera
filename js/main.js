(function () {
  'use strict';

  var desktop = window.matchMedia('(min-width: 900px)');

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabbar [data-section]'));
  var sections = [];
  tabs.forEach(function (tab) {
    tab.dataset.section.split(' ').forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sections.push(el);
    });
  });
  sections.sort(function (a, b) {
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  function setCurrent(id) {
    tabs.forEach(function (tab) {
      if (tab.dataset.section.split(' ').indexOf(id) !== -1) tab.setAttribute('aria-current', 'true');
      else tab.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  function updateCurrent() {
    ticking = false;
    var line = window.innerHeight * 0.45;
    var current = sections.length ? sections[0].id : null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) current = s.id;
    });
    if (current) setCurrent(current);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateCurrent); }
  }, { passive: true });
  window.addEventListener('resize', updateCurrent);
  updateCurrent();

  var details = Array.prototype.slice.call(document.querySelectorAll('details.offer-card'));
  function syncDetails() {
    if (desktop.matches) details.forEach(function (d) { d.open = true; });
  }
  syncDetails();
  if (desktop.addEventListener) desktop.addEventListener('change', syncDetails);

  if ('serviceWorker' in navigator && /^https:|^http:\/\/localhost/.test(location.href)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
