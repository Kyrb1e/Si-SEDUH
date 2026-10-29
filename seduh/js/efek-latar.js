(function(){
"use strict";
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,FINE=matchMedia("(pointer: fine)").matches;
const BC=["#4a2c17","#6a3d1f","#3a1f10"],LC=["#6f9448","#86ad52","#3f5a22","#c4902f"],R=(a,b)=>a+Math.random()*(b-a);
function bean(x,s,c){x.fillStyle=c;x.beginPath();x.ellipse(0,0,s*.5,s*.78,0,0,6.283);x.fill();x.strokeStyle="rgba(241,228,207,.85)";x.lineWidth=Math.max(1,s*.1);x.beginPath();x.moveTo(0,-s*.6);x.quadraticCurveTo(-s*.25,0,0,0);x.quadraticCurveTo(s*.25,0,0,s*.6);x.stroke()}
function leaf(x,s,c){x.fillStyle=c;x.beginPath();x.moveTo(0,-s);x.quadraticCurveTo(s*.8,0,0,s);x.quadraticCurveTo(-s*.8,0,0,-s);x.fill();x.strokeStyle="rgba(255,255,255,.5)";x.lineWidth=Math.max(1,s*.08);x.beginPath();x.moveTo(0,-s*.8);x.lineTo(0,s*.8);x.stroke()}
const PC=["#b5532a","#d98a2b","#8a3b22","#c9661f","#e0a53a"],KC=["#5a2a16","#6b3520","#3d1d10"];
function pod(x,s,c){x.fillStyle=c;x.beginPath();x.moveTo(0,-s);x.quadraticCurveTo(s*1.3,-s*.1,0,s);x.quadraticCurveTo(-s*1.3,-s*.1,0,-s);x.fill();
  x.strokeStyle="rgba(60,25,10,.55)";x.lineWidth=Math.max(1,s*.08);x.lineCap="round";
  [-.38,0,.38].forEach(o=>{x.beginPath();x.moveTo(0,-s*.92);x.quadraticCurveTo(s*o*1.7,0,0,s*.92);x.stroke()});
  x.fillStyle="rgba(255,255,255,.28)";x.beginPath();x.ellipse(-s*.22,-s*.2,s*.1,s*.34,.25,0,6.283);x.fill();
  x.fillStyle="#5f7a35";x.fillRect(-s*.1,-s*1.12,s*.2,s*.2)}
function choc(x,s,c){const w=s*.95;x.fillStyle=c;x.beginPath();if(x.roundRect)x.roundRect(-w/2,-w/2,w,w,w*.16);else x.rect(-w/2,-w/2,w,w);x.fill();
  x.strokeStyle="rgba(0,0,0,.4)";x.lineWidth=Math.max(1,s*.07);x.beginPath();x.moveTo(0,-w/2);x.lineTo(0,w/2);x.moveTo(-w/2,0);x.lineTo(w/2,0);x.stroke();
  x.fillStyle="rgba(255,255,255,.2)";x.fillRect(-w*.42,-w*.42,w*.3,w*.1)}
const draw=(k,x,s,c)=>k===1?leaf(x,s,c):k===2?pod(x,s,c):k===3?choc(x,s,c):bean(x,s,c);
const mk=(k)=>({k,c:k===1?LC[(Math.random()*4)|0]:k===2?PC[(Math.random()*5)|0]:k===3?KC[(Math.random()*3)|0]:BC[(Math.random()*3)|0]});

/* ---- Kursor: 6 pengikut (bean & daun) yang mengorbit, plus jejak jatuh ---- */
if(!RM){
  const cv=document.createElement("canvas");cv.id="curfx";cv.setAttribute("aria-hidden","true");document.body.appendChild(cv);
  const g=cv.getContext("2d");let W,H,dp;
  const size=()=>{dp=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dp;cv.height=H*dp;g.setTransform(dp,0,0,dp,0,0)};size();addEventListener("resize",size);
  const P=[],F=[];let mx=0,my=0,lx=0,ly=0,seen=false,run=false,idle=0;
  if(FINE)for(let i=0;i<8;i++){const o=mk(i%4);F.push({x:-50,y:-50,r:0,s:[8.5,10,11,8][i%4],k:o.k,c:o.c,e:.2-i*.02})}
  function spawn(x,y,n,burst){for(let i=0;i<n;i++){const o=mk((Math.random()*4)|0),a=R(0,6.283),v=burst?R(2,7):R(.1,.5);
    P.push({x,y,vx:burst?Math.cos(a)*v:R(-.5,.5),vy:burst?Math.sin(a)*v-2:R(.2,.8),s:R(5,burst?13:9)*(o.k===2?1.35:1),r:R(0,6.28),vr:R(-.15,.15),a:0,l:burst?R(45,80):R(40,70),k:o.k,c:o.c})}}
  function loop(now){
    g.clearRect(0,0,W,H);idle++;
    if(seen&&FINE){const t=now/1000;F.forEach((f,i)=>{const an=t*(1.6+i*.15)+i*.785,rad=20+i*4.5,tx=mx+Math.cos(an)*rad,ty=my+Math.sin(an)*rad*.8;
      const px=f.x,py=f.y;f.x+=(tx-f.x)*f.e;f.y+=(ty-f.y)*f.e;const dx=f.x-px,dy=f.y-py;if(dx*dx+dy*dy>.3)f.r+=((Math.atan2(dy,dx)+1.57)-f.r)*.15;
      g.globalAlpha=idle>420?Math.max(0,1-(idle-420)/60):1;g.save();g.translate(f.x,f.y);g.rotate(f.r);draw(f.k,g,f.s,f.c);g.restore()})}
    for(let i=P.length-1;i>=0;i--){const p=P[i];p.a++;if(p.a>=p.l){P.splice(i,1);continue}
      p.vy+=.06;p.vx*=.98;p.x+=p.vx+Math.sin(p.a*.12+p.r)*.35;p.y+=p.vy;p.r+=p.vr;
      g.globalAlpha=Math.min(1,(p.l-p.a)/18);g.save();g.translate(p.x,p.y);g.rotate(p.r);draw(p.k,g,p.s,p.c);g.restore()}
    g.globalAlpha=1;
    if(idle<480||P.length)requestAnimationFrame(loop);else{run=false;g.clearRect(0,0,W,H)}
  }
  const wake=()=>{idle=0;if(!run){run=true;requestAnimationFrame(loop)}};
  addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;mx=e.clientX;my=e.clientY;if(!seen){seen=true;F.forEach(f=>{f.x=mx;f.y=my})}
    if(Math.hypot(mx-lx,my-ly)>16){spawn(mx,my,1,false);lx=mx;ly=my}wake()},{passive:true});
  addEventListener("pointerdown",e=>{spawn(e.clientX,e.clientY,e.pointerType==="mouse"?12:9,true);wake()},{passive:true});
  document.addEventListener("mouseleave",()=>{seen=false});document.addEventListener("mouseenter",()=>{seen=true});
}

/* ---- Transisi dramatis kembali ke Beranda: pusaran beans & daun, lalu meledak ---- */
window.__homeReturn=function(){
  const ov=document.createElement("div");ov.className="hrx";ov.setAttribute("aria-hidden","true");
  ov.innerHTML='<div class="hrx-wipe"></div><canvas></canvas><div class="hrx-core"><div class="hrx-badge"><i></i><i></i><span class="gcs"></span></div></div>';
  document.body.appendChild(ov);
  const cv=ov.querySelector("canvas"),dp=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;cv.width=W*dp;cv.height=H*dp;
  const x=cv.getContext("2d");x.setTransform(dp,0,0,dp,0,0);
  const cx=W/2,cy=H*.46,ps=[];
  for(let i=0;i<140;i++){const o=mk(i%4);ps.push({k:o.k,c:o.c,a:R(0,6.283),rad:R(.5,1)*Math.max(W,H)*.7,s:R(11,28),r:R(0,6),sp:R(.8,1.2),b:false,l:0,vx:0,vy:0,x:cx,y:cy})}
  const t0=performance.now();
  (function tick(now){
    if(!ov.isConnected)return;const t=now-t0;x.clearRect(0,0,W,H);
    ps.forEach(p=>{let al;
      if(t<2700){const u=Math.min(1,Math.max(0,(t-300)/2400)),e=u*u*(3-2*u),rad=p.rad*(1-e)+12,an=p.a+e*8*p.sp;p.x=cx+Math.cos(an)*rad;p.y=cy+Math.sin(an)*rad*.8;p.r+=.12;al=Math.min(1,u*3)}
      else{if(!p.b){p.b=true;const a=R(0,6.283),v=R(7,22);p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v-5}p.l++;p.vy+=.4;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=.1;al=Math.max(0,1-p.l/150)}
      if(al<=0)return;x.globalAlpha=al;x.save();x.translate(p.x,p.y);x.rotate(p.r);draw(p.k,x,p.s,p.c);x.restore()});
    x.globalAlpha=1;if(t<5200)requestAnimationFrame(tick)})(t0);
  setTimeout(()=>ov.classList.add("out"),4300);setTimeout(()=>ov.remove(),5300);
};
})();
