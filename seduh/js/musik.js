(function(){
"use strict";
const $=id=>document.getElementById(id);
let vol=.8,cur="lofi",on=false,paused=false,dk=0;
try{const sv=localStorage.getItem("seduh.vol");if(sv!==null&&+sv>=0&&+sv<=1)vol=+sv;cur=localStorage.getItem("seduh.track")||"lofi"}catch(e){}
/* Lagu 1: Lofi Seduh (dulu di Resep) */
const CH = [[[261.63, 329.63, 392, 493.88], 130.81], [[220, 261.63, 329.63, 392], 110], [[293.66, 349.23, 440, 523.25], 146.83], [[196, 246.94, 293.66, 349.23], 98]];
  const PENT = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const BEAT = 60 / 72, SR = 22050;
  function renderLoop() {
    const bars = 4, len = Math.round(SR * BEAT * 4 * bars), out = new Float32Array(len);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const add = (f, t0, d, v, tri) => {
      const i0 = Math.round(t0 * SR), n = Math.round(d * SR), w = 2 * Math.PI * f / SR, att = .03 * SR;
      for (let i = 0; i < n; i++) {
        const t = i / SR, a = Math.min(1, i / att) * Math.exp(-3.2 * t / d);
        const x = tri ? (2 / Math.PI) * Math.asin(Math.sin(w * i)) + .2 * Math.sin(2 * w * i) : Math.sin(w * i) + .3 * Math.sin(2 * w * i) * Math.exp(-4 * t / d);
        out[(i0 + i) % len] += v * a * x;
      }
    };
    for (let b = 0; b < bars; b++) {
      const c = CH[b % 4], t = b * BEAT * 4;
      c[0].forEach((f, i) => add(f, t + i * .012, BEAT * 3.8, .07, true));
      add(c[1], t, BEAT * 1.8, .22, true); add(c[1], t + BEAT * 2, BEAT * 1.8, .17, true);
      for (let i = 0; i < 8; i++) {
        const tt = t + i * BEAT / 2;
        if (rnd() < .55) add(PENT[(rnd() * 6) | 0], tt, 1.2, .09, false);
        if (i % 2) { const i0 = Math.round(tt * SR), n = Math.round(.05 * SR); for (let j = 0; j < n; j++) out[(i0 + j) % len] += (rnd() * 2 - 1) * (1 - j / n) * .02; }
      }
    }
    let y = 0, pk = 0;
    for (let i = 0; i < len; i++) { y += .5 * (out[i] - y); out[i] = y; pk = Math.max(pk, Math.abs(y)); }
    const k = .8 / (pk || 1); for (let i = 0; i < len; i++) out[i] *= k;
    return out;
  }
  function toWav(f) {
    const n = f.length, v = new DataView(new ArrayBuffer(44 + n * 2)), w = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, f[i])) * 32767, true);
    return new Blob([v], { type: "audio/wav" });
  }
  
let lBuf=null,lEl=null;
const lofi={start(){if(!lBuf)lBuf=renderLoop();if(!lEl){lEl=new Audio(URL.createObjectURL(toWav(lBuf)));lEl.loop=true}lEl.volume=vol;return lEl.play()},stop(){if(lEl)lEl.pause()},vol(v){if(lEl)lEl.volume=v}};
/* Lagu 2: Jazz Kafe (dulu di Barista Lab) */
function musUi(){}
const MU={c:null,on:false,mute:false,tm:0,nx:0,br:0},mf=m=>440*Math.pow(2,(m-69)/12),BT=60/66,SW=.62;
const PROG=[[41,[57,60,64,67]],[38,[60,64,65,69]],[43,[58,62,65,69]],[36,[58,64,67,69]],[45,[55,60,64,67]],[38,[60,66,69,71]],[46,[62,65,69,72]],[36,[58,62,65,67]]];
function epf(t,f,d,v){const c=MU.c,o=c.createOscillator(),m=c.createOscillator(),mg=c.createGain(),g=c.createGain();o.frequency.value=f;m.frequency.value=f;
 mg.gain.setValueAtTime(f*1.5,t);mg.gain.exponentialRampToValueAtTime(f*.04,t+.35);m.connect(mg);mg.connect(o.frequency);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(v*.4,t+.5);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g);g.connect(MU.lp);g.connect(MU.rv);o.start(t);m.start(t);o.stop(t+d+.1);m.stop(t+d+.1)}
function bsn(t,f){const c=MU.c,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o.frequency.value=f;o2.frequency.value=f*2;o2.type="triangle";
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.26,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.85);o.connect(g);o2.connect(g);g.connect(MU.lp);o.start(t);o2.start(t);o.stop(t+.9);o2.stop(t+.9)}
function nz(t,v,fq,d,ty){const c=MU.c,s=c.createBufferSource(),g=c.createGain(),h=c.createBiquadFilter();s.buffer=MU.nb;h.type=ty;h.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(h);h.connect(g);g.connect(MU.lp);s.start(t);s.stop(t+d+.02)}
function playBar(t){const i=MU.br++%8,[b,ch]=PROG[i],nb=PROG[(i+1)%8][0];
 ch.forEach((n,k)=>epf(t+k*.03,mf(n),3.4,.05));
 if(i%2)ch.forEach((n,k)=>epf(t+(2+SW)*BT+k*.025,mf(n),1.4,.035));
 [b,b+7,b+12,nb+(Math.random()<.5?-1:1)].forEach((n,k)=>bsn(t+k*BT,mf(n)));
 [0,1,1+SW,2,3,3+SW].forEach(q=>nz(t+q*BT,.03,7000,.05,"highpass"));
 [1,3].forEach(q=>nz(t+q*BT,.05,3500,.2,"bandpass"));
 for(let k=0;k<8;k++)if(Math.random()<.32)epf(t+(Math.floor(k/2)+(k%2?SW:0))*BT+.02,mf(ch[Math.random()*4|0]+12),1.6,.04)}
function musicOn(){if(!MU.c){const c=MU.c=new(window.AudioContext||window.webkitAudioContext)(),sr=c.sampleRate;
  MU.m=c.createGain();MU.m.gain.value=0;const cp=c.createDynamicsCompressor();MU.m.connect(cp);cp.connect(c.destination);
  MU.lp=c.createBiquadFilter();MU.lp.type="lowpass";MU.lp.frequency.value=2300;MU.lp.Q.value=.4;MU.lp.connect(MU.m);
  MU.rv=c.createConvolver();const L=sr*2.6,ib=c.createBuffer(2,L,sr);for(let h=0;h<2;h++){const d=ib.getChannelData(h);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.6)}
  MU.rv.buffer=ib;const rg=c.createGain();rg.gain.value=.55;MU.rv.connect(rg);rg.connect(MU.m);
  MU.nb=c.createBuffer(1,sr/2,sr);let d=MU.nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const cb=c.createBuffer(1,sr*4,sr);d=cb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()<.0007?(Math.random()*2-1)*.9:0)+(Math.random()*2-1)*.01;
  const cs=c.createBufferSource(),cf=c.createBiquadFilter(),cg=c.createGain();cs.buffer=cb;cs.loop=true;cf.type="highpass";cf.frequency.value=1200;cg.gain.value=.05;cs.connect(cf);cf.connect(cg);cg.connect(MU.m);cs.start()}
 MU.c.resume();MU.on=true;MU.mute=false;MU.nx=Math.max(MU.nx,MU.c.currentTime+.1);MU.m.gain.setTargetAtTime(vol,MU.c.currentTime,.6);
 if(!MU.tm)MU.tm=setInterval(()=>{while(MU.nx<MU.c.currentTime+1.5){playBar(MU.nx);MU.nx+=4*BT}},300);musUi()}
function musicOff(){MU.on=false;MU.mute=true;if(MU.m)MU.m.gain.setTargetAtTime(0,MU.c.currentTime,.25);clearInterval(MU.tm);MU.tm=0;musUi()}

const jazz={start(){musicOn()},stop(){musicOff()},vol(v){if(MU.m&&MU.on)MU.m.gain.setTargetAtTime(v,MU.c.currentTime,.1)}};
/* Generator lagu prosedural: akor, bas, arpeggio, melodi, perkusi, hujan; dirender sekali jadi WAV */
const mfq=m=>440*Math.pow(2,(m-69)/12);
const TIM={pluck:[[1,1,4],[2,.45,6],[3,.25,8],[4,.12,10]],bell:[[1,1,3],[2.76,.55,4],[5.4,.3,6],[8.93,.15,8]],pad:[[1,1,1.6],[2,.22,2.4],[.5,.25,1.6]],bass:[[1,1,3],[2,.3,5]]};
function genTrack(c){
  const B=60/c.bpm,bpb=c.bpb||4,bars=c.chords.length*(c.rep||2),len=Math.round(SR*B*bpb*bars),out=new Float32Array(len);
  let seed=c.seed||11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const note=(m,t0,d,v,ty)=>{const P=TIM[ty],i0=Math.round(t0*SR),n=Math.round(d*SR),w=2*Math.PI*mfq(m)/SR,att=Math.max(1,(ty==="pad"?.28:.006)*SR),rel=.03*SR;
    for(let i=0;i<n;i++){const t=i/n;let x=0;for(let k=0;k<P.length;k++)x+=P[k][1]*Math.sin(w*P[k][0]*i)*Math.exp(-P[k][2]*t);
      out[(i0+i)%len]+=v*x*Math.min(1,i/att)*Math.min(1,(n-i)/rel)}};
  const tick=(t0,v,d)=>{const i0=Math.round(t0*SR),n=Math.round(d*SR);let pv=0;for(let j=0;j<n;j++){const r=rnd()*2-1;out[(i0+j)%len]+=(r-pv)*.5*v*(1-j/n);pv=r}};
  for(let b=0;b<bars;b++){const ch=c.chords[b%c.chords.length],t=b*bpb*B;
    if(c.pad)ch[1].forEach((m,i)=>note(m,t+i*.012,bpb*B*.98,c.pad,"pad"));
    if(c.arp)c.arp.pat.forEach(([bt,ix])=>{const tt=t+bt*B;if(ix<0)ch[1].forEach((m,i)=>note(m+(c.arp.oct||0),tt+i*.014,(c.arp.d||1)*B,c.arp.v,c.arp.ty));else note(ch[1][ix%ch[1].length]+(c.arp.oct||0),tt,(c.arp.d||1)*B,c.arp.v,c.arp.ty)});
    if(c.bass)c.bass.pat.forEach(([bt,iv])=>note(ch[0]+iv,t+bt*B,B*(c.bass.d||.9),c.bass.v,"bass"));
    if(c.mel){const st=c.mel.step||.5;for(let k=0;k<bpb/st;k++)if(rnd()<c.mel.p)note(c.mel.scale[(rnd()*c.mel.scale.length)|0],t+k*st*B,(c.mel.d||1.4)*B,c.mel.v,c.mel.ty)}
    if(c.hat)c.hat.pat.forEach((bt,i)=>tick(t+bt*B,c.hat.v*(i%2?.6:1),.05));
    if(c.gong&&b%2===0)note(ch[0]-12,t,B*bpb*1.9,c.gong,"bell")}
  if(c.rain){let y=0,z=0;for(let i=0;i<len;i++){const r=rnd()*2-1;y+=.12*(r-y);z+=.5*(y-z);out[i]+=z*c.rain;if(rnd()<.0004){const n=Math.round(.03*SR);for(let j=0;j<n&&i+j<len;j++)out[i+j]+=(rnd()*2-1)*(1-j/n)*c.rain*.9}}}
  let y=0,pk=0;const a=c.lp||.5;for(let i=0;i<len;i++){y+=a*(out[i]-y);out[i]=y;pk=Math.max(pk,Math.abs(y))}
  const k=.75/(pk||1);for(let i=0;i<len;i++)out[i]*=k;return out}
const wavEngine=cfg=>{let el=null;return{start(){if(!el){el=new Audio(URL.createObjectURL(toWav(genTrack(cfg))));el.loop=true}el.volume=vol;return el.play()},stop(){if(el)el.pause()},vol(v){if(el)el.volume=v}}};
const HAT8=[0,.5,1,1.5,2,2.5,3,3.5];
const CFG={
 bossa:{bpm:92,seed:5,lp:.55,chords:[[36,[60,64,67,71]],[45,[57,60,64,67]],[38,[62,65,69,72]],[43,[59,62,65,67]],[41,[60,65,69,72]],[40,[59,62,64,68]],[45,[57,60,64,67]],[43,[59,62,65,67]]],rep:1,
   arp:{pat:[[0,-1],[1.5,-1],[3,-1]],ty:"pluck",v:.05,d:.7},bass:{pat:[[0,0],[1.5,7],[2,0],[3.5,7]],v:.2},hat:{pat:HAT8,v:.05},mel:{scale:[72,74,76,79,81,84],p:.28,v:.06,ty:"pluck",d:1.2}},
 gamelan:{bpm:66,seed:3,lp:.6,chords:[[38,[50,57,62]],[43,[55,62,67]],[40,[52,59,64]],[45,[57,64,69]]],rep:2,
   pad:.05,gong:.22,bass:{pat:[[0,0],[2,0]],v:.12,d:1.8},mel:{scale:[74,76,79,81,83,86,88],p:.7,step:1,v:.075,ty:"bell",d:2.2},arp:{pat:[[0,0],[1,2],[2,1],[3,2]],oct:12,ty:"bell",v:.035,d:2}},
 hujan:{bpm:54,seed:9,lp:.4,chords:[[33,[57,60,64,67]],[41,[53,57,60,64]],[36,[55,60,64,67]],[43,[55,59,62,66]]],rep:2,
   pad:.09,rain:.1,bass:{pat:[[0,0]],v:.12,d:3.6},mel:{scale:[76,79,81,84,88],p:.2,step:1,v:.06,ty:"bell",d:3}},
 gitar:{bpm:100,seed:21,lp:.6,chords:[[43,[55,59,62,67]],[38,[57,62,66,69]],[40,[55,59,64,67]],[36,[55,60,64,67]]],rep:2,
   arp:{pat:[[0,0],[.5,1],[1,2],[1.5,3],[2,2],[2.5,1],[3,3],[3.5,2]],oct:-12,ty:"pluck",v:.1,d:1.4},bass:{pat:[[0,0],[2,7]],v:.14},mel:{scale:[79,83,86,91],p:.1,v:.05,ty:"pluck"}},
 waltz:{bpm:132,bpb:3,seed:13,lp:.7,chords:[[36,[60,64,67,72]],[43,[59,62,67,71]],[33,[57,60,64,69]],[41,[60,65,69,72]]],rep:2,
   arp:{pat:[[1,-1],[2,-1]],ty:"bell",v:.03,d:.9},bass:{pat:[[0,0]],v:.17,d:2},mel:{scale:[79,81,83,84,86,88],p:.45,step:1,v:.06,ty:"bell",d:1.6}}
};
const T={lofi:{n:"Lofi Seduh",d:"Piano santai bernada pentatonik, pas untuk menemani baca resep.",e:lofi},
         jazz:{n:"Jazz Kafe",d:"Piano elektrik, bas, sikat drum, dan derak piringan hitam.",e:jazz},
         bossa:{n:"Bossa Sore",d:"Petikan nilon ala bossa nova dengan shaker lembut, enak untuk sore hari.",e:wavEngine(CFG.bossa)},
         gamelan:{n:"Gamelan Pagi",d:"Denting logam bernada pentatonik dan gong rendah yang tenang.",e:wavEngine(CFG.gamelan)},
         hujan:{n:"Hujan di Jendela",d:"Pad panjang yang hangat dengan rintik hujan, cocok untuk fokus.",e:wavEngine(CFG.hujan)},
         gitar:{n:"Gitar Pagi",d:"Fingerpicking gitar akustik yang cerah dengan bas sederhana.",e:wavEngine(CFG.gitar)},
         waltz:{n:"Waltz Kopi",d:"Kotak musik tiga ketukan yang manis, seperti dansa di sebelah mesin kopi.",e:wavEngine(CFG.waltz)}};
const sel=$("mpSel"),play=$("mpPlay"),mini=$("mpMini"),vr=$("mpVol");
if(!sel)return;
sel.innerHTML=Object.keys(T).map(k=>`<option value="${k}">${T[k].n}</option>`).join("");
if(!T[cur])cur="lofi";sel.value=cur;vr.value=Math.round(vol*100);
$("mpEq").innerHTML=Array.from({length:9},(_,i)=>`<i style="--n:${i}"></i>`).join("");
const save=()=>{try{localStorage.setItem("seduh.on",on?"1":"0");localStorage.setItem("seduh.track",cur);localStorage.setItem("seduh.vol",vol)}catch(e){}};
function paint(){const t=T[cur];$("mp").classList.toggle("playing",on);play.setAttribute("aria-pressed",on);play.setAttribute("aria-label",on?"Jeda musik":"Putar musik");play.textContent=on?"❚❚":"▶";
  $("mpNow").textContent=(on?"Sedang diputar: ":"Terpilih: ")+t.n+". "+t.d;mini.classList.toggle("on",on);$("mpMiniT").textContent=on?t.n:"Musik"}
function fail(){on=false;paint()}
function start(){try{const p=T[cur].e.start();if(p&&p.catch)p.catch(fail);on=true}catch(e){on=false}paint();save()}
function stop(){try{T[cur].e.stop()}catch(e){}on=false;paint();save()}
const toggle=()=>on?stop():start();
play.onclick=mini.onclick=toggle;
sel.onchange=()=>{const was=on;if(was){try{T[cur].e.stop()}catch(e){}on=false}cur=sel.value;if(was)start();else{paint();save()}};
vr.oninput=()=>{vol=vr.value/100;T[cur].e.vol(vol);save()};
document.addEventListener("visibilitychange",()=>{document.body.classList.toggle("idle",document.hidden);if(!on&&!paused)return;
  if(document.hidden&&on){try{T[cur].e.stop()}catch(e){}paused=true}else if(!document.hidden&&paused){paused=false;try{const p=T[cur].e.start();if(p&&p.catch)p.catch(fail)}catch(e){}}});
window.SeduhMusic={toggle,duck(ms){if(!on)return;T[cur].e.vol(vol*.3);clearTimeout(dk);dk=setTimeout(()=>T[cur].e.vol(vol),ms)}};
paint();
let want=false;try{want=localStorage.getItem("seduh.on")==="1"}catch(e){}
if(want){const first=e=>{removeEventListener("pointerdown",first,true);removeEventListener("keydown",first,true);if(e.target.closest&&e.target.closest("#mp,#mpMini"))return;start()};addEventListener("pointerdown",first,true);addEventListener("keydown",first,true)}
})();
