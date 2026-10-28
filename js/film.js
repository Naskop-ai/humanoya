/* Humanoya film engine. Films are plain data (scenes); every frame is a pure function of time, so the same
   spec plays live in the page, scrubs, and can be rendered to an mp4 frame by frame. */
(function (root) {
  var A = root.ART, C = A.C, W = 1280, H = 720;
  var TH = {
    navy: { bg: C.navy, ink: C.cream, ac: C.gold, ac2: C.goldL },
    deep: { bg: C.deep, ink: C.cream, ac: C.gold, ac2: C.goldL },
    cream: { bg: C.cream, ink: C.navy, ac: C.gold, ac2: C.navy },
    gold: { bg: C.gold, ink: C.navy, ac: C.navy, ac2: C.cream },
    blue: { bg: C.blue, ink: C.cream, ac: C.goldL, ac2: C.cream },
    sand: { bg: C.sand, ink: C.navy, ac: C.blue, ac2: C.gold },
  };
  var FS = .84;
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var P = function (t, a, d) { return cl((t - a) / d); };
  var eo = function (p) { return 1 - Math.pow(1 - p, 3); };
  var eio = function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var back = function (p) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var money = function (n) { return '€' + Math.round(n).toLocaleString('en-GB'); };

  function side(kind, th) {
    var s = '';
    if (kind === 'pair') s = A.wrap(A.thread(215, 180, 440, 180, 100, 8) + A.young({ x: 10, y: 40, s: .8 }) + A.elder({ x: 330, y: 40, s: .8 }), 620, 420);
    else if (kind === 'symbolon') s = A.wrap(A.symbolon({ x: 220, y: 200, s: 1.2, gap: 0 }), 440, 400);
    else if (kind === 'phone') s = A.wrap(A.phone({ x: 10, y: 10, s: 1.05 }), 260, 480);
    else if (kind === 'cert') s = A.wrap(A.certificate({ s: 1.1 }), 470, 330);
    else if (kind === 'column') s = A.wrap(A.column({ x: 10, y: 10, s: 1.9, c: th.ink, d: th.bg }), 390, 450);
    else if (kind === 'young') s = A.wrap(A.young({ s: 1.1 }), 330, 495);
    else if (kind === 'elder') s = A.wrap(A.elder({ s: 1.1 }), 330, 495);
    return s;
  }
  var SIDE_POS = { pair: [630, 200], symbolon: [770, 150], phone: [880, 120], cert: [700, 190], column: [820, 130], young: [820, 120], elder: [820, 120] };

  /* ---------- scene types: html(d, th) builds, upd(r, t, d, th) animates ---------- */
  var T = {};

  T.words = {
    html: function (d, th) {
      var sz = (d.size || 112) * FS, y = d.y || 170;
      return '<div style="position:absolute;left:80px;top:' + y + 'px;width:' + (d.side ? 640 : 1120) + 'px">' +
        d.lines.map(function (l) { var o = typeof l === 'string' ? { t: l } : l; return '<div class="ln" style="font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + (o.s || sz) + 'px;color:' + (o.c === 'ac' ? th.ac : o.c === 'ac2' ? th.ac2 : th.ink) + ';margin-bottom:8px">' + esc(o.t) + '</div>'; }).join('') + '</div>' +
        (d.sub ? '<div class="sub" style="position:absolute;left:80px;top:' + (d.suby || 520) + 'px;width:' + (d.side ? 560 : 820) + 'px;font-size:30px;line-height:1.3;color:' + th.ink + '">' + esc(d.sub) + '</div>' : '');
    },
    upd: function (r, t, d) {
      r.querySelectorAll('.ln').forEach(function (e, i) { var p = eo(P(t, .2 + i * .24, .65)); e.style.opacity = p; e.style.transform = 'translateY(' + ((1 - p) * 64) + 'px)'; });
      var s = r.querySelector('.sub'); if (s) { var p = eo(P(t, .3 + d.lines.length * .24, .6)); s.style.opacity = p; s.style.transform = 'translateY(' + ((1 - p) * 30) + 'px)'; }
    },
  };

  T.fig = {
    html: function (d, th) {
      return '<div class="fg" style="position:absolute;left:80px;top:' + (d.y || 150) + 'px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1;font-size:' + ((d.size || 300) * FS) + 'px;color:' + th.ac + '"></div>' +
        '<div class="fl" style="position:absolute;left:84px;top:' + (d.ly || 470) + 'px;width:' + (d.side ? 560 : 900) + 'px;font-size:38px;line-height:1.2;font-weight:700;color:' + th.ink + '">' + esc(d.label) + '</div>' +
        (d.sub ? '<div class="fs" style="position:absolute;left:84px;top:' + (d.suby || 590) + 'px;width:' + (d.side ? 560 : 900) + 'px;font-size:24px;color:' + th.ink + ';opacity:.85">' + esc(d.sub) + '</div>' : '');
    },
    upd: function (r, t, d) {
      var p = eo(P(t, .2, 1.8)), v = d.value * p, dec = d.dec || 0;
      r.querySelector('.fg').textContent = (d.pre || '') + v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, d.sep == null ? ',' : d.sep) + (d.suf || '');
      var a = r.querySelector('.fl'); var q = eo(P(t, .9, .6)); a.style.opacity = q; a.style.transform = 'translateY(' + ((1 - q) * 30) + 'px)';
      var b = r.querySelector('.fs'); if (b) { var z = eo(P(t, 1.5, .6)); b.style.opacity = z * .85; }
    },
  };

  T.list = {
    html: function (d, th) {
      return '<div class="ti" style="position:absolute;left:80px;top:' + (d.y || 110) + 'px;width:' + (d.side ? 640 : 1100) + 'px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + ((d.size || 84) * FS) + 'px">' + esc(d.title) + '</div>' +
        '<div style="position:absolute;left:80px;top:' + (d.iy || 300) + 'px;width:' + (d.side ? 660 : 1100) + 'px">' + d.items.map(function (it) {
          return '<div class="it" style="display:flex;gap:20px;align-items:flex-start;margin-bottom:' + (d.gap || 20) + 'px;font-size:' + (d.fs || 34) + 'px;line-height:1.2;font-weight:700"><span class="ck" style="flex:0 0 auto;width:40px;height:40px;background:' + th.ac + ';display:flex;align-items:center;justify-content:center;color:' + (th.ac === C.navy ? C.cream : C.navy) + ';font-size:26px;font-weight:600"><svg viewBox=\"0 0 16 16\" width=\"24\" height=\"24\"><path d=\"M3 8.5l3.2 3L13 4.5\" stroke=\"currentColor\" stroke-width=\"2.4\" fill=\"none\"/></svg></span><span>' + esc(it) + '</span></div>'; }).join('') + '</div>';
    },
    upd: function (r, t, d) {
      var ti = r.querySelector('.ti'), p0 = eo(P(t, .15, .6)); ti.style.opacity = p0; ti.style.transform = 'translateY(' + ((1 - p0) * 40) + 'px)';
      r.querySelectorAll('.it').forEach(function (e, i) { var p = eo(P(t, (d.t0 || .9) + i * (d.step || .85), .5)); e.style.opacity = p; e.style.transform = 'translateX(' + ((1 - p) * -50) + 'px)'; var c = e.querySelector('.ck'); c.style.transform = 'scale(' + back(P(t, (d.t0 || .9) + i * (d.step || .85) + .25, .4)) + ')'; });
    },
  };

  T.bars = {
    html: function (d, th) {
      var n = d.bars.length, bw = Math.min(150, Math.floor(680 / n) - 30);
      return '<div style="position:absolute;left:80px;top:90px;width:' + (d.side ? 640 : 1100) + 'px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + ((d.size || 76) * FS) + 'px">' + esc(d.title) + '</div>' +
        '<div style="position:absolute;left:80px;top:250px;width:1000px;height:360px">' + d.bars.map(function (b, i) {
          return '<div class="bw" style="position:absolute;left:' + (i * (bw + 40)) + 'px;bottom:44px;width:' + bw + 'px;height:300px"><div class="bb" data-v="' + b.v + '" style="position:absolute;left:0;bottom:0;width:100%;height:0;background:' + (b.c || th.ac) + '"></div><div class="bv" style="position:absolute;left:0;width:100%;text-align:center;font-weight:600;font-size:30px;bottom:0;color:' + th.ink + ';opacity:0">' + esc(b.t || b.v) + '</div></div>' +
            '<div style="position:absolute;left:' + (i * (bw + 40) - 20) + 'px;bottom:0;width:' + (bw + 40) + 'px;text-align:center;font-size:22px;font-weight:700;line-height:1.1">' + esc(b.l) + '</div>'; }).join('') + '</div>';
    },
    upd: function (r, t, d) {
      var mx = d.max || Math.max.apply(null, d.bars.map(function (b) { return b.v; }));
      r.querySelectorAll('.bb').forEach(function (e, i) { var p = eo(P(t, .6 + i * .35, .9)), h = 300 * (e.dataset.v / mx) * p; e.style.height = h + 'px'; var v = e.nextSibling; v.style.bottom = (h + 8) + 'px'; v.style.opacity = P(t, .9 + i * .35, .5); });
    },
  };

  T.growth = {
    html: function (d, th) {
      var s = d.series, w = 700, h = 290, mx = d.max;
      var paths = s.map(function (se, k) {
        var pts = se.pts.map(function (v, i) { return [i / (se.pts.length - 1) * w, h - v / mx * h]; });
        return '<path class="gp" d="M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + '" fill="none" stroke="' + se.c + '" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>';
      }).join('');
      var lab = s.map(function (se, k) { var y = h - se.pts[se.pts.length - 1] / mx * h; return '<div class="gl" style="position:absolute;left:' + (w + 16) + 'px;top:' + (y - 36) + 'px;width:300px;font-weight:700;font-size:24px;line-height:1.1;opacity:0;color:' + th.ink + '"><span style="color:' + se.c + ';font-weight:600;font-size:40px;letter-spacing:-0.02em;display:block">' + esc(se.end) + '</span>' + esc(se.l) + '</div>'; }).join('');
      return '<div style="position:absolute;left:80px;top:80px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + ((d.size || 72) * FS) + 'px">' + esc(d.title) + '</div>' +
        '<div style="position:absolute;left:80px;top:250px;width:' + (w + 330) + 'px;height:' + (h + 40) + 'px"><svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" style="overflow:visible"><path d="M0 ' + h + 'H' + w + '" stroke="' + th.ink + '" stroke-width="4" opacity=".5"/>' + paths + '</svg>' + lab + '<div style="position:absolute;left:0;top:' + (h + 12) + 'px;font-size:22px;font-weight:700">' + esc(d.x0) + '</div><div style="position:absolute;left:' + (w - 200) + 'px;top:' + (h + 12) + 'px;width:200px;text-align:right;font-size:22px;font-weight:700">' + esc(d.x1) + '</div></div>';
    },
    upd: function (r, t, d) {
      r.querySelectorAll('.gp').forEach(function (e, i) { e.style.strokeDashoffset = 1 - eo(P(t, .7 + i * .5, 2.2)); });
      r.querySelectorAll('.gl').forEach(function (e, i) { var p = eo(P(t, 3 + i * .5, .6)); e.style.opacity = p; e.style.transform = 'translateX(' + ((1 - p) * 30) + 'px)'; });
    },
  };

  T.timeline = {
    html: function (d, th) {
      var tot = d.segs.reduce(function (a, s) { return a + s.m; }, 0), x = 0;
      return '<div style="position:absolute;left:80px;top:90px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:84px">' + esc(d.title) + '</div>' +
        '<div style="position:absolute;left:80px;top:330px;width:1120px;height:150px">' + d.segs.map(function (s, i) {
          var w = Math.round(1120 * s.m / tot) - 8, l = Math.round(1120 * x / tot); x += s.m;
          return '<div class="sg" data-w="' + w + '" style="position:absolute;left:' + l + 'px;top:0;height:150px;width:0;background:' + s.c + ';color:' + (s.k || C.navy) + ';overflow:hidden;white-space:nowrap"><div style="padding:20px 22px;font-weight:600;font-size:' + (w > 400 ? 52 : 40) + 'px;letter-spacing:-0.02em;line-height:1">' + esc(s.t) + '</div></div>' +
            '<div class="sl" style="position:absolute;left:' + l + 'px;top:170px;width:' + w + 'px;font-size:24px;line-height:1.2;font-weight:700;opacity:0">' + esc(s.l) + '</div>'; }).join('') + '</div>';
    },
    upd: function (r, t) {
      r.querySelectorAll('.sg').forEach(function (e, i) { e.style.width = (e.dataset.w * eo(P(t, .5 + i * .6, .8))) + 'px'; });
      r.querySelectorAll('.sl').forEach(function (e, i) { e.style.opacity = eo(P(t, 1 + i * .6, .6)); });
    },
  };

  T.split = {
    html: function (d, th) {
      function col(c, x, bg, ink) { return '<div class="sp" style="position:absolute;left:' + x + 'px;top:150px;width:540px;height:470px;background:' + bg + ';color:' + ink + ';padding:34px"><div style="font-weight:600;letter-spacing:-0.02em;font-size:50px;line-height:.95;margin-bottom:22px">' + esc(c.title) + '</div>' + c.items.map(function (it) { return '<div class="si" style="font-size:28px;line-height:1.2;font-weight:700;margin-bottom:16px">' + esc(it) + '</div>'; }).join('') + '</div>'; }
      return '<div style="position:absolute;left:80px;top:46px;width:1100px;font-weight:600;letter-spacing:-0.02em;font-size:56px;line-height:1">' + esc(d.title) + '</div>' + col(d.a, 80, C.navy === th.bg ? C.gold : C.navy, C.navy === th.bg ? C.navy : C.cream) + col(d.b, 660, C.cream, C.navy);
    },
    upd: function (r, t) {
      r.querySelectorAll('.sp').forEach(function (e, i) { var p = eo(P(t, .3 + i * .4, .7)); e.style.opacity = p; e.style.transform = 'translateY(' + ((1 - p) * 70) + 'px)'; });
      r.querySelectorAll('.si').forEach(function (e, i) { var p = eo(P(t, 1.1 + i * .35, .5)); e.style.opacity = p; });
    },
  };

  T.logo = {
    html: function (d, th) {
      return '<img class="lg" src="' + (root.FILM_BASE || '') + 'img/logo.png" alt="" style="position:absolute;left:' + (d.x || 80) + 'px;top:' + (d.y || 100) + 'px;width:' + (d.w || 300) + 'px;height:' + (d.w || 300) + 'px;background:' + C.cream + '">' +
        '<div class="ln" style="position:absolute;left:' + (d.tx || 440) + 'px;top:' + (d.ty || 160) + 'px;width:760px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + ((d.size || 104) * FS) + 'px">' + esc(d.title) + '</div>' +
        (d.sub ? '<div class="sub" style="position:absolute;left:' + (d.tx || 440) + 'px;top:' + (d.suy || 470) + 'px;width:740px;font-size:32px;line-height:1.3;color:' + th.ink + '">' + esc(d.sub) + '</div>' : '') +
        (d.btn ? '<div class="bt" style="position:absolute;left:' + (d.tx || 440) + 'px;top:' + (d.by || 560) + 'px;background:' + th.ac + ';color:' + (th.ac === C.navy ? C.cream : C.navy) + ';font-weight:700;font-size:30px;padding:18px 30px">' + esc(d.btn) + '</div>' : '');
    },
    upd: function (r, t) {
      var l = r.querySelector('.lg'), p = back(P(t, .1, .8)); l.style.transform = 'scale(' + (.6 + .4 * p) + ')'; l.style.opacity = eo(P(t, .1, .4));
      var n = r.querySelector('.ln'), q = eo(P(t, .5, .7)); n.style.opacity = q; n.style.transform = 'translateY(' + ((1 - q) * 50) + 'px)';
      var s = r.querySelector('.sub'); if (s) { s.style.opacity = eo(P(t, 1.1, .6)); }
      var b = r.querySelector('.bt'); if (b) { var z = back(P(t, 1.8, .6)); b.style.opacity = eo(P(t, 1.8, .3)); b.style.transform = 'scale(' + (.8 + .2 * z) + ')'; }
    },
  };


  /* three boxes joined by arrows: a problem chain */
  T.flow = {
    html: function (d, th) {
      var n = d.items.length, w = Math.floor((1120 - (n - 1) * 70) / n);
      return '<div class="ti" style="position:absolute;left:80px;top:80px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + ((d.size || 84) * FS) + 'px">' + esc(d.title) + '</div>' +
        d.items.map(function (it, i) {
          var x = 80 + i * (w + 70);
          return '<div class="fx" style="position:absolute;left:' + x + 'px;top:210px;width:' + w + 'px;height:340px;background:' + (it.c || th.ac) + ';color:' + (it.k || C.navy) + ';padding:28px;font-weight:700;font-size:32px;line-height:1.15;display:flex;align-items:flex-end">' + esc(it.t) + '</div>' +
            (i < n - 1 ? '<div class="ar" style="position:absolute;left:' + (x + w + 8) + 'px;top:350px;width:54px;font-size:54px;font-weight:600;line-height:1;text-align:center">&rarr;</div>' : '');
        }).join('');
    },
    upd: function (r, t) {
      var ti = r.querySelector('.ti'), p0 = eo(P(t, .1, .6)); ti.style.opacity = p0; ti.style.transform = 'translateY(' + ((1 - p0) * 40) + 'px)';
      r.querySelectorAll('.fx').forEach(function (e, i) { var p = eo(P(t, .8 + i * 1.3, .7)); e.style.opacity = p; e.style.transform = 'translateY(' + ((1 - p) * 60) + 'px)'; });
      r.querySelectorAll('.ar').forEach(function (e, i) { e.style.opacity = eo(P(t, 1.5 + i * 1.3, .4)); });
    },
  };


  /* six medallions and what the team did */
  T.team = {
    html: function (d, th) {
      return '<div class="ti" style="position:absolute;left:80px;top:70px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:78px">' + esc(d.title) + '</div>' +
        '<div style="position:absolute;left:60px;top:230px;width:1160px;height:170px">' + d.names.map(function (n, i) {
          return '<div class="md" style="position:absolute;left:' + (i * 192) + 'px;top:0;width:190px;text-align:center"><div style="margin:0 auto 14px;width:112px;height:112px;border-radius:50%;background:' + C.cream + ';color:' + C.navy + ';display:flex;align-items:center;justify-content:center;font-weight:600;font-size:56px;letter-spacing:-0.02em">' + esc(n.charAt(0)) + '</div><div style="font-weight:700;font-size:24px">' + esc(n) + '</div></div>'; }).join('') + '</div>' +
        '<div style="position:absolute;left:80px;top:440px;width:1100px">' + d.items.map(function (it) {
          return '<div class="it" style="display:flex;gap:18px;align-items:center;margin-bottom:12px;font-size:32px;font-weight:700"><span class="ck" style="flex:0 0 auto;width:36px;height:36px;background:' + th.ac + ';color:' + C.navy + ';display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 16 16" width="22" height="22"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" stroke-width="2.4" fill="none"/></svg></span>' + esc(it) + '</div>'; }).join('') + '</div>';
    },
    upd: function (r, t) {
      var ti = r.querySelector('.ti'), p0 = eo(P(t, .1, .6)); ti.style.opacity = p0; ti.style.transform = 'translateY(' + ((1 - p0) * 40) + 'px)';
      r.querySelectorAll('.md').forEach(function (e, i) { var p = back(P(t, .5 + i * .22, .6)); e.style.opacity = eo(P(t, .5 + i * .22, .3)); e.style.transform = 'scale(' + (.6 + .4 * p) + ')'; });
      r.querySelectorAll('.it').forEach(function (e, i) { var p = eo(P(t, 2.2 + i * 1.2, .5)); e.style.opacity = p; e.style.transform = 'translateX(' + ((1 - p) * -40) + 'px)'; });
    },
  };

  /* donut with a legend: where the money goes */
  T.ring = {
    html: function (d, th) {
      var R = 150, CIR = 2 * Math.PI * R, tot = d.items.reduce(function (a, i) { return a + i.v; }, 0), off = 0;
      var segs = d.items.map(function (it) { var len = CIR * it.v / tot, s = '<circle class="rg" data-len="' + len + '" data-off="' + off + '" cx="0" cy="0" r="' + R + '" fill="none" stroke="' + it.c + '" stroke-width="70" stroke-dasharray="0 ' + CIR + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90)"/>'; off += len; return s; }).join('');
      return '<div class="ti" style="position:absolute;left:80px;top:60px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:64px">' + esc(d.title) + '</div>' +
        '<svg style="position:absolute;left:60px;top:170px" width="460" height="460" viewBox="-230 -230 460 460">' + segs + '<text x="0" y="12" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-weight="500" font-size="50" letter-spacing="-2" fill="' + th.ink + '">' + esc(d.center) + '</text></svg>' +
        '<div style="position:absolute;left:580px;top:190px;width:640px">' + d.items.map(function (it) {
          return '<div class="lg" style="display:flex;gap:18px;align-items:center;margin-bottom:22px"><span style="flex:0 0 auto;width:34px;height:34px;background:' + it.c + '"></span><span style="font-weight:600;font-size:40px;letter-spacing:-0.02em;min-width:170px">' + esc(it.a) + '</span><span style="font-size:26px;line-height:1.15;font-weight:700">' + esc(it.l) + '</span></div>'; }).join('') + '</div>';
    },
    upd: function (r, t) {
      var ti = r.querySelector('.ti'), p0 = eo(P(t, .1, .6)); ti.style.opacity = p0; ti.style.transform = 'translateY(' + ((1 - p0) * 40) + 'px)';
      r.querySelectorAll('.rg').forEach(function (e, i) { var p = eo(P(t, .8 + i * .9, .9)), len = +e.dataset.len, CIR = 2 * Math.PI * 150; e.setAttribute('stroke-dasharray', (len * p) + ' ' + CIR); });
      r.querySelectorAll('.lg').forEach(function (e, i) { var p = eo(P(t, 1.2 + i * .9, .5)); e.style.opacity = p; e.style.transform = 'translateX(' + ((1 - p) * 40) + 'px)'; });
    },
  };

  /* reward cards */
  T.cards = {
    html: function (d, th) {
      var n = d.items.length, w = Math.floor((1120 - (n - 1) * 14) / n);
      return '<div class="ti" style="position:absolute;left:80px;top:70px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:78px">' + esc(d.title) + '</div>' +
        d.items.map(function (it, i) {
          return '<div class="cd" style="position:absolute;left:' + (80 + i * (w + 14)) + 'px;top:230px;width:' + w + 'px;height:360px;background:' + C.cream + ';color:' + C.navy + ';padding:26px 18px;text-align:center"><div style="font-weight:600;font-size:60px;letter-spacing:-0.02em;line-height:1">' + esc(it.a) + '</div><div style="width:50px;height:6px;background:' + C.gold + ';margin:20px auto"></div><div style="font-weight:700;font-size:24px;line-height:1.2">' + esc(it.l) + '</div></div>'; }).join('');
    },
    upd: function (r, t) {
      var ti = r.querySelector('.ti'), p0 = eo(P(t, .1, .6)); ti.style.opacity = p0; ti.style.transform = 'translateY(' + ((1 - p0) * 40) + 'px)';
      r.querySelectorAll('.cd').forEach(function (e, i) { var p = back(P(t, .6 + i * .5, .6)); e.style.opacity = eo(P(t, .6 + i * .5, .3)); e.style.transform = 'translateY(' + ((1 - p) * 90) + 'px)'; });
    },
  };

  /* closing call to action: two buttons */
  T.cta = {
    html: function (d, th) {
      return '<img class="lg" src="' + (root.FILM_BASE || '') + 'img/logo.png" alt="" style="position:absolute;left:80px;top:90px;width:200px;height:200px;background:' + C.cream + '">' +
        '<div class="ln" style="position:absolute;left:80px;top:320px;width:1100px;font-family:Newsreader,Georgia,serif;font-weight:500;letter-spacing:-0.02em;line-height:1.02;font-size:' + ((d.size || 92) * FS) + 'px">' + d.lines.map(function (l) { return '<div>' + esc(l) + '</div>'; }).join('') + '</div>' +
        '<div class="bt" style="position:absolute;left:80px;top:' + (d.by || 560) + 'px;display:flex;gap:20px">' + d.btns.map(function (b, i) { return '<div style="background:' + (i ? C.cream : th.ac) + ';color:' + C.navy + ';font-weight:700;font-size:32px;padding:20px 34px">' + esc(b) + '</div>'; }).join('') + '</div>';
    },
    upd: function (r, t) {
      var l = r.querySelector('.lg'), p = back(P(t, .1, .8)); l.style.transform = 'scale(' + (.6 + .4 * p) + ')'; l.style.opacity = eo(P(t, .1, .4));
      var n = r.querySelector('.ln'), q = eo(P(t, .5, .7)); n.style.opacity = q; n.style.transform = 'translateY(' + ((1 - q) * 50) + 'px)';
      var b = r.querySelector('.bt'), z = back(P(t, 1.6, .6)); b.style.opacity = eo(P(t, 1.6, .3)); b.style.transform = 'scale(' + (.85 + .15 * z) + ')'; b.style.transformOrigin = '0 50%';
    },
  };

  /* screenshot in a browser frame, with a moving highlight box (used by the platform tour) */
  T.shot = {
    html: function (d, th) {
      var hl = (d.hl || []).map(function (h, i) { return '<div class="hl" style="position:absolute;left:' + h[0] + 'px;top:' + h[1] + 'px;width:' + h[2] + 'px;height:' + h[3] + 'px;border:5px solid ' + C.gold + ';opacity:0"></div>'; }).join('');
      return '<div style="position:absolute;left:80px;top:78px;width:340px;font-weight:600;letter-spacing:-0.02em;line-height:.92;font-size:56px" class="ti">' + esc(d.title) + '</div>' +
        '<div class="sub" style="position:absolute;left:80px;top:' + (d.suby || 330) + 'px;width:330px;font-size:26px;line-height:1.3">' + esc(d.text || '') + '</div>' +
        '<div class="fr" style="position:absolute;left:460px;top:70px;width:760px;height:540px;background:' + C.cream + ';overflow:hidden;border:6px solid ' + C.cream + '"><div style="height:30px;background:' + C.sand + '"></div><div style="position:relative;width:748px;height:496px;overflow:hidden"><img class="im" src="' + (root.FILM_BASE || '') + d.src + '" alt="" style="position:absolute;left:0;top:0;width:748px;transform-origin:' + (d.ox || '0 0') + '">' + hl + '</div></div>';
    },
    upd: function (r, t, d) {
      var ti = r.querySelector('.ti'), p = eo(P(t, .1, .6)); ti.style.opacity = p; ti.style.transform = 'translateX(' + ((1 - p) * -60) + 'px)';
      r.querySelector('.sub').style.opacity = eo(P(t, .5, .6));
      var f = r.querySelector('.fr'), q = eo(P(t, 0, .8)); f.style.opacity = q; f.style.transform = 'translateY(' + ((1 - q) * 80) + 'px)';
      var im = r.querySelector('.im'), z = d.zoom || 1; var zp = eio(P(t, 1.2, 1.6)); im.style.transform = 'scale(' + (1 + (z - 1) * zp) + ')';
      r.querySelectorAll('.hl').forEach(function (e, i) { e.style.opacity = eo(P(t, 1.6 + i * .5, .4)); e.style.transform = 'scale(' + (1.12 - .12 * back(P(t, 1.6 + i * .5, .5))) + ')'; });
    },
  };

  /* ---------- the engine ---------- */
  function build(spec) {
    var starts = [], t = 0;
    spec.scenes.forEach(function (s) { starts.push(t); t += s.dur; });
    return { starts: starts, total: t };
  }

  var SNDI = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="currentColor" stroke="currentColor" stroke-width="1.6"/></svg>';
  var PLAYI = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 3.5v17l14-8.5z" fill="currentColor"/></svg>', PAUSEI = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z" fill="currentColor"/></svg>', FSI = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>';
  function Film(host, spec, opt) {
    var self = this; opt = opt || {};
    this.spec = spec; var b = build(spec); this.starts = b.starts; this.total = b.total; this.t = 0; this.playing = false; this.cc = true; this.sound = !!opt.sound;
    host.innerHTML = '<div class="film"><div class="fstage"><div class="fscale"></div><div class="fcap" aria-live="off"></div><button class="fbig" aria-label="Play film" type="button"><svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M7 3.5v17l14-8.5z" fill="currentColor"/></svg></button></div>' +
      '<div class="fbar"><button class="fb fplay" type="button" aria-label="Play or pause">'+PLAYI+'</button><input class="fseek" type="range" min="0" max="1000" value="0" aria-label="Position in the film"><span class="ftime">0:00</span>' + (spec.audio ? '<button class="fb fsnd" type="button" aria-pressed="false" aria-label="Sound">' + SNDI + '</button>' : '') + '<button class="fb fcc" type="button" aria-pressed="true" aria-label="Captions">CC</button><button class="fb ffs" type="button" aria-label="Full screen">'+FSI+'</button>' + (opt.skip ? '<button class="fb fskip" type="button">Skip</button>' : '') + '</div></div>';
    this.host = host; this.stage = host.querySelector('.fstage'); this.sc = host.querySelector('.fscale'); this.cap = host.querySelector('.fcap');
    this.sc.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;transform-origin:0 0;overflow:hidden';
    this.nodes = spec.scenes.map(function (s) {
      var th = TH[s.theme || 'navy'], d = document.createElement('div');
      d.style.cssText = 'position:absolute;inset:0;background:' + th.bg + ';color:' + th.ink + ';font-family:\'Hanken Grotesk\',system-ui,sans-serif;display:none;overflow:hidden';
      var ty = T[s.type]; d.innerHTML = ty.html(s, th) + (s.side ? '<div class="sd" style="position:absolute;left:' + SIDE_POS[s.side][0] + 'px;top:' + (s.sidey || SIDE_POS[s.side][1]) + 'px">' + side(s.side, th) + '</div>' : '') + (s.extra ? s.extra(th) : '');
      self.sc.appendChild(d); return d;
    });
    var fit = function () { var w = self.stage.clientWidth; self.sc.style.transform = 'scale(' + (w / W) + ')'; self.stage.style.height = (w * H / W) + 'px'; };
    this.fit = fit; fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(this.stage); else window.addEventListener('resize', fit);

    this.audio = null;
    if (spec.audio) { var a = new Audio(); a.preload = 'auto'; a.src = (root.FILM_BASE || '') + spec.audio; a.addEventListener('error', function () { self.audio = null; }); this.audio = a; }

    var $ = function (q) { return host.querySelector(q); };
    var seek = $('.fseek'), time = $('.ftime'), play = $('.fplay'), big = $('.fbig');
    this.ui = { seek: seek, time: time, play: play, big: big };
    play.onclick = big.onclick = function () { self.toggle(); };
    seek.oninput = function () { self.seek(seek.value / 1000 * self.total); };
    $('.fcc').onclick = function () { self.cc = !self.cc; this.setAttribute('aria-pressed', self.cc); self.cap.style.display = self.cc ? '' : 'none'; };
    $('.ffs').onclick = function () { var e = self.stage; (e.requestFullscreen || e.webkitRequestFullscreen || function () { }).call(e); };
    var sk = $('.fskip'); if (sk) sk.onclick = function () { self.pause(); if (opt.onskip) opt.onskip(); };
    var sn = $('.fsnd'); if (sn) { sn.setAttribute('aria-pressed', this.sound); sn.onclick = function () { self.setSound(!self.sound); }; }
    this.onend = opt.onend; this.onstate = opt.onstate;
    this._poster = !opt.autoplay && spec.poster != null; this.seek(this._poster ? spec.poster : 0);
    if (opt.autoplay) this.play();
  }

  Film.prototype.seek = function (t) {
    t = Math.max(0, Math.min(this.total, t)); this.t = t; if (this.audio && Math.abs(this.audio.currentTime - t) > .3) { try { this.audio.currentTime = t; } catch (e) { } }
    this.render(t);
  };

  Film.prototype.render = function (t) {
    var sp = this.spec.scenes, i = 0, TR = .55;
    for (var k = 0; k < sp.length; k++) if (t >= this.starts[k]) i = k;
    var lt = t - this.starts[i], tr = (sp[i].tr || 'right');
    for (var j = 0; j < this.nodes.length; j++) { this.nodes[j].style.display = 'none'; this.nodes[j].style.transform = ''; this.nodes[j].style.clipPath = ''; this.nodes[j].style.opacity = 1; }
    var prev = i > 0 ? this.nodes[i - 1] : null;
    if (prev && lt < TR) {
      prev.style.display = 'block'; this.upd(i - 1, sp[i - 1].dur);
      var p = eio(lt / TR), n = this.nodes[i]; n.style.display = 'block';
      if (tr === 'right') n.style.transform = 'translateX(' + ((1 - p) * 100) + '%)';
      else if (tr === 'up') n.style.transform = 'translateY(' + ((1 - p) * 100) + '%)';
      else if (tr === 'iris') n.style.clipPath = 'circle(' + (p * 78) + '% at 50% 50%)';
      else if (tr === 'split') n.style.clipPath = 'inset(' + ((1 - p) * 50) + '% 0 ' + ((1 - p) * 50) + '% 0)';
      else if (tr === 'zoom') { n.style.transform = 'scale(' + (1.25 - .25 * p) + ')'; n.style.opacity = p; }
      else n.style.opacity = p;
    } else this.nodes[i].style.display = 'block';
    this.upd(i, lt);
    var cap = sp[i].cap || '', ce = this.cap;
    if (ce.dataset.s !== cap) { ce.dataset.s = cap; ce.textContent = cap; }
    ce.style.opacity = cap ? eo(P(lt, .35, .35)) * (1 - P(lt, sp[i].dur - .25, .25)) : 0;
    var u = this.ui; u.seek.value = Math.round(t / this.total * 1000);
    var s = Math.floor(t), m = Math.floor(s / 60); u.time.textContent = m + ':' + ('0' + (s % 60)).slice(-2);
  };
  Film.prototype.upd = function (i, lt) {
    var s = this.spec.scenes[i], th = TH[s.theme || 'navy'], r = this.nodes[i]; T[s.type].upd(r, lt, s, th);
    var sd = r.querySelector('.sd'); if (sd) { var p = eo(P(lt, .3, .8)); sd.style.opacity = p; sd.style.transform = 'translateY(' + ((1 - p) * 60 + Math.sin(lt * 1.3) * 6) + 'px)'; }
    if (s.after) s.after(r, lt, th);
  };
  Film.prototype.play = function () {
    var self = this; if (this.playing) return; if (this._poster) { this._poster = false; this.seek(0); } if (this.t >= this.total - .05) this.seek(0);
    this.playing = true; this.ui.play.innerHTML = PAUSEI; this.ui.big.style.display = 'none'; this.last = performance.now();
    if (this.audio && this.sound) { this.audio.currentTime = this.t; this.audio.play().catch(function () { }); }
    if (this.onstate) this.onstate();
    var loop = function (now) {
      if (!self.playing) return; var dt = (now - self.last) / 1000; self.last = now;
      var nt = (self.audio && self.sound && !self.audio.paused && self.audio.currentTime > 0) ? self.audio.currentTime : self.t + dt;
      if (nt >= self.total) { self.seek(self.total); self.pause(); self.ui.big.style.display = ''; if (self.onend) self.onend(); return; }
      self.t = nt; self.render(nt); requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
  Film.prototype.pause = function () { this.playing = false; this.ui.play.innerHTML = PLAYI; if (this.audio) this.audio.pause(); if (this.onstate) this.onstate(); };
Film.prototype.setSound = function (on) { this.sound = on; var b = this.host.querySelector('.fsnd'); if (b) b.setAttribute('aria-pressed', on); if (!this.audio) return; if (on && this.playing) { try { this.audio.currentTime = this.t; } catch (e) { } this.audio.play().catch(function () { }); } else this.audio.pause(); if (this.onstate) this.onstate(); };
Film.prototype.restartWithSound = function () { this._poster = false; this.seek(0); this.sound = true; var b = this.host.querySelector('.fsnd'); if (b) b.setAttribute('aria-pressed', true); this.playing = false; this.play(); };
  Film.prototype.toggle = function () { this.playing ? this.pause() : this.play(); };

  root.Film = Film; root.FILMTH = TH;
})(window);
