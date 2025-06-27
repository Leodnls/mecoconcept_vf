function parse(id){ return parseFloat(document.getElementById(id).value) || 0; }
function toFixed(val,n=3){ return Number(val.toFixed(n)); }

document.getElementById('calculate').addEventListener('click', () => {
  // 1. Récupération de tous les paramètres
  const params = {
    L: parse('L'), l: parse('l'), h: parse('h'),
    rho_brique: parse('rho_brique'),
    refus_pct: parse('refus'), rho_terre: parse('rho_terre'),
    pct_eau: parse('pct_eau'),
    d_terre: parse('d_terre'), d_briques: parse('d_briques'),
    cons_ouv: parse('cons_ouv'), jours: parse('jours'),
    cons_moto: parse('cons_moto'), h_moto: parse('h_moto'),
    cons_t_terre: parse('cons_t_terre'), tours_terre: parse('tours_terre'),
    
    cons_rapat: parse('cons_rapat'), tours_rapat: parse('tours_rapat'),
    cons_pal: parse('cons_pal'), tours_pal: parse('tours_pal'),
    p_disc: parse('p_disc'), h_disc: parse('h_disc'),
    pow_multimeco: parse('pow_multimeco'), h_multimeco: parse('h_multimeco'),
    pow_mecotri: parse('pow_mecotri'), h_mecotri: parse('h_mecotri'),
    pow_malaxeur: parse('pow_malaxeur'), h_malaxeur: parse('h_malaxeur')
  };

  // 2. Calculs intermédiaires
  const vol    = params.L * params.l * params.h;
  const masse  = vol * params.rho_brique;
  const mTerre = masse / (1 - params.refus_pct/100);
  const vTerre = mTerre / params.rho_terre;
  const mEau   = masse * (params.pct_eau/100);

  // 3. Émissions par poste
  const eO    = ((params.cons_ouv * (params.jours * params.d_terre)) / 100) * 2.68;
  const eM    = (params.cons_moto * params.h_moto) * 2.31;
  const eTT   = ((params.cons_t_terre * params.d_terre) / 100) * 2.68 * params.tours_terre;
  
  const eR    = ((params.cons_rapat * (params.d_terre)) / 100) * 2.68 * params.tours_rapat;
  const eP    = ((params.cons_pal   * params.d_briques)   / 100) * 2.68 * params.tours_pal;
  const eDisc = ((params.p_disc * params.h_disc) / 1000)  * 0.060;

  // 4. Machines (électrique)
  const EM_ELEC = 0.060;
  const eMM  = params.pow_multimeco * params.h_multimeco * EM_ELEC;
  const eMT  = params.pow_mecotri  * params.h_mecotri  * EM_ELEC;
  const eMX  = params.pow_malaxeur * params.h_malaxeur * EM_ELEC;
  const eMach= eMM + eMT + eMX;

  // 5. Totaux
  const subtotal = eO + eM + eTT + eR + eP + eDisc;
  const total    = subtotal + eMach;
  const N        = prompt("Surface de brique en mètres carrés?","40");
  const perBrick = total / Number(N);

  // 6. Stockage complet dans localStorage
  const bilan = {
    ...params, vol, masse, mTerre, vTerre, mEau,
    eO, eM, eTT,  eR, eP, eDisc,
    eMM, eMT, eMX, eMach,
    subtotal, total, perBrick, N
  };
  localStorage.setItem('bilan', JSON.stringify(bilan));
  window.location = 'results.html';
});
