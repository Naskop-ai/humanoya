/* Film scripts. Each scene's `cap` is the caption and the voice-over line. */
(function (root) {
  var C = root.ART.C;
  function fvSeries(rate, fee, years) { var a = []; for (var y = 0; y <= years; y++) a.push(10000 * Math.pow(1 + rate - fee, y)); return a; }
  var lo = fvSeries(.05, .002, 30), hi = fvSeries(.05, .02, 30);
  var eur = function (n) { return '€' + Math.round(n).toLocaleString('en-GB'); };

  var F = {};

  F.intro = {
    title: 'Humanoya in two minutes', poster: 3.2,
    scenes: [
      { type: 'flow', theme: 'navy', dur: 11, title: 'The problem', size: 80, items: [{ t: 'Elders\' savings sleep in bank accounts', c: C.goldL }, { t: 'Businesses and projects lack funding', c: C.cream }, { t: 'Young people want to invest but do not know how', c: C.gold }], cap: 'Elders\' savings sleep in bank accounts. Businesses and projects lack funding. And young people want to invest, but nobody taught them how.', tr: 'fade' },
      { type: 'words', theme: 'gold', dur: 9, lines: [{ t: 'Learn.' }, { t: 'Mentor.', c: 'ac2' }, { t: 'Invest.' }, { t: 'Fuel.', c: 'ac2' }], size: 84, y: 70, sub: 'The wisdom of elders, the boldness of youth.', suby: 480, side: 'symbolon', cap: 'Humanoya brings them together. Learn online, for free. Mentor, with an elder. Invest, with an advisor. And fuel the real economy.', tr: 'right' },
      { type: 'words', theme: 'cream', dur: 8, lines: [{ t: 'Meet Léa.' }], size: 120, y: 190, sub: 'She is 22. She wants to invest but does not know how. She discovers Humanoya and signs up for free.', suby: 380, side: 'young', cap: 'Meet Léa, twenty-two. She wants to invest, but does not know how. She discovers Humanoya, and signs up for free.', tr: 'zoom' },
      { type: 'fig', theme: 'navy', dur: 9, value: 6, suf: ' modules', size: 190, y: 160, ly: 400, suby: 520, label: 'of ten minutes each. One badge for every module.', sub: 'Saving, ETFs and fees, risk, tax, scams, and the green option.', cap: 'First she learns alone: six modules of ten minutes on saving, ETFs, risk, tax and scams. One badge for each.', tr: 'right' },
      { type: 'words', theme: 'blue', dur: 9, lines: [{ t: '€0 at risk.', c: 'ac' }, { t: '4 weeks.' }], size: 104, y: 150, sub: 'A practice portfolio with fictional money, and a challenge every week.', suby: 450, side: 'phone', cap: 'Then she manages a practice portfolio with fictional money for four weeks, with weekly challenges. Real lessons, zero risk.', tr: 'up' },
      { type: 'words', theme: 'sand', dur: 9, lines: [{ t: 'Invite' }, { t: 'your mentor.', c: 'ac' }], size: 76, y: 150, sub: 'Léa asks her grandfather Jacques. He shares his experience: no training, no money.', suby: 400, side: 'pair', cap: 'Then she invites her grandfather Jacques to be her mentor. He simply shares his experience: no training, and no money.', tr: 'iris' },
      { type: 'list', theme: 'navy', dur: 10, title: 'Kick-off', size: 90, items: ['One hour at the Humanoya agency', 'They sign the mentoring charter', 'They choose the portfolio together', 'The advisor reassures and never sells'], fs: 32, gap: 16, step: 1.3, cap: 'They meet at the Humanoya agency, sign the mentoring charter and choose the portfolio. The advisor reassures, and never sells.', tr: 'right' },
      { type: 'words', theme: 'gold', dur: 9, lines: [{ t: '3 questions.' }, { t: '1 decision.', c: 'ac2' }], size: 92, y: 150, sub: 'Every week, over coffee or by video. Jacques shares his reflexes.', suby: 450, side: 'pair', cap: 'Each week, over coffee or by video, Léa asks three questions. Jacques shares his reflexes, and together they decide one move.', tr: 'up' },
      { type: 'words', theme: 'cream', dur: 8, lines: [{ t: 'Certificate.' }], size: 84, y: 190, sub: 'Léa presents her results and receives her certificate. Jacques is offered a free meeting with our advisor.', suby: 360, side: 'cert', cap: 'At the final meeting, Léa presents her results and receives her certificate. Jacques is offered a free meeting with our advisor.', tr: 'split' },
      { type: 'list', theme: 'blue', dur: 9, title: 'Papi meets the advisor', size: 70, items: ['At the Humanoya agency', 'To talk about his goals and his savings', 'Free, with no obligation'], fs: 34, cap: 'If he wishes, Jacques meets the Humanoya advisor to talk about his goals and his savings. It is free, with no obligation.', tr: 'iris' },
      { type: 'split', theme: 'sand', dur: 11, title: 'Invest for real', a: { title: 'Léa', items: ['Opens her own Monabanq account', 'Welcome bonus and matching', 'Invests her own money'] }, b: { title: 'Jacques', items: ['Invests in a managed portfolio', 'Fees shown in euros', 'Can stop at any time'] }, cap: 'Then Léa opens her own Monabanq account, with a welcome bonus and matching. Jacques invests through a managed portfolio, with fees shown in euros. Their savings fund businesses.', tr: 'right' },
      { type: 'words', theme: 'navy', dur: 8, lines: [{ t: 'Every year,' }, { t: 'savings at work.', c: 'ac' }], size: 92, y: 160, sub: 'The advisor follows Jacques every year. New pairs join. He can stop anytime.', suby: 450, cap: 'The advisor follows Jacques every year, and new pairs join. Their savings keep fuelling the real economy.', tr: 'fade' },
      { type: 'logo', theme: 'navy', dur: 9, title: 'Sleeping savings, a living economy.', size: 56, ty: 150, sub: 'Training is free and nobody pays before investing.', suy: 400, btn: 'Start your free course', by: 530, cap: 'Sleeping savings, a living economy. Training is free, and nobody pays before investing. Start your free course today.', tr: 'zoom' },
    ],
  };

  function modFilm(id, title, sc) { F[id] = { title: title, poster: 3.6, scenes: sc }; }

  modFilm('m1', 'Saving or investing? In one minute', [
    { type: 'words', theme: 'navy', dur: 5.5, lines: [{ t: 'Saving keeps' }, { t: 'it safe.', c: 'ac' }, { t: 'Investing makes' }, { t: 'it grow.', c: 'ac' }], size: 92, y: 130, cap: 'Saving keeps your money safe. Investing makes it grow.', tr: 'fade' },
    { type: 'split', theme: 'cream', dur: 8, title: 'Two different jobs', a: { title: 'Saving', items: ['For what is coming soon', 'For emergencies', 'Always easy to reach'] }, b: { title: 'Investing', items: ['For what is far away', 'Value goes up and down', 'Needs time to work'] }, cap: 'Neither is better. Savings are for soon and for emergencies. Investments are for far away.', tr: 'right' },
    { type: 'fig', theme: 'gold', dur: 6.5, value: 6, suf: ' months', size: 190, y: 180, ly: 430, label: 'of essential spending in your safety cushion, before you invest', cap: 'Build a cushion of three to six months of spending first.', tr: 'up' },
    { type: 'bars', theme: 'sand', dur: 8, title: 'Idle cash loses power', bars: [{ l: 'Today', v: 100, t: '€100' }, { l: 'In 10 years at 3% inflation', v: 74, t: '€74', c: C.blue }, { l: 'In 20 years', v: 55, t: '€55', c: C.navy }], max: 100, cap: 'If prices rise faster than your savings earn, each euro buys a little less every year.', tr: 'right' },
    { type: 'list', theme: 'navy', dur: 8, title: 'The horizon decides', size: 88, items: ['Under 2 years: keep it safe', '2 to 5 years: mix', 'Over 5 years: investing is reasonable'], cap: 'Ask when you will need the money. The horizon decides.', tr: 'iris' },
  ]);

  modFilm('m2', 'ETFs and fees in one minute', [
    { type: 'words', theme: 'navy', dur: 5.5, lines: [{ t: 'One basket,' }, { t: 'many companies.', c: 'ac' }], size: 104, y: 190, cap: 'An ETF is one basket that holds many companies.', tr: 'fade' },
    { type: 'fig', theme: 'blue', dur: 7, value: 1400, suf: '+', size: 300, label: 'companies in a typical world index ETF', sub: 'One purchase, more than twenty countries.', cap: 'One share of a world ETF gives you a tiny part of around fourteen hundred companies.', tr: 'zoom' },
    { type: 'list', theme: 'cream', dur: 8, title: 'Add up the fees', size: 88, items: ['Ongoing charge of the fund', 'Brokerage fee when you buy or sell', 'Account fee of the platform'], cap: 'Add up three fees: the fund, the broker and the account. The total is the real yearly price.', tr: 'right' },
    { type: 'growth', theme: 'sand', dur: 10, title: '€10,000 over 30 years', x0: 'Today', x1: '30 years', max: 42000, series: [{ l: 'Fees of 0.2% a year', c: C.navy, end: eur(lo[30]), pts: lo }, { l: 'Fees of 2% a year', c: C.gold, end: eur(hi[30]), pts: hi }], cap: 'Growing at five percent before fees, ten thousand euros becomes about forty thousand with low fees, and about twenty-four thousand with high ones.', tr: 'up' },
    { type: 'words', theme: 'navy', dur: 6, lines: [{ t: 'Low cost.', c: 'ac' }, { t: 'Broad index.' }, { t: 'Long term.' }], size: 100, y: 150, cap: 'Low cost, a broad index, and a long horizon: a simple, sound start.', tr: 'iris' },
  ]);

  modFilm('m3', 'Risk and time in one minute', [
    { type: 'words', theme: 'navy', dur: 5.5, lines: [{ t: 'Risk is' }, { t: 'movement.', c: 'ac' }], size: 130, y: 180, sub: 'A loss only becomes real when you sell.', suby: 470, cap: 'Risk is movement. A loss only becomes real when you sell.', tr: 'fade' },
    { type: 'split', theme: 'cream', dur: 8, title: 'When the market falls', a: { title: 'Panic', items: ['Sell at the bottom', 'Lock in the loss', 'Miss the rebound'] }, b: { title: 'Plan', items: ['Keep to your horizon', 'Keep investing the same sum', 'Talk to your elder'] }, cap: 'When markets fall, panic locks in the loss. A plan lets time work.', tr: 'right' },
    { type: 'list', theme: 'gold', dur: 8, title: 'Invest the same sum every month', size: 66, items: ['Low prices: you buy more units', 'High prices: you buy fewer', 'The average evens out'], cap: 'Invest the same amount every month. You buy more when prices are low and fewer when they are high.', tr: 'up' },
    { type: 'fig', theme: 'blue', dur: 6.5, value: 30, suf: '%', size: 330, label: 'Your pot drops by 30% in a month. Would you sell, wait, or buy?', cap: 'Imagine your pot drops thirty percent in a month. Would you sell, wait, or buy more?', tr: 'zoom' },
    { type: 'words', theme: 'navy', dur: 6, lines: [{ t: 'A plan you can' }, { t: 'follow', c: 'ac' }, { t: 'beats a clever one.' }], size: 84, y: 160, cap: 'A plan you can follow in a crisis beats a clever plan you abandon.', tr: 'iris' },
  ]);

  modFilm('m4', 'Taxes, the basics in one minute', [
    { type: 'words', theme: 'navy', dur: 5.5, lines: [{ t: 'The account' }, { t: 'matters.', c: 'ac' }], size: 126, y: 190, cap: 'The same investment can be taxed very differently, depending on the account that holds it.', tr: 'fade' },
    { type: 'list', theme: 'cream', dur: 10, title: 'Three accounts to know', size: 80, items: ['PEA: shares, advantage after 5 years', 'Assurance-vie: flexible, advantage after 8 years', 'Compte-titres: the plain account'], fs: 32, cap: 'Three accounts to know: the PEA, the life insurance contract, and the plain securities account.', tr: 'right' },
    { type: 'bars', theme: 'sand', dur: 8, title: 'Only gains are taxed', bars: [{ l: 'You invest', v: 1000, t: '€1,000', c: C.navy }, { l: 'You sell at', v: 1100, t: '€1,100', c: C.blue }, { l: 'Taxed gain', v: 100, t: '€100', c: C.gold }], max: 1100, cap: 'Tax applies to the profit, not to the money you put in.', tr: 'up' },
    { type: 'words', theme: 'gold', dur: 7, lines: [{ t: 'Rules change.' }, { t: 'Check, then ask.', c: 'ac2' }], size: 96, y: 160, sub: 'service-public.fr · impots.gouv.fr · your Humanoya advisor', suby: 440, cap: 'Rules change with every finance law. Check an official source, then ask an advisor.', tr: 'iris' },
  ]);

  modFilm('m5', 'Scams to avoid in one minute', [
    { type: 'fig', theme: 'navy', dur: 7, value: 382, pre: '€', suf: 'm', size: 300, label: 'a year lost to fraud by manipulation in France', sub: 'Banque de France, payment security observatory, report 2024.', cap: 'In France, hundreds of millions of euros are lost each year to people tricked into paying.', tr: 'fade' },
    { type: 'list', theme: 'cream', dur: 12, title: 'Five classics', size: 84, items: ['A guaranteed high return', 'A friendly adviser on social media', 'A fake call from your bank', 'A friendship that ends in an investment', 'An urgent deadline'], fs: 30, gap: 14, step: 1.6, cap: 'Five classics: the guaranteed return, the friendly adviser, the fake bank call, the friendship that ends in an investment, and the urgent deadline.', tr: 'right' },
    { type: 'words', theme: 'gold', dur: 8, lines: [{ t: 'Stop.' }, { t: 'Verify.', c: 'ac2' }, { t: 'Talk.' }], size: 150, y: 90, side: 'young', cap: 'The check that works: stop, verify, talk.', tr: 'up' },
    { type: 'words', theme: 'navy', dur: 7, lines: [{ t: 'Teach it' }, { t: 'to your elder.', c: 'ac' }], size: 104, y: 180, side: 'pair', cap: 'Go through the three steps with your elder. A coffee is enough.', tr: 'iris' },
  ]);

  modFilm('m6', 'The green option in one minute', [
    { type: 'words', theme: 'navy', dur: 5.5, lines: [{ t: 'Money can' }, { t: 'follow', c: 'ac' }, { t: 'your values.' }], size: 110, y: 150, cap: 'Your money can follow your values.', tr: 'fade' },
    { type: 'list', theme: 'cream', dur: 9, title: 'ESG in three words', size: 84, items: ['Environmental', 'Social', 'Governance'], fs: 44, gap: 24, cap: 'Sustainable funds pick companies on environmental, social and governance criteria.', tr: 'right' },
    { type: 'list', theme: 'gold', dur: 10, title: 'Read behind the label', size: 80, items: ['Open the fund sheet', 'Look at the top ten holdings', 'Check fees and diversification'], cap: 'A label is a start. Open the fund sheet, read the top holdings, then check fees and diversification.', tr: 'up' },
    { type: 'split', theme: 'blue', dur: 8, title: 'The honest trade-off', a: { title: 'Green funds', items: ['Follow your values', 'Fees can be higher', 'Sometimes fewer companies'] }, b: { title: 'Plain index', items: ['Broadest spread', 'Often the lowest fees', 'Fewer choices about impact'] }, cap: 'No rule says green earns less or more. Compare cost and diversification like any other fund.', tr: 'right' },
  ]);


  F.tour = {
    title: 'Your learning space in one minute', poster: 7,
    scenes: [
      { type: 'words', theme: 'navy', dur: 6, lines: [{ t: 'Welcome to' }, { t: 'your space.', c: 'ac' }], size: 128, y: 170, sub: 'One minute to find your way around.', suby: 500, cap: 'Welcome to your learning space. Here is a one-minute tour.', tr: 'fade' },
      { type: 'shot', theme: 'sand', dur: 9, title: 'Home', text: 'Your greeting tells you what is next. The tiles show your time, lessons, portfolio and mentor.', src: 'img/shots/dashboard.png', hl: [[150, 62, 270, 56], [150, 136, 570, 70]], cap: 'Home tells you what comes next, and how far you have come.', tr: 'right' },
      { type: 'shot', theme: 'blue', dur: 9, title: 'Training path', text: 'Six modules of ten minutes, one badge each. Then the portfolio and the quiz.', src: 'img/shots/path.png', hl: [[150, 150, 570, 225]], cap: 'The training path lists your six modules, one badge each, then the portfolio and the final quiz. Your progress is saved.', tr: 'up' },
      { type: 'shot', theme: 'gold', dur: 10, title: 'A module', text: 'Watch the short film, read the lesson, then answer three questions to earn the badge.', src: 'img/shots/module.png', hl: [[150, 119, 447, 285]], cap: 'Each module has a short film, a text, and three questions that earn you a badge.', tr: 'right' },
      { type: 'shot', theme: 'navy', dur: 9, title: 'Practice portfolio', text: 'Four weeks, fictional money, zero euros at risk. A challenge every week.', src: 'img/shots/project.png', hl: [[150, 140, 375, 200], [535, 140, 185, 200]], cap: 'In the practice portfolio you manage fictional money for four weeks, with a challenge every week. Zero euros at risk.', tr: 'iris' },
      { type: 'shot', theme: 'cream', dur: 10, title: 'Invite your mentor', text: 'Send one link. Then follow the kick-off, the weekly coffees and the final meeting.', src: 'img/shots/sponsor.png', hl: [[150, 138, 280, 277], [440, 138, 280, 277]], cap: 'To invite your mentor, send one link. Then follow the kick-off, the weekly coffees, and the final meeting.', tr: 'right' },
      { type: 'shot', theme: 'sand', dur: 8, title: 'Certificate', text: 'Pass the quiz, present your results and download your certificate.', src: 'img/shots/certificate.png', hl: [[300, 140, 330, 250]], cap: 'Pass the final quiz, present your results, and download your certificate.', tr: 'up' },
      { type: 'shot', theme: 'blue', dur: 8, title: 'Rewards', text: 'What you earn depends only on what you do.', src: 'img/shots/rewards.png', hl: [[150, 120, 570, 150]], cap: 'Your rewards depend only on what you do, never on the money your mentor invests.', tr: 'right' },
      { type: 'logo', theme: 'navy', dur: 7, title: 'Ready? Start with your next module.', size: 64, sub: 'Help and films are always in the menu.', suy: 400, btn: 'Go to my dashboard', by: 500, cap: 'Ready? Start with your next module. Help and films are always in the menu.', tr: 'zoom' },
    ],
  };


  /* the project in one film: story, product, team, financing, invitation */
  F.pitch = {
    title: 'Humanoya, the project', poster: 8,
    scenes: [
      { type: 'words', theme: 'navy', dur: 8, lines: [{ t: 'A young person' }, { t: 'wants to invest.', c: 'ac' }, { t: 'A grandfather has' }, { t: '40 years of it.', c: 'ac' }], size: 62, y: 130, side: 'pair', cap: 'A young person wants to invest, but does not know where to start. Their grandfather has forty years of experience, and nobody asks him for it.', tr: 'fade' },
      { type: 'fig', theme: 'cream', dur: 6, value: 615, pre: '€', suf: 'bn', size: 300, y: 140, ly: 430, suby: 540, label: 'asleep in French savings accounts', sub: 'While businesses and projects lack funding. Source: Caisse des Dépôts.', cap: 'Meanwhile, six hundred and fifteen billion euros sleep in savings accounts, while businesses lack funding.', tr: 'zoom' },
      { type: 'words', theme: 'sand', dur: 6, lines: [{ t: 'Two halves,' }, { t: 'one bond.', c: 'ac' }], size: 96, y: 150, sub: 'This is Humanoya. Two generations, one idea: passing on.', suby: 470, side: 'symbolon', cap: 'This is Humanoya. Two generations, around one idea: passing on.', tr: 'iris' },
      { type: 'list', theme: 'blue', dur: 8, title: 'Meet Léa, 22', size: 84, items: ['She trains for free, online, in 3 hours', 'Six modules, one badge each', 'Then four weeks on a practice portfolio', 'Fictional money, zero euros at risk'], fs: 32, gap: 14, step: 1.2, side: 'young', cap: 'Meet Léa, twenty-two. She trains for free, online, in three hours, then practises on a portfolio of fictional money. Zero euros at risk.', tr: 'right' },
      { type: 'words', theme: 'gold', dur: 8, lines: [{ t: 'Invite' }, { t: 'your mentor.', c: 'ac2' }], size: 76, y: 150, sub: 'Her grandfather Jacques shares his experience. No training. No money. One move decided together every week.', suby: 400, side: 'pair', cap: 'She invites her grandfather Jacques to be her mentor. He shares his experience: no training, no money. Together, they decide one move a week.', tr: 'up' },
      { type: 'shot', theme: 'sand', dur: 5, title: 'The platform exists', text: 'Léa\'s dashboard shows what comes next and how far she has come.', src: 'img/shots/dashboard.png', hl: [[150, 62, 270, 56], [150, 136, 570, 70]], cap: 'This is not a slide. The platform already exists as a working mock-up.', tr: 'right' },
      { type: 'shot', theme: 'navy', dur: 5, title: 'Film, lesson, quiz', text: 'Every module has a short film, a lesson and three questions that earn a badge.', src: 'img/shots/module.png', hl: [[150, 119, 447, 285]], cap: 'Every module has a short film, a lesson and a quiz.', tr: 'right' },
      { type: 'shot', theme: 'blue', dur: 5, title: 'Practice portfolio', text: 'Four weeks, weekly challenges, zero euros at risk.', src: 'img/shots/project.png', hl: [[150, 140, 375, 200], [535, 140, 185, 200]], cap: 'She practises with fictional money.', tr: 'right' },
      { type: 'shot', theme: 'gold', dur: 5, title: 'One link', text: 'Jacques is invited with a single link. The kick-off and the weekly coffees are booked in the app.', src: 'img/shots/sponsor.png', hl: [[150, 138, 280, 277], [440, 138, 280, 277]], cap: 'One link invites Jacques.', tr: 'right' },
      { type: 'split', theme: 'sand', dur: 9, title: 'Then, if they wish', a: { title: 'Léa', items: ['A certificate', 'Her own Monabanq account', 'Bonus and matching'] }, b: { title: 'Jacques', items: ['A free meeting with our advisor', 'No obligation', 'A managed portfolio, fees in euros'] }, cap: 'Léa gets her certificate and opens her own account. If he wishes, Jacques meets our advisor, free and with no obligation, and invests with fees shown in euros.', tr: 'up' },
      { type: 'words', theme: 'navy', dur: 6, lines: [{ t: 'The young person' }, { t: 'never pays.', c: 'ac' }], size: 88, y: 150, sub: 'We only earn when families invest, and every fee is shown in writing.', suby: 440, cap: 'The young person never pays. We only earn when families invest, with fees shown in writing.', tr: 'iris' },
      { type: 'team', theme: 'blue', dur: 9, title: 'Six students, NEOMA', names: ['Louise', 'Clarisse', 'Anaïs', 'Nabil', 'Sarah', 'Victoria'], items: ['We designed the training', 'We built the platform mock-up', 'We calculated every line of our budget'], cap: 'We are six students at NEOMA Business School. We designed the training, built the platform, and calculated every line of our budget.', tr: 'zoom' },
      { type: 'ring', theme: 'cream', dur: 10, title: 'We ask for €60,000', center: '€60,000', items: [{ v: 12000, a: '€12,000', l: 'Our first premises', c: C.navy }, { v: 32500, a: '€32,500', l: 'Our first finance advisor', c: C.gold }, { v: 9050, a: '€9,050', l: 'A pilot of fifty pairs', c: C.blue }, { v: 6450, a: '€6,450', l: 'Fees and contingencies', c: C.goldL }], cap: 'We are asking for sixty thousand euros: to open our first premises, hire our first finance advisor, and launch a pilot of fifty pairs.', tr: 'right' },
      { type: 'cards', theme: 'navy', dur: 8, title: 'In return', items: [{ a: '€10', l: 'Your name on the wall of transmitters' }, { a: '€30', l: 'Offer a young person their training' }, { a: '€60', l: 'Sponsor a pair during the pilot' }, { a: '€100', l: 'Join the opening of our agency' }, { a: '€500', l: 'Founding partner: your name at the door' }], cap: 'In return: offer a young person their training, sponsor a pair, or join us at the opening of our agency.', tr: 'up' },
      { type: 'cta', theme: 'navy', dur: 8, lines: ['Test the platform.', 'Then help us open.'], size: 84, btns: ['Test the product', 'Invest in Humanoya'], by: 520, cap: 'Now it is your turn. Test the platform, share it with someone you love, and help us open the first Humanoya agency.', tr: 'zoom' },
      { type: 'logo', theme: 'gold', dur: 9, title: 'Humanoya', size: 112, sub: 'The wisdom of the elders, the boldness of the young, united for a more dynamic finance.', suy: 330, cap: 'Humanoya: the wisdom of the elders, the boldness of the young, united for a more dynamic finance. Thank you.', tr: 'fade' },
    ],
  };


  /* timings measured on the voice-over files (silence detection + sentence alignment) */
  var TIMING = { intro: [9.81, 11.37, 10.21, 7.93, 8.73, 7.8, 8.61, 9.32, 7.45, 8.01, 12.3, 7.39, 10.38], tour: [3.93, 3.72, 8.63, 5.33, 7.83, 6.9, 4.31, 5.51, 6.77] };
  F.intro.audio = 'audio/intro.mp3'; F.tour.audio = 'audio/tour.mp3';
  ['intro', 'tour'].forEach(function (k) { F[k].scenes.forEach(function (sc, i) { sc.dur = TIMING[k][i]; }); });

  root.FILMS = F;
})(window);
