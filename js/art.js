/* Humanoya flat illustration set. One graphic language: flat fills in the brand palette, no outlines.
   Used inline on pages, rendered to PNG for the pictures, and drawn inside the films. */
(function (root) {
  var C = { navy: '#13284A', gold: '#B88D45', goldL: '#E3C48A', cream: '#FCF9F0', sand: '#E8DCC2', blue: '#2F5C9E', skin: '#F0C9A3', hair: '#3B2A20', grey: '#E6E2D8', deep: '#0C1A33', shade: '#E0E3EA' };

  function young(o) {
    o = o || {}; var x = o.x || 0, y = o.y || 0, s = o.s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<ellipse cx="150" cy="441" rx="108" ry="8" fill="' + C.shade + '"/>' +
      '<path d="M77 441V290Q77 214 150 212Q223 214 223 290V441Z" fill="' + C.navy + '"/>' +
      '<path d="M134 214Q150 238 166 214" fill="none" stroke="' + C.cream + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M122 238L120 283M178 238L180 283" stroke="' + C.goldL + '" stroke-width="5"/>' +
      '<circle cx="150" cy="128" r="57" fill="' + C.skin + '"/>' +
      '<path d="M93 130Q96 62 150 60Q204 62 207 130Q180 94 150 96Q120 94 93 130Z" fill="' + C.hair + '"/>' +
      '<circle cx="131" cy="142" r="3.6" fill="' + C.navy + '"/><circle cx="169" cy="142" r="3.6" fill="' + C.navy + '"/>' +
      '<path d="M139 164Q150 169 161 164" fill="none" stroke="' + C.navy + '" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="168" y="300" width="58" height="96" rx="10" fill="#2A3A5E"/>' +
      '<rect x="175" y="308" width="44" height="80" rx="6" fill="' + C.goldL + '"/>' +
      '<path d="M181 372L193 350L203 360L214 334" fill="none" stroke="' + C.navy + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<circle cx="190" cy="408" r="15" fill="' + C.skin + '"/></g>';
  }

  function elder(o) {
    o = o || {}; var x = o.x || 0, y = o.y || 0, s = o.s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<ellipse cx="150" cy="441" rx="108" ry="8" fill="' + C.shade + '"/>' +
      '<path d="M54 441V292Q54 214 150 212Q246 214 246 292V441Z" fill="' + C.gold + '"/>' +
      '<path d="M117 214Q150 244 183 214L183 238Q150 262 117 238Z" fill="' + C.cream + '"/>' +
      '<path d="M150 214V441" stroke="#8D6428" stroke-width="5"/>' +
      '<circle cx="132" cy="298" r="6" fill="' + C.cream + '"/><circle cx="132" cy="343" r="6" fill="' + C.cream + '"/><circle cx="132" cy="388" r="6" fill="' + C.cream + '"/>' +
      '<circle cx="150" cy="130" r="57" fill="' + C.skin + '"/>' +
      '<path d="M92 140Q92 62 150 56Q208 62 208 140Q196 96 150 92Q104 96 92 140Z" fill="' + C.grey + '"/>' +
      '<circle cx="129" cy="138" r="17" fill="none" stroke="' + C.navy + '" stroke-width="3"/><circle cx="171" cy="138" r="17" fill="none" stroke="' + C.navy + '" stroke-width="3"/><path d="M146 138H154" stroke="' + C.navy + '" stroke-width="3"/><circle cx="129" cy="139" r="2.6" fill="' + C.navy + '"/><circle cx="171" cy="139" r="2.6" fill="' + C.navy + '"/>' +
      '<path d="M140 169Q150 174 160 169" fill="none" stroke="' + C.navy + '" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="164" y="290" width="88" height="112" rx="10" fill="' + C.cream + '" stroke="' + C.navy + '" stroke-width="7"/>' +
      '<circle cx="190" cy="318" r="9" fill="' + C.navy + '"/><circle cx="222" cy="318" r="9" fill="' + C.gold + '"/><path d="M180 366Q192 346 204 360Q216 346 228 366Z" fill="' + C.navy + '"/>' +
      '<circle cx="180" cy="408" r="15" fill="' + C.skin + '"/></g>';
  }

  function column(o) {
    o = o || {}; var x = o.x || 0, y = o.y || 0, s = o.s || 1, c = o.c || C.cream, d = o.d || C.navy;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="20" y="8" width="160" height="22" fill="' + c + '"/><rect x="34" y="30" width="132" height="14" fill="' + c + '"/>' +
      '<path d="M44 44H156L150 190H50Z" fill="' + c + '"/>' +
      '<path d="M70 44V190M92 44V190M108 44V190M130 44V190" stroke="' + d + '" stroke-width="5"/>' +
      '<rect x="30" y="190" width="140" height="14" fill="' + c + '"/><rect x="16" y="204" width="168" height="18" fill="' + c + '"/></g>';
  }

  /* The symbolon: a token broken in two. Halves are drawn apart or joined. */
  function symbolon(o) {
    o = o || {}; var gap = o.gap == null ? 0 : o.gap, r = 150;
    var L = 'M0 -150A150 150 0 0 0 0 150L8 100L-12 66L24 28L-18 -10L22 -48L0 -90Z';
    var R = 'M0 -150A150 150 0 0 1 0 150L8 100L-12 66L24 28L-18 -10L22 -48L0 -90Z';
    return '<g transform="translate(' + (o.x || 0) + ' ' + (o.y || 0) + ') scale(' + (o.s || 1) + ')">' +
      '<g transform="translate(' + (-gap) + ' 0) rotate(' + (-gap * 0.12) + ')"><path d="' + L + '" fill="' + C.navy + '"/>' + column({ x: -100, y: -105, s: .62, c: C.cream, d: C.navy }) + '</g>' +
      '<g transform="translate(' + gap + ' 0) rotate(' + (gap * 0.12) + ')"><path d="' + R + '" fill="' + C.gold + '"/>' +
      '<g transform="translate(62 -4)">' + [0, 1, 2, 3, 4].map(function (i) { var a = -80 + i * 40; return '<ellipse cx="' + Math.round(Math.cos(a * Math.PI / 180) * 60) + '" cy="' + Math.round(Math.sin(a * Math.PI / 180) * 60) + '" rx="9" ry="18" transform="rotate(' + (a + 90) + ' ' + Math.round(Math.cos(a * Math.PI / 180) * 60) + ' ' + Math.round(Math.sin(a * Math.PI / 180) * 60) + ')" fill="' + C.navy + '"/>'; }).join('') + '</g></g></g>';
  }

  function phone(o) {
    o = o || {}; var x = o.x || 0, y = o.y || 0, s = o.s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect width="230" height="440" rx="34" fill="' + C.navy + '"/>' +
      '<rect x="12" y="14" width="206" height="412" rx="24" fill="' + C.cream + '"/>' +
      '<rect x="78" y="22" width="74" height="12" rx="6" fill="' + C.navy + '"/>' +
      '<rect x="30" y="64" width="110" height="14" fill="' + C.navy + '"/>' +
      '<rect x="30" y="90" width="170" height="10" fill="' + C.sand + '"/>' +
      '<rect x="30" y="130" width="170" height="92" fill="' + C.navy + '"/>' +
      '<path d="M44 200L78 172L104 186L140 150L186 164" fill="none" stroke="' + C.goldL + '" stroke-width="8" stroke-linejoin="round"/>' +
      '<rect x="30" y="240" width="170" height="44" fill="' + C.sand + '"/><rect x="30" y="292" width="170" height="44" fill="' + C.sand + '"/>' +
      '<rect x="30" y="360" width="170" height="44" fill="' + C.gold + '"/><rect x="62" y="376" width="106" height="12" fill="' + C.navy + '"/></g>';
  }

  function certificate(o) {
    o = o || {}; var x = o.x || 0, y = o.y || 0, s = o.s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect width="420" height="300" fill="' + C.cream + '"/><rect x="14" y="14" width="392" height="272" fill="none" stroke="' + C.gold + '" stroke-width="6"/>' +
      column({ x: 180, y: 34, s: .3, c: C.navy, d: C.cream }) +
      '<rect x="110" y="112" width="200" height="16" fill="' + C.navy + '"/><rect x="70" y="148" width="280" height="10" fill="' + C.sand + '"/><rect x="100" y="172" width="220" height="10" fill="' + C.sand + '"/>' +
      '<circle cx="210" cy="238" r="30" fill="' + C.gold + '"/><path d="M196 238L206 248L226 226" fill="none" stroke="' + C.navy + '" stroke-width="6"/></g>';
  }

  function thread(x1, y1, x2, y2, lift, w) {
    var mx = (x1 + x2) / 2, my = Math.min(y1, y2) - lift;
    return '<path d="M' + x1 + ' ' + y1 + 'Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + C.gold + '" stroke-width="' + (w || 7) + '" stroke-linecap="round"/>';
  }

  function pairScene(o) {
    o = o || {}; var w = o.w || 900, h = o.h || 520;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      (o.bg ? '<rect width="' + w + '" height="' + h + '" fill="' + o.bg + '"/>' : '') +
      thread(320, 170, 590, 170, 110, 8) +
      young({ x: 90, y: 40, s: 1.0 }) + elder({ x: 520, y: 40, s: 1.0 }) + '</svg>';
  }

  function wrap(inner, w, h, bg) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' + (bg ? '<rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>' : '') + inner + '</svg>';
  }

  var ART = { C: C, young: young, elder: elder, column: column, symbolon: symbolon, phone: phone, certificate: certificate, thread: thread, pairScene: pairScene, wrap: wrap };
  if (typeof module !== 'undefined' && module.exports) module.exports = ART; else root.ART = ART;
})(typeof window !== 'undefined' ? window : globalThis);
