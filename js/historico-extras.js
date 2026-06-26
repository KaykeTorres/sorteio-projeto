/* ============================ HISTÓRICO ============================ */
function renderHist(){
  if(history.length===0){
    histList.innerHTML='<p class="hint" style="margin:0;">Os ganhadores aparecerão aqui em ordem.</p>';
    btnClearHist.style.display='none';
    return;
  }
  histList.innerHTML = history.map((n,idx)=>{
    const pos = history.length - idx;
    return `<div class="hist-item"><div class="hist-num">${pos}</div><div class="hist-name">${escapeHtml(n)}</div></div>`;
  }).join('');
  btnClearHist.style.display='inline-block';
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
btnClearHist.addEventListener('click', ()=>{ history=[]; renderHist(); });

/* ============================ EXTRAS ============================ */
$('btnExemplo').addEventListener('click', ()=>{
  namesEl.value = ['Ana Beatriz Lima','Carlos Eduardo Souza','Mariana Oliveira','Pedro Henrique Costa',
    'Juliana Santos','Rafael Almeida','Beatriz Ferreira','Lucas Gabriel Rocha',
    'Camila Rodrigues','Thiago Martins','Fernanda Carvalho','Gustavo Pereira'].join('\n');
  parse();
});
$('btnLimparNomes').addEventListener('click', ()=>{ namesEl.value=''; parse(); });
$('btnDedupe').addEventListener('click', dedupe);

$('btnSom').addEventListener('click', ()=>{
  soundOn = !soundOn;
  $('btnSom').textContent = soundOn ? '🔊 Som' : '🔇 Mudo';
  if(soundOn) initAudio();
});
$('btnFull').addEventListener('click', ()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

parse();
