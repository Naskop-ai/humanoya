(function () {
  var HX = window.HX, $ = function (q, r) { return (r || document).querySelector(q); }, $$ = function (q, r) { return Array.prototype.slice.call((r || document).querySelectorAll(q)); };
  var KEY = 'hx_state_v1';
  var DEF = { name: 'Camille', email: 'camille@example.com', mods: [1, 2], quiz: null, week: 0, alloc: { world: 50, green: 20, bonds: 20, cash: 10 }, hist: [10000], elder: { name: 'Odile', rel: 'Grandmother', status: 'invited', code: 'CAMILLE-7K2P' }, mode: 'family', tour: false, monabanq: true, follow: 0 };
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) return Object.assign({}, DEF, s); } catch (e) { } return JSON.parse(JSON.stringify(DEF)); }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  window.HXS = { get: function () { return S; }, save: save, reset: function () { try { localStorage.removeItem(KEY); } catch (e) { } S = load(); } };
  var eur = function (n, d) { return '€' + n.toLocaleString('en-GB', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  var dur = function (m) { var h = Math.floor(m / 60), r = Math.round(m % 60); return h ? h + ' h ' + (r < 10 ? '0' : '') + r : r + ' min'; };
  var quizPassed = function () { return S.quiz && S.quiz.score >= 7; };
  var minutes = function () { return S.mods.length * 10 + S.week * 22.5 + (quizPassed() ? 30 : 0); };
  var pcts = function () { return Math.round(minutes() / 180 * 100); };
  var toast = function (t) { var e = $('#toast'); if (!e) return; e.textContent = t; e.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(function () { e.classList.remove('on'); }, 2800); };
  var tod = function () { var h = new Date().getHours(); return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening'; };
  var nextMod = function () { for (var i = 0; i < HX.modules.length; i++) if (S.mods.indexOf(HX.modules[i].n) < 0) return HX.modules[i]; return null; };
  var elderWords = { none: 'Not invited', invited: 'Invited', accepted: 'Joined', kickoff: 'Kick-off booked', coffees: 'In coffees', done: 'Wrapped up' };
  var elderOrder = ['none', 'invited', 'accepted', 'kickoff', 'coffees', 'done'];

  /* returns for the virtual portfolio: simulated weekly moves in % */
  var R = { world: [1.2, -2.8, 0.9, 1.6], green: [1.0, -3.1, 1.2, 1.4], bonds: [0.2, 0.4, -0.1, 0.3], cash: [0.05, 0.05, 0.05, 0.05] };
  var NAMES = { world: 'World index ETF', green: 'Sustainable ETF', bonds: 'Bond fund', cash: 'Cash' };
  function value(week) { var v = 10000; for (var w = 0; w < week; w++) { var g = 0; for (var k in R) g += S.alloc[k] / 100 * R[k][w]; v *= 1 + g / 100; } return v; }
  var QS = [
    ['Which three questions will you ask your elder about your first mix?', 'What did you do with your first savings?', 'Was there a year you were afraid to lose money?', 'What would you do with a safety cushion?'],
    ['A fall of about 3%: what would your elder do?', 'Did you ever sell in a panic?', 'What helped you stay calm?'],
    ['Which fees did you pay, and which ones did you not notice?', 'Did anyone ever offer you something that looked too good?', 'Who do you ask before a big decision?'],
    ['What would you tell a younger version of yourself about money?', 'What surprised you about what I learned?', 'What would you like to try with me next?'],
  ];
  var CH = ['Choose your mix and explain why in one sentence.', 'The market falls: stay, sell or buy more? Write what you chose.', 'Compare the fees of the two ETFs and pick the cheaper one for the same job.', 'Review the four weeks with your elder and present your results.'];

  var page = document.body.dataset.page;
  var P = {};

  /* ----- auth ----- */
  P.login = function () {
    var tabs = $$('.tabs button'), forms = { login: $('#fLogin'), signup: $('#fSignup') };
    function show(k) { tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.t === k); }); for (var f in forms) forms[f].hidden = f !== k; }
    tabs.forEach(function (t) { t.onclick = function () { show(t.dataset.t); }; });
    show(location.hash === '#signup' ? 'signup' : 'login');
    forms.login.onsubmit = function (e) { e.preventDefault(); var em = $('#lEmail').value.trim(), pw = $('#lPass').value; if (!em || pw.length < 6) { $('#lErr').textContent = 'Enter your email and a password of at least 6 characters.'; return; } S.email = em; save(); location.href = 'dashboard.html'; };
    $('#demo').onclick = function () { window.HXS.reset(); S = load(); location.href = 'dashboard.html'; };
    forms.signup.onsubmit = function (e) { e.preventDefault(); var n = $('#sName').value.trim(), em = $('#sEmail').value.trim(), pw = $('#sPass').value; if (!n || !em || pw.length < 8) { $('#sErr').textContent = 'Please give your first name, an email and a password of at least 8 characters.'; return; } window.HXS.reset(); S = load(); S.name = n; S.email = em; S.mods = []; S.week = 0; S.hist = [10000]; S.quiz = null; S.tour = false; S.monabanq = false; S.elder = { name: '', rel: '', status: 'none', code: n.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) + '-7K2P' }; save(); location.href = 'connect.html'; };
  };
  P.connect = function () {
    $('#linkBtn').onclick = function () { S.monabanq = true; save(); $('#linkOk').hidden = false; $('#linkBtn').hidden = true; };
    if (S.monabanq && S.mods.length) { $('#linkOk').hidden = false; $('#linkBtn').hidden = true; }
  };

  /* ----- shell bits ----- */
  function shell() {
    $$('[data-name]').forEach(function (e) { e.textContent = S.name; });
    $$('[data-initial]').forEach(function (e) { e.textContent = S.name.charAt(0).toUpperCase(); });
    $$('[data-pct]').forEach(function (e) { e.textContent = pcts() + '%'; });
    $$('[data-bar]').forEach(function (e) { e.style.width = pcts() + '%'; });
    $$('[data-mins]').forEach(function (e) { e.textContent = dur(minutes()); });
    var mb = $('.menu-btn'), sd = $('.side'); if (mb) mb.onclick = function () { var on = sd.classList.toggle('on'); mb.setAttribute('aria-expanded', on); };
    $$('[data-logout]').forEach(function (e) { e.onclick = function (ev) { ev.preventDefault(); location.href = 'login.html'; }; });
    var gr = $('[data-greet]'); if (gr) gr.textContent = gr.dataset.greet.replace('{tod}', tod()).replace('{name}', S.name);
  }

  /* ----- dashboard ----- */
  P.dashboard = function () {
    var nm = nextMod(), w = S.week, v = value(w), g = (v / 10000 - 1) * 100;
    var line = nm ? 'Lesson ' + nm.n + ' is ten minutes away.' : w < 4 ? 'Week ' + (w + 1) + ' of your portfolio is waiting.' : !quizPassed() ? 'The final quiz is next.' : 'Your certificate is ready.';
    $('#greet').textContent = tod() + ', ' + S.name + '. ' + line;
    $('#today').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '. ' + pcts() + '% of your three hours done.';
    var el = S.elder;
    $('#tiles').innerHTML =
      '<div class="tile s3"><span class="l">Time learned</span><span class="v">' + dur(minutes()) + '</span><span class="c">of 3 h</span></div>' +
      '<div class="tile s3"><span class="l">Lessons done</span><span class="v">' + S.mods.length + ' of 6</span><span class="c">' + S.mods.length + ' badge' + (S.mods.length === 1 ? '' : 's') + ' earned</span></div>' +
      '<div class="tile s3"><span class="l">Virtual portfolio</span><span class="v">' + eur(Math.round(v)) + '</span><span class="c">Week ' + w + ' of 4, ' + (g >= 0 ? '+' : '') + g.toFixed(1) + '%</span></div>' +
      '<div class="tile s3"><span class="l">Your elder</span><span class="v">' + elderWords[el.status] + '</span><span class="c">' + (el.name ? esc(el.name) : 'Invite someone you trust') + '</span></div>';
    var nextHtml = nm ? '<a class="rowc" href="' + nm.slug + '.html"><span class="dot now">' + nm.n + '</span><span class="t">' + nm.title + '<small>' + nm.min + ' min · film, lesson and mini quiz</small></span><span class="pill now">Start</span></a>' :
      (w < 4 ? '<a class="rowc" href="project.html"><span class="dot now">P</span><span class="t">Virtual portfolio, week ' + (w + 1) + '<small>About 25 minutes</small></span><span class="pill now">Open</span></a>' : (!quizPassed() ? '<a class="rowc" href="quiz.html"><span class="dot now">Q</span><span class="t">Final quiz<small>30 minutes, pass mark 7 of 10</small></span><span class="pill now">Start</span></a>' : '<a class="rowc" href="certificate.html"><span class="dot done"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg></span><span class="t">Your certificate<small>Download or print</small></span><span class="pill done">Ready</span></a>'));
    $('#next').innerHTML = nextHtml + '<a class="rowc" href="#" data-tour><span class="dot">?</span><span class="t">Platform tour<small>One minute: how everything works</small></span><span class="pill">Watch</span></a>';
    $('#rewards').innerHTML = '<div class="rowc"><span class="t">Investment bonus<small>€10 per €100, up to €50 a year</small></span><span class="pill">Locked</span></div><div class="rowc"><span class="t">Buddy bonus<small>€25 after two months with your elder</small></span><span class="pill ' + (el.status === 'none' ? '' : 'now') + '">' + (el.status === 'none' ? 'Locked' : 'In progress') + '</span></div>';
    var items = HX.modules.map(function (m) { var d = S.mods.indexOf(m.n) >= 0; return [m.title, m.min + ' min', d ? 'Done' : (m === nm ? 'Next' : 'To do'), m.slug + '.html', d ? 'done' : (m === nm ? 'now' : ''), m.n]; });
    items.push(['Virtual portfolio', '1 h 30', w >= 4 ? 'Done' : (!nm ? 'Next' : (w ? w + ' of 4' : 'To do')), 'project.html', w >= 4 ? 'done' : (!nm ? 'now' : ''), 'P']);
    items.push(['Final quiz', '30 min', quizPassed() ? 'Passed' : 'To do', 'quiz.html', quizPassed() ? 'done' : '', 'Q']);
    $('#path').innerHTML = items.slice(0, 5).map(function (i) { return '<a class="rowc" href="' + i[3] + '"><span class="dot ' + i[4] + '">' + (i[4] === 'done' ? '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>' : i[5]) + '</span><span class="t">' + i[0] + '<small>' + i[1] + '</small></span><span class="pill ' + i[4] + '">' + i[2] + '</span></a>'; }).join('');
    var idx = elderOrder.indexOf(el.status);
    $('#elder').innerHTML = (el.name ? '<div class="rowc"><span class="dot done">' + esc(el.name.charAt(0)) + '</span><span class="t">' + esc(el.name) + '<small>' + esc(el.rel || 'Elder') + ' · ' + elderWords[el.status] + '</small></span></div>' : '<p style="margin:0 0 12px">You have not invited anyone yet. One link is all it takes.</p>') +
      '<div class="progress" aria-label="Sponsoring progress"><i style="width:' + Math.round(idx / 5 * 100) + '%"></i></div><p class="hint" style="margin:8px 0 14px">Invited, joined, kick-off, three coffees, wrap-up.</p><a class="btn alt" href="sponsor.html">' + (el.status === 'none' ? 'Invite an elder' : 'Open sponsoring') + '</a>';
    bindTour();
    if (!S.tour && !/tour=0/.test(location.search) && window.FILMS && FILMS.tour) setTimeout(function () { openFilm('tour', { silent: true }); S.tour = true; save(); }, 600);
  };
  function bindTour() { $$('[data-tour]').forEach(function (e) { e.onclick = function (ev) { ev.preventDefault(); if (window.FILMS && FILMS.tour) openFilm('tour'); }; }); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ----- path ----- */
  P.path = function () {
    var nm = nextMod();
    var rows = HX.modules.map(function (m) { var d = S.mods.indexOf(m.n) >= 0; return '<a class="rowc" href="' + m.slug + '.html"><span class="dot ' + (d ? 'done' : (m === nm ? 'now' : '')) + '">' + (d ? '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>' : m.n) + '</span><span class="t">' + m.title + '<small>' + m.summary + ' · ' + m.min + ' min</small></span><span class="pill ' + (d ? 'done' : (m === nm ? 'now' : '')) + '">' + (d ? 'Badge: ' + m.badge : (m === nm ? 'Next' : 'To do')) + '</span></a>'; }).join('');
    $('#lessons').innerHTML = rows;
    var w = S.week;
    $('#proj').innerHTML = '<a class="rowc" href="project.html"><span class="dot ' + (w >= 4 ? 'done' : (!nm ? 'now' : '')) + '">' + (w >= 4 ? '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>' : 'P') + '</span><span class="t">Virtual portfolio<small>Four weeks, about 1 h 30 · week ' + Math.min(w + 1, 4) + ' of 4</small></span><span class="pill ' + (w >= 4 ? 'done' : '') + '">' + (w >= 4 ? 'Done' : w + ' of 4') + '</span></a>' +
      '<a class="rowc" href="quiz.html"><span class="dot ' + (quizPassed() ? 'done' : '') + '">' + (quizPassed() ? '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>' : 'Q') + '</span><span class="t">Final quiz<small>30 minutes, pass mark 7 of 10' + (S.quiz ? ' · your best: ' + S.quiz.score + ' of 10' : '') + '</small></span><span class="pill ' + (quizPassed() ? 'done' : '') + '">' + (quizPassed() ? 'Passed' : 'To do') + '</span></a>' +
      '<a class="rowc" href="certificate.html"><span class="dot ' + (quizPassed() ? 'done' : '') + '">C</span><span class="t">Certificate<small>Unlocks when you pass the quiz</small></span><span class="pill ' + (quizPassed() ? 'done' : '') + '">' + (quizPassed() ? 'Ready' : 'Locked') + '</span></a>';
  };

  /* ----- module ----- */
  P.module = function () {
    var n = +document.body.dataset.mod, m = HX.modules[n - 1], done = S.mods.indexOf(n) >= 0;
    var fs = $$('.quiz fieldset'), btn = $('#qCheck'), res = $('#qRes'), nxt = $('#qNext');
    function mark() { if (S.mods.indexOf(n) < 0) { S.mods.push(n); S.mods.sort(); save(); } $('#donePill').className = 'pill done'; $('#donePill').textContent = 'Done'; nxt.hidden = false; }
    if (done) { $('#donePill').className = 'pill done'; $('#donePill').textContent = 'Done'; nxt.hidden = false; }
    btn.onclick = function () {
      var ok = 0, all = true;
      fs.forEach(function (f, i) { var q = m.quiz[i], c = f.querySelector('input:checked'), fb = f.querySelector('.fb'); if (!c) { all = false; fb.textContent = 'Choose an answer.'; fb.className = 'fb no'; return; } var right = +c.value === q.a; if (right) ok++; fb.textContent = (right ? 'Correct. ' : 'Not quite. ') + q.why; fb.className = 'fb ' + (right ? 'ok' : 'no'); });
      if (!all) { res.textContent = 'Answer every question to check.'; return; }
      res.textContent = ok + ' of ' + fs.length + (ok >= 2 ? '. Lesson complete.' : '. Read the lesson again and retry; you need two right answers.');
      if (ok >= 2) { mark(); toast('Badge earned: ' + m.badge); }
    };
    $('#markBtn').onclick = function () { mark(); toast('Lesson marked as done'); };
  };

  /* ----- project ----- */
  P.project = function () {
    var keys = ['world', 'green', 'bonds', 'cash'];
    function total() { return keys.reduce(function (a, k) { return a + S.alloc[k]; }, 0); }
    function drawAlloc() {
      $('#alloc').innerHTML = keys.map(function (k) { return '<div class="line"><label for="a_' + k + '">' + NAMES[k] + '</label><input type="range" id="a_' + k + '" min="0" max="100" step="5" value="' + S.alloc[k] + '"' + (S.week > 0 ? ' disabled' : '') + '><span class="pc" id="p_' + k + '">' + S.alloc[k] + '%</span></div>'; }).join('');
      keys.forEach(function (k) { $('#a_' + k).oninput = function () { S.alloc[k] = +this.value; $('#p_' + k).textContent = S.alloc[k] + '%'; upd(); }; });
      upd();
    }
    function upd() { var t = total(); $('#allocTot').textContent = t + '% allocated' + (t === 100 ? '' : (t < 100 ? ', ' + (100 - t) + '% left to place' : ', ' + (t - 100) + '% too much')); $('#allocTot').className = t === 100 ? 'ok' : 'no'; $('#advance').disabled = t !== 100 || S.week >= 4; save(); }
    function chart() {
      var pts = [], mx = 10000, mn = 10000; for (var w = 0; w <= S.week; w++) pts.push(value(w));
      pts.forEach(function (x) { mx = Math.max(mx, x); mn = Math.min(mn, x); }); var lo = Math.floor((mn - 80) / 50) * 50, hi = Math.ceil((mx + 80) / 50) * 50, W = 640, H = 220, pad = 50;
      var X = function (i) { return pad + i * ((W - pad - 16) / 4); }, Y = function (v) { return H - 28 - (v - lo) / (hi - lo) * (H - 52); };
      var path = pts.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ' ' + Y(v); }).join('');
      var grid = [lo, (lo + hi) / 2, hi].map(function (v) { return '<line x1="' + pad + '" x2="' + (W - 16) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#E3DCC8"/><text x="0" y="' + (Y(v) + 4) + '" font-size="12" fill="#55607A">' + Math.round(v).toLocaleString('en-GB') + '</text>'; }).join('');
      var xs = [0, 1, 2, 3, 4].map(function (i) { return '<text x="' + X(i) + '" y="' + (H - 6) + '" font-size="12" fill="#55607A" text-anchor="middle">W' + i + '</text>'; }).join('');
      $('#chart').innerHTML = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Portfolio value by week">' + grid + xs + '<path d="' + path + '" fill="none" stroke="#13284A" stroke-width="3" stroke-linejoin="round"/>' + pts.map(function (v, i) { return '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="4.5" fill="#B88D45"/>'; }).join('') + '</svg>';
    }
    function weekly() {
      var w = S.week, rows = keys.map(function (k) { var amt = 10000 * S.alloc[k] / 100, cum = 1; for (var i = 0; i < w; i++) cum *= 1 + R[k][i] / 100; return '<tr><td>' + NAMES[k] + '</td><td class="n">' + S.alloc[k] + '%</td><td class="n">' + eur(Math.round(amt * cum)) + '</td><td class="n">' + (w ? ((cum - 1) * 100 >= 0 ? '+' : '') + ((cum - 1) * 100).toFixed(1) + '%' : 'n/a') + '</td></tr>'; }).join('');
      $('#holdings').innerHTML = rows;
      $('#wk').textContent = w >= 4 ? 'All four weeks are done' : 'Week ' + (w + 1) + ' of 4';
      var i = Math.min(w, 3); $('#challenge').textContent = CH[i]; $('#askList').innerHTML = QS[i].map(function (q) { return '<li>' + q + '</li>'; }).join('');
      $('#val').textContent = eur(Math.round(value(w))); $('#advance').textContent = w >= 3 ? 'Finish week 4' : 'Play week ' + (w + 1); if (w >= 4) { $('#advance').disabled = true; $('#advance').textContent = 'Project complete'; }
    }
    $('#advance').onclick = function () { if (S.week < 4) { S.week++; S.hist.push(value(S.week)); save(); drawAlloc(); chart(); weekly(); toast(S.week >= 4 ? 'Project complete. Take the final quiz.' : 'Week played: ' + eur(Math.round(value(S.week)))); } };
    $('#resetP').onclick = function () { S.week = 0; S.hist = [10000]; save(); drawAlloc(); chart(); weekly(); };
    $$('[data-mix]').forEach(function (b) { b.onclick = function () { if (S.week > 0) return; var m = b.dataset.mix.split(',').map(Number); keys.forEach(function (k, i) { S.alloc[k] = m[i]; }); drawAlloc(); }; });
    drawAlloc(); chart(); weekly();
  };

  /* ----- quiz ----- */
  P.quiz = function () {
    var f = $('#finalQ'), qs = HX.finalQuiz;
    f.innerHTML = qs.map(function (q, i) { return '<fieldset><legend>' + (i + 1) + '. ' + q.q + '</legend>' + q.o.map(function (o, j) { return '<label><input type="radio" name="q' + i + '" value="' + j + '"> <span>' + o + '</span></label>'; }).join('') + '<div class="fb"></div></fieldset>'; }).join('');
    var secs = 30 * 60, tm = $('#timer'), h = setInterval(function () { secs--; if (secs < 0) { clearInterval(h); return; } tm.textContent = Math.floor(secs / 60) + ':' + ('0' + (secs % 60)).slice(-2); }, 1000);
    if (S.quiz) $('#last').textContent = 'Your best score so far: ' + S.quiz.score + ' of 10.';
    $('#qSubmit').onclick = function () {
      var ok = 0, all = true; $$('fieldset', f).forEach(function (fs, i) { var c = fs.querySelector('input:checked'), fb = fs.querySelector('.fb'); if (!c) { all = false; return; } var r = +c.value === qs[i].a; if (r) ok++; fb.textContent = (r ? 'Correct. ' : 'Not quite. ') + qs[i].why; fb.className = 'fb ' + (r ? 'ok' : 'no'); });
      var out = $('#qOut'); if (!all) { out.textContent = 'Please answer all ten questions.'; out.className = 'no'; return; }
      clearInterval(h); if (!S.quiz || ok > S.quiz.score) S.quiz = { score: ok, date: new Date().toISOString() }; save();
      out.className = ok >= 7 ? 'ok' : 'no'; out.innerHTML = ok >= 7 ? 'You scored ' + ok + ' of 10. You passed. <a href="certificate.html" class="link">Get your certificate</a>' : 'You scored ' + ok + ' of 10. The pass mark is 7. Review the lessons and try again.';
      out.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  };

  /* ----- certificate ----- */
  P.certificate = function () {
    var ok = quizPassed(), box = $('#certBox'), lock = $('#certLock');
    if (!ok) { box.hidden = true; lock.hidden = false; return; }
    lock.hidden = true; box.hidden = false; $('#certName').textContent = S.name; $('#certDate').textContent = new Date(S.quiz.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#certBadges').innerHTML = HX.modules.filter(function (m) { return S.mods.indexOf(m.n) >= 0; }).map(function (m) { return '<span>' + m.badge + '</span>'; }).join('');
    $('#print').onclick = function () { window.print(); };
  };

  /* ----- sponsor ----- */
  P.sponsor = function () {
    var el = S.elder, link = 'https://humanoya.example/join/' + (el.code || 'CAMILLE-7K2P');
    function render() {
      var idx = elderOrder.indexOf(el.status);
      $('#sStatus').innerHTML = elderOrder.slice(1).map(function (k, i) { var j = i + 1, state = idx > j ? 'done' : (idx === j ? 'now' : ''); var lbl = { invited: 'Invitation sent', accepted: 'Your elder joined', kickoff: 'Kick-off meeting booked (1 h)', coffees: 'Three weekly coffees', done: 'Wrap-up and certificate' }[k]; return '<div class="rowc"><span class="dot ' + state + '">' + (state === 'done' ? '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>' : j) + '</span><span class="t">' + lbl + '</span><span class="pill ' + state + '">' + (state === 'done' ? 'Done' : state === 'now' ? 'Now' : 'To come') + '</span></div>'; }).join('');
      $('#sName').textContent = el.name || 'your elder'; $('#linkTxt').value = link;
      var msg = 'Hi ' + (el.name || '') + ', I am doing a free course on saving and investing and I would love your experience alongside it. Could we have a coffee? This is the link: ' + link;
      $('#msgTxt').value = msg; $('#mail').href = 'mailto:?subject=' + encodeURIComponent('A coffee and a conversation about money?') + '&body=' + encodeURIComponent(msg); $('#wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
      $('#adv').disabled = idx >= 5; $('#adv').textContent = idx >= 5 ? 'All steps done' : 'Demo: move to the next step';
      $('#fol').style.width = Math.min(100, S.follow / 60 * 100) + '%'; $('#folTxt').textContent = Math.min(S.follow, 60) + ' of 60 days with your elder';
    }
    $('#invite').onsubmit = function (e) { e.preventDefault(); var f = new FormData(e.target); el.name = String(f.get('n')).trim(); el.rel = f.get('r'); if (el.status === 'none') el.status = 'invited'; S.elder = el; save(); render(); toast('Invitation ready for ' + el.name); };
    $('#cp').onclick = function () { var t = $('#linkTxt'); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand('copy'); } toast('Link copied'); };
    $('#adv').onclick = function () { var i = elderOrder.indexOf(el.status); if (i < 5) { el.status = elderOrder[i + 1]; S.follow = Math.min(60, S.follow + 20); save(); render(); } };
    $$('input[name=mode]').forEach(function (r) { r.checked = r.value === S.mode; r.onchange = function () { S.mode = r.value; save(); }; });
    if (el.name) { $('#invite').n.value = el.name; $('#invite').r.value = el.rel || 'Grandmother'; }
    render();
  };

  /* ----- rewards ----- */
  P.rewards = function () {
    var inv = 0, el = S.elder, mon = S.follow >= 60;
    $('#rwBody').innerHTML =
      '<tr><td><b>Certificate and badges</b><br><span class="hint">Free, for your CV</span></td><td>Finish the lessons and pass the quiz</td><td><span class="pill ' + (quizPassed() ? 'done' : (S.mods.length ? 'now' : '')) + '">' + (quizPassed() ? 'Earned' : S.mods.length + ' of 6 badges') + '</span></td><td class="n">Free</td></tr>' +
      '<tr><td><b>Investment bonus</b><br><span class="hint">Paid into your own account</span></td><td>€10 for every €100 you invest yourself, up to €50 a year</td><td><span class="pill">Not started</span></td><td class="n">Up to €50</td></tr>' +
      '<tr><td><b>Buddy bonus</b><br><span class="hint">For following your elder</span></td><td>Follow your elder for two months after the training</td><td><span class="pill ' + (mon ? 'done' : (el.status === 'none' ? '' : 'now')) + '">' + (mon ? 'Earned' : (el.status === 'none' ? 'Locked' : 'In progress')) + '</span></td><td class="n">€25</td></tr>';
  };

  /* ----- settings ----- */
  P.settings = function () {
    $('#setName').value = S.name; $('#setEmail').value = S.email;
    $('#saveP').onclick = function () { S.name = $('#setName').value.trim() || S.name; S.email = $('#setEmail').value.trim() || S.email; save(); shell(); toast('Saved'); };
    $('#resetDemo').onclick = function () { window.HXS.reset(); toast('Demo data reset'); setTimeout(function () { location.href = 'dashboard.html'; }, 600); };
    $('#doneDemo').onclick = function () { S.mods = [1, 2, 3, 4, 5, 6]; S.week = 4; S.hist = [10000, value(1), value(2), value(3), value(4)]; S.quiz = { score: 9, date: new Date().toISOString() }; S.follow = 60; S.elder.status = 'done'; if (!S.elder.name) { S.elder.name = 'Odile'; S.elder.rel = 'Grandmother'; } save(); toast('Everything marked as complete'); };
  };

  P.help = function () { bindTour(); $$('[data-film]').forEach(function (b) { b.onclick = function () { openFilm(b.dataset.film); }; }); };

  shell(); if (P[page]) P[page]();
  bindTour();
})();
