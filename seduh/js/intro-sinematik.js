/* ===== INTRO SINEMATIK: Splash -> Beranda (3 pilihan) ===== */
(function(){
"use strict";
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,running=false;
var LITE=Math.min(innerWidth,innerHeight)<600||(navigator.hardwareConcurrency||8)<=4,CAP=LITE?110:260,RATE=LITE?.5:1;
var rnd=function(a,b){return a+Math.random()*(b-a)};
var PAL={
  "#/bahan":{c:"#e2603f",t:"#f1cdbd",g:"rgba(226,96,63,.65)"},
  "#/lab":{c:"#e0a85c",t:"#ead9c0",g:"rgba(233,185,95,.6)"},
  "#/cafe":{c:"#8fb85a",t:"#dde7c4",g:"rgba(134,173,82,.6)"}
};
var BEAN=["#8d5a33","#a8713d","#6e4325","#c08a4f"],LEAF=["#86ad52","#6f9448","#a8c96a","#5d8a3a"];

/* Tangkap klik "Masuk" lebih awal dari handler lama */
window.addEventListener("click",function(e){
  var b=e.target&&e.target.closest?e.target.closest("#sv-splash .btn"):null;
  if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(running)return;
  if(RM||!document.querySelector("#m_hot svg")){location.hash="#/hub";return}
  var r=b.getBoundingClientRect(),kb=!e.clientX&&!e.clientY;
  run(kb?r.left+r.width/2:e.clientX,kb?r.top+r.height/2:e.clientY);
},true);

function run(ox,oy){
  running=true;
  var W=innerWidth,H=innerHeight,CX,CY,K;
  var root=document.createElement("div");
  root.id="intro";root.setAttribute("aria-hidden","true");
  root.style.setProperty("--ox",ox+"px");root.style.setProperty("--oy",oy+"px");

  var tiles=[].slice.call(document.querySelectorAll("#sv-hub .hb-tile"));
  var letters="Si SEDUH".split("").map(function(ch,i){
    return ch===" "?'<span class="sp" style="--k:'+i+'">&nbsp;</span>'
      :'<span style="--k:'+i+';--r:'+Math.round(rnd(-22,22))+'deg">'+ch+'</span>';
  }).join("");
  var apps=tiles.map(function(t,i){
    var p=PAL[t.getAttribute("href")]||PAL["#/lab"],ic=t.querySelector(".ic svg"),h2=t.querySelector("h2");
    return '<div class="in-app" style="--k:'+i+';--c:'+p.c+';--t:'+p.t+';--g:'+p.g+'"><div class="in-disc"><span class="ic al">'+(ic?ic.outerHTML:"")+'</span></div><b>'+(h2?h2.textContent:"")+'</b></div>';
  }).join("");
  var wipeCols=["#8a2f1c","#5f8040","#e9b95f","#f5eee2"];

  root.innerHTML=
   '<div class="in-stage"><div class="in-blob b1"></div><div class="in-blob b2"></div><div class="in-blob b3"></div>'+
    '<div class="in-rays"><i></i></div><div class="in-vig"></div>'+
    '<div class="in-shake">'+
      '<div class="in-ch hot">'+document.querySelector("#m_hot svg").outerHTML+'</div>'+
      '<div class="in-ch cold">'+document.querySelector("#m_cold svg").outerHTML+'</div>'+
      '<canvas class="in-cv"></canvas>'+
      '<div class="in-head"><div class="in-title">'+letters+'</div><div class="in-sub">Seduh, tarik, tos, lanjut!</div></div>'+
      '<div class="in-tos">Tos!</div>'+
      '<div class="in-apps">'+apps+'</div>'+
    '</div><div class="in-flash"></div></div>'+
   '<button type="button" class="in-skip">Lewati ›</button>'+
   '<div class="in-wipe">'+wipeCols.map(function(c,i){return '<i style="--k:'+i+';--wc:'+c+'"></i>'}).join("")+'</div>';
  document.body.appendChild(root);

  /* titik awal terbang ikon aplikasi = titik tos */
  var cvEl=root.querySelector(".in-cv"),g=cvEl.getContext("2d"),dp=Math.min(LITE?1.5:2,devicePixelRatio||1);
  function size(){
    W=innerWidth;H=innerHeight;cvEl.width=W*dp;cvEl.height=H*dp;g.setTransform(dp,0,0,dp,0,0);
    CX=W/2;CY=H*.47;K=Math.max(.75,Math.min(1.4,Math.min(W,H)/620));
  }
  size();addEventListener("resize",size);
  [].forEach.call(root.querySelectorAll(".in-app"),function(a){
    var r=a.getBoundingClientRect();
    a.style.setProperty("--fx",(CX-(r.left+r.width/2))+"px");
    a.style.setProperty("--fy",(CY-(r.top+r.height/2))+"px");
  });
  var chW=root.querySelector(".in-ch").offsetWidth||140;

  /* ---------- partikel ---------- */
  var P=[],RING=[],STM=[];
  var t0=performance.now(),last=t0,alive=true,state={hit:false,wipe:false},vortex=false;
  var rainAcc=0,ambAcc=0,sparkAcc=0,steamAcc=0;
  function spawn(o){
    var r=Math.random(),ty=o.ty||(r<.55?"bean":r<.78?"leaf":r<.9?"bub":"spark");
    var p={ty:ty,x:o.x,y:o.y,vx:o.vx||0,vy:o.vy||0,r:rnd(0,6.28),vr:rnd(-4,4),s:rnd(10,26)*K,z:rnd(.55,1),age:0,life:o.life||99,mode:o.mode,
           col:ty==="leaf"?LEAF[(Math.random()*4)|0]:BEAN[(Math.random()*4)|0]};
    if(ty==="spark"){p.s=rnd(7,16)*K;p.vr*=.2}
    P.push(p);
  }
  function drawP(p){
    var a=Math.min(1,p.age/.25,(p.life-p.age)/.5);if(a<=0)return;
    var s=p.s*(.6+.4*p.z);
    g.globalAlpha=a*(.55+.45*p.z);
    g.globalCompositeOperation=p.ty==="spark"?"lighter":"source-over";
    g.save();g.translate(p.x,p.y);g.rotate(p.r);
    if(p.ty==="bean"){
      g.fillStyle=p.col;g.beginPath();g.ellipse(0,0,s*.5,s*.78,0,0,6.283);g.fill();
      g.strokeStyle="rgba(241,228,207,.85)";g.lineWidth=Math.max(1,s*.1);
      g.beginPath();g.moveTo(0,-s*.6);g.quadraticCurveTo(-s*.25,0,0,0);g.quadraticCurveTo(s*.25,0,0,s*.6);g.stroke();
    }else if(p.ty==="leaf"){
      g.fillStyle=p.col;g.beginPath();g.moveTo(0,-s);g.quadraticCurveTo(s*.8,0,0,s);g.quadraticCurveTo(-s*.8,0,0,-s);g.fill();
      g.strokeStyle="rgba(255,255,255,.5)";g.lineWidth=Math.max(1,s*.08);g.beginPath();g.moveTo(0,-s*.8);g.lineTo(0,s*.8);g.stroke();
    }else if(p.ty==="bub"){
      g.fillStyle="rgba(190,225,250,.14)";g.strokeStyle="rgba(255,255,255,.55)";g.lineWidth=1.5;
      g.beginPath();g.arc(0,0,s*.55,0,6.283);g.fill();g.stroke();
      g.fillStyle="rgba(255,255,255,.7)";g.beginPath();g.arc(-s*.2,-s*.2,s*.12,0,6.283);g.fill();
    }else{
      var sp=s*(.7+.3*Math.sin(p.age*9));
      g.fillStyle="#ffd98a";g.beginPath();
      for(var i=0;i<8;i++){var an=i*Math.PI/4-Math.PI/2,rr=i%2?sp*.28:sp;g.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}
      g.closePath();g.fill();
    }
    g.restore();
  }
  function doHit(){
    if(state.hit)return;state.hit=true;
    root.classList.add("hit");
    try{navigator.vibrate&&navigator.vibrate(18)}catch(x){}
    P.forEach(function(p){
      if(p.mode==="rain"){
        var dx=p.x-CX,dy=p.y-CY,d=Math.hypot(dx,dy)||1,v=rnd(380,900);
        p.vx=dx/d*v;p.vy=dy/d*v-120;p.mode="burst";p.age=0;p.life=rnd(1.6,2.6);
      }
    });
    for(var i=0;i<(LITE?50:90);i++){
      var a=rnd(0,6.283),v=rnd(260,1050);
      spawn({x:CX+Math.cos(a)*rnd(0,30),y:CY+Math.sin(a)*rnd(0,30),vx:Math.cos(a)*v,vy:Math.sin(a)*v-200,mode:"burst",life:rnd(1.5,2.6)});
    }
    var M=Math.max(W,H)*.75;
    RING.push({age:0,life:.9,max:M,col:"255,244,224",w:10,delay:0},
              {age:0,life:1.05,max:M,col:"233,185,95",w:6,delay:.08},
              {age:0,life:1.2,max:M,col:"226,96,63",w:4,delay:.16});
  }
  function frame(now){
    if(!alive)return;
    var dt=Math.min(.05,(now-last)/1000),t=(now-t0)/1000;last=now;
    g.globalCompositeOperation="source-over";g.globalAlpha=1;g.clearRect(0,0,W,H);
    vortex=!state.hit&&t>.3;
    if(!state.hit){
      rainAcc+=dt*RATE*(t<.2?40:120);
      while(rainAcc>=1){rainAcc--;if(P.length<CAP)spawn({x:rnd(-20,W+20),y:-30,vx:rnd(-30,30),vy:rnd(140,360),mode:"rain"})}
    }else if(!state.wipe){
      ambAcc+=dt*16*RATE;sparkAcc+=dt*14*RATE;
      while(ambAcc>=1){ambAcc--;if(P.length<CAP)spawn({ty:Math.random()<.65?"bean":"leaf",x:rnd(0,W),y:-30,vx:rnd(-15,15),vy:rnd(80,190),mode:"amb",life:7})}
      while(sparkAcc>=1){sparkAcc--;spawn({ty:"spark",x:rnd(0,W),y:rnd(0,H),mode:"amb",life:rnd(.8,1.5)})}
    }
    if(t>.55&&!state.wipe){
      steamAcc+=dt*10*RATE;
      while(steamAcc>=1){steamAcc--;if(STM.length<(LITE?12:30))STM.push({x:CX+rnd(-.5,.5)*chW,y:CY-chW*.35,r:rnd(26,44),age:0,life:rnd(1.6,2.4),vx:rnd(-8,8)})}
    }
    /* uap */
    for(var i=STM.length-1;i>=0;i--){
      var s=STM[i];s.age+=dt;if(s.age>=s.life){STM.splice(i,1);continue}
      s.y-=60*dt;s.x+=s.vx*dt;var rr=s.r*(1+s.age*.9),al=.16*Math.sin(Math.PI*s.age/s.life);
      var gr=g.createRadialGradient(s.x,s.y,0,s.x,s.y,rr);
      gr.addColorStop(0,"rgba(255,236,208,"+al+")");gr.addColorStop(1,"rgba(255,236,208,0)");
      g.fillStyle=gr;g.beginPath();g.arc(s.x,s.y,rr,0,6.283);g.fill();
    }
    /* partikel */
    for(i=P.length-1;i>=0;i--){
      var p=P[i];p.age+=dt;
      if(p.mode==="rain"){
        if(vortex){
          var dx=CX-p.x,dy=CY-p.y,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;
          p.vx+=(nx*1400-ny*1100)*dt;p.vy+=(ny*1400+nx*1100)*dt;
          var dr=Math.pow(.18,dt);p.vx*=dr;p.vy*=dr;
        }else p.vx+=Math.sin(p.age*2+p.r)*20*dt;
      }else if(p.mode==="burst"){
        p.vx*=Math.pow(.45,dt);p.vy*=Math.pow(.7,dt);p.vy+=520*dt;
      }else p.x+=Math.sin(p.age*1.6+p.r)*28*dt;
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
      if(p.age>p.life||p.y>H+80||p.x<-140||p.x>W+140||p.y<-200){P.splice(i,1);continue}
      drawP(p);
    }
    /* cincin kejut */
    g.globalCompositeOperation="source-over";
    for(i=RING.length-1;i>=0;i--){
      var q=RING[i];if(q.delay>0){q.delay-=dt;continue}
      q.age+=dt;var u=q.age/q.life;if(u>=1){RING.splice(i,1);continue}
      var e=1-Math.pow(1-u,3);
      g.globalAlpha=Math.pow(1-u,1.5);g.strokeStyle="rgb("+q.col+")";g.lineWidth=q.w*(1-u)+1;
      g.beginPath();g.arc(CX,CY,q.max*e,0,6.283);g.stroke();
    }
    g.globalAlpha=1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(function(n){last=n;frame(n)});

  /* ---------- alur waktu ---------- */
  var T=[],phase="play",canSkipAt=t0+450,wipeEl=root.querySelector(".in-wipe");
  function at(ms,fn){var id=setTimeout(fn,ms);T.push(id);return id}
  at(1100,doHit);
  at(2500,function(){startWipe(false)});
  function startWipe(fast){
    if(phase!=="play")return;phase="wipe";state.wipe=true;
    T.forEach(clearTimeout);T=[];
    root.classList.toggle("fast",!!fast);
    wipeEl.classList.add("go");
    setTimeout(swap,fast?540:780);
    setTimeout(end,fast?1050:1450);
  }
  function swap(){
    root.classList.add("swapped");alive=false;
    document.body.classList.add("in-reveal");
    if(location.hash!=="#/hub")location.hash="#/hub";
    setTimeout(function(){document.body.classList.remove("in-reveal")},2400);
  }
  function end(){
    removeEventListener("resize",size);removeEventListener("keydown",kd,true);
    root.remove();running=false;
  }
  function skip(){if(performance.now()<canSkipAt)return;startWipe(true)}
  function kd(e){
    if(e.repeat)return;
    if(e.key==="Escape"||e.key==="Enter"||e.key===" "){e.preventDefault();skip()}
  }
  root.addEventListener("click",function(e){e.stopPropagation();skip()});
  root.querySelector(".in-skip").addEventListener("click",function(e){e.stopPropagation();skip()});
  addEventListener("keydown",kd,true);
}
})();
