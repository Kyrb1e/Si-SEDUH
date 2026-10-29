/* ===== EFEK MASUK APLIKASI: Resep / Barista Lab / Cafe Finder ===== */
(function(){
"use strict";
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,running=false;
var LITE=Math.min(innerWidth,innerHeight)<600||(navigator.hardwareConcurrency||8)<=4,CAP=LITE?110:260,RATE=LITE?.5:1;
var R=function(a,b){return a+Math.random()*(b-a)},PI2=Math.PI*2;
var TH={
  "#/bahan":{k:"resep",sub:"Pilih alat & bahan, lalu seduh",hit:"Seduh!",wipe:["#8a2f1c","#e2603f","#f1cdbd","#f5eee2"]},
  "#/lab":{k:"lab",sub:"Kalibrasi shot, kumpulkan XP",hit:"Mulai!",wipe:["#2b1b12","#5a3820","#e9b95f","#f5eee2"]},
  "#/cafe":{k:"cafe",sub:"Dari Bandung sampai Nangor",hit:"Ketemu!",wipe:["#2f4a1c","#5f8040","#dde7c4","#f5eee2"]}
};
var BEAN=["#8d5a33","#a8713d","#6e4325","#c08a4f"],LEAF=["#86ad52","#6f9448","#a8c96a","#5d8a3a"],PIN=["#e2603f","#f0c36b","#ffffff","#8fb85a","#6fa8dc"],DROP=["#e2603f","#ffd9c7","#ffffff","#f0c36b"];

window.addEventListener("click",function(e){
  var a=e.target&&e.target.closest?e.target.closest("#sv-hub .hb-tile"):null;
  if(!a||e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;
  var th=TH[a.getAttribute("href")];
  if(!th||RM)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(running)return;
  var r=a.getBoundingClientRect(),kb=!e.clientX&&!e.clientY;
  run(a,th,kb?r.left+r.width/2:e.clientX,kb?r.top+r.height/2:e.clientY);
},true);

function run(tile,th,ox,oy){
  running=true;
  var W=innerWidth,H=innerHeight,CX=W/2,CY=H*.47,K=1,S=200,href=tile.getAttribute("href");
  var name=(tile.querySelector("h2")||{}).textContent||"",icEl=tile.querySelector(".ic"),icSvg=icEl&&icEl.querySelector("svg");
  var kk=0,title=name.split(" ").map(function(w){
    return '<span class="w">'+w.split("").map(function(ch){return '<span style="--k:'+(kk++)+';--r:'+Math.round(R(-20,20))+'deg">'+ch+'</span>'}).join("")+'</span>';
  }).join(" ");
  var gauge=th.k==="lab"?'<svg class="af-gauge" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="46"/><circle class="tck" cx="50" cy="50" r="49"/><circle class="prg" cx="50" cy="50" r="46"/></svg>':"";
  var root=document.createElement("div");
  root.id="afx";root.className="t-"+th.k;root.setAttribute("aria-hidden","true");
  root.style.setProperty("--ox",ox+"px");root.style.setProperty("--oy",oy+"px");
  root.innerHTML=
   '<div class="af-stage"><div class="af-blob b1"></div><div class="af-blob b2"></div>'+
    (th.k==="cafe"?'<div class="af-grid"></div><div class="af-rays sweep"><i></i></div>':'<div class="af-rays"><i></i></div>')+
    (th.k==="resep"?'<div class="af-liq l1"></div><div class="af-liq l2"></div>':'')+
    '<div class="af-vig"></div>'+
    '<div class="af-shake">'+
      (th.k==="lab"?'<div class="af-stream"></div>':'')+
      '<canvas class="af-cv"></canvas>'+
      '<div class="af-head"><div class="af-title">'+title+'</div><div class="af-sub">'+th.sub.replace(/&/g,"&amp;")+'</div></div>'+
      '<div class="af-icon"><div class="af-pop"><div class="af-disc"></div><span class="ic al">'+(icSvg?icSvg.outerHTML:"")+'</span>'+gauge+'</div></div>'+
      '<div class="af-go"></div>'+
    '</div><div class="af-flash"></div></div>'+
   '<button type="button" class="af-skip">Lewati ›</button>'+
   '<div class="af-wipe">'+th.wipe.map(function(c,i){return '<i style="--k:'+i+';--wc:'+c+'"></i>'}).join("")+'</div>';
  document.body.appendChild(root);

  var cv=root.querySelector(".af-cv"),g=cv.getContext("2d"),dp=Math.min(LITE?1.5:2,devicePixelRatio||1),iconEl=root.querySelector(".af-icon"),goEl=root.querySelector(".af-go");
  function size(){W=innerWidth;H=innerHeight;cv.width=W*dp;cv.height=H*dp;g.setTransform(dp,0,0,dp,0,0);K=Math.max(.75,Math.min(1.4,Math.min(W,H)/620))}
  size();addEventListener("resize",size);
  /* FLIP: ikon mulai tepat di posisi ikon kartu lalu terbang ke tengah */
  var ir=iconEl.getBoundingClientRect();S=ir.width;CX=ir.left+S/2;CY=ir.top+S/2;
  var tr=(icEl||tile).getBoundingClientRect();
  iconEl.style.setProperty("--fx",(tr.left+tr.width/2-CX)+"px");
  iconEl.style.setProperty("--fy",(tr.top+tr.height/2-CY)+"px");
  iconEl.style.setProperty("--fs",Math.max(.15,Math.min(1,tr.width/(S*.74)||.4)));
  if(th.k==="lab")root.querySelector(".af-stream").style.setProperty("--sh2",Math.max(40,CY-S*.5)+"px");

  var P=[],RING=[],STM=[],PINQ=[],acc={a:0,b:0,c:0,d:0};
  var t0=performance.now(),last=t0,alive=true,hit=false,wiping=false,phase="play",T=[];
  function at(ms,fn){T.push(setTimeout(fn,ms))}
  function say(txt){goEl.textContent=txt;goEl.classList.remove("pop");void goEl.offsetWidth;goEl.classList.add("pop")}
  function ring(o){o.age=0;o.delay=o.delay||0;o.x=o.x==null?CX:o.x;o.y=o.y==null?CY:o.y;RING.push(o)}

  function add(o){
    var p={ty:o.ty,x:o.x,y:o.y,vx:o.vx||0,vy:o.vy||0,r:R(0,6.28),vr:R(-4,4),s:(o.s||R(10,24))*K,z:R(.55,1),age:0,life:o.life||99,mode:o.mode,
      col:o.col||(o.ty==="leaf"?LEAF[(Math.random()*4)|0]:BEAN[(Math.random()*4)|0]),a:o.a||0,rho:o.rho||0,w:o.w||0,gy:o.gy||0,b:0,landed:false,sc:1};
    if(o.ty==="spark")p.vr*=.2;
    P.push(p);return p;
  }
  function rainType(){var r=Math.random();
    if(th.k==="resep")return r<.4?"ice":r<.8?"pearl":"spark";
    if(th.k==="lab")return r<.8?"bean":"spark";
    return r<.75?"leaf":"spark";}
  function burstType(){var r=Math.random();
    if(th.k==="resep")return r<.28?"ice":r<.5?"pearl":r<.78?"drop":"spark";
    if(th.k==="lab")return r<.55?"bean":r<.75?"drop":"spark";
    return r<.55?"leaf":"spark";}

  function drawP(p){
    var a=p.mode==="pin"?1:Math.min(1,p.age/.25,(p.life-p.age)/.5);if(a<=0)return;
    var s=p.s*(.6+.4*p.z);
    g.globalAlpha=a*(p.mode==="pin"?1:(.55+.45*p.z));
    g.globalCompositeOperation=p.ty==="spark"?"lighter":"source-over";
    g.save();g.translate(p.x,p.y);
    if(p.ty==="pin"){
      g.globalAlpha=.28*(p.landed?1:.5);g.fillStyle="#000";g.beginPath();g.ellipse(0,0,s*.4,s*.14,0,0,PI2);g.fill();g.globalAlpha=1;
      var sc=p.sc;g.scale(sc,sc);s=p.s;
      g.fillStyle=p.col;g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=1.5;
      g.beginPath();g.moveTo(0,0);g.bezierCurveTo(-s*.62,-s*.55,-s*.55,-s*1.45,0,-s*1.45);g.bezierCurveTo(s*.55,-s*1.45,s*.62,-s*.55,0,0);g.fill();g.stroke();
      g.fillStyle=p.col==="#ffffff"?"#e2603f":"#fff";g.beginPath();g.arc(0,-s*.95,s*.2,0,PI2);g.fill();
      g.restore();return;
    }
    g.rotate(p.r);
    if(p.ty==="bean"){
      g.fillStyle=p.col;g.beginPath();g.ellipse(0,0,s*.5,s*.78,0,0,PI2);g.fill();
      g.strokeStyle="rgba(241,228,207,.85)";g.lineWidth=Math.max(1,s*.1);
      g.beginPath();g.moveTo(0,-s*.6);g.quadraticCurveTo(-s*.25,0,0,0);g.quadraticCurveTo(s*.25,0,0,s*.6);g.stroke();
    }else if(p.ty==="leaf"){
      g.fillStyle=p.col;g.beginPath();g.moveTo(0,-s);g.quadraticCurveTo(s*.8,0,0,s);g.quadraticCurveTo(-s*.8,0,0,-s);g.fill();
      g.strokeStyle="rgba(255,255,255,.5)";g.lineWidth=Math.max(1,s*.08);g.beginPath();g.moveTo(0,-s*.8);g.lineTo(0,s*.8);g.stroke();
    }else if(p.ty==="bub"){
      g.fillStyle="rgba(255,255,255,.12)";g.strokeStyle="rgba(255,255,255,.6)";g.lineWidth=1.5;
      g.beginPath();g.arc(0,0,s*.55,0,PI2);g.fill();g.stroke();
      g.fillStyle="rgba(255,255,255,.75)";g.beginPath();g.arc(-s*.2,-s*.2,s*.12,0,PI2);g.fill();
    }else if(p.ty==="ice"){
      var w=s*.9;g.fillStyle="rgba(205,235,255,.38)";g.strokeStyle="rgba(255,255,255,.75)";g.lineWidth=1.5;
      g.beginPath();if(g.roundRect)g.roundRect(-w/2,-w/2,w,w,w*.2);else g.rect(-w/2,-w/2,w,w);g.fill();g.stroke();
      g.strokeStyle="rgba(255,255,255,.8)";g.beginPath();g.moveTo(-w*.28,-w*.2);g.lineTo(-w*.28,w*.1);g.stroke();
    }else if(p.ty==="pearl"){
      g.fillStyle="#2b1b12";g.beginPath();g.arc(0,0,s*.38,0,PI2);g.fill();
      g.fillStyle="rgba(255,255,255,.55)";g.beginPath();g.arc(-s*.12,-s*.12,s*.09,0,PI2);g.fill();
    }else if(p.ty==="drop"){
      g.fillStyle=p.col;g.beginPath();g.arc(0,0,s*.26,0,PI2);g.fill();
    }else{
      var sp=s*(.7+.3*Math.sin(p.age*9));g.fillStyle="#ffd98a";g.beginPath();
      for(var i=0;i<8;i++){var an=i*Math.PI/4-Math.PI/2,rr=i%2?sp*.28:sp;g.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}
      g.closePath();g.fill();
    }
    g.restore();
  }

  function doHit(){
    if(hit)return;hit=true;root.classList.add("hit");
    try{navigator.vibrate&&navigator.vibrate(18)}catch(x){}
    say(th.hit);
    var M=Math.max(W,H)*.75,acc2=th.k==="resep"?"255,160,120":th.k==="lab"?"233,185,95":"190,235,120";
    ring({life:.85,max:M,col:"255,244,224",w:10});
    ring({life:1.05,max:M,col:acc2,w:6,delay:.08});
    ring({life:1.25,max:M,col:"255,244,224",w:3,delay:.18});
    P.forEach(function(p){
      if(p.mode==="orbit"){var dx=p.x-CX,dy=p.y-CY,d=Math.hypot(dx,dy)||1,v=R(380,900);p.vx=dx/d*v;p.vy=dy/d*v-120;p.mode="burst";p.age=0;p.life=R(1.4,2.4)}
      if(p.mode==="pin"){p.vy=-R(380,540);p.landed=false;p.b=1;p.sc=1.25}
    });
    for(var i=0;i<(LITE?45:80);i++){
      var a=R(0,PI2),v=R(260,1000),ty=burstType();
      add({ty:ty,x:CX+Math.cos(a)*R(0,24),y:CY+Math.sin(a)*R(0,24),vx:Math.cos(a)*v,vy:Math.sin(a)*v-200,mode:"burst",life:R(1.4,2.5),s:ty==="drop"?R(10,20):null,col:ty==="drop"?(th.k==="resep"?DROP[(Math.random()*4)|0]:BEAN[(Math.random()*4)|0]):null});
    }
  }

  function frame(now){
    if(!alive)return;
    var dt=Math.min(.05,(now-last)/1000),t=(now-t0)/1000;last=now;var sdt=dt*RATE;
    g.globalCompositeOperation="source-over";g.globalAlpha=1;g.clearRect(0,0,W,H);
    var cap=P.length<CAP,k=th.k;
    /* --- spawner per tema --- */
    if(!wiping){
      if(k==="resep"){
        acc.a+=sdt*(hit?20:48);while(acc.a>=1){acc.a--;if(cap){var ty=rainType();add({ty:ty,x:R(-20,W+20),y:-30,vx:R(-30,30),vy:R(150,340),mode:"fall",life:9})}}
        acc.b+=sdt*24;while(acc.b>=1){acc.b--;if(cap)add({ty:"bub",x:R(0,W),y:H+24,vx:R(-12,12),vy:-R(70,200),mode:"rise",life:7,s:R(8,24)})}
      }else if(k==="lab"){
        if(!hit){acc.a+=sdt*60;while(acc.a>=1){acc.a--;if(cap){var an=R(0,PI2);add({ty:"bean",x:CX,y:CY,a:an,rho:Math.max(W,H)*R(.55,.8),w:R(1.4,2.6),mode:"orbit",life:9})}}}
        else{acc.a+=sdt*14;while(acc.a>=1){acc.a--;if(cap)add({ty:"bean",x:R(0,W),y:-30,vx:R(-15,15),vy:R(90,200),mode:"fall",life:8})}}
        if(t>.55&&t<1.2||hit){acc.b+=sdt*(hit?12:34);while(acc.b>=1){acc.b--;add({ty:"drop",x:CX,y:CY-S*.52,vx:R(-280,280),vy:-R(180,520),mode:"burst",life:R(.6,1.1),s:R(8,16),col:BEAN[(Math.random()*4)|0]})}}
        if(t>.5){acc.c+=sdt*9;while(acc.c>=1){acc.c--;if(STM.length<(LITE?12:28))STM.push({x:CX+R(-.4,.4)*S,y:CY-S*.5,r:R(26,44),age:0,life:R(1.6,2.4),vx:R(-8,8)})}}
      }else{
        acc.a+=sdt*(hit?18:10);while(acc.a>=1){acc.a--;if(cap){var ty2=rainType();add({ty:ty2,x:R(-20,W+20),y:-30,vx:R(-30,30),vy:R(90,230),mode:"fall",life:9})}}
        acc.b+=sdt;if(acc.b>=.42){acc.b=0;ring({life:1.3,max:Math.max(W,H)*.55,col:"190,235,120",w:3})}
      }
      if(hit){acc.d+=sdt*12;while(acc.d>=1){acc.d--;add({ty:"spark",x:R(0,W),y:R(0,H),mode:"amb",life:R(.8,1.5),s:R(7,15)})}}
    }
    /* pin (Cafe Finder) */
    for(var q=PINQ.length-1;q>=0;q--)if(t>=PINQ[q].t){var pq=PINQ.splice(q,1)[0];add({ty:"pin",x:pq.x,y:-40,vy:R(100,300),gy:pq.y,mode:"pin",s:R(22,34),col:PIN[(Math.random()*5)|0]})}
    /* uap */
    for(var i=STM.length-1;i>=0;i--){
      var s=STM[i];s.age+=dt;if(s.age>=s.life){STM.splice(i,1);continue}
      s.y-=60*dt;s.x+=s.vx*dt;var rr=s.r*(1+s.age*.9),al=.16*Math.sin(Math.PI*s.age/s.life);
      var gr=g.createRadialGradient(s.x,s.y,0,s.x,s.y,rr);gr.addColorStop(0,"rgba(255,236,208,"+al+")");gr.addColorStop(1,"rgba(255,236,208,0)");
      g.fillStyle=gr;g.beginPath();g.arc(s.x,s.y,rr,0,PI2);g.fill();
    }
    /* partikel */
    for(i=P.length-1;i>=0;i--){
      var p=P[i];p.age+=dt;
      if(p.mode==="fall"){p.x+=Math.sin(p.age*2+p.r)*22*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}
      else if(p.mode==="rise"){p.x+=Math.sin(p.age*2.4+p.r)*26*dt+p.vx*dt;p.y+=p.vy*dt}
      else if(p.mode==="orbit"){
        p.a+=p.w*dt;p.rho-=420*dt;
        if(p.rho<S*.62){P.splice(i,1);continue}
        p.x=CX+Math.cos(p.a)*p.rho;p.y=CY+Math.sin(p.a)*p.rho*.8;
      }
      else if(p.mode==="burst"){p.vx*=Math.pow(.45,dt);p.vy*=Math.pow(.7,dt);p.vy+=560*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}
      else if(p.mode==="pin"){
        if(!p.landed){
          p.vy+=2000*dt;p.y+=p.vy*dt;
          if(p.y>=p.gy){p.y=p.gy;
            if(p.b<2&&Math.abs(p.vy)>240){p.vy=-p.vy*.36;p.b++}
            else{p.vy=0;p.landed=true;ring({x:p.x,y:p.y,life:.7,max:46*K,col:"255,255,255",w:3});p.sc=1.3}
          }
        }
        p.sc+=(1-p.sc)*Math.min(1,dt*9);
      }
      else{p.x+=Math.sin(p.age*1.6+p.r)*28*dt}
      p.r+=p.vr*dt;
      if(p.mode!=="pin"&&(p.age>p.life||p.y>H+90||p.x<-160||p.x>W+160||p.y<-220)){P.splice(i,1);continue}
      drawP(p);
    }
    /* cincin */
    g.globalCompositeOperation="source-over";
    for(i=RING.length-1;i>=0;i--){
      var rg=RING[i];if(rg.delay>0){rg.delay-=dt;continue}
      rg.age+=dt;var u=rg.age/rg.life;if(u>=1){RING.splice(i,1);continue}
      var e=1-Math.pow(1-u,3);
      g.globalAlpha=Math.pow(1-u,1.5);g.strokeStyle="rgb("+rg.col+")";g.lineWidth=rg.w*(1-u)+1;
      g.beginPath();g.arc(rg.x,rg.y,rg.max*e,0,PI2);g.stroke();
    }
    g.globalAlpha=1;
    requestAnimationFrame(frame);
  }
  if(th.k==="cafe"){
    var n=W<600?8:11;
    for(var j=0;j<n;j++)for(var tr2=0;tr2<30;tr2++){
      var x=R(.08,.92)*W,y=R(.3,.9)*H;
      if(Math.hypot(x-CX,y-CY)<S*.95)continue;
      if(Math.abs(x-CX)<W*.32&&y>CY+S*.5&&y<CY+S*.5+90*K)continue;
      PINQ.push({x:x,y:y,t:R(.3,1.05)});break;
    }
  }
  requestAnimationFrame(function(n2){last=n2;frame(n2)});

  /* ---- alur waktu ---- */
  var canSkipAt=t0+350,wipeEl=root.querySelector(".af-wipe");
  if(th.k==="lab")at(300,function(){say("Siap?")});
  at(900,doHit);
  at(1600,function(){startWipe(false)});
  function startWipe(fast){
    if(phase!=="play")return;phase="wipe";wiping=true;
    T.forEach(clearTimeout);T=[];
    root.classList.toggle("fast",!!fast);wipeEl.classList.add("go");
    setTimeout(swap,fast?400:580);setTimeout(end,fast?700:1000);
  }
  function swap(){
    root.classList.add("swapped");alive=false;
    document.body.classList.add("in-reveal2");
    if(location.hash!==href)location.hash=href;
    setTimeout(function(){document.body.classList.remove("in-reveal2")},2200);
  }
  function end(){removeEventListener("resize",size);removeEventListener("keydown",kd,true);root.remove();running=false}
  function skip(){if(performance.now()<canSkipAt)return;startWipe(true)}
  function kd(e){if(e.repeat)return;if(e.key==="Escape"||e.key==="Enter"||e.key===" "){e.preventDefault();skip()}}
  root.addEventListener("click",function(e){e.stopPropagation();skip()});
  root.querySelector(".af-skip").addEventListener("click",function(e){e.stopPropagation();skip()});
  addEventListener("keydown",kd,true);
}
})();
