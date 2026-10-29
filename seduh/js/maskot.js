(function(){
const $=id=>document.getElementById(id),RM=()=>matchMedia("(prefers-reduced-motion:reduce)").matches,R=a=>a[Math.floor(Math.random()*a.length)],INK="#2b1b12";
const FACE='<g><g class="mey"><ellipse cx="-9" cy="0" rx="3" ry="4" fill="'+INK+'"/><ellipse cx="9" cy="0" rx="3" ry="4" fill="'+INK+'"/><circle cx="-8" cy="-1.5" r="1.1" fill="#fff"/><circle cx="10" cy="-1.5" r="1.1" fill="#fff"/></g><circle class="chk" cx="-16" cy="7" r="3.6"/><circle class="chk" cx="16" cy="7" r="3.6"/><path class="mmo" d="M-5 6Q0 12 5 6" fill="none" stroke="'+INK+'" stroke-width="2.2" stroke-linecap="round"/></g>';
const SV={
hot:'<svg viewBox="0 0 96 104" aria-hidden="true"><g class="stz" fill="none" stroke="#b08a6a" stroke-width="3" stroke-linecap="round"><path d="M28 30Q22 22 28 15T28 4"/><path d="M42 30Q36 22 42 15T42 2"/><path d="M56 30Q50 22 56 15T56 4"/></g><path d="M72 54H80Q92 54 92 65Q92 76 80 76H70" fill="none" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/><path d="M12 40H72V74Q72 96 50 96H34Q12 96 12 74Z" fill="#fffaf2" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><ellipse cx="42" cy="40" rx="30" ry="7" fill="#8a4a1c" stroke="'+INK+'" stroke-width="3"/><g transform="translate(42 70)">'+FACE+'</g></svg>',
cold:'<svg viewBox="0 0 96 104" aria-hidden="true"><path d="M52 36L62 6H78" fill="none" stroke="#e0603a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 32H72L65 92Q64 98 58 98H26Q20 98 19 92Z" fill="#dcedfb"/><path d="M15 50H69L65 92Q64 98 58 98H26Q20 98 19 92Z" fill="#8cc4ee"/><path d="M12 32H72L65 92Q64 98 58 98H26Q20 98 19 92Z" fill="none" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><g class="ic"><rect x="22" y="38" width="15" height="15" rx="3" fill="#fff" fill-opacity=".9" stroke="'+INK+'" stroke-width="2" transform="rotate(-12 29 45)"/><rect x="42" y="36" width="14" height="14" rx="3" fill="#fff" fill-opacity=".9" stroke="'+INK+'" stroke-width="2" transform="rotate(10 49 43)"/></g><g transform="translate(42 74)">'+FACE+'</g></svg>'};
const NAME={hot:"Si Hangat",cold:"Si Sejuk"},box=document.createElement("div");box.id="mates";
box.innerHTML=["hot","cold"].map(k=>'<div class="mate '+k+'" id="m_'+k+'" role="button" tabindex="0" aria-label="'+NAME[k]+', klik untuk ngobrol"><div class="mb" role="status"></div>'+SV[k]+'</div>').join("");
document.body.appendChild(box);
const M={hot:$("m_hot"),cold:$("m_cold")},tm={};
function say(k,t,ms){const m=M[k],b=m.querySelector(".mb");b.innerHTML="<b>"+NAME[k]+"</b>"+t;b.classList.add("on");m.classList.add("talk");clearTimeout(tm[k]);tm[k]=setTimeout(()=>{b.classList.remove("on");m.classList.remove("talk")},ms||3800)}
const busy=()=>box.querySelector(".mb.on");
function act(k,c){const m=M[k];m.classList.remove("jump","spin");void m.offsetWidth;m.classList.add(c);setTimeout(()=>m.classList.remove(c),900)}
function burst(x,y,k,n){if(RM())return;const E={hot:["☕","✨","♨️","💛","🔥"],cold:["❄️","🧊","💧","✨","💙"]};for(let i=0;i<n;i++){const s=document.createElement("span"),a=Math.random()*6.28,d=50+Math.random()*90,kk=k=="mix"?(i%2?"hot":"cold"):k;s.className="pf";s.textContent=R(E[kk]);s.style.cssText="left:"+x+"px;top:"+y+"px;--dx:"+Math.cos(a)*d+"px;--dy:"+(Math.sin(a)*d-40)+"px;font-size:"+(14+Math.random()*14)+"px";document.body.appendChild(s);setTimeout(()=>s.remove(),1100)}}
const ctr=k=>{const r=M[k].getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/3]};
const L={splash:[["hot","Ayo masuk, aku sudah siap!"],["cold","Tekan tombol Masuk, ya!"]],
hub:[["hot","Pilih satu ya, jangan bingung!"],["cold","Resep, game, atau kafe? Semuanya seru."],["hot","Aku paling suka bagian resep."],["cold","Coba Barista Lab, shot-nya bikin deg-degan!"]],
cafe:[["cold","Coba filter Wi-Fi dan stop kontak kalau mau garap tugas."],["hot","Klik kartu kafe buat lihat detailnya."],["cold","Bingung? Tekan Acak kafe!"],["hot","Cek jam buka dulu sebelum berangkat."]],
lab:[["hot","Shot terbaik itu sabar, bukan buru-buru."],["cold","Yield terlalu tinggi bikin pahit, lho."],["hot","Pilih beans dulu, lalu atur mesinnya."],["cold","Kumpulkan XP biar naik rank!"]]};
const GEN=[["hot","Hei, kamu! Klik aku dong."],["cold","Brrr, aku lagi segar-segarnya."],["hot","Sudah minum air hari ini?"],["cold","Tos dulu, yuk!"]];
const POKE={hot:["Hihi, geli!","Hangat, kan?","Hati-hati, aku panas!","Seruput dulu!","Aku masih ngebul, nih."],cold:["Brr, dingin!","Es batunya goyang!","Segar!","Jangan diaduk-aduk dong!","Cling cling!"]};
const GREET={hub:[["hot","Selamat datang di Si SEDUH! Aku Si Hangat."],["cold","Dan aku Si Sejuk. Mau mulai dari mana?"]],cafe:[["cold","Mau ngopi di mana? Aku bantu cari!"],["hot","Bandung atau Nangor, dua-duanya asyik."]],lab:[["hot","Siap kalibrasi? Aku nonton dari sini."],["cold","Semangat, barista!"]]};
const VM={"":"splash",hub:"hub",lab:"lab",cafe:"cafe",bahan:"resep",perlengkapan:"resep",menu:"resep"};
const view=()=>VM[location.hash.replace(/^#\/?/,"")]||"splash";
let cur=null,go=false;
function hush(){Object.keys(M).forEach(k=>{clearTimeout(tm[k]);M[k].querySelector(".mb").classList.remove("on");M[k].classList.remove("talk")})}
function sync(fromGo){const v=view();document.body.dataset.view=v;if(v===cur)return;cur=v;hush();if(v==="resep")return;(GREET[v]||L[v]||[]).forEach((p,i)=>setTimeout(()=>{if(view()===v){say(p[0],p[1]);act(p[0],"jump")}},(fromGo?900:500)+i*2300))}
addEventListener("hashchange",()=>{sync(go);go=false});addEventListener("popstate",()=>sync(false));sync(false);
function tick(){const v=view();if(v!=="resep"&&!document.hidden&&!busy()&&!/^(INPUT|SELECT|TEXTAREA)$/.test((document.activeElement||{}).tagName||"")&&!$("cfModal")){const p=R((L[v]||[]).concat(GEN));say(p[0],p[1]);if(Math.random()<.5)act(p[0],"jump");if(Math.random()<.4){const o=p[0]=="hot"?"cold":"hot";setTimeout(()=>{say(o,R(POKE[o]),2200);act(o,"jump")},2400)}}setTimeout(tick,6000+Math.random()*5000)}
setTimeout(tick,4500);
let clicks=[];
Object.keys(M).forEach(k=>{const go1=()=>{say(k,R(POKE[k]),2400);act(k,"jump");const c=ctr(k);burst(c[0],c[1],k,8);const n=Date.now();clicks=clicks.filter(t=>n-t<3000);clicks.push(n);if(clicks.length>=5){clicks=[];act("hot","spin");act("cold","spin");const a=ctr("hot"),b=ctr("cold");burst(a[0],a[1],"mix",14);burst(b[0],b[1],"mix",14);say("hot","Tos!!",2200);setTimeout(()=>say("cold","Kompak banget kita!",2400),500)}};M[k].addEventListener("click",go1);M[k].addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go1()}})});
let pr=null;addEventListener("pointermove",e=>{if(pr)return;pr=requestAnimationFrame(()=>{pr=null;Object.keys(M).forEach(k=>{const r=M[k].getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height*.7),d=Math.hypot(dx,dy)||1,s=Math.min(2.6,d/60);M[k].style.setProperty("--ex",dx/d*s+"px");M[k].style.setProperty("--ey",dy/d*s+"px")})})},{passive:true});
document.addEventListener("click",e=>{
 const h=e.target.closest("[data-home]");
 if(h){const t=h.dataset.home;h.classList.remove("hpop");void h.offsetWidth;h.classList.add("hpop");setTimeout(()=>h.classList.remove("hpop"),800);
  const top=()=>scrollTo({top:0,behavior:RM()?"auto":"smooth"});
  if(t==="cafe"){e.preventDefault();
   const dirty=$("cfQ").value||(document.querySelector("#cfArea .on")||{}).dataset.k!=="Semua"||document.querySelector("#cfFac .on,#cfUse .on,#cfNow.on,#cfFavF.on")||$("cfDist").value||$("cfSort").value!=="best"||$("cfModal")||scrollY>80;
   if(dirty){const x=document.querySelector("#cfModal .cf-x");if(x)x.click();$("cfReset").click();top();say("cold","Kembali ke awal, filter sudah bersih!",2400);act("cold","jump")}
   else{say("hot","Sudah di awal, kuantar ke Beranda ya!",1800);act("hot","jump");setTimeout(()=>{go=true;location.hash="#/hub"},500)}}
  else if(location.hash==="#/hub"){e.preventDefault();top();say("hot","Balik ke atas!",1800);act("hot","jump")}
  else{say("hot","Balik ke awal!",2200);act("hot","jump");setTimeout(()=>{say("cold","Mulai lagi, yuk!",2200);act("cold","jump")},500)}
  return}
 if(e.target.closest("#cfRand")){say("cold","Serahkan ke aku, pasti pas!",2500);act("cold","spin")}
 else if(e.target.closest("[data-fav]")){say("hot","Disimpan! Favoritmu makin banyak.",2500);act("hot","jump")}
 else if(e.target.closest(".cf-card")&&Math.random()<.6)say("cold","Wah, tempatnya bagus!",2500);
 else if(e.target.closest(".cf-chip")&&Math.random()<.3)say("hot","Filter baru, hasil baru!",2200);
},true);
let lt="",lc=0;document.addEventListener("mouseover",e=>{const t=e.target.closest(".hb-tile");if(!t)return;const g=t.getAttribute("href"),n=Date.now();if(n-lc<2500||(g===lt&&n-lc<8000))return;lt=g;lc=n;const p=g.includes("lab")?["hot","Barista Lab: tegang tapi seru!"]:g.includes("cafe")?["cold","Cari kafe baru yuk, semangat ngopi!"]:["hot","Resep favoritku! Ada yang panas, ada yang dingin."];say(p[0],p[1],2600);act(p[0],"jump")});
addEventListener("message",e=>{const d=e.data||{};if(d.seduh==="lab-home"){say("hot","Balik ke awal!",2200);act("hot","jump");setTimeout(()=>say("cold","Pilih beans lagi, yuk!",2200),500)}else if(d.seduh==="go-hub"){say("cold","Sudah di awal, kuantar ke Beranda ya!",1800);act("cold","jump");setTimeout(()=>{go=true;location.hash="#/hub"},500)}});
/* Efek tombol Masuk: tos cangkir */
document.addEventListener("click",e=>{
 const b=e.target.closest("#sv-splash .btn");if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 const enter=()=>{go=true;if(location.hash!=="#/hub")location.hash="#/hub"};
 if(RM()){enter();return}
 if($("goFx")){$("goFx").dispatchEvent(new Event("skip"));return}
 const o=document.createElement("div");o.id="goFx";o.setAttribute("aria-hidden","true");
 const sp=Array.from({length:10},(_,i)=>'<i class="sp" style="--a:'+(i*36+8)+'deg;--r:'+(70+i%3*26)+'px"></i>').join("");
 o.innerHTML='<div class="gm hot">'+SV.hot+'</div><div class="gm cold">'+SV.cold+'</div><div class="gsp">'+sp+'</div><i class="gring"></i><b class="gt">Tos!</b>';
 document.body.appendChild(o);
 let done=false;const T=[];
 const fin=()=>{if(done)return;done=true;T.forEach(clearTimeout);removeEventListener("keydown",kd);enter();o.classList.add("out");setTimeout(()=>o.remove(),500)};
 const kd=ev=>{if(ev.key==="Escape"||ev.key==="Enter")fin()};
 T.push(setTimeout(()=>{o.classList.add("hit");try{burst(innerWidth/2,innerHeight*.52,"mix",22)}catch(x){}try{window.flyBits(innerWidth/2,innerHeight*.52,{n:34,mode:"all"})}catch(x){}},780));
 T.push(setTimeout(fin,1750));
 o.addEventListener("skip",fin);o.addEventListener("click",fin);addEventListener("keydown",kd);
},true);
})();
