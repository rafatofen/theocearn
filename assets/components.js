/* ═══════════════════════════════════════════════════════
   VILLA OCEARN — components.js
   Injects shared nav + footer into every page.
   Add <div id="nav-mount"></div> and <div id="footer-mount"></div>
   to each HTML file, then <script src="assets/components.js"></script>
   ═══════════════════════════════════════════════════════ */

(function () {
  /* ── Detect current page for active nav link ── */
  const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  const isPage = (p) => path === p || (p === 'index.html' && (path === '' || path === '/'));

  /* ── NAV HTML ── */
  const navHTML = `
<nav id="mainNav">
  <a class="nav-logo" href="index.html">Villa Ocearn</a>
  <ul class="nav-links">
    <li><a href="about.html"    ${isPage('about.html')    ? 'class="active"' : ''}>About</a></li>
    <li><a href="the-villa.html" ${isPage('the-villa.html') ? 'class="active"' : ''}>The Villa</a></li>
    <li><a href="location.html" ${isPage('location.html') ? 'class="active"' : ''}>Location</a></li>
    <li><a href="enquire.html"  class="nav-cta-link ${isPage('enquire.html') ? 'active' : ''}"
           ${isPage('enquire.html') ? 'class="nav-cta-link active"' : 'class="nav-cta-link"'}>Enquire</a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <a href="about.html">About</a>
  <a href="the-villa.html">The Villa</a>
  <a href="location.html">Location</a>
  <a href="enquire.html">Enquire</a>
  <span class="m-loc">Kerobokan · Bali · Indonesia</span>
</div>`;

  /* ── FOOTER HTML ── */
  const footerHTML = `
<footer>
  <span class="foot-logo">Villa Ocearn</span>
  <ul class="foot-nav">
    <li><a href="about.html">About</a></li>
    <li><a href="the-villa.html">The Villa</a></li>
    <li><a href="location.html">Location</a></li>
    <li><a href="enquire.html">Enquire</a></li>
  </ul>
  <div class="foot-meta">
    <span class="foot-copy">© 2025 Villa Ocearn · Kerobokan, Bali</span>
    <span class="foot-credit">Developed by <a href="https://rafaelthofehrn.com" target="_blank" rel="noopener">Rafael Thofehrn</a></span>
  </div>
</footer>`;

  /* ── LIGHTBOX HTML ── */
  const lightboxHTML = `
<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose">✕ Close</button>
  <img class="lb-img" id="lbImg" src="" alt="">
  <div class="lb-nav">
    <button class="lb-btn" id="lbPrev">← Prev</button>
    <button class="lb-btn" id="lbNext">Next →</button>
  </div>
  <span class="lb-ct" id="lbCt"></span>
</div>`;

  /* ── Mount ── */
  const navMount = document.getElementById('nav-mount');
  const footerMount = document.getElementById('footer-mount');
  if (navMount) navMount.innerHTML = navHTML;
  if (footerMount) footerMount.innerHTML = footerHTML;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  /* ── NAV: transparent on hero ── */
  function updateNav() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    const hero = document.querySelector('.hero');
    if (hero && window.scrollY < 60) nav.classList.add('on-hero');
    else nav.classList.remove('on-hero');
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Hamburger ── */
  document.addEventListener('click', function (e) {
    const hb = document.getElementById('hamburger');
    const mm = document.getElementById('mobileMenu');
    if (e.target.closest('#hamburger')) {
      hb.classList.toggle('open');
      mm.classList.toggle('open');
      document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
    } else if (mm && mm.classList.contains('open') && !e.target.closest('.mobile-menu')) {
      hb.classList.remove('open');
      mm.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.1 });
  function initReveal() {
    document.querySelectorAll('.reveal, .stat').forEach((el, i) => {
      if (el.classList.contains('stat')) el.style.transitionDelay = (i % 4 * 0.1) + 's';
      io.observe(el);
    });
  }

  /* ── Lightbox ── */
  let lbItems = [], lbIdx = 0;
  function openLb(srcs, idx) {
    lbItems = srcs; lbIdx = idx;
    const img = document.getElementById('lbImg');
    const ct = document.getElementById('lbCt');
    img.src = lbItems[lbIdx];
    ct.textContent = (lbIdx + 1) + ' / ' + lbItems.length;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbStep(dir) {
    lbIdx = (lbIdx + dir + lbItems.length) % lbItems.length;
    document.getElementById('lbImg').src = lbItems[lbIdx];
    document.getElementById('lbCt').textContent = (lbIdx + 1) + ' / ' + lbItems.length;
  }
  document.addEventListener('click', e => {
    if (e.target.id === 'lbClose' || e.target.id === 'lightbox') closeLb();
    if (e.target.id === 'lbPrev') lbStep(-1);
    if (e.target.id === 'lbNext') lbStep(1);
    const gi = e.target.closest('.gi');
    if (gi) {
      const block = gi.closest('[data-gallery]') || gi.closest('section') || gi.closest('.gsb') || document.body;
      const all = Array.from(block.querySelectorAll('.gi'));
      const srcs = all.map(it => it.dataset.src || it.querySelector('img').src);
      openLb(srcs, all.indexOf(gi));
    }
  });
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
  });

  /* ── Carousel (shared logic) ── */
  window.initCarousel = function (trackId, dotsId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track || !dotsWrap) return;
    const cards = track.querySelectorAll('.amenity-card');
    let idx = 0;
    const vis = () => window.innerWidth < 960 ? 1 : 3;
    const maxI = () => Math.max(0, cards.length - vis());
    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxI(); i++) {
        const d = document.createElement('div');
        d.className = 'cdot' + (i === idx ? ' active' : '');
        d.onclick = () => go(i);
        dotsWrap.appendChild(d);
      }
    }
    function go(n) {
      idx = Math.min(Math.max(n, 0), maxI());
      const w = cards[0].offsetWidth + 20;
      track.style.transform = `translateX(-${idx * w}px)`;
      dotsWrap.querySelectorAll('.cdot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    document.getElementById(prevId).onclick = () => go(idx > 0 ? idx - 1 : maxI());
    document.getElementById(nextId).onclick = () => go(idx < maxI() ? idx + 1 : 0);
    window.addEventListener('resize', () => { idx = 0; track.style.transform = ''; buildDots(); });
    buildDots();
  };

  /* ── Run reveal after DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

})();
