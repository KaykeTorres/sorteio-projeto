/* ============================ SORTEIO ============================ */
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function buildDelays(){
  const fast=24, slow=14, delays=[];
  for(let i=0;i<fast;i++) delays.push(52);
  for(let i=0;i<slow;i++){
    const k=i/(slow-1);                 // 0..1
    delays.push(60 + Math.pow(k,2.4)*880); // desacelera dramaticamente
  }
  return delays;
}

btnSortear.addEventListener('click', drawStart);
btnAgain.addEventListener('click', ()=>{ resetStage(); });
btnRemove.addEventListener('click', ()=>{
  if(currentWinner){
    sorteados.add(normName(currentWinner));
    remaining = remaining.filter(n=>n!==currentWinner);
    countNum.textContent = remaining.length;
  }
  resetStage();
});

function drawStart(){
  if(rolling || remaining.length===0) return;
  initAudio();
  rolling=true;
  btnSortear.disabled=true;
  btnSortear.classList.remove('pulse');
  btnAgain.style.display='none';
  btnRemove.style.display='none';
  winner.classList.remove('show');
  roller.style.display='block';
  roller.className='roller fast';
  palco.classList.add('suspense');
  palcoEyebrow.textContent='Sorteando...';

  const delays = buildDelays();
  const totalMs = delays.reduce((a,b)=>a+b,0);
  startSuspense(totalMs/1000);

  const startTime = performance.now();
  let i=0;

  function step(){
    const progress = i/delays.length;
    // anel de tensão
    ringProg.style.strokeDashoffset = RING_LEN*(1-progress);
    // troca o nome
    roller.textContent = rand(remaining);
    roller.classList.remove('tick'); void roller.offsetWidth; roller.classList.add('tick');
    tick(progress);
    // ao desacelerar, tira o blur para dar nitidez ao "quase-ganhador"
    if(progress>0.62) roller.classList.remove('fast');
    if(progress>0.78) roller.style.fontSize='clamp(40px,9vw,92px)';

    i++;
    if(i>=delays.length){ setTimeout(reveal, 90); return; }
    setTimeout(step, delays[i]);
  }
  step();
}

function reveal(){
  currentWinner = rand(remaining);
  stopSuspense();
  boom();
  setTimeout(fanfare, 60);

  palco.classList.remove('suspense');
  palcoEyebrow.textContent='';
  ringProg.style.strokeDashoffset = RING_LEN;
  flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');

  roller.style.display='none';
  roller.style.fontSize='';
  winnerName.textContent = currentWinner;
  winner.classList.add('show');
  spawnConfetti();

  rolling=false;
  history.unshift(currentWinner);
  renderHist();

  if(optAuto.checked){
    sorteados.add(normName(currentWinner));
    remaining = remaining.filter(n=>n!==currentWinner);
    countNum.textContent = remaining.length;
    btnAgain.textContent = remaining.length>0 ? 'Sortear próximo' : 'Urna vazia';
    btnAgain.disabled = remaining.length===0;
    btnAgain.style.display='inline-block';
    btnRemove.style.display='none';
  } else {
    btnAgain.textContent='Sortear novamente';
    btnAgain.disabled=false;
    btnAgain.style.display='inline-block';
    btnRemove.style.display='inline-block';
  }
}

