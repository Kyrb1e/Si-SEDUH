window.flyBits=(x,y,o={})=>{
 if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 const n=o.n||16,all=o.mode==="all",L=document.createElement("div");
 L.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:130;overflow:hidden";document.body.appendChild(L);
 const bean=c=>'<svg viewBox="0 0 20 28"><ellipse cx="10" cy="14" rx="8" ry="12" fill="'+c+'"/><path d="M10 3C4 10 16 18 10 25" stroke="#2b1b12" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>';
 const leaf=c=>'<svg viewBox="0 0 24 24"><path d="M3 21C3 9 11 3 21 3c0 10-6 18-18 18Z" fill="'+c+'"/><path d="M4.5 19.5 15 9" stroke="#eef3d8" stroke-width="1.3" stroke-linecap="round"/></svg>';
 const BC=["#5a3820","#7a4a27","#4a2c18","#8a5a2f"],LC=["#5f8040","#7ba052","#4a6b30","#93b563"];let end=0;
 for(let i=0;i<n;i++){
  const b=i%2===0,s=(b?14:18)+Math.random()*(all?16:8),d=document.createElement("i");
  d.style.cssText="position:absolute;left:"+(x-s/2)+"px;top:"+(y-s/2)+"px;width:"+s+"px;height:"+s+"px;will-change:transform,opacity";
  d.innerHTML=b?bean(BC[i%4]):leaf(LC[i%4]);d.firstChild.style.cssText="width:100%;height:100%;display:block";
  const a=all?Math.random()*Math.PI*2:Math.PI/2+(Math.random()-.5)*2.9,v=(all?140:110)+Math.random()*(all?260:170);
  const dx=Math.cos(a)*v,dy=Math.sin(a)*v,fall=(all?260:200)+Math.random()*160,rot=(Math.random()<.5?-1:1)*(180+Math.random()*540),dur=1300+Math.random()*900;end=Math.max(end,dur+150);
  d.animate([{transform:"translate(0,0) rotate(0deg) scale(.3)",opacity:1,easing:"cubic-bezier(.15,.8,.4,1)"},
   {transform:"translate("+dx+"px,"+dy+"px) rotate("+rot*.45+"deg) scale(1)",opacity:1,offset:.4,easing:"cubic-bezier(.5,0,.85,.6)"},
   {transform:"translate("+(dx*1.25+(Math.random()-.5)*60)+"px,"+(dy+fall)+"px) rotate("+rot+"deg) scale(.9)",opacity:0}],
   {duration:dur,delay:Math.random()*120,fill:"forwards"});
  L.appendChild(d)}
 setTimeout(()=>L.remove(),end+400)};
document.addEventListener("click",e=>{const b=e.target.closest(".sbrand");if(!b)return;
 const r=b.querySelector(".gcs").getBoundingClientRect();window.flyBits(r.left+r.width/2,r.top+r.height/2,{n:22})});
