/* Si SEDUH - semua logika utama. Bagian dipisah dengan penanda ####. Tiap bagian dibungkus try/catch agar error satu bagian tidak mematikan bagian lain. */

/* ################ Sinkronisasi localStorage (harus pertama) ################ */
try{
(function(){
  var PREFIX="seduh.";
  var proto=Storage.prototype, rawSet=proto.setItem, rawRemove=proto.removeItem, rawGet=proto.getItem;
  function mine(st,k){return st===window.localStorage&&typeof k==="string"&&k.indexOf(PREFIX)===0}
  function notify(){var S=window.SeduhSync;if(S&&typeof S.onLocalChange==="function")S.onLocalChange()}
  proto.setItem=function(k,v){rawSet.call(this,k,v);if(mine(this,k))notify()};
  proto.removeItem=function(k){rawRemove.call(this,k);if(mine(this,k))notify()};
  window.SeduhSync={
    PREFIX:PREFIX, onLocalChange:null,
    get:function(k){return rawGet.call(localStorage,k)},
    set:function(k,v){rawSet.call(localStorage,k,v)},
    remove:function(k){rawRemove.call(localStorage,k)},
    snapshot:function(){
      var o={};
      try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(PREFIX)===0)o[k]=rawGet.call(localStorage,k)}}catch(e){}
      return o;
    },
    clearAll:function(){
      try{var ks=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(PREFIX)===0)ks.push(k)}
      ks.forEach(function(k){rawRemove.call(localStorage,k)})}catch(e){}
    }
  };
})();
}catch(e){console.error("[storage-sync]",e)}

/* ################ Navigasi + Cafe Finder ################ */
try{
(function(){
const $=id=>document.getElementById(id);
/* ---------- Navigasi ---------- */
const VIEWS={"":"splash",hub:"hub",lab:"lab",cafe:"cafe",beverage:"beverage",login:"login",bahan:"resep",perlengkapan:"resep",menu:"resep"};
const TITLE={splash:"Si SEDUH",hub:"Si SEDUH — Beranda",lab:"Si SEDUH — Barista Lab",cafe:"Si SEDUH — Cafe Finder",beverage:"Si SEDUH — Beverage",login:"Si SEDUH — Masuk"};
let cur="",lastRecipe="bahan",cfAnim=false;
const hroute=()=>location.hash.replace(/^#\/?/,"");
function labWin(){const f=$("labFrame");return f&&f.contentWindow}
function loadLab(){
  if($("labFrame"))return;
  const logo=getComputedStyle(document.documentElement).getPropertyValue("--logo");
  const f=document.createElement("iframe");f.id="labFrame";f.className="lab-frame";f.title="Barista Lab";f.setAttribute("allow","autoplay");
  f.addEventListener("load",()=>{try{f.contentDocument.documentElement.style.setProperty("--logo",logo)}catch(e){}});
  f.src="lab.html";$("sv-lab").appendChild(f);
}
let hrBusy=false;
function show(){const v=VIEWS[hroute()]||"splash";
  if(v==="hub"&&cur&&cur!=="hub"&&cur!=="splash"&&!hrBusy&&window.__homeReturn&&!matchMedia("(prefers-reduced-motion: reduce)").matches){hrBusy=true;window.__homeReturn();setTimeout(()=>{hrBusy=false;showNow()},700);return}
  if(!hrBusy)showNow()}
function showNow(){
  const r=hroute(),v=VIEWS[r]||"splash";
  if(cur==="lab"&&v!=="lab"){try{const w=labWin();if(w.MU.on)w.musicOff();if(w.S.run)w.reset()}catch(e){}try{labWin().postMessage({seduh:"lab-stop"},"*")}catch(e){}}
  const changed=cur!==v;cur=v;
  ["splash","hub","lab","cafe","beverage","login","resep"].forEach(n=>$("sv-"+n).classList.toggle("on",n===v));
  $("sbar").style.display=v==="splash"?"none":"";
  document.querySelectorAll("#sbar a").forEach(a=>a.classList.toggle("on",a.dataset.v===v));
  try{const ta=document.querySelector("#sbar a.on:not(.sbrand)"),c=document.querySelector("#sbar .in"),br=c&&c.querySelector(".sbrand");if(ta&&br){const r=ta.getBoundingClientRect(),bl=br.getBoundingClientRect().right;if(r.left<bl+8||r.right>innerWidth-8)c.scrollLeft+=r.left-bl-8}}catch(e){}
  if(v==="lab")loadLab();
  if(v==="resep"){lastRecipe=r||lastRecipe}else document.title=TITLE[v];
  const TH={hub:"",lab:"kopi",cafe:"teh",beverage:"coklat"};
  document.body.classList.toggle("in-resep",v==="resep");document.body.classList.toggle("in-login",v==="login");
  if(v!=="resep")document.body.dataset.theme=TH[v]||"";
  try{window.__scene.set(v==="resep"?(document.body.dataset.theme||"mix"):(TH[v]||"mix"))}catch(e){}
  if(v!=="splash")document.documentElement.style.setProperty("--sbh",$("sbar").offsetHeight+"px");
  if(v==="cafe"&&changed){cfAnim=true;render()}
  if(changed)window.scrollTo(0,0);
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-v=resep]");
  if(a&&cur==="resep")lastRecipe=hroute()||"bahan";
  else if(a&&a.closest("#sbar")&&lastRecipe)a.setAttribute("href","#/"+lastRecipe);
},true);

document.addEventListener("click",e=>{
  const a=e.target.closest('#sbar a[data-v="lab"]');
  if(a&&cur==="lab"){e.preventDefault();try{labWin().postMessage({seduh:"lab-back"},"*")}catch(x){}window.scrollTo(0,0)}
  const c=e.target.closest('#sbar a[data-v="cafe"]');
  if(c&&cur==="cafe"){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})}
});

document.addEventListener("click",e=>{
  if(e.defaultPrevented)return;
  const a=e.target.closest('a[href^="#/"]');if(!a||e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;
  e.preventDefault();const h=a.getAttribute("href");
  if(location.hash!==h)location.hash=h;else show();
});
addEventListener("hashchange",show);addEventListener("popstate",show);
/* ---------- Menu ---------- */
/* MENU = daftar item per kategori [nama, harga|null, keterangan]; MSUM = ringkasan menu dari sumber media; MEDIA = kafe yang infonya dari artikel dan belum dicek lapangan */
const FORE={src:"IDN Times, Tempo",yr:"tanggal artikel beragam",part:true,note:"Ini sebagian menu. Menu lengkap, menu musiman, dan harga terbaru ada di aplikasi Fore Coffee.",hl:["Aren Latte","Pandan Latte","Butterscotch Sea Salt Latte"],cats:[
 ["Fore Signature",[["Iced Aren Latte",29000],["Hot Aren Latte",29000],["Iced Pandan Latte",29000],["Hot Pandan Latte",29000],["Iced Butterscotch Sea Salt Latte",29000],["Iced Café Malt Latte",33000],["Hot Café Malt Latte",33000]]],
 ["Buttercream (musiman)",[["Iced Buttercream Latte",29000],["Iced Buttercream Tiramisu Latte",33000],["Iced Light Buttercream Latte",29000]]],
 ["Coffee",[["Nutty Oat Latte",39000],["Iced Classic Latte",24000],["Double Iced Shaken Latte",33000],["Iced Café Latte",29000],["Hot Café Latte",29000]]],
 ["Non-Coffee",[["Butterscotch Milk Crumble",29000]]],
 ["Fore Deli",[["Aren Coconut Sandwich",32000],["Butterscotch Gula Malaka Financier",29000]]],
 ["Favorit lain (harga tidak tercatat)",[["Hazelnut Latte",null],["Iced Roasted Latte",null],["Iced Shake Shake Latte",null],["Iced Biscuit Chizu",null]]]
]};
const MENU={
17:{src:"Sumedang Ekspres",yr:"Okt 2025",note:"Harga acuan dari artikel, bisa sudah berubah.",hl:["Bagi Akal Sehat","Bagi Blangkon","Bagi Avocado"],cats:[
 ["Signature Coffee",[["Bagi Akal Sehat",18000,"Es kopi susu, gula putih khusus"],["Bagi Blangkon",21000,"Es kopi susu, gula organik"],["Bagi Ingatan",23000,"Es kopi susu"],["Bagi Kasih Sayang",15000,"Es kopi susu hazelnut"],["Bagi Kekayaan",23000,"Es kopi susu Vietnam"],["Bagi Kepastian",20000,"Es kopi susu"],["Bagi Avocado",25000,"Es kopi signature dengan alpukat"]]],
 ["Coffee",[["Caramel Macchiato",23000],["Americano",18000],["Caffè Latte",23000],["Cappuccino",23000],["Mochaccino",25000],["Piccolo",23000],["Long Black",18000],["Affogato",23000],["Flat White",23000]]],
 ["Manual Brew",[["V60",26000],["Kopi Tubruk",20000]]],
 ["Non-Coffee",[["Chocolate",20000],["Matcha",20000],["Taro",20000],["Lemon Tea Signature",18000],["Klepon",23000]]],
 ["Choco Series",[["Choco Hazelnut",25000],["Rum Cake Choco",23000],["Cinnamon Banana Vanilla Choco",23000],["Peppermint Candy Choco",23000]]],
 ["Speciality Tea",[["Jasmine Punch Tea",23000],["Butterfly Pea Tea",23000],["Rosella Tea",23000]]],
 ["Yakult Series",[["Snowlychee",18000],["Yakult Lychee",20000],["Yakult Refreshing Dream",20000],["Yakult Citrun",23000],["Yakult Strawberry Milk",23000]]],
 ["Mocktail",[["Jagericano",25000],["Cosmopolitan",25000],["Joker",25000],["Scream Multiple O",25000],["Bloody Orange Margaritta",25000],["Screwdriver",25000]]],
 ["Rice Bowl",[["Karage Curry Rice Bowl",30000],["Beef Yakiniku Rice Bowl",35000],["Chicken Nanban Rice Bowl",30000],["Japanese Rice Bowl",30000],["Karage Sambal Matah",27000]]],
 ["Tambahan",[["Add Arabica",5000],["Add Oatly",5000],["Extra Shot",5000],["Extra Flavour",5000]]]
]},
10:FORE,26:FORE,
111:{src:"Rumah123",yr:"2026",note:"Harga acuan dari artikel, bisa sudah berubah.",hl:["Espresso","Cafe Latte","Gyoza"],cats:[
 ["Kopi",[["Espresso",25000],["Americano",25000],["Cafe Latte",30000]]],
 ["Camilan",[["Chicken Wings",27000],["Gyoza",20000]]]
]}
};
const MSUM={
1:{src:"Moms Money (Kontan), Bobobox",yr:"2026",tx:"Menu sangat beragam: bakery dan pastry, kopi, cokelat, teh, mocktail, mojito, sarapan (dari pancake sampai smoothies), appetizer, menu utama seperti sate, nasi bebek, steak, pasta, dan pizza, lalu dessert seperti pannacota, sundae, dan cake.",hl:["Pizza","Nasi bebek","Sate","Steak","Pannacota","Pancake"]},
3:{src:"IDN Times",yr:"",tx:"Makanan: nasi goreng, fish and chips, menu sarapan, rice bowl, gorengan, pisang goreng, dan snack ringan. Minuman: espresso, cappuccino, berbagai latte, iced coffee, dan non-kopi yang segar.",hl:["Nasi goreng","Fish and chips","Rice bowl","Pisang goreng","Cappuccino","Latte"]},
37:{src:"IDN Times",yr:"2025",tx:"Menu beragam, termasuk kopi pisang susu (Kosangsu), ice latte, dan ice java choco.",hl:["Kosangsu (kopi pisang susu)","Ice Latte","Ice Java Choco"]},
27:{src:"Kompas.com, Jatinangorku",yr:"2023–2025",tx:"Minuman panas dan dingin serta makanan, di ruangan yang luas dan artistik.",hl:["Kopi Jadoel","Cappuccino","Coffee Latte","Hot Milo","Ice Coffee Thai Tea"],pr:"Minuman sekitar Rp20.000–37.000 (data 2023)."},
49:{src:"Detik",yr:"2021",tx:"Makanan Western, Asian, dan khas Indonesia, plus minuman.",hl:[],pr:"Sekitar Rp20.000–40.000 per orang (data 2021)."},
50:{src:"Kompas.com, Jatinangorku",yr:"2023–2025",tx:"Minuman kopi, dessert, dan makanan berat dengan harga terjangkau.",hl:["Black Coffee","Cafe Latte","Creme Brulee","Affogato"],pr:"Kopi sekitar Rp16.500–26.000 (data 2023)."},
51:{src:"Kompas.com",yr:"2023–2024",tx:"Minuman kopi dan non-kopi, plus paket makan.",hl:["Es Kopi Djoeroe","Es Kopi Susu 1 Liter","Red Velvet","Cremebrulee Hot","Paket nasi ayam geprek + es teh manis"],pr:"Minuman mulai Rp18.000. Paket nasi ayam geprek dan es teh manis mulai Rp33.000."},
52:{src:"Kompas.com",yr:"2024",tx:"Menu ramah kantong mahasiswa, dari kopi sampai makanan sederhana.",hl:["Kopi Pandan","Nasi Telur Sambel Penyet","Indomie Rebus","Cokelat Susu"],pr:"Mulai Rp10.000."},
54:{src:"Kompas.com, ProJabar",yr:"2023–2025",tx:"Lebih banyak menu kopi, ditambah camilan dan makanan berat.",hl:["Coffeetail","Coffee Ice","Mocktail","Milk Based"],pr:"Minuman sekitar Rp17.000–40.000 (data 2023). Makanan mulai Rp25.000."},
60:{src:"Sindonews",yr:"2022",tx:"Menu lintas negara: Indonesia, Oriental, sampai Eropa.",hl:[]},
61:{src:"Monday Co, Liputan6",yr:"2025–2026",tx:"Dari camilan ringan sampai menu berat.",hl:["Ayam geprek","Nasi goreng"]},
62:{src:"Helvetia",yr:"2025",tx:"Desain estetik dengan menu internasional dan Indonesia.",hl:["Rendang hitam","Nasi goreng spesial"]},
63:{src:"Helvetia",yr:"2025",tx:"Menu variatif dari kopi sampai makanan berat, harga terjangkau.",hl:[]},
64:{src:"Popmama",yr:"",tx:"Masakan Western sampai lokal.",hl:[],pr:"Minuman mulai Rp7.000, makanan mulai Rp18.000 (data media, tahun tidak tercatat)."},
65:{src:"IDN Times",yr:"2025",tx:"Menu beragam: kopi susu, teh, dan beberapa camilan.",hl:["Kopi susu","Teh","Camilan"]},
68:{src:"Kompas.com",yr:"2024",tx:"Menu ringan dan makanan, buka 24 jam.",hl:["Mendoan","Dimsum Goreng","Ricebowl Chicken Skin","Nasi Ayam Bakar","Roti Bakar Keju"],pr:"Mulai Rp10.000."},
69:{src:"Kompas.com",yr:"2024",tx:"Kopi, roti bakar, rice bowl, dan mie.",hl:["Roti Bakar Cokelat","Coffee Milk","Chicken Egg Teriyaki Ricebowl","Mendoan","Kopi Susu Jahe","Mie Goreng"],pr:"Mulai Rp10.000."},
70:{src:"IDN Times, Kumparan",yr:"2022–2023",tx:"Beragam olahan kopi dengan tempat yang tenang untuk belajar.",hl:[],pr:"Sekitar Rp10.000–20.000 (data 2023)."},
71:{src:"Kompas.com",yr:"2023",tx:"Minuman kopi, gelato, dan dessert, plus menu makan.",hl:["Gelato","Pizza","Pasta","Sate Maranggi","Hainan Chicken Rice"]},
92:{src:"What's New Indonesia",yr:"",tx:"Teh dan kopi dalam suasana vintage yang berpadu modern.",hl:[]},
93:{src:"What's New Indonesia",yr:"",tx:"Minuman teh, terutama fruit tea dengan beragam rasa buah.",hl:["Fruit tea"]},
95:{src:"Orami",yr:"2025",tx:"Menu berbasis matcha dengan nuansa ala Jepang.",hl:["Matcha"]},
96:{src:"Orami",yr:"2025",tx:"Menu berbasis matcha.",hl:["Matcha"]},
97:{src:"Tripadvisor",yr:"2018",tx:"Kopi dan pizza menurut ulasan tahun 2018. Ulasan terbaru yang kami temukan juga dari tahun itu, jadi cek dulu apakah masih buka.",hl:["Kopi","Pizza"]},
98:{src:"What's New Indonesia",yr:"",tx:"Teh klasik yang disajikan dalam cangkir porselen halus.",hl:["Earl Grey","Darjeeling","Oolong"]},
101:{src:"detikEdu",yr:"2021",tx:"Donat dan minuman.",hl:["Donat"]},
106:{src:"Rumah123",yr:"2026",tx:"Kopi dan menu lokal buatan sendiri, dengan balkon outdoor menghadap Jalan Braga.",hl:["Soto Braga","Dendeng Padang"],pr:"Makanan sekitar Rp45.000–120.000, minuman mulai Rp25.000."},
107:{src:"Rumah123",yr:"2026",tx:"Kopi dan makanan di kafe bertema taman tropis dalam ruangan.",hl:[],pr:"Makanan sekitar Rp40.000–110.000, minuman mulai Rp35.000."},
108:{src:"Rumah123",yr:"2026",tx:"Kopi, camilan, dan hidangan manis untuk keluarga.",hl:[],pr:"Makanan/camilan sekitar Rp25.000–75.000, minuman mulai Rp20.000."},
109:{src:"Rumah123",yr:"2026",tx:"Restoran klasik dengan appetizer, steak, dan dessert khas Belanda.",hl:["Bitterballen","Steak lidah","Poffertjes"],pr:"Sekitar Rp20.000–200.000."},
110:{src:"Rumah123",yr:"2026",tx:"Menu kopi susu dan latte.",hl:["Bonie (kopi susu macchiato)","Caramel Latte"],pr:"Sekitar Rp50.000–100.000 per orang."},
112:{src:"Rumah123",yr:"2026",tx:"Es kopi dan minuman cokelat.",hl:["Es Kopi Awan","Es Kopi Djawa","Es Cokelat"],pr:"Di bawah Rp50.000 per orang."}
};
const MEDIA=new Set([1001,106,107,108,109,110,111,112,113,114,60,61,62,63,64,65,66,67,68,69,70,71,92,93,94,95,96,97,98,99,100,101,102,103,104,105]);

const FAC={w:["📶","Wi-Fi"],p:["🔌","Stop Kontak"],a:["❄️","AC"],k:["🚗","Parkir"],o:["🌳","Outdoor"],i:["🛋️","Indoor"],s:["🚬","Smoking Area"],t:["🌿","Taman"],c:["💼","Coworking"],m:["👥","Ruang Meeting"],e:["🪑","Meja Ergonomis"],d:["🍰","Dessert"],r:["🎨","Creative Space"]};
const FF=["w","p","a","k","o","c"],UU=["Belajar","Kerja","Nongkrong","Makan"];
/* Koordinat kampus (acuan) + rumus Haversine; jarak = garis lurus */
const CAMPUS={Gane:{name:"ITB Ganesha",lat:-6.8906,lng:107.6107},Nangor:{name:"ITB Jatinangor",lat:-6.9267,lng:107.7714}};
const hav=(a,b,c,d)=>{const r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))};
const fmtKm=k=>k<1?Math.round(k*100)*10+" m":k.toLocaleString("id-ID",{maximumFractionDigits:1})+" km";
const num=v=>{if(v==null||v==="")return null;const n=typeof v==="number"?v:parseFloat(String(v).replace(",","."));return Number.isFinite(n)?n:null};
const okLL=(a,b)=>a!=null&&b!=null&&Math.abs(a)<=90&&Math.abs(b)<=180&&!(a===0&&b===0);
const nk=n=>String(n||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g," ").replace(/\b(bandung|jatinangor)\b/g," ").replace(/\s+/g,"");
const GEO2={1001:[-6.9021376,107.632623],106:[-6.9197959,107.6072987],107:[-6.9169285,107.6065313],108:[-6.9166943,107.6066094],109:[-6.9173475,107.6069351],110:[-6.9187892,107.6069117],111:[-6.9160016,107.6065284]};
const APX={"Otista":[-6.92,107.604],"Sabang":[-6.905,107.612],"Flores":[-6.907,107.618],"Prof Eyckman":[-6.898,107.596],"Kebon Bibit":[-6.896,107.606],"Lengkong Besar":[-6.922,107.61],"Pager Gunung":[-6.893,107.614],"Setiabudi":[-6.865,107.596],"Ahmad Yani":[-6.913,107.633],"Pasir Kaliki":[-6.906,107.594],"Gatot Subroto":[-6.922,107.635],"Cikutra":[-6.902,107.642],"Taman Kopo":[-6.965,107.57],"Merdeka":[-6.912,107.61],"Naripan":[-6.917,107.611],"Djunjunan":[-6.9,107.58],"Pasirkoja":[-6.933,107.58],"Teuku Umar":[-6.897,107.62],"Surya Sumantri":[-6.887,107.581],"Mustofa":[-6.904,107.65],"AH Nasution":[-6.915,107.69],"Karawitan":[-6.939,107.628],"Bojong Koneng":[-6.865,107.635],"Supratman":[-6.901,107.624],"Surapati":[-6.899,107.627],"Peta":[-6.937,107.593],"Sudirman":[-6.917,107.59],"Kebon Jati":[-6.913,107.599],"Veteran":[-6.919,107.611],"Tirtayasa":[-6.911,107.631],"Purnawarman":[-6.896,107.613],"Hasanudin":[-6.893,107.613],"Gegerkalong":[-6.868,107.588],"Terusan Buah Batu":[-6.97,107.635],"Sersan Bajuri":[-6.845,107.592],"Coblong":[-6.892,107.615],"Cidadap":[-6.87,107.605],"Sukasari":[-6.86,107.59],"Cicendo":[-6.9,107.595],"Andir":[-6.91,107.58],"Bandung Wetan":[-6.9,107.615],"Cibeunying Kaler":[-6.885,107.628],"Cibeunying Kidul":[-6.904,107.64],"Sumur Bandung":[-6.915,107.61],"Astanaanyar":[-6.93,107.6],"Regol":[-6.937,107.615],"Lengkong":[-6.931,107.623],"Batununggal":[-6.93,107.635],"Kiaracondong":[-6.923,107.649],"Antapani":[-6.917,107.66],"Arcamanik":[-6.922,107.677],"Ujungberung":[-6.915,107.7],"Cibiru":[-6.93,107.72],"Panyileukan":[-6.93,107.695],"Cinambo":[-6.942,107.69],"Gedebage":[-6.95,107.68],"Rancasari":[-6.956,107.66],"Mandalajati":[-6.899,107.68],"Buahbatu":[-6.95,107.635],"Bandung Kidul":[-6.956,107.62],"Bojongloa Kaler":[-6.931,107.59],"Bojongloa Kidul":[-6.95,107.59],"Babakan Ciparay":[-6.95,107.57],"Bandung Kulon":[-6.93,107.57],"Riau":[-6.9065,107.6175],"Pasteur":[-6.8945,107.5935],"Punclut":[-6.8545,107.6055],"Sukajadi":[-6.887,107.592],"Banceuy":[-6.919,107.609],"Ranca Kendal":[-6.8725,107.6315],"Parongpong":[-6.8,107.59],"Braga":[-6.9175,107.6068],"Buah Batu":[-6.942,107.635],"Ganesha":[-6.8915,107.6112],"Dalam kampus ITB":[-6.8914,107.6105],"Lebak Siliwangi":[-6.8895,107.6125],"Dago / Lebak Siliwangi":[-6.8885,107.613],"Lebak Gede":[-6.894,107.614],"Dipatiukur":[-6.894,107.617],"Dago":[-6.884,107.613],"Dago Bawah":[-6.8885,107.613],"Simpang Dago":[-6.8855,107.6131],"Dago Atas":[-6.873,107.619],"Dago Utara":[-6.878,107.621],"Dago Pakar":[-6.86,107.635],"Siliwangi":[-6.887,107.607],"Gelap Nyawang":[-6.8895,107.6085],"Cikapayang":[-6.8955,107.613],"Citarum":[-6.9,107.615],"Tamansari":[-6.8945,107.607],"Ciumbuleuit":[-6.874,107.605],"Malabar":[-6.908,107.615],"Cigadung":[-6.88,107.629],"Cihapit":[-6.903,107.62],"Pasirluyu":[-6.939,107.633],"Pajajaran":[-6.914,107.595],"Kanayakan":[-6.891,107.618],"Talaga Bodas":[-6.924,107.629],"Sunda":[-6.9115,107.615],"Cibeusi":[-6.927,107.774],"Ciseke":[-6.922,107.772],"Mekargalih":[-6.934,107.77],"Kampung Geulis":[-6.924,107.769],"Sayang":[-6.925,107.772],"Cikuda":[-6.919,107.765],"Louvin":[-6.925,107.771],"Jatinangor":[-6.9265,107.773],"Cikeruh":[-6.93,107.768],"JATOS":[-6.93,107.768],"Hegarmanah":[-6.929,107.768],"Gerbang Lama Unpad":[-6.927,107.77],"Cileles":[-6.909,107.766]};
function geo(c){
  c.dist=c.campus=c.dG=c.dN=null;c.apx=false;
  if(!okLL(c.lat,c.lng)){const a=APX[c.loc];if(!a)return;c.lat=a[0];c.lng=a[1];c.apx=true}
  c.dG=hav(c.lat,c.lng,CAMPUS.Gane.lat,CAMPUS.Gane.lng);c.dN=hav(c.lat,c.lng,CAMPUS.Nangor.lat,CAMPUS.Nangor.lng);
  c.campus=c.dG<=c.dN?"Gane":"Nangor";c.dist=Math.min(c.dG,c.dN);
}
let IMP=[];try{IMP=JSON.parse(localStorage.getItem("seduh.imp")||"[]")}catch(e){}
const saveImp=()=>{try{localStorage.setItem("seduh.imp",JSON.stringify(IMP))}catch(e){}};
let CAFES=[];
function rebuild(){
  const B=CF.map(r=>({id:String(r[0]),name:r[1],area:r[2],loc:r[3],addr:r[4],rating:r[5],n:r[6],price:r[7],fac:r[8],use:r[9].split(","),desc:r[10],hours:r[11],lat:GEO2[r[0]]?GEO2[r[0]][0]:null,lng:GEO2[r[0]]?GEO2[r[0]][1]:null,url:null,imp:false,menu:MENU[r[0]]||null,msum:MSUM[r[0]]||null,med:MEDIA.has(r[0])}));
  const idx=new Map(B.map(c=>[nk(c.name),c])),seen=new Set();
  IMP.forEach((r,i)=>{
    const k=nk(r.name);if(!k||seen.has(k))return;seen.add(k);
    const t=idx.get(k);
    if(t){if(r.lat!=null){t.lat=r.lat;t.lng=r.lng}if(r.url)t.url=r.url;if(t.rating==null&&r.rating!=null){t.rating=r.rating;t.n=r.n||0}t.gm=true;return}
    B.push({id:"g"+i+"_"+k.slice(0,14),name:r.name,area:"Belum diketahui",loc:"Lokasi belum diketahui",addr:r.addr||"Alamat belum ada",rating:r.rating,n:r.n||0,price:"",fac:"",use:[],
      desc:"Ditambahkan dari impor Google Maps. Fasilitas dan jam buka belum diverifikasi.",hours:"Perlu verifikasi",lat:r.lat,lng:r.lng,url:r.url,imp:true,gm:true});
  });
  B.forEach(c=>{geo(c);if(c.imp&&c.campus){c.area=c.campus==="Gane"?"Bandung":"Nangor";c.loc=fmtKm(c.dist)+" dari "+CAMPUS[c.campus].name}});
  CAFES=B;
  const st=document.getElementById("hbStats");if(st)st.innerHTML=`<span class="pill"><b>${CAFES.length}</b> kafe</span><span class="pill"><b>${CAFES.filter(c=>c.dist!=null).length}</b> dengan jarak kampus</span><span class="pill">Area <b>Bandung</b> &amp; <b>Nangor</b></span>`;
}
rebuild();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const score=c=>c.rating==null?0:(c.rating*c.n+4.4*30)/(c.n+30);
function openNow(h){
  if(/24\s*jam/i.test(h))return true;
  const t=(h.match(/\d{1,2}:\d{2}/g)||[]).map(x=>{const[a,b]=x.split(":");return +a*60+ +b});
  if(t.length<2)return null;
  const o=t[0];let c=t[t.length-1];if(c<=o)c+=1440;
  const d=new Date(),n=d.getHours()*60+d.getMinutes();
  return(n>=o&&n<c)||(n+1440>=o&&n+1440<c);
}
const priceTxt=p=>p?"Rp "+p.replace("-","–"):"Harga belum ada";
let favs=new Set();try{favs=new Set(JSON.parse(localStorage.getItem("seduh.favs")||"[]").map(String))}catch(e){}
/* Migrasi sekali jalan: ID kafe dinomori ulang berurutan (v2). OLD_IDS = ID lama kafe manual menurut urutan ID baru 1..132; ID lama >= 1000 (data Dinas) menjadi ID lama - 867. */
(function(){try{
  if(localStorage.getItem("seduh.favsV")==="2")return;
  const OLD_IDS=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,17,18,19,20,21,22,23,24,25,26,27,28,29,121,122,123,124,125,126,127,128,129,130,131,30,31,32,33,34,35,36,37,132,133,134,135,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,136,137,138,55,56,57,58,59,60,61,62,63,139,64,65,66,67,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166];
  favs=new Set([...favs].map(f=>{if(!/^\d+$/.test(f))return f;const n=+f;if(n>=1000)return String(n-867);const i=OLD_IDS.indexOf(n);return i<0?null:String(i+1)}).filter(Boolean));
  localStorage.setItem("seduh.favs",JSON.stringify([...favs]));localStorage.setItem("seduh.favsV","2");
}catch(e){}})();
const saveFavs=()=>{try{localStorage.setItem("seduh.favs",JSON.stringify([...favs]))}catch(e){}};
/* ---------- Filter ---------- */
const F={q:"",area:"Semua",fac:new Set(),use:new Set(),now:false,fav:false,menu:false,maxd:null,sort:"best"};
const PAGE=matchMedia("(max-width:700px)").matches?12:24;let shown=PAGE;
const hasFac=(c,k)=>c.fac.includes(k),hasUse=(c,u)=>c.use.some(x=>x.startsWith(u));
const byNear=(a,b)=>a.dist==null?(b.dist==null?0:1):b.dist==null?-1:a.dist-b.dist;
function list(){
  const qs=F.q.trim().toLowerCase().split(/\s+/).filter(Boolean),hay=c=>c._h||(c._h=(c.name+" "+c.area+" "+c.loc+" "+c.addr+" "+c.use.join(" ")+" "+mtxt(c)).toLowerCase());
  let r=CAFES.filter(c=>(F.area==="Semua"||c.area===F.area)&&(F.maxd==null||(c.dist!=null&&c.dist<=F.maxd))&&(!qs.length||qs.every(t=>hay(c).includes(t)))
    &&[...F.fac].every(k=>hasFac(c,k))&&[...F.use].every(u=>hasUse(c,u))&&(!F.now||openNow(c.hours)===true)&&(!F.fav||favs.has(c.id))&&(!F.menu||!!(c.menu||c.msum)));
  const s={best:(a,b)=>score(b)-score(a),rating:(a,b)=>(b.rating||0)-(a.rating||0),reviews:(a,b)=>b.n-a.n,name:(a,b)=>a.name.localeCompare(b.name),near:byNear}[F.sort];
  return r.sort(s);
}
function chips(el,items,set,label){
  el.innerHTML=items.map(([k,t])=>`<button class="cf-chip${set(k)?" on":""}" data-k="${esc(k)}">${t}</button>`).join(" ");
}
function ui(){
  chips($("cfArea"),["Semua","Bandung","Nangor"].map(a=>[a,a]),k=>F.area===k);
  chips($("cfFac"),FF.map(k=>[k,FAC[k][0]+" "+FAC[k][1]]),k=>F.fac.has(k));
  chips($("cfUse"),UU.map(u=>[u,u]),k=>F.use.has(k));
  $("cfNow").classList.toggle("on",F.now);$("cfFavF").classList.toggle("on",F.fav);$("cfFn").textContent=favs.size;$("cfMenuF").classList.toggle("on",F.menu);
  const nf=(F.area!=="Semua"?1:0)+F.fac.size+F.use.size+(F.now?1:0)+(F.fav?1:0)+(F.menu?1:0)+(F.maxd!=null?1:0);$("cfFiltN").textContent=nf;$("cfFiltN").hidden=!nf;
}
const tint=c=>c.area==="Nangor"?"var(--teh-tint)":"var(--kopi-tint)";
const icon=c=>hasFac(c,"c")?"💼":hasFac(c,"d")?"🍰":hasUse(c,"Makan")?"🍽️":(hasFac(c,"t")||hasFac(c,"o"))?"🌿":"☕";
const subTxt=c=>c.imp&&c.dist==null?"Area belum diketahui":esc(c.area)+(c.loc?" · "+esc(c.loc):"");
const distChip=c=>c.dist==null?"":`<div class="cf-dist" title="${c.apx?"Perkiraan dari kawasan kafe, bukan titik pasti":"Jarak garis lurus ke kampus terdekat"}">📍 ${c.apx?"≈ ":""}${fmtKm(c.dist)} <small>dari ${CAMPUS[c.campus].name}</small></div>`;
const mtxt=c=>{if(c._mt!=null)return c._mt;const M=c.menu,S=c.msum;let t="";if(M)t=M.cats.map(x=>x[0]+" "+x[1].map(i=>i[0]).join(" ")).join(" ");if(S)t+=" "+(S.hl||[]).join(" ")+" "+(S.tx||"");return c._mt=t};
const mTag=c=>c.menu?(c.menu.part?"Menu sebagian":"Menu lengkap"):c.msum?"Ringkasan menu":"";
const rid=r=>r.toLocaleString("id-ID",{minimumFractionDigits:1,maximumFractionDigits:1});
const fmtN=n=>n>=1000?(n/1000).toLocaleString("id-ID",{maximumFractionDigits:1})+" rb":String(n);
const rTier=c=>c.rating==null?"":c.n>=1000?"hi":c.n>=30?"":"lo";
const rLabel=c=>c.rating==null?null:c.n>=1000?["Sangat populer",""]:c.n>=300?["Populer",""]:c.n>0&&c.n<30?["Ulasan masih sedikit","w"]:c.n===0?["Belum ada ulasan","w"]:null;
const starsHtml=r=>`<span class="cf-stars" style="--p:${Math.max(0,Math.min(100,r/5*100))}%" role="img" aria-label="Rating ${rid(r)} dari 5">★★★★★</span>`;
const rateBadge=c=>c.rating==null?`<div class="cf-rate none">Belum ada rating</div>`:`<div class="cf-rate ${rTier(c)}" title="${rid(c.rating)} dari 5${c.n?" · "+c.n.toLocaleString("id-ID")+" ulasan":""}"><i aria-hidden="true">★</i>${rid(c.rating)}</div>`;
const rateRow=c=>{if(c.rating==null)return"";const l=rLabel(c);return`<div class="cf-rrow">${starsHtml(c.rating)}<span class="cf-rn">${c.n?fmtN(c.n)+" ulasan":"tanpa ulasan"}</span>${l?`<span class="cf-rt ${l[1]}">${l[0]}</span>`:""}</div>`};
const rateBig=c=>{if(c.rating==null)return`<div class="cf-rbig"><small style="margin:0">Belum ada rating untuk kafe ini. Cek ulasan terbaru di Google Maps sebelum berangkat.</small></div>`;const l=rLabel(c);return`<div class="cf-rbig"><b>${rid(c.rating)}</b><div>${starsHtml(c.rating)}<small>${c.n?c.n.toLocaleString("id-ID")+" ulasan":"Belum ada jumlah ulasan"}${l?" · "+l[0]:""}</small>${c.n>0&&c.n<30?`<small>Rating dari sedikit ulasan, belum cukup kuat jadi acuan.</small>`:""}</div></div>`};
function card(c,i){
  const o=openNow(c.hours),mt=mTag(c),hl=((c.menu&&c.menu.hl)||(c.msum&&c.msum.hl)||[]).slice(0,3),
  tags=[...c.use.slice(0,3).map(u=>`<span class="cf-tag">${esc(u)}</span>`),...["w","p","a"].filter(k=>hasFac(c,k)).map(k=>`<span class="cf-tag g">${FAC[k][1]}</span>`),...(mt?[`<span class="cf-tag m">🍽️ ${mt}</span>`]:[]),...(c.med?['<span class="cf-tag w">Info dari media</span>']:[]),...(c.imp?['<span class="cf-tag w">Belum diverifikasi</span>']:[])].join("");
  return `<article class="cf-card${cfAnim?" rv":""}" style="--i:${Math.min(i,11)};--t:${tint(c)}" tabindex="0" role="button" data-id="${esc(c.id)}" aria-label="Detail ${esc(c.name)}">
    <div class="cf-photo"><span aria-hidden="true">${icon(c)}</span>${rateBadge(c)}</div><div class="cf-body">
    <h3>${esc(c.name)}</h3><div class="cf-sub">${c.imp&&c.dist!=null?esc(c.area):subTxt(c)}</div>${rateRow(c)}${distChip(c)}
    <p>${esc(c.desc)}</p>${hl.length?`<div class="cf-hl"><span aria-hidden="true">🍽️</span><span>${hl.map(esc).join(" · ")}</span></div>`:""}<div class="cf-tags">${tags}</div>
    <div class="cf-meta"><span>${priceTxt(c.price)}</span><span>${esc(c.hours)}${o==null?"":` · <span class="cf-open ${o?"y":"n"}">${o?"Buka":"Tutup"}</span>`}</span></div>
    </div><button class="cf-fav${favs.has(c.id)?" on":""}" data-fav="${esc(c.id)}" aria-label="Favorit" aria-pressed="${favs.has(c.id)}">${favs.has(c.id)?"♥":"♡"}</button></article>`;
}
function render(keep){
  if(!keep)shown=PAGE;
  ui();const r=list(),vis=r.slice(0,shown),noGeo=CAFES.filter(c=>c.dist==null).length;
  $("cfCount").innerHTML=`Menampilkan <b>${vis.length}</b> dari <b>${r.length}</b> kafe`
    +(noGeo?`<span class="cf-note"> · ${noGeo} belum punya koordinat, jarak belum tersedia</span>`:"");
  $("cfGrid").innerHTML=r.length?vis.map((c,i)=>card(c,i)).join(""):`<div class="cf-empty">Belum ada kafe yang cocok. Coba kurangi filter.</div>`;cfAnim=false;
  const mb=$("cfMore");mb.style.display=r.length>shown?"inline-flex":"none";mb.textContent="Muat "+Math.min(PAGE,r.length-shown)+" lagi";$("cfAll").style.display=r.length>shown?"inline-flex":"none";
}
/* ---------- Menu kafe ---------- */
const rp=n=>"Rp "+n.toLocaleString("id-ID");
const srcTxt=M=>esc(M.src)+(M.yr?" ("+esc(M.yr)+")":"");
function menuHtml(c){
  const M=c.menu,S=c.msum,maps="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(c.name+" "+c.addr);
  if(M){
    const cats=M.cats,total=cats.reduce((a,x)=>a+x[1].length,0),pr=cats.flatMap(x=>x[1].map(i=>i[1])).filter(p=>p!=null),
      rng=pr.length?" · "+rp(Math.min(...pr))+"–"+Math.max(...pr).toLocaleString("id-ID"):"";
    return `<section class="mn" aria-label="Menu ${esc(c.name)}"><h4>${M.part?"Menu (sebagian)":"Menu"}</h4>
      <p class="mn-src">${total} item${rng} · Sumber: ${srcTxt(M)}. ${esc(M.note||"Harga acuan, bisa sudah berubah.")}</p>
      <div class="mn-tools"><input class="mn-q" type="search" placeholder="Cari di menu ini" aria-label="Cari di menu ${esc(c.name)}" enterkeyhint="search">
      <div class="mn-tabs" role="group" aria-label="Kategori menu"><button type="button" class="mn-tab on" data-c="*">Semua <small>${total}</small></button>${cats.map((x,i)=>`<button type="button" class="mn-tab" data-c="${i}">${esc(x[0])} <small>${x[1].length}</small></button>`).join("")}</div></div>
      <div class="mn-body">${cats.map((x,i)=>`<div class="mn-cat" data-c="${i}"><h5>${esc(x[0])}</h5><ul class="mn-list">${x[1].map(it=>`<li class="mn-it" data-n="${esc((it[0]+" "+(it[2]||"")).toLowerCase())}"><span><b>${esc(it[0])}</b>${it[2]?`<small>${esc(it[2])}</small>`:""}</span><span class="mn-pr">${it[1]==null?"–":rp(it[1])}</span></li>`).join("")}</ul></div>`).join("")}
      <p class="cf-empty mn-none" hidden>Tidak ada menu yang cocok.</p></div></section>`;
  }
  if(S)return `<section class="mn" aria-label="Ringkasan menu ${esc(c.name)}"><h4>Ringkasan menu</h4>
      <p class="mn-src">Sumber: ${srcTxt(S)}. Ini ringkasan, bukan daftar menu lengkap.</p>
      ${S.tx?`<p>${esc(S.tx)}</p>`:""}${S.hl&&S.hl.length?`<div class="cf-tags">${S.hl.map(x=>`<span class="cf-tag m">${esc(x)}</span>`).join("")}</div>`:""}
      ${S.pr?`<p class="mn-src" style="margin-top:10px!important">Harga: ${esc(S.pr)}</p>`:""}
      <p class="mn-src"><a href="${maps}" target="_blank" rel="noopener">Lihat foto menu di Google Maps →</a></p></section>`;
  return `<section class="mn"><h4>Menu</h4><p class="mn-src">Daftar menu kafe ini belum ada di data kami. <a href="${maps}" target="_blank" rel="noopener">Cek foto menu di Google Maps →</a></p></section>`;
}
function wireMenu(m){
  const q=m.querySelector(".mn-q");if(!q)return;let cat="*";
  const apply=()=>{const t=q.value.trim().toLowerCase();let any=false;
    m.querySelectorAll(".mn-cat").forEach(s=>{let n=0;
      s.querySelectorAll(".mn-it").forEach(li=>{const ok=!t||li.dataset.n.includes(t);li.hidden=!ok;if(ok)n++});
      const show=(cat==="*"||s.dataset.c===cat)&&n>0;s.hidden=!show;if(show)any=true});
    m.querySelector(".mn-none").hidden=any};
  q.addEventListener("input",apply);
  m.querySelector(".mn-tabs").addEventListener("click",e=>{const b=e.target.closest(".mn-tab");if(!b)return;cat=b.dataset.c;
    m.querySelectorAll(".mn-tab").forEach(x=>x.classList.toggle("on",x===b));apply();
    b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})});
}
/* ---------- Detail ---------- */
let lastFocus=null;
function closeM(){const m=$("cfModal");if(m){m.remove();document.removeEventListener("keydown",esk);if(lastFocus)lastFocus.focus()}}
function esk(e){if(e.key==="Escape")closeM()}
function detail(id){
  const c=CAFES.find(x=>x.id==id);if(!c)return;closeM();lastFocus=document.activeElement;
  const o=openNow(c.hours),ll=c.dist!=null&&!c.apx?c.lat+","+c.lng:null,
    map=c.url||(ll?"https://www.google.com/maps/search/?api=1&query="+ll:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(c.name+" "+c.addr)),
    route=ll?"https://www.google.com/maps/dir/?api=1&destination="+ll:null,
    other=c.dist==null?"":c.campus==="Gane"?c.dN:c.dG,oc=c.campus==="Gane"?"Nangor":"Gane",
    jarak=c.dist==null?"":`<dt>Jarak</dt><dd><b>${c.apx?"≈ ":""}${fmtKm(c.dist)}</b> dari ${CAMPUS[c.campus].name}<span class="cf-sub">${c.apx?"Perkiraan dari kawasan kafe (belum ada titik koordinat). ":""}Garis lurus. ${CAMPUS[oc].name}: ${fmtKm(other)}.</span></dd>`;
  const m=document.createElement("div");m.className="cf-modal";m.id="cfModal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-label",c.name);
  m.innerHTML=`<div class="cf-box" style="--t:${tint(c)}"><button class="cf-x" aria-label="Tutup">✕</button><div class="cf-photo"><span aria-hidden="true">${icon(c)}</span></div><div class="cf-in"><h3>${esc(c.name)}</h3>
    <div class="cf-sub">${subTxt(c)}</div>
    ${rateBig(c)}
    <p>${esc(c.desc)}</p>${c.med?'<p class="cf-sub">Info kafe ini dari artikel media dan belum dicek langsung di lapangan. Pastikan alamat dan jam buka sebelum berangkat.</p>':""}
    <dl class="cf-dl"><dt>Alamat</dt><dd>${esc(c.addr)}</dd>${jarak}<dt>Harga</dt><dd>${priceTxt(c.price)}</dd><dt>Jam buka</dt><dd>${esc(c.hours)}${o==null?"":` · <span class="cf-open ${o?"y":"n"}">${o?"Buka sekarang":"Sedang tutup"}</span>`}</dd></dl>
    ${menuHtml(c)}
    ${c.fac.length?`<div class="cf-sub">Fasilitas</div><div class="cf-tags">${[...c.fac].map(k=>`<span class="cf-tag g">${FAC[k][0]} ${FAC[k][1]}</span>`).join("")}</div>`:""}
    ${c.use.length?`<div class="cf-sub" style="margin-top:12px">Cocok untuk</div><div class="cf-tags">${c.use.map(u=>`<span class="cf-tag">${esc(u)}</span>`).join("")}</div>`:""}
    <div class="cf-acts"><a class="btn accent" href="${esc(map)}" target="_blank" rel="noopener">📍 Buka di Maps</a>${route?`<a class="btn ghost" href="${route}" target="_blank" rel="noopener">Rute</a>`:""}<button class="btn ghost" data-fav="${esc(c.id)}">${favs.has(c.id)?"♥ Tersimpan":"♡ Simpan"}</button></div></div></div>`;
  m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".cf-x"))closeM()});
  document.body.appendChild(m);document.addEventListener("keydown",esk);m.querySelector(".cf-x").focus({preventScroll:true});wireMenu(m);
}
function toggleFav(id){favs.has(id)?favs.delete(id):favs.add(id);saveFavs();render(true);const m=$("cfModal");if(m){const b=m.querySelector("[data-fav]");if(b)b.textContent=favs.has(id)?"♥ Tersimpan":"♡ Simpan"}}
/* ---------- Impor Google Maps (GeoJSON/JSON, CSV, KML, tautan) ---------- */
function fromUrl(u){
  u=String(u||"");
  const m=u.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)||u.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)||u.match(/[?&](?:q|ll|query|destination|center)=(-?\d+(?:\.\d+)?)(?:,|%2C)(-?\d+(?:\.\d+)?)/i);
  let name=null;const p=u.match(/\/maps\/place\/([^\/@?#]+)/);
  if(p){try{name=decodeURIComponent(p[1].replace(/\+/g," "))}catch(e){name=p[1].replace(/\+/g," ")}}
  return{lat:m?num(m[1]):null,lng:m?num(m[2]):null,name};
}
function mkRow(o){
  let name=String(o.name||"").trim().slice(0,80),url=/^https?:\/\//i.test(String(o.url||"").trim())?String(o.url).trim():null,lat=num(o.lat),lng=num(o.lng);
  if(url){const f=fromUrl(url);if(!name&&f.name)name=f.name;if(!okLL(lat,lng)&&okLL(f.lat,f.lng)){lat=f.lat;lng=f.lng}}
  if(!name)return null;
  if(!okLL(lat,lng)){lat=lng=null}
  const r=num(o.rating);
  return{name,lat,lng,url,addr:o.addr?String(o.addr).trim().slice(0,160):null,rating:r!=null&&r>=0&&r<=5?r:null,n:Math.max(0,parseInt(o.n)||0)};
}
function parseJSONp(t){
  let j;try{j=JSON.parse(t)}catch(e){return null}
  const fs=Array.isArray(j)?j:(j.features||j.places||j.items||[]);
  return fs.map(f=>{
    const p=f.properties||f,loc=p.location||p.Location||{},g=f.geometry&&f.geometry.coordinates,c=Array.isArray(g)?g:[];
    return mkRow({name:p.Title||p.title||p.name||p.Name||loc["Business Name"]||loc.name,url:p["Google Maps URL"]||p.google_maps_url||p.url||p.URL||p.link,
      addr:loc.Address||loc.address||p.address||p.Address,lat:p.lat??p.latitude??p.Latitude??c[1],lng:p.lng??p.lon??p.longitude??p.Longitude??c[0],
      rating:p.rating||p.Rating,n:p.reviews||p.reviewCount||p.user_ratings_total});
  }).filter(Boolean);
}
function parseKML(t){
  const d=new DOMParser().parseFromString(t,"text/xml");
  return[...d.getElementsByTagName("Placemark")].map(pm=>{
    const g=s=>{const e=pm.getElementsByTagName(s)[0];return e?e.textContent.trim():""},co=g("coordinates").split(/\s+/)[0].split(",");
    return mkRow({name:g("name"),lat:co[1],lng:co[0],addr:g("address"),url:(g("description").match(/https?:\/\/[^\s"'<]+/)||[])[0]});
  }).filter(Boolean);
}
function csvRows(t){
  const rows=[];let row=[],f="",q=false;
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}
    else if(ch==='"')q=true;else if(ch===","){row.push(f);f=""}
    else if(ch==="\n"||ch==="\r"){if(ch==="\r"&&t[i+1]==="\n")i++;row.push(f);rows.push(row);row=[];f=""}else f+=ch}
  if(f||row.length){row.push(f);rows.push(row)}
  return rows.filter(r=>r.some(x=>x.trim()));
}
function parseCSV(t){
  const R=csvRows(t.replace(/^﻿/,""));if(R.length<2)return null;
  const h=R[0].map(x=>x.trim().toLowerCase()),ix=(...ns)=>h.findIndex(x=>ns.includes(x));
  const iN=ix("title","name","nama","business name"),iLa=ix("lat","latitude","latitud"),iLo=ix("lng","lon","long","longitude"),iU=ix("url","google maps url","link","maps url"),
    iA=ix("address","alamat"),iR=ix("rating"),iC=ix("reviews","review count","jumlah review","user_ratings_total");
  if(iN<0)return null;
  const g=(r,i)=>i<0?undefined:r[i];
  return R.slice(1).map(r=>mkRow({name:g(r,iN),lat:g(r,iLa),lng:g(r,iLo),url:g(r,iU),addr:g(r,iA),rating:g(r,iR),n:g(r,iC)})).filter(Boolean);
}
function parseLines(t){
  return t.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>{
    const u=l.match(/https?:\/\/\S+/);
    if(u)return mkRow({url:u[0],name:l.replace(u[0],"").replace(/[|,;\-–\s]+$/,"").trim()});
    const m=l.match(/^(.*?)[,|;\t]\s*(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)\s*$/);
    return m?mkRow({name:m[1],lat:m[2],lng:m[3]}):null;
  }).filter(Boolean);
}
function parseAny(t){
  const s=t.trim();if(!s)return[];
  if(/^[\[{]/.test(s))return parseJSONp(s)||[];
  if(/<kml|<Placemark/i.test(s))return parseKML(s);
  return parseCSV(s)||parseLines(s);
}
function openImport(){
  closeM();lastFocus=document.activeElement;
  const m=document.createElement("div");m.className="cf-modal";m.id="cfModal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-label","Impor dari Google Maps");
  m.innerHTML=`<div class="cf-box cf-imp"><button class="cf-x" aria-label="Tutup">✕</button><div class="cf-in"><h3>Impor dari Google Maps</h3>
    <p class="cf-sub">Jarak ke ITB Ganesha dan ITB Jatinangor dihitung otomatis, lalu kampus terdekat tampil di tiap kartu.</p>
    <ol class="cf-how"><li><b>Daftar tersimpan:</b> unduh lewat Google Takeout (pilih <i>Saved</i> atau <i>Maps (your places)</i>), lalu unggah file <code>.json</code> atau <code>.csv</code>.</li>
    <li><b>Google My Maps:</b> menu ⋮ pada peta, pilih <i>Ekspor ke KML</i> (bukan KMZ), lalu unggah file <code>.kml</code>.</li>
    <li><b>Tautan:</b> tempel tautan Google Maps, satu per baris. Koordinat dibaca dari tautan bila ada.</li></ol>
    <label class="cf-drop"><input type="file" id="impFile" accept=".json,.geojson,.csv,.kml,.txt" multiple><span id="impFn">📂 Pilih file…</span></label>
    <textarea id="impTxt" rows="4" placeholder="Atau tempel di sini:&#10;https://www.google.com/maps/place/Nama+Kafe/@-6.89,107.61,17z&#10;Nama Kafe, -6.8906, 107.6107" aria-label="Tempel tautan atau data"></textarea>
    <p class="cf-note" id="impMsg" role="status" aria-live="polite">Data impor tersimpan di browser ini. Koordinat tidak pernah ditebak: tempat tanpa koordinat tetap masuk tanpa jarak. Saat ini ${IMP.length} data impor tersimpan.</p>
    <div class="cf-acts"><button class="btn accent" id="impGo">Impor</button><button class="btn ghost" id="impClr">Hapus data impor</button></div></div></div>`;
  m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".cf-x"))closeM()});
  document.body.appendChild(m);document.addEventListener("keydown",esk);
  const msg=(t,k)=>{const e=$("impMsg");e.textContent=t;e.className="cf-note"+(k?" "+k:"")};
  $("impFile").onchange=e=>{const n=[...e.target.files].map(f=>f.name);$("impFn").textContent=n.length?"📄 "+n.join(", "):"📂 Pilih file…"};
  $("impGo").onclick=async()=>{
    const fs=[...$("impFile").files],txt=$("impTxt").value;
    if(!fs.length&&!txt.trim()){msg("Pilih file atau tempel data dulu.","err");return}
    let rows=[],skipped=0;
    try{
      for(const f of fs){
        if(/\.kmz$/i.test(f.name)){msg("File KMZ belum didukung. Ekspor ulang sebagai KML.","err");return}
        const r=parseAny(await f.text());if(!r.length)skipped++;rows=rows.concat(r);
      }
      if(txt.trim()){const r=parseAny(txt);if(!r.length)skipped++;rows=rows.concat(r)}
    }catch(err){msg("Gagal membaca data. Periksa format file.","err");return}
    if(!rows.length){msg("Tidak ada tempat yang bisa dibaca. Pastikan ada kolom nama (Title/Name) atau tautan /maps/place/.","err");return}
    const before=CAFES.length,keys=new Set(rows.map(r=>nk(r.name)));
    IMP=IMP.filter(r=>!keys.has(nk(r.name))).concat(rows).slice(-3000);saveImp();rebuild();
    const added=CAFES.length-before,withLL=rows.filter(r=>r.lat!=null).length;
    msg(`${rows.length} tempat terbaca: ${added} kafe baru, ${rows.length-added} digabung ke data yang ada. ${withLL} punya koordinat (jarak dihitung)${rows.length-withLL?`, ${rows.length-withLL} belum punya koordinat`:""}.`,"ok");
    render();
  };
  $("impClr").onclick=()=>{if(!IMP.length){msg("Belum ada data impor.");return}IMP=[];saveImp();rebuild();render();msg("Data impor dihapus.","ok")};
}
/* ---------- Events ---------- */
let tq;$("cfQ").oninput=e=>{F.q=e.target.value;clearTimeout(tq);tq=setTimeout(render,140)};
$("cfSort").onchange=e=>{F.sort=e.target.value;render()};
$("cfDist").onchange=e=>{F.maxd=e.target.value?+e.target.value:null;render()};
$("cfArea").onclick=e=>{const b=e.target.closest("[data-k]");if(b){F.area=b.dataset.k;render()}};
const tg=(s,k)=>s.has(k)?s.delete(k):s.add(k);
$("cfFac").onclick=e=>{const b=e.target.closest("[data-k]");if(b){tg(F.fac,b.dataset.k);render()}};
$("cfUse").onclick=e=>{const b=e.target.closest("[data-k]");if(b){tg(F.use,b.dataset.k);render()}};
$("cfNow").onclick=()=>{F.now=!F.now;render()};
$("cfFavF").onclick=()=>{F.fav=!F.fav;render()};
$("cfImp").onclick=openImport;
$("cfMenuF").onclick=()=>{F.menu=!F.menu;render()};
$("cfFiltBtn").onclick=()=>{const b=$("cfFiltBtn"),o=b.closest(".cf-bar").classList.toggle("open");b.setAttribute("aria-expanded",o)};
$("cfMore").onclick=()=>{shown+=PAGE;render(true)};$("cfAll").onclick=()=>{shown=1e9;render(true)};
$("cfReset").onclick=()=>{Object.assign(F,{q:"",area:"Semua",now:false,fav:false,menu:false,maxd:null,sort:"best"});F.fac.clear();F.use.clear();$("cfQ").value="";$("cfSort").value="best";$("cfDist").value="";render()};
$("cfRand").onclick=()=>{
  const r=list();if(!r.length)return;const b=$("cfRand");b.disabled=true;let n=0;
  const t=setInterval(()=>{b.textContent="🎲 "+r[Math.floor(Math.random()*r.length)].name.slice(0,18);
    if(++n>=8){clearInterval(t);b.textContent="🎲 Acak kafe";b.disabled=false;detail(r[Math.floor(Math.random()*r.length)].id)}},90);
};
$("cfGrid").addEventListener("click",e=>{
  const f=e.target.closest("[data-fav]");if(f){e.stopPropagation();toggleFav(f.dataset.fav);return}
  const c=e.target.closest("[data-id]");if(c)detail(c.dataset.id)});
$("cfGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();detail(e.target.dataset.id)}});
document.addEventListener("click",e=>{const f=e.target.closest("#cfModal [data-fav]");if(f)toggleFav(f.dataset.fav)});
/* ---------- Mulai ---------- */
$("hbStats").innerHTML=`<span class="pill"><b>${CAFES.length}</b> kafe</span><span class="pill">Area <b>Bandung</b> &amp; <b>Nangor</b></span><span class="pill"><b>3</b> jenis minuman</span>`;
render();
show();
})();
}catch(e){console.error("[navigasi-cafe]",e)}

/* ################ Maskot ################ */
try{
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
const VM={"":"splash",hub:"hub",lab:"lab",cafe:"cafe",beverage:"beverage",bahan:"resep",perlengkapan:"resep",menu:"resep"};
const view=()=>VM[location.hash.replace(/^#\/?/,"")]||"splash";
let cur=null,go=false;
function hush(){Object.keys(M).forEach(k=>{clearTimeout(tm[k]);M[k].querySelector(".mb").classList.remove("on");M[k].classList.remove("talk")})}
function sync(fromGo){const v=view();document.body.dataset.view=v;if(v===cur)return;cur=v;hush();if(v==="resep"||v==="beverage")return;(GREET[v]||L[v]||[]).forEach((p,i)=>setTimeout(()=>{if(view()===v){say(p[0],p[1]);act(p[0],"jump")}},(fromGo?900:500)+i*2300))}
addEventListener("hashchange",()=>{sync(go);go=false});addEventListener("popstate",()=>sync(false));sync(false);
function tick(){const v=view();if(v!=="resep"&&v!=="beverage"&&!document.hidden&&!busy()&&!/^(INPUT|SELECT|TEXTAREA)$/.test((document.activeElement||{}).tagName||"")&&!$("cfModal")){const p=R((L[v]||[]).concat(GEN));say(p[0],p[1]);if(Math.random()<.5)act(p[0],"jump");if(Math.random()<.4){const o=p[0]=="hot"?"cold":"hot";setTimeout(()=>{say(o,R(POKE[o]),2200);act(o,"jump")},2400)}}setTimeout(tick,6000+Math.random()*5000)}
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
}catch(e){console.error("[maskot]",e)}

/* ################ Judul splash ################ */
try{
(function(){
const sp=document.getElementById("sv-splash");if(!sp)return;
const h=sp.querySelector("h1"),t=h.textContent;h.setAttribute("aria-label",t);
h.innerHTML=[...t].map((c,i)=>c===" "?" ":'<span class="l" aria-hidden="true" style="--k:'+i+'">'+c+"</span>").join("");
h.querySelectorAll(".l").forEach(l=>l.addEventListener("animationend",e=>{if(e.animationName==="lIn")l.classList.add("rdy")}));
const b=sp.querySelector(".btn");
b.insertAdjacentHTML("beforebegin",'<div class="sfeat" aria-hidden="true"><span style="--j:0">🧋 Resep</span><span style="--j:1">☕ Barista Lab</span><span style="--j:2">📍 Cafe Finder</span></div>');
let f='<div class="spfx" aria-hidden="true">';
for(let i=0;i<9;i++)f+='<i class="st" style="left:'+(2+i*4.4)+'%;--d:'+(7+i%4*1.6)+'s;--dl:-'+(i*1.3)+'s;--sw:'+((i%2?1:-1)*(20+i*4))+'px"></i>';
for(let i=0;i<14;i++)f+='<i class="sk" style="left:'+(56+(i*37%42))+'%;top:'+(6+(i*53%84))+'%;--z:'+(10+i%4*5)+'px;--d:'+(2.6+i%3)+'s;--dl:-'+(i*.7)+'s">✦</i>';
sp.insertAdjacentHTML("afterbegin",f+"</div>");
sp.addEventListener("pointermove",e=>{const r=sp.getBoundingClientRect();sp.style.setProperty("--px",((e.clientX-r.left)/r.width-.5)*2);sp.style.setProperty("--py",((e.clientY-r.top)/r.height-.5)*2)},{passive:true});
const m=()=>document.getElementById("mates");
["mouseenter","focus"].forEach(v=>b.addEventListener(v,()=>m()&&m().classList.add("excite")));
["mouseleave","blur"].forEach(v=>b.addEventListener(v,()=>m()&&m().classList.remove("excite")));
b.addEventListener("click",()=>m()&&m().classList.remove("excite"),true);
})();
}catch(e){console.error("[splash-judul]",e)}

/* ################ Slogan ################ */
try{
(function(){const el=document.getElementById("slg");if(!el)return;
const L=["Seduh, tarik, tos, lanjut!","Dari biji sampai nongkrong.","Satu aplikasi, sejuta seduhan.","Racik dulu, ngopi kemudian.","Shot sempurna, kafe terbaik.","Ngopi jadi petualangan seru!"];
let i=0;const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
setInterval(()=>{if(document.hidden)return;i=(i+1)%L.length;
 if(rm){el.textContent=L[i];return}
 el.animate([{opacity:1},{opacity:.05,offset:.5},{opacity:1}],{duration:520,easing:"ease-in-out"});setTimeout(()=>{el.textContent=L[i]},260)},3800);
})();
}catch(e){console.error("[slogan]",e)}

/* ################ Efek fly-bits ################ */
try{
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
}catch(e){console.error("[fly-bits]",e)}

/* ################ Musik ################ */
try{
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
}catch(e){console.error("[musik]",e)}

/* ################ Efek latar ################ */
try{
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
}catch(e){console.error("[efek-latar]",e)}

/* ################ Intro sinematik ################ */
try{
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
}catch(e){console.error("[intro-sinematik]",e)}

/* ################ Efek masuk aplikasi ################ */
try{
/* ===== EFEK MASUK APLIKASI (seirama): Resep / Barista Lab / Cafe Finder / Beverage =====
   Satu alur waktu untuk semua tema:
   Total 3 detik, sama untuk semua tema:
   0,0 s tuang warna + ikon terbang -> 0,35 / 0,70 / 1,05 s tiga ketukan makin kuat ("Siap?")
   -> 1,40 s DUM (semua partikel tiba di ikon lalu meledak) -> 1,75 s ledakan susulan kecil
   -> 2,00 s sapuan warna -> 2,60 s pindah halaman -> 3,00 s selesai.
   Yang berbeda per tema hanya isi partikel, warna, dan kata. */
(function(){
"use strict";
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,running=false;
var LITE=Math.min(innerWidth,innerHeight)<600||(navigator.hardwareConcurrency||8)<=4,CAP=LITE?110:260,RATE=LITE?.5:1;
var R=function(a,b){return a+Math.random()*(b-a)},PI2=Math.PI*2;
var BEAT=[350,700,1050],HIT=1400,ECHO=1750,WIPE=2000;   /* milidetik, sama untuk semua tema */
var BEAN=["#8d5a33","#a8713d","#6e4325","#c08a4f"],LEAF=["#86ad52","#6f9448","#a8c96a","#5d8a3a"],
    DROP=["#e2603f","#ffd9c7","#ffffff","#f0c36b"],BLU=["#3d8fd1","#8cc4ea","#d6ebfa","#ffffff"];
var TH={
  "#/bahan":{k:"resep",sub:"Pilih alat & bahan, lalu seduh",hit:"Seduh!",t:["ice","ice","pearl","drop","bub"],cols:DROP,rc:"255,160,120",wipe:["#8a2f1c","#e2603f","#f1cdbd","#f5eee2"]},
  "#/lab":{k:"lab",sub:"Kalibrasi shot, kumpulkan XP",hit:"Mulai!",t:["bean","bean","bean","drop","spark"],cols:BEAN,rc:"233,185,95",wipe:["#2b1b12","#5a3820","#e9b95f","#f5eee2"]},
  "#/cafe":{k:"cafe",sub:"Dari Bandung sampai Nangor",hit:"Ketemu!",t:["leaf","leaf","leaf","spark"],cols:LEAF,rc:"190,235,120",wipe:["#2f4a1c","#5f8040","#dde7c4","#f5eee2"]},
  "#/hub":{k:"hub",sub:"Resep, Lab, Cafe, dan Beverage",hit:"Halo!",t:["bean","leaf","ice","drop","spark"],cols:["#e2603f","#e9b95f","#6f9448","#3d8fd1"],rc:"255,226,170",wipe:["#2b1b12","#8a2f1c","#5f8040","#3d8fd1"],
    svg:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 32 32 12l22 20" fill="none" stroke="#fffaf0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 30v22h12V38h8v14h12V30" fill="#e9b95f" stroke="#fffaf0" stroke-width="3.5" stroke-linejoin="round"/></svg>'},
  "#/beverage":{k:"bev",sub:"Sejarah, asal-usul, dan fakta menarik",hit:"Baca!",t:["ice","ice","drop","bub"],cols:BLU,rc:"140,200,250",wipe:["#14487a","#3d8fd1","#d6ebfa","#f5eee2"]}
};

window.addEventListener("click",function(e){
  var a=e.target&&e.target.closest?e.target.closest("#sv-hub .hb-tile"):null,nav=null;
  if(!a){
    nav=e.target&&e.target.closest?e.target.closest("#sbar a[data-v]"):null;
    if(!nav||nav.classList.contains("sbrand"))return;
    a=nav;
  }
  if(e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;
  var th=TH[a.getAttribute("href")];
  if(!th||RM)return;
  if(nav&&location.hash===nav.getAttribute("href"))return;
  e.preventDefault();e.stopImmediatePropagation();
  if(running)return;
  var r=a.getBoundingClientRect(),kb=!e.clientX&&!e.clientY;
  run(a,th,kb?r.left+r.width/2:e.clientX,kb?r.top+r.height/2:e.clientY,nav);
},true);

function run(tile,th,ox,oy,nav){
  running=true;
  var W=innerWidth,H=innerHeight,CX=W/2,CY=H*.47,K=1,S=200,href=tile.getAttribute("href");
  var src=nav?document.querySelector('#sv-hub .hb-tile[href="'+href+'"]'):tile;
  var name=nav?nav.textContent.trim():((tile.querySelector("h2")||{}).textContent||""),
      icEl=nav?null:tile.querySelector(".ic"),
      icSvg=nav?(src&&src.querySelector(".ic svg")):(icEl&&icEl.querySelector("svg"));
  var svgHtml=icSvg?icSvg.outerHTML:(th.svg||"");
  var kk=0,title=name.split(" ").map(function(w){
    return '<span class="w">'+w.split("").map(function(ch){return '<span style="--k:'+(kk++)+';--r:'+Math.round(R(-20,20))+'deg">'+ch+'</span>'}).join("")+'</span>';
  }).join(" ");
  var root=document.createElement("div");
  root.id="afx";root.className="t-"+th.k;root.setAttribute("aria-hidden","true");
  root.style.setProperty("--ox",ox+"px");root.style.setProperty("--oy",oy+"px");
  root.innerHTML=
   '<div class="af-stage"><div class="af-blob b1"></div><div class="af-blob b2"></div><div class="af-vig"></div><div class="af-bar"></div>'+
    '<div class="af-shake">'+
      '<canvas class="af-cv"></canvas>'+
      '<div class="af-head"><div class="af-title">'+title+'</div><div class="af-sub">'+th.sub.replace(/&/g,"&amp;")+'</div></div>'+
      '<div class="af-icon"><div class="af-pop"><div class="af-disc"></div><span class="ic al">'+svgHtml+'</span></div></div>'+
      '<div class="af-go"></div>'+
    '</div><div class="af-flash"></div></div>'+
   '<button type="button" class="af-skip">Lewati ›</button>'+
   '<div class="af-wipe">'+th.wipe.map(function(c,i){return '<i style="--k:'+i+';--wc:'+c+'"></i>'}).join("")+'</div>';
  document.body.appendChild(root);

  var cv=root.querySelector(".af-cv"),g=cv.getContext("2d"),dp=Math.min(LITE?1.5:2,devicePixelRatio||1);
  var iconEl=root.querySelector(".af-icon"),popEl=root.querySelector(".af-pop"),goEl=root.querySelector(".af-go");
  function size(){W=innerWidth;H=innerHeight;cv.width=W*dp;cv.height=H*dp;g.setTransform(dp,0,0,dp,0,0);K=Math.max(.75,Math.min(1.4,Math.min(W,H)/620))}
  size();addEventListener("resize",size);
  /* FLIP: ikon mulai tepat di posisi ikon kartu lalu terbang ke tengah */
  var ir=iconEl.getBoundingClientRect();S=ir.width;CX=ir.left+S/2;CY=ir.top+S/2;
  var tr=(icEl||tile).getBoundingClientRect();
  iconEl.style.setProperty("--fx",(tr.left+tr.width/2-CX)+"px");
  iconEl.style.setProperty("--fy",(tr.top+tr.height/2-CY)+"px");
  iconEl.style.setProperty("--fs",Math.max(.15,Math.min(1,tr.width/(S*.74)||.4)));

  var P=[],RING=[],acc={g:0,a:0,s:0};
  var t0=performance.now(),last=t0,alive=true,hit=false,wiping=false,phase="play",T=[];
  function at(ms,fn){T.push(setTimeout(fn,ms))}
  function say(txt){goEl.textContent=txt;goEl.classList.remove("pop");void goEl.offsetWidth;goEl.classList.add("pop")}
  function ring(o){o.age=0;o.delay=o.delay||0;o.x=CX;o.y=CY;RING.push(o)}
  function pickTy(){return th.t[(Math.random()*th.t.length)|0]}
  function colFor(ty){
    if(th.k==="hub")return th.cols[(Math.random()*th.cols.length)|0];
    if(ty==="drop")return th.cols[(Math.random()*th.cols.length)|0];
    return ty==="leaf"?LEAF[(Math.random()*4)|0]:BEAN[(Math.random()*4)|0];
  }
  function add(o){
    var p={ty:o.ty,x:o.x,y:o.y,vx:o.vx||0,vy:o.vy||0,r:R(0,6.28),vr:R(-4,4),
      s:(o.s||(o.ty==="drop"?R(14,28):R(10,24)))*K,z:R(.55,1),age:0,life:o.life||99,mode:o.mode,col:colFor(o.ty),a:o.a||0,rho:o.rho||0,sp:o.sp||0,w:o.w||0};
    if(o.ty==="spark")p.vr*=.2;
    P.push(p);return p;
  }
  function drawP(p){
    var a=Math.min(1,p.age/.25,(p.life-p.age)/.5);if(a<=0)return;
    var s=p.s*(.6+.4*p.z);
    g.globalAlpha=a*(.55+.45*p.z);
    g.globalCompositeOperation=p.ty==="spark"?"lighter":"source-over";
    g.save();g.translate(p.x,p.y);g.rotate(p.r);
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

  /* ketukan 1 dan 2: cincin kecil + ikon berdenyut */
  function beat(n){
    ring({life:.6,max:S*(1.4+n*.45),col:th.rc,w:3+n*1.5});
    try{popEl.animate([{transform:"scale(1)"},{transform:"scale("+(1.05+n*.04)+")"},{transform:"scale(1)"}],{duration:260,easing:"ease-out"})}catch(x){}
    if(n===0)say("Siap?");
  }
  /* ledakan susulan: lebih kecil dan lembut, menutup klimaks */
  function echo(){
    ring({life:1,max:Math.max(W,H)*.6,col:th.rc,w:4});
    for(var i=0;i<(LITE?22:40);i++){
      var a=R(0,PI2),v=R(200,640);
      add({ty:pickTy(),x:CX,y:CY,vx:Math.cos(a)*v,vy:Math.sin(a)*v-160,mode:"burst",life:R(1,1.8)});
    }
  }
  /* DUM: semua partikel yang menuju ikon meledak ke luar */
  function doHit(){
    if(hit)return;hit=true;root.classList.add("hit");
    try{navigator.vibrate&&navigator.vibrate(18)}catch(x){}
    say(th.hit);
    var M=Math.max(W,H)*.75;
    ring({life:.85,max:M,col:"255,244,224",w:10});
    ring({life:1.05,max:M,col:th.rc,w:6,delay:.08});
    ring({life:1.25,max:M,col:"255,244,224",w:3,delay:.18});
    P.forEach(function(p){
      if(p.mode==="in"){var dx=p.x-CX,dy=p.y-CY,d=Math.hypot(dx,dy)||1,v=R(380,900);p.vx=dx/d*v;p.vy=dy/d*v-120;p.mode="burst";p.age=0;p.life=R(1.4,2.4)}
    });
    for(var i=0;i<(LITE?45:80);i++){
      var a=R(0,PI2),v=R(260,1000);
      add({ty:pickTy(),x:CX+Math.cos(a)*R(0,24),y:CY+Math.sin(a)*R(0,24),vx:Math.cos(a)*v,vy:Math.sin(a)*v-200,mode:"burst",life:R(1.4,2.5)});
    }
  }

  function frame(now){
    if(!alive)return;
    var dt=Math.min(.05,(now-last)/1000),t=(now-t0)/1000;last=now;var sdt=dt*RATE;
    g.globalCompositeOperation="source-over";g.globalAlpha=1;g.clearRect(0,0,W,H);
    if(!wiping){
      if(!hit&&t<HIT/1000-.1){
        /* kumpul: semua partikel diatur agar tiba di ikon tepat saat DUM */
        acc.g+=sdt*90;
        while(acc.g>=1){acc.g--;
          if(P.length<CAP){
            var rho=Math.max(W,H)*R(.55,.8),left=Math.max(.15,HIT/1000+.03-t);
            add({ty:pickTy(),x:CX,y:CY,a:R(0,PI2),rho:rho,sp:(rho-S*.6)/left,w:R(2.2,4),mode:"in",life:9});
          }
        }
      }else if(hit){
        /* reda: tetesan lembut dan kilau */
        acc.a+=sdt*18;while(acc.a>=1){acc.a--;if(P.length<CAP)add({ty:pickTy(),x:R(-20,W+20),y:-30,vx:R(-20,20),vy:R(90,220),mode:"fall",life:9})}
        acc.s+=sdt*12;while(acc.s>=1){acc.s--;add({ty:"spark",x:R(0,W),y:R(0,H),mode:"amb",life:R(.8,1.5),s:R(7,15)})}
      }
    }
    for(var i=P.length-1;i>=0;i--){
      var p=P[i];p.age+=dt;
      if(p.mode==="in"){
        p.a+=p.w*dt;p.rho=Math.max(S*.6,p.rho-p.sp*dt);
        p.x=CX+Math.cos(p.a)*p.rho;p.y=CY+Math.sin(p.a)*p.rho*.8;
      }else if(p.mode==="fall"){p.x+=Math.sin(p.age*2+p.r)*22*dt+p.vx*dt;p.y+=p.vy*dt}
      else if(p.mode==="burst"){p.vx*=Math.pow(.45,dt);p.vy*=Math.pow(.7,dt);p.vy+=560*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}
      else{p.x+=Math.sin(p.age*1.6+p.r)*28*dt}
      p.r+=p.vr*dt;
      if(p.mode!=="in"&&(p.age>p.life||p.y>H+90||p.x<-160||p.x>W+160||p.y<-220)){P.splice(i,1);continue}
      drawP(p);
    }
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
  requestAnimationFrame(function(n2){last=n2;frame(n2)});

  /* ---- alur waktu (sama untuk semua tema) ---- */
  var canSkipAt=t0+350,wipeEl=root.querySelector(".af-wipe");
  BEAT.forEach(function(ms,i){at(ms,function(){beat(i)})});
  at(HIT,doHit);
  at(ECHO,echo);
  at(WIPE,function(){startWipe(false)});
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
}catch(e){console.error("[efek-masuk]",e)}

/* ################ Tombol akun ################ */
try{
(function(){function mv(){var b=document.getElementById('acctBtn'),m=document.getElementById('mpMini');if(!b||!m||!m.parentNode)return;m.parentNode.appendChild(b);b.classList.add('in-nav');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mv);else mv();})();
}catch(e){console.error("[akun-tombol]",e)}
