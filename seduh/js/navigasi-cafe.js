(function(){
const $=id=>document.getElementById(id);
/* ---------- Navigasi ---------- */
const VIEWS={"":"splash",hub:"hub",lab:"lab",cafe:"cafe",login:"login",bahan:"resep",perlengkapan:"resep",menu:"resep"};
const TITLE={splash:"Si SEDUH",hub:"Si SEDUH — Beranda",lab:"Si SEDUH — Barista Lab",cafe:"Si SEDUH — Cafe Finder",login:"Si SEDUH — Masuk"};
let cur="",lastRecipe="bahan",cfAnim=false;
const hroute=()=>location.hash.replace(/^#\/?/,"");
function labWin(){const f=$("labFrame");return f&&f.contentWindow}
function loadLab(){
  if($("labFrame"))return;
  const logo=getComputedStyle(document.documentElement).getPropertyValue("--logo");
  const f=document.createElement("iframe");f.id="labFrame";f.className="lab-frame";f.title="Barista Lab";f.setAttribute("allow","autoplay");
  f.addEventListener("load",()=>{try{f.contentDocument.documentElement.style.setProperty("--logo",logo)}catch(e){}});
  f.src="lab/lab.html";$("sv-lab").appendChild(f);
}
let hrBusy=false;
function show(){const v=VIEWS[hroute()]||"splash";
  if(v==="hub"&&cur&&cur!=="hub"&&cur!=="splash"&&!hrBusy&&window.__homeReturn&&!matchMedia("(prefers-reduced-motion: reduce)").matches){hrBusy=true;window.__homeReturn();setTimeout(()=>{hrBusy=false;showNow()},700);return}
  if(!hrBusy)showNow()}
function showNow(){
  const r=hroute(),v=VIEWS[r]||"splash";
  if(cur==="lab"&&v!=="lab"){try{const w=labWin();if(w.MU.on)w.musicOff();if(w.S.run)w.reset()}catch(e){}try{labWin().postMessage({seduh:"lab-stop"},"*")}catch(e){}}
  const changed=cur!==v;cur=v;
  ["splash","hub","lab","cafe","login","resep"].forEach(n=>$("sv-"+n).classList.toggle("on",n===v));
  $("sbar").style.display=v==="splash"?"none":"";
  document.querySelectorAll("#sbar a").forEach(a=>a.classList.toggle("on",a.dataset.v===v));
  try{const ta=document.querySelector("#sbar a.on:not(.sbrand)"),c=document.querySelector("#sbar .in"),br=c&&c.querySelector(".sbrand");if(ta&&br){const r=ta.getBoundingClientRect(),bl=br.getBoundingClientRect().right;if(r.left<bl+8||r.right>innerWidth-8)c.scrollLeft+=r.left-bl-8}}catch(e){}
  if(v==="lab")loadLab();
  if(v==="resep"){lastRecipe=r||lastRecipe}else document.title=TITLE[v];
  const TH={hub:"",lab:"kopi",cafe:"teh"};
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
CFD.forEach((r,i)=>CF.push([1000+i,r[0],"Bandung",r[2],r[1],null,0,"",r[5],r[4],"Tercatat di data Dinas Kebudayaan dan Pariwisata Kota Bandung (terakhir tahun "+r[3]+"). Kategori diperkirakan dari nama; status buka/tutup, fasilitas, dan jam buka belum diverifikasi.",r[6]||"Perlu verifikasi"]));
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
101:{src:"Sumedang Ekspres",yr:"Okt 2025",note:"Harga acuan dari artikel, bisa sudah berubah.",hl:["Bagi Akal Sehat","Bagi Blangkon","Bagi Avocado"],cats:[
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
10:FORE,110:FORE,
145:{src:"Rumah123",yr:"2026",note:"Harga acuan dari artikel, bisa sudah berubah.",hl:["Espresso","Cafe Latte","Gyoza"],cats:[
 ["Kopi",[["Espresso",25000],["Americano",25000],["Cafe Latte",30000]]],
 ["Camilan",[["Chicken Wings",27000],["Gyoza",20000]]]
]}
};
const MSUM={
1:{src:"Moms Money (Kontan), Bobobox",yr:"2026",tx:"Menu sangat beragam: bakery dan pastry, kopi, cokelat, teh, mocktail, mojito, sarapan (dari pancake sampai smoothies), appetizer, menu utama seperti sate, nasi bebek, steak, pasta, dan pizza, lalu dessert seperti pannacota, sundae, dan cake.",hl:["Pizza","Nasi bebek","Sate","Steak","Pannacota","Pancake"]},
3:{src:"IDN Times",yr:"",tx:"Makanan: nasi goreng, fish and chips, menu sarapan, rice bowl, gorengan, pisang goreng, dan snack ringan. Minuman: espresso, cappuccino, berbagai latte, iced coffee, dan non-kopi yang segar.",hl:["Nasi goreng","Fish and chips","Rice bowl","Pisang goreng","Cappuccino","Latte"]},
18:{src:"IDN Times",yr:"2025",tx:"Menu beragam, termasuk kopi pisang susu (Kosangsu), ice latte, dan ice java choco.",hl:["Kosangsu (kopi pisang susu)","Ice Latte","Ice Java Choco"]},
111:{src:"Kompas.com, Jatinangorku",yr:"2023–2025",tx:"Minuman panas dan dingin serta makanan, di ruangan yang luas dan artistik.",hl:["Kopi Jadoel","Cappuccino","Coffee Latte","Hot Milo","Ice Coffee Thai Tea"],pr:"Minuman sekitar Rp20.000–37.000 (data 2023)."},
121:{src:"Detik",yr:"2021",tx:"Makanan Western, Asian, dan khas Indonesia, plus minuman.",hl:[],pr:"Sekitar Rp20.000–40.000 per orang (data 2021)."},
122:{src:"Kompas.com, Jatinangorku",yr:"2023–2025",tx:"Minuman kopi, dessert, dan makanan berat dengan harga terjangkau.",hl:["Black Coffee","Cafe Latte","Creme Brulee","Affogato"],pr:"Kopi sekitar Rp16.500–26.000 (data 2023)."},
123:{src:"Kompas.com",yr:"2023–2024",tx:"Minuman kopi dan non-kopi, plus paket makan.",hl:["Es Kopi Djoeroe","Es Kopi Susu 1 Liter","Red Velvet","Cremebrulee Hot","Paket nasi ayam geprek + es teh manis"],pr:"Minuman mulai Rp18.000. Paket nasi ayam geprek dan es teh manis mulai Rp33.000."},
124:{src:"Kompas.com",yr:"2024",tx:"Menu ramah kantong mahasiswa, dari kopi sampai makanan sederhana.",hl:["Kopi Pandan","Nasi Telur Sambel Penyet","Indomie Rebus","Cokelat Susu"],pr:"Mulai Rp10.000."},
126:{src:"Kompas.com, ProJabar",yr:"2023–2025",tx:"Lebih banyak menu kopi, ditambah camilan dan makanan berat.",hl:["Coffeetail","Coffee Ice","Mocktail","Milk Based"],pr:"Minuman sekitar Rp17.000–40.000 (data 2023). Makanan mulai Rp25.000."},
30:{src:"Sindonews",yr:"2022",tx:"Menu lintas negara: Indonesia, Oriental, sampai Eropa.",hl:[]},
31:{src:"Monday Co, Liputan6",yr:"2025–2026",tx:"Dari camilan ringan sampai menu berat.",hl:["Ayam geprek","Nasi goreng"]},
32:{src:"Helvetia",yr:"2025",tx:"Desain estetik dengan menu internasional dan Indonesia.",hl:["Rendang hitam","Nasi goreng spesial"]},
33:{src:"Helvetia",yr:"2025",tx:"Menu variatif dari kopi sampai makanan berat, harga terjangkau.",hl:[]},
34:{src:"Popmama",yr:"",tx:"Masakan Western sampai lokal.",hl:[],pr:"Minuman mulai Rp7.000, makanan mulai Rp18.000 (data media, tahun tidak tercatat)."},
35:{src:"IDN Times",yr:"2025",tx:"Menu beragam: kopi susu, teh, dan beberapa camilan.",hl:["Kopi susu","Teh","Camilan"]},
132:{src:"Kompas.com",yr:"2024",tx:"Menu ringan dan makanan, buka 24 jam.",hl:["Mendoan","Dimsum Goreng","Ricebowl Chicken Skin","Nasi Ayam Bakar","Roti Bakar Keju"],pr:"Mulai Rp10.000."},
133:{src:"Kompas.com",yr:"2024",tx:"Kopi, roti bakar, rice bowl, dan mie.",hl:["Roti Bakar Cokelat","Coffee Milk","Chicken Egg Teriyaki Ricebowl","Mendoan","Kopi Susu Jahe","Mie Goreng"],pr:"Mulai Rp10.000."},
134:{src:"IDN Times, Kumparan",yr:"2022–2023",tx:"Beragam olahan kopi dengan tempat yang tenang untuk belajar.",hl:[],pr:"Sekitar Rp10.000–20.000 (data 2023)."},
135:{src:"Kompas.com",yr:"2023",tx:"Minuman kopi, gelato, dan dessert, plus menu makan.",hl:["Gelato","Pizza","Pasta","Sate Maranggi","Hainan Chicken Rice"]},
55:{src:"What's New Indonesia",yr:"",tx:"Teh dan kopi dalam suasana vintage yang berpadu modern.",hl:[]},
56:{src:"What's New Indonesia",yr:"",tx:"Minuman teh, terutama fruit tea dengan beragam rasa buah.",hl:["Fruit tea"]},
58:{src:"Orami",yr:"2025",tx:"Menu berbasis matcha dengan nuansa ala Jepang.",hl:["Matcha"]},
59:{src:"Orami",yr:"2025",tx:"Menu berbasis matcha.",hl:["Matcha"]},
60:{src:"Tripadvisor",yr:"2018",tx:"Kopi dan pizza menurut ulasan tahun 2018. Ulasan terbaru yang kami temukan juga dari tahun itu, jadi cek dulu apakah masih buka.",hl:["Kopi","Pizza"]},
61:{src:"What's New Indonesia",yr:"",tx:"Teh klasik yang disajikan dalam cangkir porselen halus.",hl:["Earl Grey","Darjeeling","Oolong"]},
139:{src:"detikEdu",yr:"2021",tx:"Donat dan minuman.",hl:["Donat"]},
140:{src:"Rumah123",yr:"2026",tx:"Kopi dan menu lokal buatan sendiri, dengan balkon outdoor menghadap Jalan Braga.",hl:["Soto Braga","Dendeng Padang"],pr:"Makanan sekitar Rp45.000–120.000, minuman mulai Rp25.000."},
141:{src:"Rumah123",yr:"2026",tx:"Kopi dan makanan di kafe bertema taman tropis dalam ruangan.",hl:[],pr:"Makanan sekitar Rp40.000–110.000, minuman mulai Rp35.000."},
142:{src:"Rumah123",yr:"2026",tx:"Kopi, camilan, dan hidangan manis untuk keluarga.",hl:[],pr:"Makanan/camilan sekitar Rp25.000–75.000, minuman mulai Rp20.000."},
143:{src:"Rumah123",yr:"2026",tx:"Restoran klasik dengan appetizer, steak, dan dessert khas Belanda.",hl:["Bitterballen","Steak lidah","Poffertjes"],pr:"Sekitar Rp20.000–200.000."},
144:{src:"Rumah123",yr:"2026",tx:"Menu kopi susu dan latte.",hl:["Bonie (kopi susu macchiato)","Caramel Latte"],pr:"Sekitar Rp50.000–100.000 per orang."},
146:{src:"Rumah123",yr:"2026",tx:"Es kopi dan minuman cokelat.",hl:["Es Kopi Awan","Es Kopi Djawa","Es Cokelat"],pr:"Di bawah Rp50.000 per orang."}
};
const MEDIA=new Set([140,141,142,143,144,145,146,147,148,30,31,32,33,34,35,36,37,132,133,134,135,55,56,57,58,59,60,61,62,63,139,64,65,66,67]);

const FAC={w:["📶","Wi-Fi"],p:["🔌","Stop Kontak"],a:["❄️","AC"],k:["🚗","Parkir"],o:["🌳","Outdoor"],i:["🛋️","Indoor"],s:["🚬","Smoking Area"],t:["🌿","Taman"],c:["💼","Coworking"],m:["👥","Ruang Meeting"],e:["🪑","Meja Ergonomis"],d:["🍰","Dessert"],r:["🎨","Creative Space"]};
const FF=["w","p","a","k","o","c"],UU=["Belajar","Kerja","Nongkrong","Makan"];
/* Koordinat kampus (acuan) + rumus Haversine; jarak = garis lurus */
const CAMPUS={Gane:{name:"ITB Ganesha",lat:-6.8906,lng:107.6107},Nangor:{name:"ITB Jatinangor",lat:-6.9267,lng:107.7714}};
const hav=(a,b,c,d)=>{const r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))};
const fmtKm=k=>k<1?Math.round(k*100)*10+" m":k.toLocaleString("id-ID",{maximumFractionDigits:1})+" km";
const num=v=>{if(v==null||v==="")return null;const n=typeof v==="number"?v:parseFloat(String(v).replace(",","."));return Number.isFinite(n)?n:null};
const okLL=(a,b)=>a!=null&&b!=null&&Math.abs(a)<=90&&Math.abs(b)<=180&&!(a===0&&b===0);
const nk=n=>String(n||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g," ").replace(/\b(bandung|jatinangor)\b/g," ").replace(/\s+/g,"");
const GEO2={140:[-6.9197959,107.6072987],141:[-6.9169285,107.6065313],142:[-6.9166943,107.6066094],143:[-6.9173475,107.6069351],144:[-6.9187892,107.6069117],145:[-6.9160016,107.6065284]};
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

