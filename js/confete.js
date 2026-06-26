/* ============================ CONFETE ============================ */
function spawnConfetti(){
  const colors=['#FFC629','#ffffff','#2E5BD8','#27D17C','#E0A500'];
  const W = palco.clientWidth;
  for(let i=0;i<70;i++){
    const c=document.createElement('div');
    c.className='confetti';
    c.style.left = Math.random()*W+'px';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.borderRadius = Math.random()>.5 ? '2px' : '50%';
    const dur = 1.4 + Math.random()*1.4;
    const x = (Math.random()*200-100);
    const rot = Math.random()*720-360;
    palco.appendChild(c);
    c.animate([
      {transform:'translate(0,0) rotate(0deg)', opacity:1},
      {transform:`translate(${x}px, ${palco.clientHeight+40}px) rotate(${rot}deg)`, opacity:0}
    ], {duration:dur*1000, easing:'cubic-bezier(.3,.6,.5,1)', delay:Math.random()*250, fill:'forwards'});
    setTimeout(()=>c.remove(), dur*1000+400);
  }
}

