(function () {
  var $ = function (q, r) { return (r || document).querySelector(q); };
  var $$ = function (q, r) { return Array.prototype.slice.call((r || document).querySelectorAll(q)); };
  var safe = function (f) { try { return f(); } catch (e) { return null; } };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header takes the colours of the chapter beneath it */
  var top = $('#top'), chs = $$('.ch, .foot, .faq .band.head');
  function paintHeader() {
    var y = 70, cur = chs[0];
    chs.forEach(function (c) { var r = c.getBoundingClientRect(); if (r.top <= y && r.bottom > y) cur = c; });
    if (!cur) return; var cs = getComputedStyle(cur), hb = cs.getPropertyValue('--hb').trim(), hi = cs.getPropertyValue('--hi').trim();
    if (hb) { top.style.setProperty('--hb', hb); top.style.setProperty('--hi', hi); }
  }
  paintHeader(); window.addEventListener('scroll', paintHeader, { passive: true }); window.addEventListener('resize', paintHeader);

  /* menu */
  var bg = $('.burger'), nav = $('#nav');
  /* theme: dark by default, remembered */
  var root = document.documentElement; var savedT = safe(function () { return localStorage.getItem('hx_theme'); }); if (savedT) root.dataset.theme = savedT;
  var tb = $('#themeBtn'); if (tb) tb.onclick = function () { var n = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = n; safe(function () { localStorage.setItem('hx_theme', n); }); };
  /* a quiet field of stars behind the page */
  (function () { if (reduce) return; var c = document.createElement('canvas'); c.className = 'stars'; c.setAttribute('aria-hidden', 'true'); document.body.prepend(c); var x = c.getContext('2d'), W, H, pts = []; function size() { W = c.width = innerWidth; H = c.height = innerHeight; pts = []; var n = Math.round(W * H / 14000); for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + .3, p: Math.random() * 6.28, s: .4 + Math.random() * 1.2, c: Math.random() < .2 ? '227,196,138' : Math.random() < .5 ? '140,150,255' : '255,255,255' }); } size(); addEventListener('resize', size); var t0 = 0; function tick(t) { x.clearRect(0, 0, W, H); for (var i = 0; i < pts.length; i++) { var q = pts[i], a = .25 + .55 * Math.abs(Math.sin(t / 1000 * q.s + q.p)); x.fillStyle = 'rgba(' + q.c + ',' + a + ')'; x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.283); x.fill(); } requestAnimationFrame(tick); } requestAnimationFrame(tick); })();
  if (bg) bg.onclick = function () { var on = nav.classList.toggle('on'); bg.setAttribute('aria-expanded', on); };

  /* entrances: heading, then text, then picture, staggered; content stays visible without script */
  var rv = $$('.ch > *:not(.cta-row), .tile, .inset > *, .postlist a, .lessons li').filter(function (e) { return !e.closest('.faq') && !e.classList.contains('acc') && !e.closest('.film'); });
  rv.forEach(function (e, i) { e.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .08 });
    var k = 0, last = null;
    rv.forEach(function (e) { var p = e.parentNode; if (p !== last) { k = 0; last = p; } e.style.setProperty('--d', (k++ * 80) + 'ms'); io.observe(e); });
    setTimeout(function () { rv.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < innerHeight) e.classList.add('in'); }); }, 50);
  } else rv.forEach(function (e) { e.classList.add('in'); });

  /* accordion */
  $$('.acc').forEach(function (acc) {
    var ps = $$('.p', acc);
    ps.forEach(function (p) { p.onclick = function () { ps.forEach(function (q) { q.setAttribute('aria-expanded', q === p); }); }; p.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); } }; });
  });

  /* cookies */
  var ck = $('#cookie'), dlgEl = $('#filmDlg');
  var willIntro = false;
  function maybeCookie() { if (!ck) return; var got = safe(function () { return localStorage.getItem('hx_cookies'); }); if (!got && !(dlgEl && dlgEl.classList.contains('on'))) ck.classList.add('on'); }
  if (ck) {
    if (!willIntro) setTimeout(maybeCookie, 900);
    $$('[data-ck]', ck).forEach(function (b) { b.onclick = function () { safe(function () { localStorage.setItem('hx_cookies', b.dataset.ck); }); ck.classList.remove('on'); }; });
    $$('[data-cookie-reset]').forEach(function (b) { b.onclick = function () { safe(function () { localStorage.removeItem('hx_cookies'); }); ck.classList.add('on'); }; });
  }

  /* film dialog */
  var dlg = $('#filmDlg'), fh = $('#filmHost'), cur = null;
  window.openFilm = function (id, opt) {
    if (!dlg || !window.FILMS || !FILMS[id]) return; $('#filmTitle').textContent = FILMS[id].title; dlg.classList.add('on'); document.body.style.overflow = 'hidden';
    cur = new Film(fh, FILMS[id], { autoplay: true, skip: true, sound: !(opt && opt.silent), onskip: closeFilm, onend: (opt && opt.onend) || null });
    $('#filmClose').focus();
  };
  window.closeFilm = function () { if (!dlg) return; if (cur) cur.pause(); cur = null; fh.innerHTML = ''; dlg.classList.remove('on'); document.body.style.overflow = ''; safe(function () { sessionStorage.setItem('hx_intro_seen', '1'); }); maybeCookie(); };
  if ($('#filmClose')) { $('#filmClose').onclick = closeFilm; document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeFilm(); }); }
  $$('[data-film]').forEach(function (b) { b.onclick = function (e) { e.preventDefault(); openFilm(b.dataset.film); }; });
  /* inline films live in a frame of their own, so the page and the film stay separate documents */
  var base = (document.body.dataset.page ? '../' : '');
  $$('[data-film-inline]').forEach(function (h) {
    var f = document.createElement('iframe'); f.src = base + 'film.html?f=' + h.dataset.filmInline; f.title = h.getAttribute('aria-label') || 'Film'; f.setAttribute("allowfullscreen", ""); f.setAttribute("allow", "autoplay"); f.loading = 'lazy'; f.style.cssText = 'width:100%;border:0;display:block;background:#0C1A33;aspect-ratio:16/9.55'; h.appendChild(f);
  });
  window.addEventListener('message', function (e) { if (e.data && e.data.hxFilmH) $$('iframe').forEach(function (f) { if (f.contentWindow === e.source) { f.style.aspectRatio = 'auto'; f.style.height = e.data.hxFilmH + 'px'; } }); });
  /* the opening film plays once per visit on the home page */
  if (willIntro) setTimeout(function () { openFilm('intro'); }, 1800);

  /* bonus calculator */
  var rg = $('#calcRange');
  if (rg) {
    var fmt = function (n) { return '€' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 }); };
    var mc = $('#calcMentor');
    var upd = function () {
      var inv = +rg.value, b = Math.min(inv * .1, 50), m = mc.checked ? 25 : 0;
      $('#calcInv').textContent = fmt(inv); $('#calcB1').textContent = fmt(b); $('#calcB2').textContent = fmt(m); $('#calcTot').textContent = fmt(b + m);
      $('#calcNote').textContent = b >= 50 ? 'You have reached the yearly cap of €50.' : 'Every €100 you invest earns €10, up to €50 a year.';
    };
    rg.oninput = mc.onchange = upd; upd();
  }

  /* booking */
  var bk = $('#bookForm');
  if (bk) {
    var days = $('#bkDays'), slots = $('#bkSlots'), selDay = null, selSlot = null;
    var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d0 = new Date(); d0.setDate(d0.getDate() + 1); var list = [];
    while (list.length < 10) { if (d0.getDay() !== 0 && d0.getDay() !== 6) list.push(new Date(d0)); d0.setDate(d0.getDate() + 1); }
    var times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:30', '18:00'];
    list.forEach(function (d, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'day'; b.setAttribute('aria-pressed', 'false'); b.innerHTML = names[d.getDay()] + '<br>' + d.getDate() + ' ' + mon[d.getMonth()];
      b.onclick = function () {
        $$('.day', days).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); selDay = b.textContent.replace(/([a-z])(\d)/i, '$1 $2'); selSlot = null; slots.innerHTML = '';
        times.forEach(function (tm, j) { if ((i + j) % 4 === 3) return; var s = document.createElement('button'); s.type = 'button'; s.className = 'slot'; s.textContent = tm; s.setAttribute('aria-pressed', 'false'); s.onclick = function () { $$('.slot', slots).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); s.setAttribute('aria-pressed', 'true'); selSlot = tm; }; slots.appendChild(s); });
      };
      days.appendChild(b);
    });
    bk.onsubmit = function (e) {
      e.preventDefault(); var msg = $('#bkMsg');
      if (!selDay || !selSlot) { msg.textContent = 'Please pick a day and a time.'; msg.focus(); return; }
      var f = new FormData(bk), kind = f.get('kind');
      var subject = encodeURIComponent('Humanoya: ' + kind + ' on ' + selDay + ' at ' + selSlot);
      var body = encodeURIComponent('Hello Humanoya,\n\nI would like to book: ' + kind + '\nWhen: ' + selDay + ' at ' + selSlot + '\nName: ' + f.get('name') + '\nEmail: ' + f.get('email') + '\n\n' + (f.get('note') || ''));
      $('#bkDone').hidden = false; $('#bkDoneTxt').textContent = f.get('name') + ', your request for ' + selDay + ' at ' + selSlot + ' is ready.'; $('#bkMail').href = 'mailto:hello@humanoya.example?subject=' + subject + '&body=' + body; bk.hidden = true; $('#bkDone').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  }

  /* newsletter / mailto forms */
  $$('form[data-mailto]').forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); var m = new FormData(f).get('email'); location.href = 'mailto:hello@humanoya.example?subject=' + encodeURIComponent(f.dataset.mailto) + '&body=' + encodeURIComponent('Please add ' + m + ' to the list.'); }; });
})();

/* hero film controls: the film runs in its own frame, these buttons talk to it */
(function () {
  var fr = document.getElementById('heroFilm'); if (!fr) return;
  var snd = document.getElementById('hfSound'), pz = document.getElementById('hfPause'), tr = document.getElementById('hfTr'), tx = document.getElementById('transcript');
  var st = { playing: true, sound: false };
  function send(m) { try { fr.contentWindow.postMessage(m, '*'); } catch (e) { } }
  function paint() { snd.textContent = st.sound ? 'Mute' : 'Watch with sound'; pz.textContent = st.playing ? 'Pause' : 'Play'; pz.setAttribute('aria-label', st.playing ? 'Pause the film' : 'Play the film'); }
  window.addEventListener('message', function (e) { if (e.data && e.data.hxFilmState) { st = e.data.hxFilmState; paint(); } });
  snd.onclick = function () { if (st.sound) send({ hx: 'sound', on: false }); else send({ hx: 'restart-sound' }); };
  pz.onclick = function () { send({ hx: 'toggle' }); };
  tr.onclick = function () { var open = tx.hidden; tx.hidden = !open; tr.setAttribute('aria-expanded', open); tr.textContent = open ? 'Hide the transcript' : 'Read the transcript'; };
  paint();
})();
