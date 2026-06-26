/* ============================ ÁUDIO ============================ */
let audioCtx = null, master = null, soundOn = true, suspenseNodes = null;
function initAudio(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.9;
    master.connect(audioCtx.destination);
  }
  if(audioCtx.state === 'suspended') audioCtx.resume();
}
function tick(rate){ // rate 0..1 (tensão)
  if(!soundOn) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'square';
  o.frequency.value = 360 + rate*520;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.06 + rate*0.05, t+0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.07);
  o.connect(g).connect(master);
  o.start(t); o.stop(t+0.08);
}
function startSuspense(dur){
  if(!soundOn) return;
  const t = audioCtx.currentTime;
  // drone subindo (tensão)
  const o = audioCtx.createOscillator(), g = audioCtx.createGain(), f = audioCtx.createBiquadFilter();
  o.type='sawtooth'; f.type='lowpass';
  o.frequency.setValueAtTime(55, t);
  o.frequency.exponentialRampToValueAtTime(165, t+dur);
  f.frequency.setValueAtTime(180, t);
  f.frequency.exponentialRampToValueAtTime(1500, t+dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.14, t+dur*0.85);
  o.connect(f).connect(g).connect(master);
  o.start(t);
  // tambor/rufar leve (ruído filtrado em tremolo crescente)
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate*dur, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
  const noise = audioCtx.createBufferSource(); noise.buffer=buf;
  const nf = audioCtx.createBiquadFilter(); nf.type='bandpass'; nf.frequency.value=120; nf.Q.value=1.2;
  const ng = audioCtx.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(0.10, t+dur*0.9);
  noise.connect(nf).connect(ng).connect(master);
  noise.start(t);
  suspenseNodes = {o,g,noise,ng};
}
function stopSuspense(){
  if(!suspenseNodes) return;
  const t = audioCtx.currentTime;
  try{
    suspenseNodes.g.gain.cancelScheduledValues(t);
    suspenseNodes.g.gain.setValueAtTime(suspenseNodes.g.gain.value, t);
    suspenseNodes.g.gain.exponentialRampToValueAtTime(0.0001, t+0.18);
    suspenseNodes.ng.gain.exponentialRampToValueAtTime(0.0001, t+0.12);
    suspenseNodes.o.stop(t+0.2);
    suspenseNodes.noise.stop(t+0.2);
  }catch(e){}
  suspenseNodes = null;
}
function boom(){
  if(!soundOn) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(45, t+0.4);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.55);
  o.connect(g).connect(master);
  o.start(t); o.stop(t+0.6);
}
function fanfare(){
  if(!soundOn) return;
  const t = audioCtx.currentTime;
  const notes = [523.25,659.25,783.99,1046.50,1318.51]; // C5 E5 G5 C6 E6
  notes.forEach((fr,i)=>{
    const st = t + i*0.10;
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type='triangle'; o.frequency.value=fr;
    g.gain.setValueAtTime(0.0001, st);
    g.gain.exponentialRampToValueAtTime(0.20, st+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, st+0.6);
    o.connect(g).connect(master);
    o.start(st); o.stop(st+0.65);
  });
  // brilho final
  const st = t+0.55;
  [1046.5,1318.5,1567.98].forEach(fr=>{
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type='sine'; o.frequency.value=fr;
    g.gain.setValueAtTime(0.0001, st);
    g.gain.exponentialRampToValueAtTime(0.12, st+0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, st+0.9);
    o.connect(g).connect(master);
    o.start(st); o.stop(st+0.95);
  });
}

