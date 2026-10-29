"use strict";
const $=id=>document.getElementById(id),cl=(x,a,b)=>Math.max(a,Math.min(b,x));
/* Kunci per beans: dose g, grind (0 halus–100 kasar), temp °C, tamp kg, ratio, time s. tol = toleransi, risk = peluang channeling dasar */
const BEANS=[
{id:"gayo",name:"Arabika Gayo",sub:"Light · Washed · Aceh",roast:"light",diff:2,notes:"jeruk, madu, bunga",flavor:"Asam cerah dan bersih. Toleran, cocok untuk belajar.",
 k:{dose:18,grind:38,temp:94,tamp:15,ratio:2.2,time:30},tol:{dose:1,grind:8,temp:2,tamp:4,ratio:.3,time:4},risk:.04},
{id:"kinta",name:"Arabika Kintamani",sub:"Light-Medium · Washed · Bali",roast:"light",diff:3,notes:"lemon, apel hijau, karamel ringan",flavor:"Keasaman jeruk yang halus. Mudah encer kalau yield kebanyakan.",
 k:{dose:18,grind:42,temp:93,tamp:15,ratio:2.1,time:29},tol:{dose:.9,grind:7,temp:1.8,tamp:3.5,ratio:.25,time:3.5},risk:.05},
{id:"toraja",name:"Arabika Toraja",sub:"Medium · Semi-wash · Sulawesi",roast:"medium",diff:3,notes:"cokelat, rempah, earthy",flavor:"Body tebal dan earthy. Butuh rasio yang rapi.",
 k:{dose:18.5,grind:48,temp:92,tamp:16,ratio:2,time:28},tol:{dose:.8,grind:6,temp:1.5,tamp:3,ratio:.22,time:3.2},risk:.06},
{id:"robu",name:"Robusta Lampung",sub:"Dark · Sumatera",roast:"dark",diff:4,notes:"cokelat pekat, kacang, crema tebal",flavor:"Pahit dan kuat. Air terlalu panas langsung membuatnya gosong.",
 k:{dose:17,grind:62,temp:89,tamp:13,ratio:1.7,time:25},tol:{dose:.8,grind:6,temp:1.5,tamp:3,ratio:.18,time:3},risk:.08},
{id:"wine",name:"Wine Process",sub:"Medium-Dark · Natural · Sumatera",roast:"medium",diff:4,notes:"anggur, buah gelap, tape",flavor:"Aroma liar dan fermentatif. Rawan channeling, tamping harus tepat.",
 k:{dose:18,grind:45,temp:91,tamp:15,ratio:2,time:29},tol:{dose:.7,grind:5,temp:1.2,tamp:2.5,ratio:.2,time:3},risk:.16},
{id:"flores",name:"Arabika Flores Bajawa",sub:"Medium · Honey · NTT",roast:"medium",diff:1,notes:"karamel, kacang, cokelat susu",flavor:"Manis lembut dan jinak. Cocok untuk pemanasan.",
 k:{dose:18,grind:46,temp:92,tamp:15,ratio:2.1,time:29},tol:{dose:1.1,grind:9,temp:2.2,tamp:4.5,ratio:.32,time:4.5},risk:.03},
{id:"preanger",name:"Arabika Java Preanger",sub:"Light-Medium · Washed · Jawa Barat",roast:"light",diff:3,notes:"teh hitam, jeruk bali, gula aren",flavor:"Bersih dan teh-tehan. Rasio terlalu panjang cepat membuatnya hambar.",
 k:{dose:18,grind:40,temp:93.5,tamp:15,ratio:2.2,time:30},tol:{dose:.9,grind:7,temp:1.7,tamp:3.5,ratio:.25,time:3.5},risk:.05},
{id:"mandai",name:"Arabika Mandailing",sub:"Medium-Dark · Wet-hulled · Sumatera Utara",roast:"dark",diff:3,notes:"cokelat gelap, rempah, tembakau",flavor:"Body berat dan herbal. Gilingan terlalu halus langsung pahit.",
 k:{dose:18.5,grind:52,temp:91,tamp:16,ratio:1.9,time:27},tol:{dose:.8,grind:6,temp:1.5,tamp:3,ratio:.2,time:3.2},risk:.06},
{id:"wamena",name:"Arabika Wamena",sub:"Medium · Washed · Papua",roast:"medium",diff:3,notes:"cokelat, buah kering, floral",flavor:"Seimbang dan bersih, tapi mudah salah di rasio.",
 k:{dose:18,grind:44,temp:92.5,tamp:15,ratio:2.1,time:29},tol:{dose:.9,grind:7,temp:1.6,tamp:3.2,ratio:.23,time:3.3},risk:.05},
{id:"temang",name:"Robusta Temanggung",sub:"Medium-Dark · Natural · Jawa Tengah",roast:"dark",diff:4,notes:"cokelat pahit, kayu manis, kacang",flavor:"Kuat dan beraroma. Crema tebal, tapi toleransinya sempit.",
 k:{dose:17.5,grind:60,temp:90,tamp:14,ratio:1.8,time:26},tol:{dose:.7,grind:5,temp:1.3,tamp:2.8,ratio:.18,time:2.8},risk:.09},
{id:"geisha",name:"Arabika Geisha Ijen",sub:"Light · Washed · Jawa Timur",roast:"light",diff:5,notes:"melati, bergamot, persik",flavor:"Floral halus dan langka. Sedikit meleset, karakternya langsung hilang.",
 k:{dose:17,grind:35,temp:95,tamp:14,ratio:2.4,time:32},tol:{dose:.5,grind:3.5,temp:.8,tamp:1.8,ratio:.12,time:2.2},risk:.12},
{id:"gcs",name:"Signature Blend GCS",sub:"Medium · Blend · Final challenge",roast:"medium",diff:5,notes:"cokelat susu, jeruk manis, praline",flavor:"Racikan andalan GCS. Semua variabel harus presisi.",
 k:{dose:18,grind:50,temp:92.5,tamp:16,ratio:2,time:28},tol:{dose:.6,grind:4,temp:1,tamp:2,ratio:.15,time:2.5},risk:.1}
];
const EXTRA={gayo:[{wd:3},{wd:1.5}],kinta:[{wd:3.5},{wd:1.2}],toraja:[{wd:3.5},{wd:1.2}],robu:[{wd:2.5},{wd:1.2}],wine:[{wd:4.5},{wd:1}],gcs:[{wd:4},{wd:1}],flores:[{wd:2.5},{wd:1.6}],preanger:[{wd:3.5},{wd:1.2}],mandai:[{wd:3.5},{wd:1.2}],wamena:[{wd:3.5},{wd:1.2}],temang:[{wd:2.5},{wd:1.2}],geisha:[{wd:4},{wd:1}]};
BEANS.forEach(b=>{Object.assign(b.k,EXTRA[b.id][0]);Object.assign(b.tol,EXTRA[b.id][1])});
[["sidik","Arabika Sidikalang","Medium-Dark · Wet-hulled · Sumatera Utara","dark",3,"rempah, cokelat pekat, herbal","Pahit manis dengan body tebal. Gilingan terlalu halus cepat membuatnya getir.",[18.5,52,91,16,1.9,27],[.8,6,1.5,3,.2,3.2],.06,[3.5,1.2]],
["kerinci","Arabika Kerinci","Medium · Washed · Jambi","medium",3,"markisa, teh hitam, gula merah","Manis buah tropis yang bersih. Air terlalu panas menonjolkan asam yang tajam.",[18,44,92.5,15,2.1,29],[.9,7,1.6,3.2,.23,3.3],.05,[3.5,1.2]],
["puntang","Arabika Gunung Puntang","Light-Medium · Honey · Jawa Barat","light",3,"stroberi, madu, bunga","Manis buah merah khas Bandung selatan. Rasio terlalu panjang membuatnya hilang.",[18,40,93.5,15,2.2,30],[.9,7,1.7,3.5,.25,3.5],.05,[3.5,1.2]],
["malabar","Arabika Malabar","Light · Washed · Jawa Barat","light",4,"melati, jeruk nipis, teh","Floral dan cerah dari lereng Malabar. Sedikit meleset, rasanya langsung asam.",[17.5,37,94.5,14,2.3,31],[.6,4,1,2.2,.15,2.5],.09,[4,1.1]],
["dampit","Robusta Dampit","Dark · Natural · Jawa Timur","dark",4,"cokelat gelap, kayu, tembakau","Pekat dan kuat. Air terlalu panas langsung membuatnya gosong.",[17,63,89,13,1.7,25],[.7,5,1.3,2.8,.18,2.8],.09,[2.5,1.2]],
["liberika","Liberika Meranti","Medium · Natural · Riau","medium",5,"nangka, bunga, rempah","Aroma nangka yang langka. Rawan channeling, tamping harus rapi.",[18,46,92,15,2,29],[.5,3.5,1,2,.13,2.3],.14,[4,1]],
["enrek","Arabika Enrekang","Medium · Washed · Sulawesi Selatan","medium",2,"karamel, buah merah, cokelat","Seimbang dan ramah untuk belajar. Toleran terhadap koreksi kecil.",[18,45,92.5,15,2.1,29],[1,8,2,4,.3,4],.03,[3,1.5]],
["semendo","Robusta Semendo","Medium-Dark · Honey · Sumatera Selatan","dark",3,"cokelat, kacang, karamel","Manis pahit dengan crema tebal. Lebih memaafkan dibanding robusta lain.",[17.5,58,90.5,14,1.8,26],[.8,6,1.5,3,.2,3],.07,[2.5,1.3]]
].forEach(([id,name,sub,roast,diff,notes,flavor,k,t,risk,w])=>BEANS.push({id,name,sub,roast,diff,notes,flavor,k:{dose:k[0],grind:k[1],temp:k[2],tamp:k[3],ratio:k[4],time:k[5],wd:w[0]},tol:{dose:t[0],grind:t[1],temp:t[2],tamp:t[3],ratio:t[4],time:t[5],wd:w[1]},risk}));
const RANKS=["Barista Pemula","Barista Junior","Barista Senior","Barista Ulung","Barista Andal","Murid Mas Zahi"];
/* Level 1-5 naik lewat total XP (jumlah skor terbaik tiap beans) sebagai pecahan dari XP maksimum.
   Level 6 (Murid Mas Zahi) hanya didapat bila SEMUA beans pernah diseduh dengan skor >= MASTER. */
const LV_XP=[0,.15,.35,.55,.75],MASTER=95;
const hintRoast={light:"Light roast padat dan sulit larut: biasanya butuh gilingan lebih halus dan air lebih panas.",medium:"Medium roast paling seimbang: mulai dari resep standar, lalu koreksi sedikit demi sedikit.",dark:"Dark roast mudah larut: biasanya gilingan lebih kasar, air lebih dingin, dan yield lebih pendek."};
let S={b:null,ok:{},ev:.5,g:50,d:18,tm:92,tp:15,t:0,y:0,run:false,ch:false,iv:null,best:{},streak:0};

const LKEY="seduh.lab";
const save=()=>{try{localStorage.setItem(LKEY,JSON.stringify({best:S.best}));const y=parent.SeduhSync;if(y&&y.onLocalChange)y.onLocalChange()}catch(e){}};
try{const r=JSON.parse(localStorage.getItem(LKEY)||"{}");BEANS.forEach(b=>{const v=r.best&&+r.best[b.id];if(v>0)S.best[b.id]=Math.min(100,Math.round(v))})}catch(e){}
const SF={c:null};
function sfx(k){if(MU.mute)return;try{const c=SF.c||(SF.c=new(window.AudioContext||window.webkitAudioContext)());c.resume();
 ({pick:[[520,0,.08,"triangle"]],ok:[[660,0],[880,.08]],drip:[[1500,0,.04]],go:[[90,0,.6,"sawtooth"],[120,.15,.5,"sawtooth"]],lvl:[[523,0],[659,.1],[784,.2],[1046,.3,.3]],S:[[784,0],[988,.1],[1175,.2],[1568,.3,.4]],bad:[[220,0,.2,"triangle"],[165,.16,.3,"triangle"]]}[k]||[]).forEach(([f,d,l=.14,ty="sine"])=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+d;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(k=="go"?.05:.07,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+l);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+l+.02)})}catch(e){}}
function popup(t){let h=$("pops");if(!h){h=document.createElement("div");h.id="pops";document.body.appendChild(h)}const e=document.createElement("div");e.className="pop";e.textContent=t;h.appendChild(e);setTimeout(()=>e.remove(),2700)}
const rnd=a=>a[Math.random()*a.length|0];
const say=t=>{const e=$("say");if(!e)return;e.textContent=t;e.classList.remove("sy");void e.offsetWidth;e.classList.add("sy")};
const SAYS={g:["Gilingan terkunci. Semoga jarumnya jujur.","Bubuk kopi siap dituang."],d:["Dosis masuk. Timbangan ikut deg-degan.","Portafilter terisi. Hopper lega."],tm:["Suhu air dipasang. Boiler diminta bersabar.","Knob berhenti. Uap mulai menari."],tp:["Tamping selesai. Puck terasa padat.","Sekali tekan, semoga lurus."],ev:["Gelembung diam di tengah. Meja terasa rata.","Kerataan dikunci. Tangan mantap!"],wd:["Jarum WDT mengurai gumpalan.","Bubuk teraduk. Rongga kecil menghilang."]};
function ALIVE(){const r=S.y/S.d/S.b.k.ratio;$("st").style.filter=r>1.15?"saturate("+cl(1.6-r*.7,.3,1)+") brightness("+(1+cl(r-1.1,0,.6))+")":"";
 if(S.y>3)$("mach").classList.add("hot");
 if(!S.fd&&S.y>.3){S.fd=1;say("Tetes pertama jatuh. Pre-infusion selesai.");sfx("ok")}
 if(!S.cr&&S.y>6){S.cr=1;say("Crema mulai menutup permukaan.")}
 if(!S.mid&&r>1.15){S.mid=1;say("Warna aliran mulai memucat…")}
 if(S.y>.3&&Math.random()<.15)sfx("drip")}
function narrate(c){const b=S.b,k=b.k,t=b.tol,m=S.m,gd=S.gd,ch=S.ch,{ey,tds,time,ratio,fl,ft,g}=c,s=ch?"c":ey<18?"u":ey>22?"o":"k",n=b.notes.split(",").map(x=>x.trim()),
bu=b.roast=="dark"?"arang dan kulit kayu terbakar":b.roast=="light"?"kayu dan kertas hangus":"karamel yang gosong",
 ar=rnd({c:[`Aroma tidak sehaluan: ${n[0]} muncul samar, disela bau hijau dan gosong tipis, seolah dua shot berbeda dituang ke satu cangkir.`,`Wangi pertama menjanjikan ${n[0]}, tetapi cepat dikotori bau mentah dan hangus yang datang bergantian.`],
  u:[`Aromanya ada tetapi tipis dan agak hijau. ${n[0]} sempat terbaca sekilas lalu menghilang, seperti lagu yang volumenya terlalu kecil.`,`Hidung menangkap ${n[0]} dari kejauhan, tetapi begitu mendekat yang tersisa hanya uap hangat.`],
  o:[`Wangi ${n[0]} tertutup bau ${bu}. Cupper langsung teringat dapur yang kompornya lupa dimatikan.`,`Bau ${bu} mendominasi; ${n[0]} tinggal bisikan di belakangnya.`],
  k:[`Aroma pertama bersih dan berlapis. ${n[0]} tampil paling depan, disusul ${n[1]||n[0]} pelan-pelan. Cupper menarik napas sedikit lebih lama dari biasanya.`,`Begitu cangkir diangkat, ${n[0]} langsung naik, lalu ${n[1]||n[0]} menyusul. Aromanya jernih dan tidak ada yang berebut.`,`Wanginya hangat dan rapi: ${n[0]} di depan, ${n[2]||n[1]||n[0]} samar di belakang, seperti membuka toples kopi yang baru digiling.`]}[s]),
 ac=rnd({c:["Asam dan pahit muncul bergantian di sendok yang sama dan tak ada yang mau mengalah.","Tiap tegukan berbeda: kadang asam menusuk, kadang pahit menggantung."],u:["Keasamannya menusuk di ujung lidah, tajam, dan belum sempat bertemu manis.","Asamnya berdiri sendirian; belum ada manis yang menemaninya."],o:["Keasamannya sudah lama menghilang, digantikan pahit yang menggantung di belakang lidah.","Yang tersisa hanya pahit dan kering; sisi cerahnya ikut terbakar."],k:["Keasamannya sopan: cerah di depan, lalu mengendap menjadi manis.","Asam dan manis bertemu di tengah lidah, saling menyeimbangkan.","Ada kecerahan lembut yang disambut manis yang membulat."]}[s]),
 bd=rnd(tds<8?["Body-nya tipis, mendekati teh pekat.","Teksturnya ringan, nyaris seperti air berwarna."]:tds>12?["Body-nya sangat pekat, hampir seperti sirup.","Kental dan berat; lidah sampai terasa terlapisi."]:["Body-nya bulat dan menempel nyaman di lidah.","Tekstur halus seperti krim cair, tidak berat dan tidak kosong."]),
 fi=rnd({c:["Finish-nya kasar dan tidak rapi.","Akhirnya berantakan; tak ada rasa yang tertinggal dengan jelas."],u:["Finish-nya cepat habis dan hanya menyisakan asam.","Rasa lenyap dalam dua detik, meninggalkan lidah yang kering."],o:["Finish-nya kering dan sepat, menempel di langit-langit.","Pahit bertahan lama di tenggorokan tanpa manis yang menetralkan."],k:[`Finish-nya panjang dan manis; ${n[2]||n[0]} tertinggal beberapa detik setelah tegukan terakhir.`,`Setelah tegukan terakhir, ${n[2]||n[0]} masih tinggal, manis dan bersih.`]}[s]),
 dt=time-k.time,rz=(ratio-k.ratio)/t.ratio,
 tw=Math.abs(dt)/t.time<=.6?"Aliran berjalan dengan tempo yang pas: pre-infusion membasahi puck, lalu air mengalir merata sampai yield terkumpul.":dt<0?"Shot selesai terlalu cepat; air hampir tak sempat berkenalan dengan kopi.":"Shot berjalan lambat; kopi terlalu lama ditahan tekanan.",
 ra=Math.abs(rz)<=.6?"Rasio akhirnya tepat sasaran.":rz>0?"Minuman dibiarkan mengalir lebih panjang dari yang dibutuhkan beans ini.":"Minuman dihentikan sebelum kopinya sempat memberikan semua yang ia punya.",
 chs=ch?" Di tengah shot, aliran mulai berpilin: air menemukan jalur lemah di puck dan menembusnya lebih cepat dari bagian lain, tanda khas channeling.":"",
 mc=m.jit>1?`${m.name} memang tidak sabar soal suhu, jadi grup kopi naik-turun selama shot${Math.abs(S.te-S.tm)>.8?(S.te>S.tm?" dan kali ini bergeser lebih panas dari setelanmu":" dan kali ini bergeser lebih dingin dari setelanmu"):""}.`:m.jit<.2?`${m.name} menjaga suhu dan tekanan hampir datar, sehingga hasil lebih banyak ditentukan oleh tanganmu.`:`${m.name} cukup stabil, hanya sesekali bergeser tipis.`,
 gc=gd.q==1?`${gd.name} menghasilkan campuran bubuk halus dan kasar; yang halus menyumbat, yang kasar meloloskan air.`:gd.q==2?`${gd.name} cukup seragam untuk kelasnya, meski masih meninggalkan sedikit fines.`:`${gd.name} memberi partikel seragam, jadi gilingan bukan tersangka utama di sini.`,
 DV=[["dosis",S.d-k.dose,t.dose,"yang kurang","yang kebanyakan"],["gilingan",S.g-k.grind,t.grind,"yang terlalu halus","yang terlalu kasar"],["suhu air",S.te-k.temp,t.temp,"yang terlalu dingin","yang terlalu panas"],["tamping",S.tp-k.tamp,t.tamp,"yang terlalu lembut","yang terlalu keras"],["aduk WDT",S.wd-k.wd,t.wd,"yang kurang","yang berlebih"],["permukaan puck",fl,ft,"","yang belum rata"]].map(([a,d,tl,l,h])=>[a+" "+(d>0?h:l),Math.abs(d)/tl]).filter(x=>x[1]>1).sort((a,b)=>b[1]-a[1]).slice(0,2),
 vt=DV.length?`Yang paling mencolok di mata cupper: ${DV.map(x=>x[0]).join(", lalu ")}.`:"Semua variabel jatuh di dalam jendela toleransi; tidak ada yang menonjol sebagai kesalahan.",
 cs={S:"Sesi ditutup dengan satu kata: sempurna. Resep ini layak jadi standar bar.",A:"Hampir sempurna. Satu koreksi kecil lagi dan cangkir ini siap disajikan tanpa ragu.",B:"Cangkir ini layak diminum dan layak dibanggakan, tetapi belum berani dijadikan resep tetap.",C:"Cangkir ini belum stabil. Rasanya jujur memberi tahu bahwa ada variabel yang menyimpang; baca petunjuknya sebelum mengulang.",D:"Cangkir ini gagal, tetapi gagal yang berguna: tiap penyimpangan di atas adalah petunjuk arah, bukan hukuman."}[g];
 return [["Aroma",ar],["Di lidah",ac+" "+bd+" "+fi],["Perjalanan shot",tw+" "+ra+chs+" "+mc+" "+gc],["Kata cupper",vt+" "+cs]].map(([h,x])=>`<div><h5>${h}</h5><p>${x}</p></div>`).join("")}
const grade=s=>s>=90?"S":s>=80?"A":s>=65?"B":s>=45?"C":"D";

/* Radar rasa (cupping) */
const AX=["Aroma","Asam","Manis","Pahit","Body","Balance","Aftertaste"],CX=120,CY=104,RR=64;
const JG=[{n:"Rina",r:"Cupper senior, ketat soal keasaman",w:[1,2.2,1,.6,.6,1.2,1],b:-.4},{n:"Bayu",r:"Pencinta body dan crema",w:[.8,.6,1,.8,2.2,1,1.2],b:.2},{n:"Mei",r:"Pemburu manis dan aftertaste",w:[1,.7,2.2,.5,.8,1.2,2],b:0}];
const LOW=["aromanya kurang bicara","asamnya belum pada tempatnya","manisnya belum keluar","pahitnya mengganggu","body-nya belum pas","rasanya belum menyatu","aftertaste-nya cepat hilang"],HIGH=["aromanya memikat","asamnya cantik","manisnya jelas terasa","pahitnya terkendali","body-nya nyaman","semua rasa menyatu","aftertaste-nya panjang"];
const TG={u:["asam tajam","belimbing wuluh","rumput hijau","teh tipis","hollow","jeruk nipis mentah"],o:["arang","abu","kayu hangus","kakao pahit","sepat","karet terbakar"],c:["asam-pahit bergantian","kasar","tidak rata","bau hijau","gosong sebagian"]},XT={light:["teh bunga","gula tebu","madu","lemon manis"],medium:["karamel","kacang panggang","cokelat susu","gula merah"],dark:["kakao gelap","tembakau manis","kayu manis","crema tebal"]};
const pt=(i,r)=>{const a=(-90+i*360/AX.length)*Math.PI/180;return[CX+r*Math.cos(a),CY+r*Math.sin(a)]};
(function(){let h="";[.25,.5,.75,1].forEach(f=>h+=`<polygon points="${AX.map((_,i)=>pt(i,RR*f).join(",")).join(" ")}" fill="${f==1?"#ffffff08":"none"}" stroke="#4b3626"/>`);
 AX.forEach((n,i)=>{const[x,y]=pt(i,RR),[lx,ly]=pt(i,RR+17);h+=`<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="#4b3626"/><text x="${lx}" y="${ly+3}" text-anchor="middle" fill="#a08c76" font-size="10">${n}</text>`});
 h+='<defs><radialGradient id="rgd"><stop offset="0" stop-color="#e9b95f" stop-opacity=".15"/><stop offset="1" stop-color="#d2792f" stop-opacity=".65"/></radialGradient></defs><polygon id="rp" fill="url(#rgd)" stroke="#e9b95f" stroke-width="2" stroke-linejoin="round"/>'+AX.map((_,i)=>`<circle id="rd${i}" r="3.5" fill="#fff"/>`).join("");
 $("radar").innerHTML=h})();
function radar(v){const t0=performance.now(),step=ts=>{const x=Math.min(1,(ts-t0)/800),e=1-Math.pow(1-x,3),ps=v.map((q,i)=>pt(i,RR*q/10*e));
 $("rp").setAttribute("points",ps.map(p=>p.join(",")).join(" "));ps.forEach((p,i)=>{$("rd"+i).setAttribute("cx",p[0]);$("rd"+i).setAttribute("cy",p[1])});if(x<1)requestAnimationFrame(step)};requestAnimationFrame(step)}

/* Efek hasil akhir sesuai skor: S emas meledak, A konfeti, B bara api, C debu, D asap + guncangan */
const TH={S:{c:"#ffd36a",r:"#ffd36a44",t:"SEMPURNA"},A:{c:"#6be3c6",r:"#6be3c633",t:"LUAR BIASA"},B:{c:"#e9b95f",r:"#e9b95f22",t:"SHOT BAGUS"},C:{c:"#b9a690",r:"#b9a69018",t:"BELUM STABIL"},D:{c:"#ff6a4d",r:"#ff6a4d33",t:"SHOT GAGAL"}};
let fxRaf=0,fxTo=0;
function mkP(g,W,H){const r=Math.random,gold=["#ffd36a","#ffb938","#fff1c1","#e9b95f"],tl=["#6be3c6","#ffd36a","#ffffff","#58c4b4"],cols=g==="S"?gold:tl;
 if(g==="S")return{k:"c",x:W/2,y:H*.55,vx:(r()-.5)*20,vy:-(6+r()*14),g:.28,w:5+r()*8,h:8+r()*10,a:r()*6,va:(r()-.5)*.4,col:cols[r()*4|0]};
 if(g==="A")return{k:"c",x:r()*W,y:-20-r()*H*.6,vx:(r()-.5)*2,vy:2+r()*3,g:.02,w:5+r()*6,h:8+r()*8,a:r()*6,va:(r()-.5)*.3,col:cols[r()*4|0]};
 if(g==="B")return{k:"e",x:r()*W,y:H+r()*80,vx:(r()-.5)*.6,vy:-(.8+r()*1.8),rad:1.5+r()*3,col:"#e9b95f",life:1};
 if(g==="C")return{k:"e",x:r()*W,y:-10-r()*H*.4,vx:(r()-.5)*.5,vy:.5+r()*1,rad:1+r()*2.5,col:"#b9a690",life:1};
 return{k:"s",x:W/2+(r()-.5)*W*.6,y:H*.85+r()*40,vx:(r()-.5),vy:-(.9+r()*1.4),rad:18+r()*20,gr:.9+r()*.8,life:.5+r()*.4}}
function fx(g,sc,vd,taste,ch){
 const o=$("fxo"),cv=$("fxc"),c=cv.getContext("2d"),th=TH[g]||TH.D,rm=typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,mn=document.querySelector("main");
 cancelAnimationFrame(fxRaf);clearTimeout(fxTo);const W=cv.width=innerWidth,H=cv.height=innerHeight;
 o.style.setProperty("--c",th.c);o.style.setProperty("--rc",th.r);o.className="fxo g"+g;
 $("fxg").textContent=g;$("fxt").textContent=th.t;$("fxn").textContent="0";$("fxs").textContent=(ch?"Channeling terdeteksi. ":"")+taste;
 if(g==="D"&&!rm&&mn){mn.classList.add("shake");setTimeout(()=>mn.classList.remove("shake"),600)}
 const P=Array.from({length:rm?0:{S:170,A:100,B:36,C:22,D:30}[g]},()=>mkP(g,W,H));let t0=0;
 const loop=ts=>{t0=t0||ts;const t=ts-t0;c.clearRect(0,0,W,H);
  for(const p of P){
   if(p.k==="c"){p.vx*=g==="S"?.985:1;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;if(p.y<H+30){c.save();c.translate(p.x,p.y);c.rotate(p.a);c.fillStyle=p.col;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore()}}
   else if(p.k==="e"){p.x+=p.vx;p.y+=p.vy;p.life-=.0025;c.globalAlpha=Math.max(0,p.life);c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,p.rad,0,7);c.fill();c.globalAlpha=1;if((p.y<-40||p.y>H+40||p.life<=0)&&t<5000)Object.assign(p,mkP(g,W,H))}
   else{p.x+=p.vx;p.y+=p.vy;p.rad+=p.gr;p.life-=.004;if(p.life>0){c.fillStyle="rgba(80,70,70,"+p.life*.5+")";c.beginPath();c.arc(p.x,p.y,p.rad,0,7);c.fill()}else if(t<3500)Object.assign(p,mkP(g,W,H))}}
  const x=Math.min(1,t/1100),n=Math.round(sc*(1-Math.pow(1-x,3)));if($("fxn").textContent!=n)$("fxn").textContent=n;
  if(t<7000&&!o.classList.contains("hidden"))fxRaf=requestAnimationFrame(loop)};
 fxRaf=requestAnimationFrame(loop);fxTo=setTimeout(closeFx,8000)}
function closeFx(){clearTimeout(fxTo);cancelAnimationFrame(fxRaf);$("fxo").classList.add("hidden");const r=$("res");if(r.scrollIntoView)r.scrollIntoView({behavior:"smooth",block:"nearest"})}
$("fxo").onclick=closeFx;

function lvInfo(){const N=BEANS.length,xp=BEANS.reduce((a,b)=>a+(S.best[b.id]||0),0),m=BEANS.filter(b=>(S.best[b.id]||0)>=MASTER).length;
 let lv=0;LV_XP.forEach((f,i)=>{if(xp>=f*N*100)lv=i});if(m>=N)lv=RANKS.length-1;return{xp,m,N,lv}}
function hud(){const{xp,m,N,lv}=lvInfo(),top=RANKS.length-1;
 if(S.lv!=null&&lv>S.lv){popup("⬆ Naik pangkat: "+RANKS[lv]);sfx("lvl")}S.lv=lv;
 let pct,txt;
 if(lv===top){pct=100;txt=xp+" XP · semua beans ≥"+MASTER}
 else if(lv===top-1){pct=m/N*100;txt=xp+" XP · "+m+"/"+N+" beans ≥"+MASTER}
 else{const lo=LV_XP[lv]*N*100,hi=LV_XP[lv+1]*N*100;pct=(xp-lo)/(hi-lo)*100;txt=xp+" / "+Math.round(hi)+" XP"}
 $("rk").textContent=RANKS[lv];$("rk").parentNode.title=RANKS[top]+": seduh semua beans dengan skor "+MASTER+" ke atas";$("lvn").textContent=lv+1;$("xpt").textContent=txt;$("xpb").style.width=Math.max(0,Math.min(100,pct))+"%";
 $("stk").textContent=S.streak;$("stk").parentNode.classList.toggle("hot",S.streak>=3)}
function cards(){$("cards").innerHTML=BEANS.map(b=>{const sc=S.best[b.id],g=sc!=null?grade(sc):"";
 return `<button class="card${P.b===b.id?" sel":""}" data-id="${b.id}" data-d="${b.diff}"><span class="badge ${g}">${g||"–"}</span><div class="row"><div class="bean ${b.roast}"></div><div><h3>${b.name}</h3><div class="meta">${b.sub}</div></div></div><p>${b.flavor}</p><div class="diff"><span class="stars">${"★".repeat(b.diff)+"☆".repeat(5-b.diff)}</span><span>${sc!=null?"Terbaik "+sc:"Belum dicoba"}</span></div></button>`}).join("");
 $("cards").querySelectorAll(".card").forEach(c=>c.onclick=()=>{sfx("pick");P.b=c.dataset.id;cards()});mcards();gcards();sum();hud()}
const MACH=[
{id:"flair",name:"Press Manual Portabel",sub:"Pompa tangan, tanpa listrik",desc:"Ringkas dan jujur: tekanan murni dari tanganmu. Sulit stabil, tapi melatih feeling.",st:1,jit:1.7,risk:.09,pmax:8,spd:1.3,col:"#7f8a8f"},
{id:"home",name:"Semi-Auto Rumahan",sub:"Pompa vibrasi, satu boiler",desc:"Terjangkau, tapi suhu mudah melenceng dan puck lebih rawan channeling.",st:1,jit:1.4,risk:.07,pmax:10,spd:1.2,col:"#8d9397"},
{id:"thermo",name:"Thermoblock Ringkas",sub:"Pemanas instan, tanpa boiler",desc:"Siap dalam hitungan detik, tapi suhunya naik-turun mengikuti aliran.",st:1,jit:1.2,risk:.06,pmax:9.5,spd:1.15,col:"#98a0a4"},
{id:"single",name:"Single Boiler PID",sub:"Satu boiler, suhu terkontrol",desc:"Naik level dari mesin rumahan. Perlu jeda saat pindah dari uap ke seduh.",st:1,jit:1,risk:.05,pmax:9.5,spd:1.1,col:"#a9b0b4"},
{id:"classic",name:"Single Boiler Klasik",sub:"Grup kuningan, katup 3-way",desc:"Mesin pekerja yang awet. Puck lebih kering dan rapi setelah shot.",st:2,jit:.8,risk:.04,pmax:9.2,spd:1.05,col:"#b9bfc2"},
{id:"e61",name:"E61 Heat Exchanger",sub:"Pompa rotari, grup E61",desc:"Stabil setelah panas. Suhu kadang bergeser tipis.",st:2,jit:.6,risk:.02,pmax:9,spd:1,col:"#c9ced1"},
{id:"lever",name:"Lever Manual",sub:"Tuas pegas, profil tekanan menurun",desc:"Aliran halus dan memaafkan, tapi suhunya butuh perhatian.",st:2,jit:.5,risk:.03,pmax:9,spd:.92,col:"#c99a62"},
{id:"sat",name:"Saturated Group Prosumer",sub:"Grup tersaturasi, pompa rotari",desc:"Suhu grup menempel stabil dan mudah diulang dari shot ke shot.",st:2,jit:.35,risk:.01,pmax:9,spd:.92,col:"#d4d8d9"},
{id:"dual",name:"Dual Boiler PID",sub:"Boiler terpisah, kontrol PID",desc:"Suhu hampir konstan dan tekanan rapi. Sangat memaafkan.",st:3,jit:.15,risk:0,pmax:9,spd:.85,col:"#e2b878"},
{id:"profile",name:"Dual Boiler Profiling",sub:"Tekanan dan aliran diatur per tahap",desc:"Pre-infusion dan tekanan menurun diatur halus. Nyaris tanpa celah salah.",st:3,jit:.1,risk:0,pmax:9,spd:.8,col:"#e6c88f"},
{id:"cafe",name:"Kafe Grup-2",sub:"Komersial, boiler besar",desc:"Suhu dan tekanan nyaris tanpa fluktuasi. Paling stabil.",st:3,jit:.08,risk:0,pmax:9,spd:.8,col:"#e8d9a8"},
{id:"cafe3",name:"Kafe Grup-3 Multi-Boiler",sub:"Komersial, tiap grup punya boiler",desc:"Standar kafe sibuk. Hampir tanpa fluktuasi, geraknya paling pelan dan mudah dibaca.",st:3,jit:.05,risk:0,pmax:9,spd:.74,col:"#efe3b8"}];
const GR=[
{id:"blade",name:"Blade Grinder",sub:"Pisau pencincang",desc:"Murah, tapi partikelnya tidak seragam sehingga puck rawan channeling.",q:1,risk:.05,spd:1.2,col:"#8d9397"},
{id:"cer",name:"Hand Burr Keramik",sub:"Burr keramik, putar tangan",desc:"Terjangkau dan portabel, tapi gilingannya berdebu dan kurang konsisten.",q:1,risk:.045,spd:1.15,col:"#c7b8a0"},
{id:"hand",name:"Hand Burr Manual",sub:"Burr konikal, putar tangan",desc:"Cukup seragam untuk harganya. Butuh tenaga dan ketelitian.",q:2,risk:.03,spd:1.05,col:"#b5835a"},
{id:"con",name:"Konikal Elektrik",sub:"Burr konikal, motor pelan",desc:"Seragam dan hangat di rasa. Retensi cukup, tidak merepotkan.",q:2,risk:.025,spd:.95,col:"#a9b4b8"},
{id:"handp",name:"Hand Burr Premium",sub:"Burr baja presisi, putar tangan",desc:"Seragam setara elektrik, dibayar dengan tenaga lengan.",q:3,risk:.015,spd:.98,col:"#d3a574"},
{id:"f64",name:"Flat Burr 64 mm",sub:"Elektrik, burr datar",desc:"Gilingan seragam dengan retensi rendah.",q:3,risk:.01,spd:.9,col:"#c9ced1"},
{id:"sd",name:"Single Dose 65 mm",sub:"Elektrik, retensi nyaris nol",desc:"Giling per dosis tanpa sisa. Tiap shot terasa bersih dan konsisten.",q:3,risk:.005,spd:.86,col:"#d7dcde"},
{id:"f83",name:"Flat Burr 83 mm",sub:"Elektrik, on-demand",desc:"Standar kafe. Partikel sangat seragam dan konsisten.",q:3,risk:0,spd:.8,col:"#e2b878"},
{id:"f98",name:"Flat Burr 98 mm Titanium",sub:"Elektrik, burr berlapis titanium",desc:"Kelas tertinggi: nyaris tanpa fines, tak ada alasan menyalahkan gilingan.",q:3,risk:0,spd:.72,col:"#f0cf8a"}];
let P={b:null,m:null,g:null};
const SHD=`<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".3" stop-color="#fff" stop-opacity=".12"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>`;
const mIcon=m=>{const c=m.col,n=m.st,id=m.id;
 const gg=Array.from({length:n},(_,i)=>{const x=40+i*20;return `<circle cx="${x}" cy="35" r="7" fill="#0d0907" stroke="#e9b95f" stroke-width="1.5"/><g class="sw" style="transform-origin:${x}px 35px;animation-delay:${-i*.8}s"><line x1="${x}" y1="35" x2="${x}" y2="29.5" stroke="#f1e4cf" stroke-width="1.4" stroke-linecap="round"/></g>`}).join("");
 return `<svg class="ill" viewBox="0 0 160 112" width="176" height="123" aria-hidden="true">${SHD}<ellipse cx="80" cy="108" rx="64" ry="3.5" fill="#000" opacity=".45"/>${n>2?[34,50,66].map(x=>`<rect x="${x}" y="11" width="11" height="9" rx="2.5" fill="#efe9de"/>`).join(""):""}<rect x="20" y="20" width="120" height="84" rx="11" fill="${c}"/><rect x="20" y="20" width="120" height="84" rx="11" fill="url(#sh)"/><rect x="28" y="26" width="104" height="20" rx="6" fill="#120d0a" opacity=".6"/>${gg}<circle class="led" cx="122" cy="36" r="3" fill="#58d36b"/><rect x="44" y="64" width="72" height="35" rx="7" fill="#0d0907" opacity=".7"/><rect x="62" y="52" width="36" height="12" rx="3" fill="#aeb3b5"/><rect x="62" y="52" width="36" height="12" rx="3" fill="url(#sh)"/><rect x="66" y="64" width="28" height="8" rx="3" fill="#2a2a2a"/><rect x="92" y="66" width="26" height="5" rx="2.5" fill="#2a1a10"/><line class="act dr" x1="80" y1="72" x2="80" y2="88" stroke="#d79a4a" stroke-width="2.4" stroke-dasharray="3 4"/><path d="M66 88h28v5a8 8 0 0 1-8 8H74a8 8 0 0 1-8-8z" fill="#efe9de"/><ellipse cx="80" cy="88.5" rx="14" ry="2" fill="#6b4423"/><path d="M140 52h6v22l2 7" fill="none" stroke="#c9ced1" stroke-width="2.6" stroke-linecap="round"/>${[0,1,2].map(i=>`<circle class="puff" cx="${147+i}" cy="46" r="2.4" fill="#fff" style="animation-delay:${-i*.9}s"/>`).join("")}${/^(lever|flair)$/.test(id)?'<g class="act bob" style="transform-origin:112px 52px"><path d="M112 52L128 14" stroke="#c99a62" stroke-width="4.5" stroke-linecap="round"/><circle cx="128" cy="14" r="5" fill="#2a1a10"/></g>':""}</svg>`};
const gIcon=g=>{const c=g.col,id=g.id,bn=(dy)=>[[66,22],[80,18],[92,24],[74,30],[88,34],[80,26]].map(([x,y])=>`<ellipse cx="${x}" cy="${y+dy}" rx="4.2" ry="2.8" fill="#5c3515" transform="rotate(${x*7%60-30} ${x} ${y+dy})"/>`).join("");let b;
 if(id==="blade")b=`<rect x="52" y="30" width="56" height="52" rx="8" fill="#fff" opacity=".13" stroke="${c}" stroke-width="2"/><rect x="48" y="22" width="64" height="12" rx="5" fill="#2a2a2a"/><g transform="translate(0,30)">${bn(0).slice(0,300)}</g><rect x="46" y="80" width="68" height="22" rx="8" fill="${c}"/><rect x="46" y="80" width="68" height="22" rx="8" fill="url(#sh)"/><g class="act spin" style="transform-origin:80px 73px"><ellipse cx="80" cy="73" rx="22" ry="3" fill="#dfe3e5"/></g><circle cx="80" cy="73" r="3" fill="#2a2a2a"/>`;
 else if(/^(hand|cer)/.test(id))b=`<rect x="58" y="42" width="44" height="44" rx="6" fill="${c}"/><rect x="58" y="42" width="44" height="44" rx="6" fill="url(#sh)"/><rect x="54" y="34" width="52" height="10" rx="4" fill="#2a1a10"/><rect x="62" y="86" width="36" height="16" rx="4" fill="#fff" opacity=".14" stroke="#cfd4d6"/><ellipse cx="80" cy="100" rx="15" ry="3" fill="#5c3515"/><g class="act spin" style="transform-origin:80px 28px"><line x1="80" y1="28" x2="116" y2="28" stroke="#2a1a10" stroke-width="4" stroke-linecap="round"/><circle cx="118" cy="28" r="6" fill="#b5835a"/></g><circle cx="80" cy="28" r="4" fill="#cfd4d6"/>`;
 else b=`<path d="M46 8h68l-10 38H56z" fill="#fff" opacity=".13" stroke="${c}" stroke-width="2"/>${bn(0)}<rect x="44" y="46" width="72" height="50" rx="9" fill="${c}"/><rect x="44" y="46" width="72" height="50" rx="9" fill="url(#sh)"/><circle cx="80" cy="68" r="12" fill="#0d0907"/><g class="act spin" style="transform-origin:80px 68px"><circle cx="80" cy="68" r="8" fill="none" stroke="#e9b95f" stroke-width="3" stroke-dasharray="3 3"/></g><circle class="led" cx="104" cy="56" r="2.6" fill="#58d36b"/>${/^(f83|f98|sd)$/.test(id)?'<circle class="led" cx="104" cy="64" r="2.6" fill="#e9b95f" style="animation-delay:-.8s"/><circle cx="106" cy="82" r="5" fill="#120d0a" stroke="#e9b95f"/>':""}<rect x="74" y="96" width="12" height="6" rx="2" fill="#2a2a2a"/><line class="act dr" x1="80" y1="102" x2="80" y2="108" stroke="#8a5a2d" stroke-width="2.4" stroke-dasharray="2 3"/>`;
 return `<svg class="ill" viewBox="0 0 160 112" width="176" height="123" aria-hidden="true">${SHD}<ellipse cx="80" cy="109" rx="50" ry="3" fill="#000" opacity=".45"/>${b}</svg>`};
const pace=v=>v>1.1?"Cepat":v>.9?"Sedang":"Lambat";
const segs=(n,c="")=>`<span class="seg ${c}">${[1,2,3].map(i=>`<i class="${i<=n?"on":""}"></i>`).join("")}</span>`;
const eqc=(el,L,k,ic,rows)=>{$(el).innerHTML=L.map(m=>`<button class="card mc${P[k]===m.id?" sel":""}" data-id="${m.id}"><div class="mi">${ic(m)}</div><h3>${m.name}</h3><div class="meta">${m.sub}</div><p>${m.desc}</p>${rows(m).map(([a,b])=>`<div class="stat"><span>${a}</span>${b}</div>`).join("")}<div class="stat"><span>Laju gerak game</span><b class="pace">${pace(m.spd)}</b></div></button>`).join("");
 $(el).querySelectorAll(".card").forEach(c=>c.onclick=()=>{sfx("pick");P[k]=c.dataset.id;eqc(el,L,k,ic,rows);sum()})};
const mcards=()=>eqc("mcards",MACH,"m",mIcon,m=>[["Kestabilan suhu",segs(m.st)],["Risiko channeling",segs(m.risk>.05?3:m.risk>.01?2:1,"bad")]]);
const gcards=()=>eqc("gcards",GR,"g",gIcon,g=>[["Keseragaman gilingan",segs(g.q)]]);
function sum(){const b=BEANS.find(x=>x.id===P.b),m=MACH.find(x=>x.id===P.m),g=GR.find(x=>x.id===P.g);$("start").disabled=!(b&&m&&g);
 $("dsum").innerHTML=b&&m&&g?"<b>"+b.name+"</b> di <b>"+m.name+"</b> + <b>"+g.name+"</b>":"Pilih "+[!b&&"beans",!m&&"mesin",!g&&"grinder"].filter(Boolean).join(", ")+" untuk mulai."}
$("start").onclick=()=>{if(P.b&&P.m&&P.g){S.m=MACH.find(m=>m.id===P.m);S.gd=GR.find(g=>g.id===P.g);S.spd=S.m.spd*S.gd.spd;musicAuto();open(P.b)}};
const mt=(n,v,lo,hi,a,b)=>{const pc=x=>cl((x-a)/(b-a)*100,0,100);return `<div class="mt"><div class="mh2"><span>${n}</span><b class="${v<lo?"lo":v>hi?"hi":"ok"}">${v.toFixed(1)}%</b></div><div class="mbar"><i class="zone" style="left:${pc(lo)}%;width:${pc(hi)-pc(lo)}%"></i><i class="pin" style="left:${pc(v)}%"></i></div><div class="mscale"><span>${a}%</span><span>ideal ${lo}–${hi}%</span><span>${b}%</span></div></div>`};
/* Musik jazz cozy prosedural (Web Audio): piano elektrik, bas, sikat drum, reverb, dan derak piringan hitam */
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
function musUi(){$("mus").textContent=MU.on?"♪ Musik: nyala":"♪ Musik: mati";$("mus").classList.toggle("on",MU.on)}
function musicOn(){if(!MU.c){const c=MU.c=new(window.AudioContext||window.webkitAudioContext)(),sr=c.sampleRate;
  MU.m=c.createGain();MU.m.gain.value=0;const cp=c.createDynamicsCompressor();MU.m.connect(cp);cp.connect(c.destination);
  MU.lp=c.createBiquadFilter();MU.lp.type="lowpass";MU.lp.frequency.value=2300;MU.lp.Q.value=.4;MU.lp.connect(MU.m);
  MU.rv=c.createConvolver();const L=sr*2.6,ib=c.createBuffer(2,L,sr);for(let h=0;h<2;h++){const d=ib.getChannelData(h);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.6)}
  MU.rv.buffer=ib;const rg=c.createGain();rg.gain.value=.55;MU.rv.connect(rg);rg.connect(MU.m);
  MU.nb=c.createBuffer(1,sr/2,sr);let d=MU.nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const cb=c.createBuffer(1,sr*4,sr);d=cb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()<.0007?(Math.random()*2-1)*.9:0)+(Math.random()*2-1)*.01;
  const cs=c.createBufferSource(),cf=c.createBiquadFilter(),cg=c.createGain();cs.buffer=cb;cs.loop=true;cf.type="highpass";cf.frequency.value=1200;cg.gain.value=.05;cs.connect(cf);cf.connect(cg);cg.connect(MU.m);cs.start()}
 MU.c.resume();MU.on=true;MU.mute=false;MU.nx=Math.max(MU.nx,MU.c.currentTime+.1);MU.m.gain.setTargetAtTime(1,MU.c.currentTime,.6);
 if(!MU.tm)MU.tm=setInterval(()=>{while(MU.nx<MU.c.currentTime+1.5){playBar(MU.nx);MU.nx+=4*BT}},300);musUi()}
function musicOff(){MU.on=false;MU.mute=true;if(MU.m)MU.m.gain.setTargetAtTime(0,MU.c.currentTime,.25);clearInterval(MU.tm);MU.tm=0;musUi()}
const musicAuto=()=>{};
$("mus").onclick=()=>MU.on?musicOff():musicOn();
function open(id){S.b=BEANS.find(b=>b.id===id);resetGames();
 $("bi").className="bean "+S.b.roast;$("mn").textContent="· "+S.m.name+" + "+S.gd.name;$("bn").textContent=S.b.name;$("bs").textContent=S.b.sub;$("bf").textContent=S.b.flavor;
 $("hint").innerHTML="<b>Titik awal:</b> dosis sekitar "+Math.round(S.b.k.dose)+" g, rasio sekitar 1:"+S.b.k.ratio.toFixed(1)+". "+hintRoast[S.b.roast]+" <span class=\"clue\">Warna di tiap stasiun adalah petunjuk panas-dingin: hijau paling dekat dengan nilai kunci, merah paling jauh. Titik hijau belum tentu persis di kunci.</span>";
 reset();$("select").classList.add("hidden");$("station").classList.remove("hidden");scrollTo(0,0);say("Bar siap untuk "+S.b.name+". "+(S.m.jit>1?"Mesin ini gampang goyah suhunya, hati-hati.":S.m.jit<.2?"Mesin ini stabil, sisanya tergantung tanganmu.":"Mulai dari gilingan, ya."))}
const upd=()=>{$("go1").disabled=S.run||!GM.every(o=>S.ok[o.k]);const n=GM.filter(o=>S.ok[o.k]).length;$("pgt").textContent=n+" / "+GM.length+" stasiun siap";$("pgi").style.width=n/GM.length*100+"%"};
function lock(v){document.querySelectorAll(".mb").forEach(b=>b.disabled=v);upd()}
function mark(k){$("m_"+k).classList.toggle("done",!!S.ok[k]);upd();if(S.ok[k]){sfx("ok");say(GM.every(o=>S.ok[o.k])?"Semua stasiun siap. Tekan MULAI SHOT dan jaga tempo!":rnd(SAYS[k]))}}
/* 8 mini-game. Warna = clue panas-dingin: hijau dekat nilai kunci, merah jauh. */
const R=x=>(x*100).toFixed(1)+"%",ST=(c,h,f)=>[[c-3*h,"#d9573f"],[c-1.5*h,"#e9c24a"],[c-.45*h,"#58d36b"],[c+.45*h,"#58d36b"],[c+1.5*h,"#e9c24a"],[c+3*h,"#d9573f"]].map(([x,col])=>col+" "+f(x)).join(",");
const heat=(c,h,dir)=>`linear-gradient(${dir},${ST(c,h,R)})`;
const conic=(c,h,sp,from)=>`conic-gradient(from ${from}deg,${ST(c,h,x=>Math.max(0,Math.min(sp,x*sp)).toFixed(1)+"deg")}${sp<360?`,transparent ${sp}deg`:""})`;
const vd=k=>p=>{$("f_"+k).style.height=(1-p)*100+"%";$("l_"+k).style.bottom=p*100+"%"};
const hd=k=>p=>{$("f_"+k).style.width=(1-p)*100+"%";$("l_"+k).style.left=p*100+"%"};
const vb=k=>(c,h)=>{$("z_"+k).style.background=heat(c,h,"to top")};
const hb=k=>(c,h)=>{$("z_"+k).style.background=heat(c,h,"to right")};
const tube=(k,cls,x="")=>`<div class="vt ${cls}"><div class="gz" id="z_${k}"></div><div class="dm" id="f_${k}"></div><i class="ln" id="l_${k}"></i>${x}</div>`;
const GM=[
{k:"g",type:"sweep",t:"Gilingan",lo:0,hi:100,period:3200,lbl0:"TAP: KUNCI JARUM",fmt:v=>Math.round(v),key:b=>b.k.grind,tol:b=>b.tol.grind,
 vis:'<div class="rg tk" id="z_g"><i class="nd" id="n_g"></i><b>halus ◀ ▶ kasar</b></div>',draw:p=>{$("n_g").style.transform="rotate("+(-135+p*270)+"deg)"},band:(c,h)=>{$("z_g").style.background=conic(c,h,270,-135)}},
{k:"d",type:"hold",t:"Dosis",lo:0,hi:26,rate:4.5,lbl0:"TAHAN: GILING",fmt:v=>v.toFixed(1)+" g",key:b=>b.k.dose,tol:b=>b.tol.dose,
 vis:tube("d","vv hop",'<b class="drop"></b><b class="drop"></b><b class="drop"></b>'),draw:vd("d"),band:vb("d")},
{k:"tm",type:"knob",t:"Suhu air",lo:84,hi:98,lbl0:"PUTAR KNOB ↻",fmt:v=>v.toFixed(1)+"°C",key:b=>b.k.temp,tol:b=>b.tol.temp,
 vis:'<div class="rg tk dr" id="z_tm"><div class="kb" id="kb"><i class="kp"></i></div></div>',draw:p=>{$("kb").style.transform="rotate("+(-135+p*270)+"deg)"},band:(c,h)=>{$("z_tm").style.background=conic(c,h,270,-135)}},
{k:"tp",type:"hold",t:"Tamping",lo:5,hi:30,rate:7,lbl0:"TAHAN: TEKAN",fmt:v=>v.toFixed(1)+" kg",key:b=>b.k.tamp,tol:b=>b.tol.tamp,
 vis:'<div class="rg" id="z_tp"><div class="rm" id="m_tp"></div><i class="nd" id="n_tp"></i><b>tamper</b></div>',
 draw:p=>{$("m_tp").style.background="conic-gradient(transparent "+p*360+"deg,#120d0a99 0)";$("n_tp").style.transform="rotate("+p*360+"deg)"},band:(c,h)=>{$("z_tp").style.background=conic(c,h,360,0)}},
{k:"ev",type:"sweep",t:"Kerataan",lo:0,hi:1,period:1500,lbl0:"TAP: GELEMBUNG",fmt:v=>"Rata "+Math.round((1-Math.abs(v-.5)*2)*100)+"%",key:()=>.5,tol:b=>(.24-b.diff*.028)/2,noff:1,
 vis:'<div class="lv" id="z_ev"><i class="bb" id="f_ev"></i></div>',draw:p=>{const e=$("f_ev");e.style.left=p*100+"%";e.style.transform="translateX(-"+p*100+"%)"},band:hb("ev")},
{k:"wd",type:"swirl",t:"Aduk WDT",lo:0,hi:8,lbl0:"PUTAR JARUM ↻",fmt:v=>v.toFixed(1)+" putaran",key:b=>b.k.wd,tol:b=>b.tol.wd,
 vis:'<div class="col"><div class="pk dr" id="pk"><div class="rm" id="tr_wd"></div><i class="nd" id="n_wd"></i></div>'+tube("wd","hb")+'</div>',
 draw:p=>{const rev=p*8;$("n_wd").style.transform="rotate("+rev*360+"deg)";$("tr_wd").style.background="conic-gradient(#f1e4cf55 "+(rev%1)*360+"deg,transparent 0)";hd("wd")(p)},band:hb("wd")}];
$("games").innerHTML=GM.map(o=>`<div class="mg" id="m_${o.k}"><div class="mh"><span>${o.t}</span><output id="o_${o.k}">—</output></div><div class="vzw">${o.vis}</div><button class="btn mb" id="b_${o.k}">${o.lbl0}</button></div>`).join("");
function setup(o){const k=o.k,b=$("b_"+k),m=$("m_"+k),sp=o.hi-o.lo;let v=o.lo,iv=null,raf=null,t0=0,tm=null;
 const show=(txt=1)=>{o.draw((v-o.lo)/sp);if(txt)$("o_"+k).textContent=o.fmt(v)};
 const done=()=>{S[k]=v;S.ok[k]=1;mark(k);b.textContent="ULANGI";show()};
 const begin=()=>{S.ok[k]=0;mark(k);v=o.lo};
 if(o.type==="hold"){
  const en=()=>{if(!iv)return;clearInterval(iv);iv=null;b.classList.remove("on");m.classList.remove("act");v=Math.min(o.hi,v+o.rate*S.spd*.1*(.5+Math.random()));done()};
  b.onpointerdown=e=>{if(S.run||iv)return;e.preventDefault();begin();b.classList.add("on");m.classList.add("act");iv=setInterval(()=>{v=Math.min(o.hi,v+o.rate*S.spd*.05);show(o.hide?0:1);if(v>=o.hi)en()},50)};
  ["pointerup","pointerleave","pointercancel"].forEach(e=>b.addEventListener(e,en))}
 else if(o.type==="knob"){
  const el=$("z_"+k);let on=false;
  const mv=e=>{if(!on)return;const r=el.getBoundingClientRect();let a=Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2))*180/Math.PI;if(Math.abs(a)>135)a=a>0?135:-135;v=o.lo+(a+135)/270*sp;show()};
  el.onpointerdown=e=>{if(S.run)return;e.preventDefault();el.setPointerCapture(e.pointerId);on=true;begin();m.classList.add("act");mv(e)};
  el.onpointermove=mv;const up=()=>{if(!on)return;on=false;m.classList.remove("act");done()};el.onpointerup=up;el.onpointercancel=up;
  b.onclick=()=>{if(!S.run){b.reset();S.ok[k]=0;mark(k)}}}
 else if(o.type==="swirl"){
  const el=$("pk");let on=false,last=0,acc=0;
  const pos=e=>{const r=el.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;return[Math.atan2(dx,-dy),Math.hypot(dx,dy)]};
  el.onpointerdown=e=>{if(S.run)return;e.preventDefault();el.setPointerCapture(e.pointerId);on=true;begin();acc=0;last=pos(e)[0];m.classList.add("act");show()};
  el.onpointermove=e=>{if(!on)return;const[a,r]=pos(e);if(r<14)return;let d=a-last;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;last=a;acc+=Math.abs(d);v=Math.min(o.hi,acc/(2*Math.PI));show()};
  const up=()=>{if(!on)return;on=false;m.classList.remove("act");done()};el.onpointerup=up;el.onpointercancel=up;
  b.onclick=()=>{if(!S.run){b.reset();S.ok[k]=0;mark(k)}}}
 else{
  const run=ts=>{t0=t0||ts;const p=(1-Math.cos((ts-t0)*S.spd/o.period*2*Math.PI))/2;v=o.lo+p*sp;show(0);raf=requestAnimationFrame(run)};
  b.onclick=()=>{if(S.run)return;if(raf){cancelAnimationFrame(raf);raf=null;done()}else{begin();t0=0;b.textContent="TAP: KUNCI!";raf=requestAnimationFrame(run)}}}
 b.reset=()=>{clearInterval(iv);iv=null;cancelAnimationFrame(raf);raf=null;clearTimeout(tm);tm=null;v=o.lo;o.draw(0);$("o_"+k).textContent="—";b.textContent=o.lbl0;b.classList.remove("on");m.classList.remove("act")}}
GM.forEach(setup);
function resetGames(){S.ok={};
 GM.forEach(o=>{$("b_"+o.k).reset();mark(o.k);const sp=o.hi-o.lo,c=(o.key(S.b)-o.lo)/sp,h=o.tol(S.b)/sp;o.band(c+(o.noff?0:(Math.random()-.5)*h),h)})}
function reset(){clearInterval(S.iv);S.run=false;S.t=0;S.y=0;lock(false);
 $("mach").classList.remove("run","hot","flow");$("lcd").textContent="0.0 s";$("st").style.filter="";$("go1").textContent="MULAI SHOT";$("go1").classList.remove("hidden");$("stop").classList.add("hidden");$("res").classList.add("hidden");$("empty").classList.remove("hidden");
 $("st").style.height="0";$("lq").style.height="0";$("crm").style.opacity=0;$("rt").textContent="0.0";$("ry").textContent="0.0";$("rf").textContent="0.0";$("rr").textContent="—";
 $("nd").style.transform="rotate(0deg)";$("bar").textContent="0 bar";$("msg").textContent="Selesaikan semua stasiun, lalu mulai shot. Hentikan saat yield pas."}
$("back").onclick=()=>{reset();$("station").classList.add("hidden");$("select").classList.remove("hidden");cards()};
$("again").onclick=reset;$("again2").onclick=()=>$("back").onclick();

/* Model fisika sederhana: aliran bergantung gilingan, dosis, tamping, suhu. Ada jeda basah 6 dtk + ramp 4 dtk. */
function flowRate(){const k=S.b.k,f0=k.dose*k.ratio/(k.time-8);
 let f=f0*Math.exp((S.g-k.grind)/30)*Math.pow(k.dose/S.d,1.3)*Math.exp(-(S.tp-k.tamp)*.035)*(1+(S.te-k.temp)*.008);
 return S.ch?f*1.35:f}
$("go1").onclick=()=>{if($("go1").disabled)return;const k=S.b.k,t=S.b.tol;
 const p=cl(S.b.risk+S.m.risk+S.gd.risk+.1*Math.abs(S.tp-k.tamp)/t.tamp+.05*Math.abs(S.d-k.dose)/t.dose+.35*Math.abs(S.ev-.5)*2+.12*Math.min(2,Math.abs(S.wd-k.wd)/t.wd),0,.85);S.ch=Math.random()<p;
 S.te=S.tm+(Math.random()*2-1)*S.m.jit;const f=flowRate();lock(true);S.run=true;S.t=0;S.y=0;S.fd=S.cr=S.mid=0;$("mach").classList.add("run");sfx("go");say("Pompa menyala. Pre-infusion dimulai, sabar ya.");
 $("go1").classList.add("hidden");$("stop").classList.remove("hidden");$("empty").classList.remove("hidden");
 $("st").style.height="161px";$("st").style.opacity=0;$("st").className="stream"+(S.ch?" ch":"");$("msg").textContent="Pre-infusion… tunggu tetes pertama.";
 S.iv=setInterval(()=>{S.t+=.2;let fl=0;if(S.t>6){fl=f*cl((S.t-6)/4,0,1);S.y+=fl*.2}
  const pr=S.t<1?0:S.t<6?3:Math.min(S.m.pmax,3+(S.t-6)*3);
  $("nd").style.transform="rotate("+(pr/10*180+(Math.random()-.5)*(pr?1+S.m.jit*2:0))+"deg)";$("bar").textContent=pr.toFixed(1)+" bar";
  $("rt").textContent=S.t.toFixed(1);$("ry").textContent=S.y.toFixed(1);$("rf").textContent=fl.toFixed(1);$("rr").textContent=S.y>1?"1:"+(S.y/S.d).toFixed(2):"—";
  $("lq").style.height=cl(S.y/60*100,0,100)+"%";$("crm").style.opacity=S.y>3?.9:0;$("crm").style.bottom="calc("+cl(S.y/60*100,0,100)+"% - 9px)";
  if(S.t>6&&S.y<.3)$("msg").textContent="Pre-infusion… tunggu tetes pertama.";else if(S.t>6)$("msg").textContent="Mengalir. Perhatikan warna dan flow.";
  $("st").style.height=(161-1.06*cl(S.y/60*100,0,100))+"px";$("st").style.opacity=S.y>.3?1:0;$("mach").classList.toggle("flow",S.y>.3);$("lcd").textContent=S.t.toFixed(1)+" s";ALIVE();if(S.y>=60||S.t>=70)finish()},100)};
$("stop").onclick=()=>{if(S.y<5){$("msg").textContent="Terlalu awal. Tunggu yield terkumpul dulu.";return}finish()};

/* Zona 100 dipersempit (dulu sampai 0,5 toleransi, kini 0,35) dan skor turun lebih cepat di dekat puncak.
   Mulai z>=1 kurvanya identik dengan sebelumnya, jadi skor menengah ke bawah nyaris tidak berubah. */
const f=(x,tol)=>{const z=Math.abs(x)/tol;return z<=.35?100:z<=.5?100-(z-.35)*40:z<=1?94-(z-.5)*48:cl(100-(z-.5)*60,0,100)};
const fe=d=>d<=.4?100:d<=1.2?100-(d-.4)*18.75:cl(100-Math.max(0,d-.7)*30,0,100);
function finish(){clearInterval(S.iv);$("mach").classList.remove("run","flow");$("nd").style.transform="rotate(0deg)";$("bar").textContent="0 bar";S.run=false;lock(false);$("stop").classList.add("hidden");$("go1").classList.remove("hidden");$("go1").textContent="SHOT BARU";$("st").style.height="0";
 const k=S.b.k,t=S.b.tol,y=S.y,ratio=y/S.d,time=S.t;
 /* Extraction yield (%): referensi 20% pada resep kunci; naik oleh suhu, gilingan halus, waktu, rasio. Channeling menurunkan. */
 let ey=20+.45*(S.te-k.temp)-.04*(S.g-k.grind)+.12*(time-k.time)+2.4*(ratio-k.ratio);if(S.ch)ey-=3;ey=cl(ey,10,30);
 const tds=cl(ey*S.d/Math.max(y,1),3,18);
 let sc=.34*fe(Math.abs(ey-20))+.16*f(time-k.time,t.time)+.18*f(ratio-k.ratio,t.ratio)+.09*f(S.te-k.temp,t.temp)+.07*f(S.d-k.dose,t.dose)+.07*f(S.g-k.grind,t.grind)+.06*f(S.tp-k.tamp,t.tamp)+.03*f(S.wd-k.wd,t.wd);
 if(S.ch)sc-=18;sc=Math.round(cl(sc,0,100));
 const under=ey<18,over=ey>22;let cls=under?"under":over?"over":"perfect",vd=S.ch?"Channeling terdeteksi":under?"Under-extracted":over?"Over-extracted":"Ekstraksi seimbang";
let taste=rnd(S.ch?["Asam dan pahit sekaligus, aliran tidak merata.","Dua karakter bertabrakan di satu cangkir: sebagian hijau, sebagian gosong."]:under?["Asam tajam, tipis, after-taste pendek.","Cerah di depan tapi hampa di belakang, seperti jeruk nipis tanpa gula.","Segar sebentar lalu kosong; manisnya belum sempat keluar."]:over?["Pahit, kering, after-taste seperti abu.","Pahitnya menutup semua karakter; lidah terasa sepat.","Gosong di ujung, kering di langit-langit."]:tds<8?["Manis tapi encer, body kurang.","Bersih, namun terlalu ringan untuk disebut espresso."]:tds>12?["Manis tapi terlalu pekat.","Kental seperti sirup; manisnya nyaris menutup keasamannya."]:["Manis, body bulat. "+S.b.notes+".","Seimbang dan manis; "+S.b.notes+" terbaca jelas.","Bersih, bulat, dan menyisakan "+S.b.notes.split(",")[0].trim()+" di akhir."]);
 const g=grade(sc);S.streak=sc>=80?S.streak+1:0;const old=S.best[S.b.id]||0;if(sc>old)S.best[S.b.id]=sc;save();
 $("vd").textContent=vd;$("vd").className="verdict "+cls;$("taste").textContent=taste;$("gr").textContent=g;$("sc").textContent=sc+" / 100";
 $("xpg").textContent=sc>old?"+"+(sc-old)+" XP · rekor baru":"Rekor beans ini: "+old;$("res").dataset.g=g;const n5=Math.max(1,Math.round(sc/20));$("rst").textContent="★".repeat(n5)+"☆".repeat(5-n5);$("fxst").textContent=$("rst").textContent;
const rr=S.b.roast,rb={light:[1.2,0,-1,-.5],medium:[0,.3,0,0],dark:[-1.2,-.2,1.2,.8]}[rr],q=S.gd.q;
 const sour=cl(4+(20-ey)*1.25+(S.ch?2:0)+rb[0],0,10),sweet=cl(10-Math.abs(ey-20)*1.7-(S.ch?2.5:0)+rb[1],0,10),bit=cl(3+(ey-20)*1.25+(S.ch?1.5:0)+rb[2],0,10),body=cl(tds/12*8.5+rb[3],0,10);
 const aroma=cl(10-Math.abs(S.te-k.temp)/t.temp*1.8-(S.ch?2.5:0)-(ey>22?(ey-22)*.8:0)-(ey<18?(18-ey)*.4:0)+(q-2)*.4,0,10),bal=cl(10-Math.abs(sour-bit)*.6-Math.abs(ey-20)*.9-(S.ch?2:0),0,10),aft=cl(sc/10*.7+sweet*.3-(under||over?1:0),0,10),vals=[aroma,sour,sweet,bit,body,bal,aft];
 radar(vals);$("fl").innerHTML=vals.map((q,i)=>`<span><b>${q.toFixed(1)}</b>${AX[i]}</span>`).join("");$("rinfo").innerHTML=mt("EY · ekstraksi",ey,18,22,12,28)+mt("TDS · kepekatan",tds,8,12,4,16);
 const nt=S.b.notes.split(",").map(x=>x.trim()),shf=a=>[...a].sort(()=>Math.random()-.5);
 let tags=S.ch?shf(TG.c).slice(0,4):ey<18?shf(TG.u).slice(0,4):ey>22?shf(TG.o).slice(0,4):[...nt,...shf(XT[rr]).slice(0,2)];
 if(tds<8)tags.push("body tipis");else if(tds>12)tags.push("pekat seperti sirup");if(q==1)tags.push("fines pahit");
 $("tg").innerHTML=tags.map(x=>`<span>${x}</span>`).join("");
 const qual=[aroma,10-Math.abs(sour-5.2)*1.5,sweet,10-Math.abs(bit-3.5)*1.6,10-Math.abs(body-7)*1.2,bal,aft].map(x=>cl(x,0,10)),ix=[0,1,2,3,4,5,6];
 $("jg").innerHTML=JG.map(j=>{const s=Math.round(cl(j.w.reduce((a,w,i)=>a+w*qual[i],0)/j.w.reduce((a,w)=>a+w)+j.b,0,10)*4)/4,
  hi=ix.reduce((a,i)=>qual[i]+j.w[i]*.5>qual[a]+j.w[a]*.5?i:a),lo=ix.reduce((a,i)=>qual[i]-j.w[i]*.5<qual[a]-j.w[a]*.5?i:a),
  cm=qual[lo]>=7.5?HIGH[hi][0].toUpperCase()+HIGH[hi].slice(1)+"; sulit mencari cela.":rnd(["Menurut saya","Di lidah saya","Catatan saya:"])+" "+HIGH[hi]+", tetapi "+LOW[lo]+".";
  return `<div class="jc"><div class="jn"><b>${j.n}</b><span>${j.r}</span></div><div class="js">${s.toFixed(2)}</div><p>${cm}</p></div>`}).join("");
 const J=(d,t,lo,hi)=>{const m=Math.abs(d)/t,w=d>0?hi:lo;return m<=.6?["ok","Pas"]:m<=1?["nr","Hampir pas, agak "+w]:m<=2?[d>0?"hi":"lo","Masih terlalu "+w]:[d>0?"hi":"lo","Jauh terlalu "+w]};
 const fl=Math.abs(S.ev-.5)*2,ft=(.24-S.b.diff*.028)/2;
 const rows=[["Dosis",S.d.toFixed(1)+" g",...J(S.d-k.dose,t.dose,"sedikit","banyak")],["Gilingan",Math.round(S.g),...J(S.g-k.grind,t.grind,"halus","kasar")],["Suhu",S.te.toFixed(1)+"°C",...J(S.te-k.temp,t.temp,"dingin","panas")],["Tamping",S.tp.toFixed(1)+" kg",...J(S.tp-k.tamp,t.tamp,"lembut","keras")],["Rasio","1:"+ratio.toFixed(2),...J(ratio-k.ratio,t.ratio,"pendek","panjang")],["Waktu",time.toFixed(1)+" s",...J(time-k.time,t.time,"cepat","lama")],["Aduk WDT",S.wd.toFixed(1)+" putaran",...J(S.wd-k.wd,t.wd,"sedikit","banyak")],
 ["Kerataan",Math.round((1-fl)*100)+"%",...(fl<=ft*.6?["ok","Rata"]:fl<=ft?["nr","Hampir rata"]:fl<=ft*2?["hi","Masih kurang rata"]:["hi","Jauh dari rata"])],
 ["Ekstraksi",ey.toFixed(1)+"% / "+tds.toFixed(1)+"%",...(under?["lo","Masih kurang terekstraksi"]:over?["hi","Terlalu terekstraksi"]:["ok","Seimbang"])]];
 $("key").innerHTML=rows.map(([n,v,c,x])=>`<tr><td>${n}</td><td>${v}</td><td class="${c}"><span class="pl">${x}</span></td></tr>`).join("");
 let tip;if(S.ch)tip="Channeling: air menembus jalur lemah di puck. Rapikan distribusi dan periksa kembali tamping.";
 else if(under)tip=time<k.time-t.time?"Shot terlalu cepat dan asam. Haluskan gilingan atau naikkan suhu sedikit.":"Ekstraksi kurang walau waktu cukup. Naikkan suhu atau perpanjang yield.";
 else if(over)tip=time>k.time+t.time?"Shot terlalu lama dan pahit. Kasarkan gilingan atau turunkan suhu.":"Ekstraksi berlebih. Hentikan shot lebih awal atau turunkan suhu.";
 else tip=sc>=90?"Kalibrasi hampir sempurna. Coba beans lain.":"Rasa sudah seimbang. Dekatkan lagi ke kunci untuk skor lebih tinggi.";
 $("tip").innerHTML="<b>Langkah berikutnya:</b> "+tip;$("nar").innerHTML=narrate({ey,tds,time,ratio,fl,ft,g});$("empty").classList.add("hidden");$("res").classList.remove("hidden");$("msg").textContent="Shot selesai: "+y.toFixed(1)+" g dalam "+time.toFixed(1)+" dtk.";hud();setTimeout(()=>{fx(g,sc,vd,taste,S.ch);sfx(({S:"S",A:"S",B:"ok"})[g]||"bad");if(sc>old)popup("+"+(sc-old)+" XP");say(({S:"Sempurna! Cupper berdiri memberi tepuk tangan.",A:"Luar biasa. Sedikit lagi menuju sempurna.",B:"Shot bagus. Masih ada ruang untuk dirapikan.",C:"Belum stabil. Baca catatan cupper di bawah.",D:"Aduh, shot gagal. Tenang, setiap barista pernah begini."})[g])},450)}
$("tk").innerHTML=Array.from({length:21},(_,i)=>{const a=Math.PI*(1-i/20),M=i%2==0,r1=M?46:49.5,r2=53;return `<line x1="${75+r1*Math.cos(a)}" y1="${76-r1*Math.sin(a)}" x2="${75+r2*Math.cos(a)}" y2="${76-r2*Math.sin(a)}" stroke="${M?"#f1e4cf":"#8a7660"}" stroke-width="${M?1.6:1}"/>`}).join("");
cards();

addEventListener("message",e=>{const d=e.data||{};
 if(d.seduh==="lab-back"){if(!$("station").classList.contains("hidden"))$("back").click();else scrollTo({top:0,behavior:"smooth"})}
 if(d.seduh==="lab-stop"){try{if(MU.on)musicOff();if(S.run)reset()}catch(x){}}});
$("homeLab").onclick=e=>{e.preventDefault();const L=e.currentTarget;L.classList.remove("hpop");void L.offsetWidth;L.classList.add("hpop");setTimeout(()=>L.classList.remove("hpop"),800);
const inSt=!$("station").classList.contains("hidden");
if(inSt){reset();$("station").classList.add("hidden");$("select").classList.remove("hidden");cards();scrollTo(0,0);try{parent.postMessage({seduh:"lab-home"},"*")}catch(x){}}
else if(scrollY>80){scrollTo({top:0,behavior:"smooth"})}
else{try{parent.postMessage({seduh:"go-hub"},"*")}catch(x){}}};
