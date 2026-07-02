/* ============================ ESTADO ============================ */
const $ = id => document.getElementById(id);
const namesEl=$('names'), countNum=$('countNum'), btnSortear=$('btnSortear'),
      btnAgain=$('btnAgain'), btnRemove=$('btnRemove'), roller=$('roller'),
      winner=$('winner'), winnerName=$('winnerName'), palco=$('palco'),
      palcoEyebrow=$('palcoEyebrow'), ring=$('ring'), ringProg=$('ringProg'),
      flash=$('flash'), histList=$('histList'), btnClearHist=$('btnClearHist'),
      optAuto=$('optAuto'), dupWarn=$('dupWarn'), dupText=$('dupText'), dupOk=$('dupOk'),
      dataHojeTag=$('dataHojeTag');

/* data de hoje no formato AAAA-MM-DD (fuso local), usada para filtrar
   quem se cadastrou hoje — precisa bater com o formato devolvido pelo
   Apps Script (Utilities.formatDate(..., "yyyy-MM-dd")) */
function dataDeHojeISO(){
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth()+1).padStart(2,'0');
  const dia = String(hoje.getDate()).padStart(2,'0');
  return `${ano}-${mes}-${dia}`;
}
/* data de hoje no formato dd/mm, só para exibir no título */
function dataDeHojeCurta(){
  const hoje = new Date();
  return `${String(hoje.getDate()).padStart(2,'0')}/${String(hoje.getMonth()+1).padStart(2,'0')}`;
}
if(dataHojeTag) dataHojeTag.textContent = dataDeHojeCurta();

let names=[], remaining=[], history=[], rolling=false, currentWinner=null;
// nomes já sorteados (normalizados) — preservado mesmo quando a lista é
// recarregada do cadastro, para que um vencedor removido não volte à urna
let sorteados = new Set();
const RING_LEN = 2*Math.PI*92;
ringProg.style.strokeDasharray = RING_LEN;
ringProg.style.strokeDashoffset = RING_LEN;

function parse(){
  names = namesEl.value.split('\n').map(n=>n.trim()).filter(Boolean);
  // só exclui quem já foi sorteado — duplicados continuam contados até o
  // usuário clicar em "Remover duplicados", para o número da urna sempre
  // bater com o que está escrito na caixa de texto
  remaining = names.filter(n=>!sorteados.has(normName(n)));
  countNum.textContent = remaining.length;
  checkDuplicates();
  resetStage();
}

/* normaliza para comparação: minúsculas + espaços colapsados (ignora acentos diferentes? não — mantém acento, mas iguala caixa/espaços) */
function normName(n){ return n.toLowerCase().replace(/\s+/g,' ').trim(); }

function checkDuplicates(){
  const seen = new Map(); // norm -> {original, count}
  names.forEach(n=>{
    const k = normName(n);
    if(seen.has(k)) seen.get(k).count++;
    else seen.set(k, {original:n, count:1});
  });
  const dups = [...seen.values()].filter(v=>v.count>1);

  if(dups.length){
    const repetidos = dups.reduce((a,d)=>a+d.count-1,0); // total de entradas em excesso
    const lista = dups.map(d=>`${escapeHtml(d.original)} <b>×${d.count}</b>`).join(' · ');
    dupText.innerHTML = `⚠ <b>${dups.length}</b> ${dups.length===1?'nome aparece':'nomes aparecem'} mais de uma vez `
      + `(${repetidos} ${repetidos===1?'entrada repetida':'entradas repetidas'} — chance desigual no sorteio):<br>${lista}`;
    dupWarn.classList.add('show');
    dupOk.classList.remove('show');
  } else {
    dupWarn.classList.remove('show');
    dupOk.classList.toggle('show', names.length > 0);
  }
}

/* remove visualmente da caixa de texto todas as linhas que correspondem
   ao nome informado (inclusive duplicatas dele), mantendo o restante intacto */
function removeFromVisibleList(nome){
  const k = normName(nome);
  namesEl.value = namesEl.value.split('\n')
    .filter(n => normName(n.trim()) !== k)
    .join('\n');
}

function dedupe(){
  const seen = new Set(), out = [];
  names.forEach(n=>{
    const k = normName(n);
    if(!seen.has(k)){ seen.add(k); out.push(n); }
  });
  namesEl.value = out.join('\n');
  parse();
}
function resetStage(){
  winner.classList.remove('show');
  roller.style.display='block';
  roller.className = 'roller idle';
  roller.textContent = remaining.length>0
    ? remaining.length + (remaining.length===1?' nome pronto na urna':' nomes prontos na urna')
    : 'Adicione os participantes abaixo';
  palcoEyebrow.textContent = remaining.length>0 ? 'Pronto para começar' : 'Aguardando participantes';
  btnSortear.disabled = remaining.length===0 || rolling;
  btnSortear.classList.toggle('pulse', remaining.length>0 && !rolling);
  btnAgain.style.display='none';
  btnRemove.style.display='none';
  currentWinner=null;
}

namesEl.addEventListener('input', parse);

