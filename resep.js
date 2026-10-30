/* Si SEDUH - Aplikasi Resep (dipisah dari app.js).
   Muat SEBELUM app.js: blok ini mendefinisikan window.__scene yang dipakai bagian navigasi di app.js. */
try{
(function () {
  "use strict";

  /* ---------- Data ---------- */
  const BASES = {
    kopi:   { name: "Kopi",   tint: "#e8d5bf", deep: "#3d2414", blurb: "Dari espresso pekat sampai seduhan manual yang ringan.",
              tags: ["Panas", "Dingin"], lead: "Chip berwarna berarti alat atau bahannya sudah kamu punya. Chip putus-putus berarti belum.",
              art: { type: "hot", c: ["#4a2c17"], f: "#d9b98f" } },
    coklat: { name: "Coklat", tint: "#f1cdbd", deep: "#6b1f10", blurb: "Hangat, kental, dan manis. Ada juga versi bergaya China, Jepang, Korea, Inggris, Meksiko, Spanyol, dan Italia.",
              tags: ["Panas", "Dingin"], lead: "Chip berwarna berarti alat atau bahannya sudah kamu punya. Chip putus-putus berarti belum.",
              art: { type: "hot", c: ["#5e2616"], f: "#e8c9ae", marsh: true } },
    teh:    { name: "Teh",    tint: "linear-gradient(165deg,#e1ebc6 0%,#f2e2b6 100%)", deep: "#3f5a22", blurb: "Teh melati dan Thai tea, matcha, sampai teh gaya China, Jepang, Korea, Inggris, Turki, India, Maroko, dan Taiwan.",
              tags: ["Panas", "Dingin", "Termasuk matcha"], lead: "Matcha ada di dalam kategori teh. Pakai tab di bawah untuk memilah.",
              art: { type: "iced", c: ["#d9a441", "#7fa04f"], f: "#cfe3a3" } }
  };
  const SUBS = {
    teh: [{ id: "semua", label: "Semua" }, { id: "matcha", label: "Matcha" }, { id: "seduh", label: "Teh seduh" }]
  };
  const SUB_LABEL = { matcha: "Matcha", seduh: "Teh seduh", v60: "V60", manual: "Seduh manual", espresso: "Espresso & susu" };
  SUBS.kopi = [{ id: "semua", label: "Semua" }, { id: "v60", label: "V60" }, { id: "manual", label: "Seduh manual" }, { id: "espresso", label: "Espresso & susu" }];

  const GEAR = [
    { id: "espresso",    name: "Mesin espresso",         ico: "☕", grp: "main", for: ["kopi"],   d: "Ekstraksi bertekanan" },
    { id: "moka",        name: "Moka pot",               ico: "♨️", grp: "main", for: ["kopi"],   d: "Seduh di atas kompor" },
    { id: "v60",         name: "Dripper V60",            ico: "⏳", grp: "main", for: ["kopi"],   d: "Seduh manual" },
    { id: "frenchpress", name: "French press",           ico: "🧴", grp: "main", for: ["kopi"],   d: "Rendam lalu tekan" },
    { id: "aeropress",   name: "Aeropress",              ico: "☕", grp: "main", for: ["kopi"],   d: "Seduh tekan, cepat dan bersih" },
    { id: "cezve",       name: "Cezve (panci kopi Turki)", ico: "🫕", grp: "main", for: ["kopi"], d: "Panci leher sempit untuk kopi Turki" },
    { id: "chemex",      name: "Chemex",                 ico: "⏳", grp: "main", for: ["kopi"],   d: "Seduh manual, botol kaca jam pasir" },
    { id: "kalita",      name: "Kalita Wave",             ico: "🌊", grp: "main", for: ["kopi"],   d: "Dripper dasar rata, seduhan merata" },
    { id: "phin",        name: "Phin Vietnam",            ico: "🥄", grp: "main", for: ["kopi"],   d: "Saringan logam kecil di atas gelas" },
    { id: "siphon",      name: "Alat siphon",             ico: "⚗️", grp: "main", for: ["kopi"],   d: "Seduh vakum dengan uap panas" },
    { id: "filterindia", name: "Filter kopi India (tumbler-davarah)", ico: "🫗", grp: "main", for: ["kopi"], d: "Filter dua tingkat untuk kopi saring India" },
    { id: "percolator",  name: "Percolator",              ico: "☕", grp: "main", for: ["kopi"],   d: "Air bersirkulasi lewat kopi berulang" },
    { id: "colddrip",    name: "Menara cold drip",        ico: "⏳", grp: "main", for: ["kopi"],   d: "Tetes dingin perlahan berjam-jam" },
    { id: "napoletana",  name: "Napoletana (panci balik)", ico: "♨️", grp: "main", for: ["kopi"],   d: "Panci kopi Italia yang dibalik" },
    { id: "saucepan",    name: "Panci kecil",            ico: "🍲", grp: "main", for: ["coklat", "teh"], d: "Memanaskan susu, coklat, atau rebusan teh" },
    { id: "whisk",       name: "Pengocok (whisk)",       ico: "🥄", grp: "main", for: ["coklat", "kopi"], d: "Melarutkan atau mengocok hingga berbusa" },
    { id: "teapot",      name: "Teko teh",               ico: "🫖", grp: "main", for: ["teh"],    d: "Menyeduh daun teh" },
    { id: "chawan",      name: "Chawan (mangkuk)",       ico: "🍵", grp: "main", for: ["teh"],    d: "Untuk matcha: wadah mengocok" },
    { id: "gaiwan",      name: "Gaiwan",                 ico: "🍵", grp: "main", for: ["teh"],    d: "Cangkir bertutup untuk seduh gaya China" },
    { id: "chasen",      name: "Chasen (kocokan bambu)", ico: "🎋", grp: "main", for: ["teh"],    d: "Untuk matcha: hasilkan busa" },
    { id: "grinder",     name: "Penggiling kopi",        ico: "⚙️", grp: "aux",  for: ["kopi"],   d: "Atur kehalusan biji" },
    { id: "chashaku",    name: "Sendok matcha",          ico: "🥢", grp: "aux",  for: ["teh"],    d: "Untuk matcha: takar bubuk" },
    { id: "thermo",      name: "Termometer dapur",       ico: "🌡️", grp: "aux",  for: ["kopi", "coklat", "teh"], d: "Jaga suhu tetap pas" },
    { id: "kettle",      name: "Ketel air",              ico: "🫗", grp: "aux",  for: ["kopi", "teh"], d: "Suhu air terukur" },
    { id: "frother",     name: "Pengocok susu",          ico: "🥛", grp: "aux",  for: ["kopi", "coklat", "teh"], d: "Busa susu halus" },
    { id: "shaker",      name: "Shaker",                 ico: "🍶", grp: "aux",  for: ["kopi", "coklat", "teh"], d: "Untuk minuman dingin" },
    { id: "strainer",    name: "Saringan halus",         ico: "🔘", grp: "aux",  for: ["coklat", "teh"], d: "Menyaring gumpalan" },
    { id: "scale",       name: "Timbangan digital",      ico: "⚖️", grp: "aux",  for: ["kopi", "coklat", "teh"], d: "Takaran akurat" },
    { id: "glass",       name: "Gelas saji",             ico: "🥤", grp: "aux",  for: ["kopi", "coklat", "teh"], d: "Untuk menyajikan" }
  ];
  const GROUPS = {
    main: { title: "Alat utama", sub: "Alat yang dipakai langsung untuk membuat minumannya." },
    aux:  { title: "Alat pendukung", sub: "Membantu takaran, suhu, dan penyajian." }
  };
  const nameRe = n => new RegExp("(?<![\\p{L}\\p{N}])" + String(n).replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&") + "(?![\\p{L}\\p{N}])", "iu");

  /* Bahan: dikenali otomatis dari teks bahan tiap menu (air biasa dianggap selalu ada) */
  const INGR = [
    { id: "b_kopi",   name: "Kopi bubuk / biji",  ico: "🫘", for: ["kopi"],  d: "Bahan utama minuman kopi", re: /kopi|espresso/i },
    { id: "b_batang", name: "Coklat batang",      ico: "🍫", for: ["coklat"], d: "Untuk coklat panas", re: /coklat (batang|panas klasik)/i },
    { id: "b_bubuk",  name: "Bubuk coklat",       ico: "🤎", for: ["coklat"], d: "Untuk coklat dingin", re: /bubuk coklat/i },
    { id: "b_marsh",  name: "Marshmallow",        ico: "☁️", for: ["coklat"], d: "Topping", re: /marshmallow/i },
    { id: "b_matcha", name: "Bubuk matcha",       ico: "🍃", for: ["teh", "coklat"], d: "Untuk semua menu matcha", re: /matcha/i },
    { id: "b_melati", name: "Teh melati",         ico: "🌼", for: ["teh"],   d: "Teh hijau beraroma", re: /teh melati/i },
    { id: "b_hitam",  name: "Teh hitam",          ico: "🍂", for: ["teh"],   d: "Daun atau kantong", re: /teh hitam/i },
    { id: "b_thai",   name: "Teh Thai",           ico: "🧡", for: ["teh"],   d: "Teh oranye pekat", re: /teh thai/i },
    { id: "b_susu",   name: "Susu cair",          ico: "🥛", for: ["kopi", "coklat", "teh"], d: "Segar atau UHT", re: /susu(?! kental)/i },
    { id: "b_kental", name: "Susu kental manis",  ico: "🥫", for: ["kopi", "teh"], d: "Pemanis dan pelengkap", re: /susu kental/i },
    { id: "b_gula",   name: "Gula pasir",         ico: "🍬", for: ["kopi", "coklat", "teh"], d: "Pemanis", re: /(?<!sirup )gula/i },
    { id: "b_kapulaga", name: "Kapulaga",         ico: "🌱", for: ["teh"],   d: "Rempah untuk masala chai", re: /kapulaga/i },
    { id: "b_kayumanis", name: "Kayu manis",      ico: "🟤", for: ["teh"],   d: "Rempah hangat untuk masala chai", re: /kayu manis/i },
    { id: "b_gunpowder", name: "Teh hijau gunpowder", ico: "🍃", for: ["teh"], d: "Teh hijau gulung khas teh mint Maroko", re: /gunpowder/i },
    { id: "b_mint",   name: "Daun mint segar",    ico: "🌿", for: ["teh", "coklat"],   d: "Untuk teh mint Maroko", re: /mint/i },
    { id: "b_sirup",  name: "Sirup (gula aren, gula, lemon, karamel, mint)", ico: "🍯", for: ["kopi", "teh", "coklat"], d: "Pemanis cair", re: /sirup/i },
    { id: "b_lemon",  name: "Lemon segar",        ico: "🍋", for: ["teh"],   d: "Untuk diperas", re: /buah lemon/i },
    { id: "b_es",     name: "Es batu",            ico: "🧊", for: ["kopi", "coklat", "teh"], d: "Untuk minuman dingin", re: /es batu/i },
    { id: "b_oolong",  name: "Teh oolong",         ico: "🍂", for: ["teh"],   d: "Teh semi-fermentasi", re: /oolong/i },
    { id: "b_puerh",   name: "Teh pu-erh",         ico: "🟤", for: ["teh"],   d: "Teh fermentasi, aroma tanah", re: /pu-?erh/i },
    { id: "b_krisan",  name: "Bunga krisan kering", ico: "🌼", for: ["teh"],  d: "Untuk teh krisan", re: /krisan/i },
    { id: "b_sencha",  name: "Sencha",             ico: "🍃", for: ["teh"],   d: "Teh hijau harian Jepang", re: /sencha/i },
    { id: "b_genmai",  name: "Genmaicha",          ico: "🍚", for: ["teh"],   d: "Teh hijau dengan beras panggang", re: /genmaicha/i },
    { id: "b_hojicha", name: "Hojicha",            ico: "🔥", for: ["teh", "coklat"], d: "Teh hijau sangrai", re: /hojicha/i },
    { id: "b_yuja",    name: "Selai yuja",         ico: "🍊", for: ["teh", "coklat"], d: "Yuja-cheong khas Korea; bisa diganti selai jeruk", re: /yuja/i },
    { id: "b_jujube",  name: "Kurma merah kering", ico: "🔴", for: ["teh"],   d: "Jujube untuk daechu-cha", re: /kurma merah|jujube/i },
    { id: "b_jahe",    name: "Jahe segar",         ico: "🫚", for: ["teh", "coklat"], d: "Diiris atau digeprek", re: /jahe/i },
    { id: "b_boricha", name: "Jelai panggang (boricha)", ico: "🌾", for: ["teh"], d: "Teh jelai tanpa kafein", re: /boricha|jelai/i },
    { id: "b_earl",    name: "Teh Earl Grey",      ico: "🫖", for: ["teh"],   d: "Teh hitam beraroma bergamot", re: /earl grey/i },
    { id: "b_madu",    name: "Madu",               ico: "🍯", for: ["teh", "coklat"], d: "Pemanis alami", re: /madu/i },
    { id: "b_wijen",   name: "Wijen hitam (bubuk/pasta)", ico: "⚫", for: ["coklat"], d: "Untuk coklat wijen", re: /wijen hitam/i },
    { id: "b_putih",   name: "Coklat putih",       ico: "🤍", for: ["coklat"], d: "Untuk coklat matcha", re: /coklat putih/i },
    { id: "b_malt",    name: "Bubuk malt",         ico: "🌰", for: ["coklat"], d: "Untuk coklat malt", re: /malt/i },
    { id: "b_jeruk",   name: "Jeruk (kulit)",      ico: "🍊", for: ["coklat"], d: "Parutan kulit jeruk", re: /jeruk/i },
    { id: "b_dalgona", name: "Dalgona / honeycomb toffee", ico: "🍯", for: ["coklat"], d: "Permen karamel renyah khas Korea", re: /dalgona|honeycomb/i },
    { id: "b_boba",    name: "Boba (mutiara tapioka)", ico: "⚫", for: ["teh"],   d: "Untuk teh susu ala Taiwan", re: /boba|mutiara tapioka/i },
    { id: "b_rosella", name: "Bunga rosella kering", ico: "🌺", for: ["teh"],   d: "Untuk teh rosella, asam segar", re: /rosella/i },
    { id: "b_maizena", name: "Tepung maizena / masa harina", ico: "🌽", for: ["coklat"], d: "Pengental coklat kental khas Meksiko, Spanyol, Italia", re: /maizena|masa harina/i },
    { id: "b_chicory", name: "Bubuk cikori",     ico: "🌱", for: ["kopi"],   d: "Campuran tradisional kopi saring India", re: /cikori|chicory/i },
    { id: "b_stroberi", name: "Puree stroberi", ico: "🍓", for: ["teh"], d: "Lapisan buah untuk matcha latte", re: /stroberi|strawberry/i },
    { id: "b_garam", name: "Garam laut", ico: "🧂", for: ["coklat", "kopi"], d: "Sejumput untuk menyeimbangkan rasa manis", re: /garam/i },
    { id: "b_santan", name: "Santan cair", ico: "🥥", for: ["coklat"], d: "Alternatif susu dengan rasa kelapa", re: /santan/i }
  ];


  const SEED = [
    { id: "s1", base: "kopi", type: "hot", c: ["#2a150a"], f: "#c9965f", name: "Espresso", desc: "Kopi pekat dengan crema tebal. Dasar dari hampir semua minuman kopi.",
      ing: "18 g kopi bubuk halus\nAir panas", steps: "Giling kopi halus.\nEkstrak dengan mesin selama 25–30 detik.\nHasilkan sekitar 36 ml.", needs: ["espresso", "grinder", "glass"] },
    { id: "s2", base: "kopi", type: "hot", c: ["#b98a5e"], f: "#f1e4cf", name: "Caffe Latte", desc: "Espresso dengan susu steam yang lembut dan manis alami.",
      ing: "1 shot espresso\n150 ml susu segar", steps: "Seduh espresso ke dalam gelas.\nBusakan susu hingga hangat dan halus.\nTuang susu ke atas espresso.", needs: ["espresso", "frother", "glass"] },
    { id: "s3", base: "kopi", type: "iced", c: ["#9a5b2a", "#efe2cb", "#4a2c17"], name: "Es Kopi Susu Gula Aren", desc: "Kopi, susu, dan gula aren. Manis legit dan segar.",
      ing: "2 shot espresso atau kopi kuat\n100 ml susu\n2 sdm sirup gula aren\nEs batu", steps: "Kocok kopi dan sirup gula aren bersama es.\nTuang ke gelas berisi es.\nTambahkan susu perlahan.", needs: ["shaker", "glass"] },
    { id: "s4", base: "kopi", type: "hot", c: ["#6a3d1f"], f: "#c9965f", name: "Pour Over V60", desc: "Seduhan bersih dengan aroma buah dan bunga yang jelas.",
      ing: "15 g kopi bubuk sedang\n250 ml air 92–94°C", steps: "Bilas kertas filter.\nBasahi kopi 30 ml, tunggu 30 detik.\nTuang air bertahap dengan gerakan melingkar hingga 250 ml.", needs: ["v60", "grinder", "kettle", "scale", "glass"] },
    { id: "s5", base: "kopi", type: "iced", c: ["#3a1f10"], name: "Cold Brew", desc: "Direndam dingin semalaman. Rasa halus, asam rendah.",
      ing: "60 g kopi bubuk kasar\n750 ml air dingin", steps: "Campur kopi dan air di French press.\nSimpan di kulkas 12–16 jam.\nTekan plunger, sajikan dengan es.", needs: ["frenchpress", "grinder", "scale", "glass"] },

    { id: "c1", base: "coklat", type: "hot", c: ["#5e2616"], f: "#b9805e", name: "Coklat Panas Klasik", desc: "Coklat leleh dalam susu hangat. Kental dan menenangkan.",
      ing: "40 g coklat batang\n250 ml susu\n1 sdm gula", steps: "Hangatkan susu di panci kecil, jangan sampai mendidih.\nMasukkan coklat cincang dan gula.\nAduk dengan whisk hingga larut dan mengilap.", needs: ["saucepan", "whisk", "glass"] },
    { id: "c2", base: "coklat", type: "hot", c: ["#5e2616"], f: "#b9805e", marsh: true, name: "Coklat Marshmallow", desc: "Coklat panas dengan topping marshmallow yang meleleh.",
      ing: "1 porsi coklat panas klasik\nMarshmallow", steps: "Buat coklat panas klasik.\nTuang ke gelas.\nTaruh marshmallow di atasnya.", needs: ["saucepan", "whisk", "glass"] },
    { id: "c3", base: "coklat", type: "iced", c: ["#5e2616"], name: "Es Coklat Kocok", desc: "Coklat dingin yang dikocok hingga berbusa tipis.",
      ing: "3 sdm bubuk coklat\n2 sdm gula\n200 ml susu dingin\nEs batu", steps: "Larutkan bubuk coklat dan gula dengan sedikit air panas.\nMasukkan susu dan es ke shaker.\nKocok 15 detik, tuang ke gelas.", needs: ["shaker", "glass"] },
    { id: "c4", base: "coklat", type: "hot", c: ["#5e2616"], f: "#f1dcc8", name: "Coklat Susu Berbusa", desc: "Coklat panas dengan busa susu tebal di atasnya.",
      ing: "1 porsi coklat panas klasik\n50 ml susu untuk busa", steps: "Buat coklat panas klasik.\nBusakan susu dengan pengocok.\nSendokkan busa ke atas coklat.", needs: ["saucepan", "frother", "glass"] },

    { id: "m1", base: "teh", sub: "matcha", type: "bowl", c: ["#6f9a3f"], f: "#cfe3a3", name: "Usucha (Matcha Murni)", desc: "Matcha tradisional Jepang: hanya bubuk matcha dan air panas.",
      ing: "2 g matcha (sekitar 2 sendok bambu)\n70 ml air 80°C", steps: "Ayak matcha ke chawan.\nTuang air panas.\nKocok dengan chasen membentuk huruf M hingga berbusa.", needs: ["chawan", "chasen", "chashaku", "strainer", "kettle"] },
    { id: "m2", base: "teh", sub: "matcha", type: "hot", c: ["#9dba6a"], f: "#e6efd0", name: "Matcha Latte Panas", desc: "Matcha pekat dengan susu hangat berbusa.",
      ing: "2 g matcha\n40 ml air panas\n150 ml susu", steps: "Kocok matcha dengan air panas di chawan.\nBusakan susu hangat.\nTuang susu ke atas matcha.", needs: ["chawan", "chasen", "frother", "glass"] },
    { id: "m3", base: "teh", sub: "matcha", type: "iced", c: ["#f0f2e0", "#7fa04f"], name: "Es Matcha Latte", desc: "Matcha dingin dengan susu. Hijau segar dan sedikit manis.",
      ing: "2 g matcha\n40 ml air panas\n1 sdm sirup gula\n150 ml susu dingin\nEs batu", steps: "Kocok matcha dan air panas hingga tidak ada gumpalan.\nTambahkan sirup gula.\nTuang ke gelas berisi es, lalu susu.", needs: ["chawan", "chasen", "glass"] },
    { id: "m4", base: "teh", sub: "matcha", type: "iced", c: ["#8bab59"], name: "Matcha Kocok Shaker", desc: "Cara praktis tanpa chasen. Matcha dikocok dengan shaker.",
      ing: "2 g matcha\n60 ml air\n100 ml susu\nEs batu", steps: "Ayak matcha ke shaker.\nTambahkan air, susu, dan es.\nKocok kuat 20 detik lalu tuang.", needs: ["shaker", "strainer", "glass"] },
    { id: "m5", base: "teh", sub: "matcha", type: "iced", c: ["#e9d36b", "#c4742a", "#8bb04e"], name: "Es Teh Matcha Lemon", desc: "Teh seduh dingin dengan lapisan matcha di atasnya. Segar dan sedikit asam.",
      ing: "200 ml teh hitam dingin\n1 sdm sirup lemon\n2 g matcha\n40 ml air panas\nEs batu", steps: "Seduh teh, dinginkan.\nCampur teh dan sirup lemon di gelas berisi es.\nKocok matcha dengan air panas, tuang perlahan di atasnya.", needs: ["teapot", "kettle", "chawan", "chasen", "glass"] },

    { id: "t1", base: "teh", sub: "seduh", type: "hot", c: ["#d9a441"], f: "#f0d28a", name: "Teh Melati Panas", desc: "Teh hijau beraroma melati. Ringan dan wangi.",
      ing: "2 g teh melati\n250 ml air 85°C", steps: "Panaskan air hingga 85°C.\nSeduh teh di teko selama 3 menit.\nTuang ke gelas.", needs: ["teapot", "kettle", "glass"] },
    { id: "t2", base: "teh", sub: "seduh", type: "iced", c: ["#e9d36b", "#c4742a"], name: "Es Teh Lemon", desc: "Teh hitam dingin dengan perasan lemon.",
      ing: "3 g teh hitam\n200 ml air panas\n1 sdm gula\n1/2 buah lemon\nEs batu", steps: "Seduh teh 4 menit, tambahkan gula.\nDinginkan sebentar.\nTuang ke gelas berisi es, peras lemon.", needs: ["teapot", "kettle", "glass"] },
    { id: "t3", base: "teh", sub: "seduh", type: "iced", c: ["#f4e2c8", "#e0752a"], name: "Thai Tea Susu", desc: "Teh oranye pekat yang manis dengan lapisan susu.",
      ing: "3 sdm teh Thai\n250 ml air panas\n3 sdm susu kental manis\n50 ml susu cair\nEs batu", steps: "Seduh teh Thai 5 menit lalu saring.\nCampur susu kental manis, dinginkan.\nTuang ke gelas berisi es, tambahkan susu cair.", needs: ["teapot", "strainer", "glass"] },
    { id: "t4", base: "teh", sub: "seduh", type: "hot", c: ["#c99a6b"], f: "#efddc2", name: "Teh Susu Hangat", desc: "Teh hitam kuat dengan susu berbusa. Hangat dan lembut.",
      ing: "3 g teh hitam\n150 ml air panas\n100 ml susu", steps: "Seduh teh pekat 4 menit.\nBusakan susu hangat.\nTuang susu ke atas teh.", needs: ["teapot", "kettle", "frother", "glass"] },
    {"id": "s6", "base": "kopi", "type": "hot", "c": ["#2a150a"], "f": "#8a5a35", "name": "Americano", "desc": "Espresso yang diencerkan air panas. Ringan, bersih, enak diminum pelan-pelan.", "ing": "1 shot espresso\n150 ml air panas", "steps": "Seduh 1 shot espresso ke dalam gelas.\nTuang 150 ml air panas.\nAduk pelan lalu sajikan.", "needs": ["espresso", "kettle", "glass"]},
    {"id": "s7", "base": "kopi", "type": "hot", "c": ["#8a5a35"], "f": "#f6ecdc", "name": "Cappuccino", "desc": "Espresso, susu panas, dan busa tebal dalam takaran seimbang.", "ing": "1 shot espresso\n100 ml susu segar", "steps": "Seduh espresso ke cangkir.\nBusakan susu hingga busanya tebal.\nTuang susu, lalu sendokkan busa di atasnya.", "needs": ["espresso", "frother", "glass"]},
    {"id": "s8", "base": "kopi", "type": "hot", "c": ["#2a150a"], "f": "#8a5a35", "name": "Kopi Tubruk", "desc": "Kopi tradisional Nusantara: bubuk langsung diseduh, ampasnya mengendap.", "ing": "10 g kopi bubuk halus\n200 ml air mendidih\n1 sdm gula", "steps": "Masukkan kopi dan gula ke gelas.\nTuang air mendidih lalu aduk.\nDiamkan 3 menit sampai ampas turun.", "needs": ["kettle", "glass"]},
    {"id": "s9", "base": "kopi", "type": "iced", "c": ["#e8e4c8", "#3a1f10"], "f": null, "name": "Espresso Tonic", "desc": "Espresso di atas air tonik dan es. Segar, sedikit pahit-manis.", "ing": "1 shot espresso\n150 ml air tonik\nEs batu", "steps": "Isi gelas dengan es batu dan air tonik.\nSeduh 1 shot espresso.\nTuang espresso perlahan di atas tonik.", "needs": ["espresso", "glass"]},
    {"id": "s10", "base": "kopi", "type": "iced", "c": ["#f3ead8", "#3a1f10"], "f": null, "name": "Dirty Latte", "desc": "Espresso panas dituang ke susu dingin. Lapisan gelap di atas putih, hasilnya dingin, creamy, dan kopinya terasa tegas.", "ing": "1 shot espresso\n150 ml susu dingin\nEs batu", "steps": "Isi gelas dengan es batu lalu tuang susu dingin.\nSeduh 1 shot espresso panas.\nTuang espresso perlahan di atas susu hingga membentuk lapisan.", "needs": ["espresso", "glass"]},
    {"id": "s11", "base": "kopi", "type": "hot", "c": ["#8a5a35"], "f": "#f6ecdc", "name": "Flat White", "desc": "Espresso ganda dengan susu steam halus tanpa busa tebal. Lebih kuat dari latte.", "ing": "2 shot espresso\n120 ml susu segar", "steps": "Seduh 2 shot espresso ke dalam cangkir.\nPanaskan susu dengan busa tipis dan halus.\nTuang susu perlahan ke atas espresso.", "needs": ["espresso", "frother", "glass"]},
    {"id": "s12", "base": "kopi", "type": "hot", "c": ["#4a2c17"], "f": "#d9b98f", "name": "Kopi Aeropress", "desc": "Seduhan bersih dan ringan dengan cara ditekan. Cepat, praktis, mudah dibawa.", "ing": "15 g kopi bubuk halus\n200 ml air 85–90°C", "steps": "Giling kopi halus.\nMasukkan kopi ke Aeropress, tuang air panas, aduk 10 detik.\nRendam 1 menit.\nTekan plunger perlahan hingga habis, lalu sajikan.", "needs": ["aeropress", "grinder", "kettle", "scale", "glass"]},
    {"id": "v1", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "V60 Klasik 1:15", "desc": "Resep dasar V60 dengan rasio 1:15. Seimbang dan bersih, cocok untuk biji apa saja.", "ing": "15 g kopi bubuk sedang\n225 ml air 92–94°C", "steps": "Giling 15 g kopi sedang, seperti garam meja.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 30 ml air untuk membasahi kopi, tunggu 30 detik.\nTuang melingkar sampai 130 ml, tunggu 20 detik.\nTuang sampai 225 ml, lalu biarkan menetes habis (sekitar 1 menit).\nPutar gelas sebentar, lalu sajikan.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v2", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "V60 Metode 4:6", "desc": "Lima tuangan sama besar. Dua tuangan awal mengatur manis dan asam, tiga tuangan akhir mengatur kekuatan.", "ing": "20 g kopi bubuk kasar-sedang\n300 ml air 92°C", "steps": "Giling 20 g kopi kasar-sedang.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 60 ml air, tunggu 45 detik.\nTuang 60 ml lagi (total 120 ml), tunggu 45 detik.\nTuang 60 ml (total 180 ml), tunggu 45 detik.\nTuang 60 ml (total 240 ml), tunggu 45 detik.\nTuang 60 ml terakhir (total 300 ml), tunggu sampai habis menetes (sekitar 30 detik).", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v3", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "V60 Hoffmann (2 Gelas)", "desc": "Teknik populer James Hoffmann: bloom diaduk, dua tuangan besar, lalu diputar. Hasilnya manis dan rata. Untuk 2 gelas.", "ing": "30 g kopi bubuk sedang-halus\n500 ml air mendidih", "steps": "Giling 30 g kopi sedang-halus, sedikit lebih halus dari garam meja.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 60 ml air, aduk pelan sampai semua bubuk basah, tunggu 45 detik.\nTuang perlahan sampai 300 ml dalam sekitar 30 detik.\nTuang sampai 500 ml, aduk pelan sekali, lalu putar dripper agar permukaan rata.\nBiarkan menetes habis, sekitar 2 menit dari tuangan terakhir.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v4", "base": "kopi", "type": "iced", "c": ["#c9965f", "#6a3d1f"], "f": null, "name": "V60 Es Gaya Jepang", "desc": "Diseduh langsung di atas es. Seduhan sengaja dibuat lebih pekat, lalu es mencairkannya sambil mendinginkan.", "ing": "20 g kopi bubuk sedang\n200 ml air 94°C\n100 g es batu", "steps": "Giling 20 g kopi sedang.\nTaruh 100 g es batu di gelas atau server di bawah dripper, lalu bilas filter.\nTuang 40 ml air, tunggu 30 detik.\nTuang bertahap sampai 200 ml, biarkan menetes habis (sekitar 2 menit).\nPutar gelas agar es mencair rata, lalu sajikan.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v5", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "V60 Pemula Satu Tuangan", "desc": "Paling gampang: satu bloom, satu tuangan. Cocok untuk yang baru belajar V60.", "ing": "12 g kopi bubuk sedang\n200 ml air 92°C", "steps": "Giling 12 g kopi sedang.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 30 ml air, tunggu 30 detik.\nTuang pelan melingkar sampai 200 ml dalam satu tuangan.\nTunggu sampai habis menetes (sekitar 1 menit), lalu sajikan.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v6", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "V60 Light Roast Cerah", "desc": "Air lebih panas dan gilingan sedikit lebih halus untuk memunculkan asam buah dan aroma bunga.", "ing": "15 g kopi bubuk sedang-halus\n250 ml air 96°C", "steps": "Giling 15 g kopi sedikit lebih halus dari sedang.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 45 ml air 96°C, tunggu 40 detik.\nTuang sampai 150 ml, tunggu 30 detik.\nTuang sampai 250 ml, lalu biarkan menetes habis (sekitar 1 menit).\nSajikan hangat. Asam buahnya paling terasa saat agak mendingin.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v7", "base": "kopi", "type": "hot", "c": ["#3a1f10"], "f": "#c9965f", "name": "V60 Roast Gelap Manis", "desc": "Air lebih dingin dan gilingan lebih kasar agar pahitnya tidak berlebihan dan manisnya keluar.", "ing": "16 g kopi bubuk kasar-sedang\n250 ml air 88°C", "steps": "Giling 16 g kopi kasar-sedang.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 35 ml air 88°C, tunggu 30 detik.\nTuang pelan sampai 250 ml dalam dua tuangan, jangan diaduk.\nBiarkan menetes habis (sekitar 2 menit), lalu sajikan.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v8", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "V60 Bypass", "desc": "Seduh pekat dulu, lalu tambah air panas di gelas. Rasa tetap jernih dan tidak terlalu asam.", "ing": "15 g kopi bubuk sedang\n150 ml air 93°C\n100 ml air panas untuk bypass", "steps": "Giling 15 g kopi sedang.\nBilas kertas filter dengan air panas, buang airnya.\nTuang 30 ml air, tunggu 30 detik.\nTuang sampai 150 ml, tunggu sampai habis menetes (sekitar 1 menit).\nTambahkan 100 ml air panas ke gelas, aduk pelan, lalu sajikan.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "v9", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#f6ecdc", "name": "V60 Susu Hangat", "desc": "Seduhan V60 pekat ditambah susu hangat. Lembut seperti latte, tanpa mesin espresso.", "ing": "18 g kopi bubuk sedang\n150 ml air 92°C\n120 ml susu", "steps": "Giling 18 g kopi sedang.\nBilas kertas filter dengan air panas, buang airnya.\nHangatkan 120 ml susu sampai hangat, jangan mendidih.\nTuang 40 ml air, tunggu 30 detik.\nTuang sampai 150 ml, tunggu sampai habis menetes (sekitar 1 menit).\nTuang susu hangat ke gelas, lalu sajikan.", "needs": ["v60", "grinder", "kettle", "scale", "glass"]},
    {"id": "k1", "base": "kopi", "type": "hot", "c": ["#2a150a"], "f": "#d9b98f", "name": "Moka Pot Klasik", "desc": "Kopi pekat ala Italia dari panci moka. Mendekati espresso, dibuat di atas kompor.", "ing": "18 g kopi bubuk halus-sedang\n150 ml air panas", "steps": "Giling 18 g kopi, sedikit lebih kasar dari espresso.\nIsi tabung bawah dengan air panas sampai di bawah katup pengaman.\nIsi keranjang dengan kopi, ratakan tanpa ditekan, lalu kunci pot.\nPanaskan dengan api kecil sampai kopi mulai mengalir.\nAngkat saat terdengar mendesis, dinginkan dasar pot di kain basah (sekitar 10 detik), lalu tuang.", "needs": ["moka", "grinder", "glass"]},
    {"id": "k2", "base": "kopi", "type": "hot", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "French Press Panas", "desc": "Rendam lalu tekan. Hasilnya tebal dan berbadan penuh.", "ing": "30 g kopi bubuk kasar\n500 ml air 93°C", "steps": "Giling 30 g kopi kasar.\nMasukkan kopi ke French press, tuang air sampai 500 ml.\nAduk pelan, pasang tutup tanpa menekan, tunggu 4 menit.\nSendok kerak dan busa di permukaan sampai bersih.\nTekan plunger perlahan sampai dasar, lalu tuang segera.", "needs": ["frenchpress", "grinder", "kettle", "scale", "glass"]},
    {"id": "k3", "base": "kopi", "type": "iced", "c": ["#c9965f", "#3a1f10"], "f": null, "name": "AeroPress Es", "desc": "Diseduh pekat langsung ke atas es. Cepat dan segar.", "ing": "18 g kopi bubuk halus\n100 ml air 90°C\n100 g es batu", "steps": "Giling 18 g kopi halus.\nTaruh 100 g es batu di gelas.\nMasukkan kopi ke AeroPress, tuang 100 ml air, aduk 10 detik.\nPasang plunger, lalu tekan perlahan ke atas es selama 30 detik.\nAduk sebentar sampai es mencair sebagian, lalu sajikan.", "needs": ["aeropress", "grinder", "kettle", "scale", "glass"]},
    {"id": "k4", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#2a150a"], "f": "#c9965f", "name": "Kopi Turki", "desc": "Kopi bubuk sangat halus yang dimasak langsung di panci leher sempit, berbusa di atas dan berampas di dasar cangkir.", "ing": "7 g kopi bubuk sangat halus\n100 ml air dingin\n1 sdt gula (opsional)", "steps": "Campur kopi bubuk sangat halus, air dingin, dan gula di dalam cezve.\nPanaskan dengan api kecil sambil diaduk sampai gula larut.\nBiarkan buih naik perlahan tanpa diaduk lagi, angkat sebelum mendidih.\nSendokkan sedikit buih ke cangkir, lalu tuang sisa kopinya pelan-pelan.\nDiamkan sebentar agar ampas mengendap sebelum diminum.", "needs": ["cezve", "grinder", "glass"]},
    {"id": "k5", "base": "kopi", "type": "iced", "sub": "manual", "c": ["#efe2cb", "#3a1f10"], "f": null, "name": "Dalgona Coffee", "desc": "Kopi instan yang dikocok sampai kaku lalu disendokkan di atas susu dingin. Populer lewat video media sosial.", "ing": "2 sdm kopi instan\n2 sdm gula pasir\n2 sdm air panas\n200 ml susu dingin\nEs batu", "steps": "Campur kopi instan, gula, dan air panas dalam mangkuk.\nKocok dengan whisk atau mixer tangan sampai kaku dan warnanya pucat, sekitar 3–5 menit.\nIsi gelas dengan es batu, lalu tuang susu dingin.\nSendokkan busa kopi di atas susu.\nAduk sebelum diminum agar kopi dan susu menyatu.", "needs": ["whisk", "glass"]},
    {"id": "k6", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#6a3d1f"], "f": "#d9b98f", "name": "Chemex Klasik", "desc": "Seduhan bersih lewat kertas filter tebal Chemex. Rasanya ringan, jernih, dan rendah ampas.", "ing": "30 g kopi bubuk sedang-kasar\n500 ml air 94°C", "steps": "Giling 30 g kopi sedang-kasar.\nLipat dan pasang filter Chemex (3 lapis di satu sisi), bilas dengan air panas, buang airnya.\nTuang 60 ml air untuk bloom, tunggu 30–45 detik.\nTuang bertahap melingkar sampai 500 ml dalam beberapa putaran.\nBiarkan menetes habis, sekitar 4 menit sejak awal, lalu lepas filter dan sajikan.", "needs": ["chemex", "grinder", "kettle", "scale", "glass"]},
    {"id": "k7", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#8a5a35"], "f": "#f1e4cf", "name": "Kalita Wave Rata", "desc": "Dasar dripper yang rata dengan tiga lubang kecil membuat ekstraksi lebih merata dibanding dripper berbentuk kerucut.", "ing": "20 g kopi bubuk sedang\n300 ml air 92°C", "steps": "Giling 20 g kopi sedang.\nPasang filter wave, bilas dengan air panas, buang airnya.\nTuang 40 ml air untuk bloom, tunggu 30 detik.\nTuang melingkar bertahap sampai 300 ml, jaga permukaan air tetap rata.\nBiarkan menetes habis (sekitar 3 menit), lalu sajikan.", "needs": ["kalita", "grinder", "kettle", "scale", "glass"]},
    {"id": "k8", "base": "kopi", "type": "iced", "sub": "manual", "c": ["#efe2cb", "#2a150a"], "f": null, "name": "Kopi Vietnam (Cà Phê Sữa Đá)", "desc": "Kopi robusta pekat yang menetes lewat phin logam langsung ke susu kental manis, lalu dituang ke es.", "ing": "15 g kopi bubuk kasar (robusta)\n60 ml air panas\n3 sdm susu kental manis\nEs batu", "steps": "Tuang susu kental manis ke dasar gelas saji.\nPasang phin di atas gelas, masukkan kopi, ratakan, lalu tekan saringan atasnya.\nTuang sedikit air panas untuk membasahi kopi, tunggu 30 detik.\nTuang sisa air panas, biarkan menetes habis (sekitar 4–5 menit).\nAduk kopi dengan susu, lalu tuang ke gelas berisi es batu.", "needs": ["phin", "glass"]},
    {"id": "k9", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#3a1f10"], "f": "#c9965f", "name": "Kopi Siphon", "desc": "Air mendidih naik lewat tabung ke ruang kopi berkat tekanan uap, lalu turun kembali saat api dimatikan. Hasilnya bersih dan aromatik.", "ing": "24 g kopi bubuk sedang\n300 ml air", "steps": "Isi tabung bawah siphon dengan air, pasang pemanas di bawahnya.\nSaat air mulai mendidih dan naik ke tabung atas, masukkan kopi bubuk, aduk pelan.\nBiarkan terendam sekitar 1 menit sambil terus diaduk sesekali.\nMatikan api, kopi akan turun kembali ke tabung bawah lewat filter.\nLepas tabung atas, tuang kopi dari tabung bawah ke gelas.", "needs": ["siphon", "grinder", "scale", "glass"]},
    {"id": "k10", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#4a2c17"], "f": "#d9b98f", "name": "Filter Kaapi (Kopi Saring India)", "desc": "Kopi dan cikori yang diseduh lambat dalam filter logam dua tingkat, lalu dituang bolak-balik antara tumbler dan davarah hingga berbusa.", "ing": "20 g kopi bubuk kasar campur cikori\n150 ml air mendidih\n150 ml susu\n2 sdt gula", "steps": "Masukkan kopi dan cikori ke tabung atas filter, tekan rata dengan pemberat.\nTuang air mendidih sedikit demi sedikit, tutup filter, biarkan menetes 15–20 menit.\nPanaskan susu sampai hampir mendidih, campur dengan gula.\nTuang sedikit dekoksi kopi ke susu manis sesuai selera kepekatan.\nTuang bolak-balik antara tumbler dan davarah dari ketinggian hingga berbusa.", "needs": ["filterindia", "glass"]},
    {"id": "k11", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#3a1f10"], "f": "#c9965f", "name": "Kopi Percolator", "desc": "Air mendidih disirkulasikan berulang lewat bubuk kopi di keranjang logam. Gaya seduh klasik kemah dan dapur rumahan.", "ing": "25 g kopi bubuk kasar\n600 ml air", "steps": "Isi tabung bawah percolator dengan air.\nMasukkan kopi kasar ke keranjang logam, pasang di atas tabung pompa.\nPanaskan di atas kompor sampai air mendidih dan mulai memompa ke atas.\nKecilkan api, biarkan bersirkulasi 7–10 menit sampai warnanya pekat.\nAngkat dari api, diamkan sebentar sebelum dituang.", "needs": ["percolator", "glass"]},
    {"id": "k12", "base": "kopi", "type": "iced", "sub": "manual", "c": ["#c9965f", "#3a1f10"], "f": null, "name": "Cold Drip Kyoto", "desc": "Air dingin menetes sangat perlahan lewat bubuk kopi selama berjam-jam lewat menara kaca bertingkat. Hasilnya jernih, manis, dan rendah asam.", "ing": "40 g kopi bubuk sedang\n350 ml air dingin", "steps": "Giling 40 g kopi sedang.\nIsi tabung air menara cold drip dengan air dingin, pasang di atas ruang kopi.\nAtur tetesan sangat lambat, sekitar 1 tetes per 2–3 detik.\nBiarkan menetes selama 3–4 jam sampai air habis.\nSimpan hasil tetesan di kulkas, sajikan dengan es.", "needs": ["colddrip", "grinder", "scale", "glass"]},
    {"id": "k13", "base": "kopi", "type": "hot", "sub": "manual", "c": ["#2a150a"], "f": "#8a5a35", "name": "Caffè alla Napoletana", "desc": "Panci kopi dua ruang khas Napoli yang dibalik setelah air mendidih, lalu menetes ke ruang bawah lewat gaya gravitasi.", "ing": "20 g kopi bubuk sedang-halus\n300 ml air", "steps": "Isi ruang bawah napoletana dengan air, pasang saringan berisi kopi di atasnya.\nPasang ruang penampung kosong di paling atas, lalu panaskan di atas kompor sampai mendidih.\nAngkat dari api, balik seluruh alat dengan cepat dan hati-hati.\nBiarkan air menetes turun lewat kopi ke ruang penampung selama beberapa menit.\nTuang kopi dari ruang bawah yang sekarang di atas.", "needs": ["napoletana", "glass"]},
    {"id": "c5", "base": "coklat", "gaya": "meksiko", "type": "hot", "c": ["#5e2616"], "f": "#c98a6b", "name": "Coklat Pedas Meksiko", "desc": "Coklat panas dengan sedikit cabai. Hangatnya bertahan lama.", "ing": "40 g coklat batang\n250 ml susu\n1/4 sdt cabai bubuk\n1 sdm gula", "steps": "Hangatkan susu di panci kecil, jangan sampai mendidih.\nMasukkan coklat cincang, cabai, dan gula.\nAduk dengan whisk selama 2 menit hingga kental.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "c6", "base": "coklat", "type": "hot", "c": ["#5e2616"], "f": "#b9805e", "name": "Mocha Hangat", "desc": "Coklat panas dengan sentuhan kopi. Manis, pahit, dan hangat.", "ing": "1 sdt kopi instan\n40 g coklat batang\n250 ml susu", "steps": "Hangatkan susu di panci kecil.\nMasukkan coklat cincang dan kopi instan.\nAduk dengan whisk hingga larut dan mengilap.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "t5", "base": "teh", "type": "hot", "c": ["#c99a6b"], "f": "#efddc2", "name": "Teh Tarik", "desc": "Teh hitam pekat dengan susu kental manis, ditarik hingga berbusa.", "ing": "3 g teh hitam\n200 ml air panas\n3 sdm susu kental manis", "steps": "Seduh teh hitam 4 menit lalu saring.\nCampur susu kental manis.\nTuang bolak-balik antar dua gelas dari ketinggian hingga berbusa.", "needs": ["teapot", "strainer", "glass"], "sub": "seduh"},
    {"id": "m6", "base": "teh", "type": "iced", "c": ["#b9773a", "#f0f2e0", "#7fa04f"], "f": null, "name": "Es Matcha Gula Aren", "desc": "Matcha, susu, dan gula aren. Gurih hijau berpadu manis karamel.", "ing": "2 g matcha\n50 ml air panas\n2 sdm sirup gula aren\n120 ml susu\nEs batu", "steps": "Tuang sirup gula aren ke dasar gelas.\nIsi es batu lalu tuang susu.\nKocok matcha dengan air panas, tuang perlahan di atasnya.", "needs": ["chawan", "chasen", "glass"], "sub": "matcha"},
    {"id": "t6", "base": "teh", "type": "hot", "c": ["#c4742a"], "f": "#efc98a", "name": "Teh Jahe Hangat", "desc": "Teh hitam dengan jahe geprek. Menghangatkan badan saat hujan.", "ing": "3 g teh hitam\n200 ml air panas\n2 ruas jahe geprek\n1 sdm gula", "steps": "Rebus air bersama jahe geprek selama 5 menit.\nMasukkan teh hitam, seduh 3 menit.\nSaring lalu tambahkan gula.", "needs": ["teapot", "kettle", "strainer", "glass"], "sub": "seduh"},
    {"id": "h1", "base": "teh", "sub": "seduh", "gaya": "china", "type": "hot", "c": ["#c98a2b"], "f": "#f0d28a", "name": "Oolong Gong Fu Cha", "desc": "Seduhan singkat berulang di gaiwan. Daun yang sama memberi rasa yang berubah di tiap seduhan.", "ing": "5 g teh oolong\n100 ml air 95°C untuk tiap seduhan", "steps": "Panaskan gaiwan dengan air panas, lalu buang airnya.\nMasukkan oolong, bilas cepat dengan air panas dan buang airnya.\nSeduh 20–30 detik, tuang lewat saringan ke gelas kecil.\nUlangi 4–5 kali, tambah 5–10 detik di tiap seduhan.", "needs": ["gaiwan", "kettle", "strainer", "glass"]},
    {"id": "h2", "base": "teh", "sub": "seduh", "gaya": "china", "type": "hot", "c": ["#e6c04a"], "f": "#f6e6a8", "name": "Teh Krisan (Ju Hua)", "desc": "Seduhan bunga krisan kering yang wangi dan ringan. Biasa dinikmati hangat dengan sedikit gula.", "ing": "6 kuntum bunga krisan kering\n250 ml air 90°C\n1 sdm gula batu atau gula", "steps": "Bilas krisan sebentar dengan air panas.\nMasukkan ke teko dan tuang air 90°C.\nSeduh 4–5 menit, tambahkan gula sesuai selera.\nSaring ke gelas.", "needs": ["teapot", "kettle", "strainer", "glass"]},
    {"id": "h3", "base": "teh", "sub": "seduh", "gaya": "china", "type": "hot", "c": ["#b7814f"], "f": "#efddc2", "name": "Teh Susu Hong Kong", "desc": "Teh hitam pekat yang direbus lalu dicampur susu. Tebal, harum, dan licin di lidah.", "ing": "8 g teh hitam\n300 ml air\n80 ml susu (idealnya susu evaporasi)\n1–2 sdm gula", "steps": "Didihkan air di panci kecil, masukkan teh hitam.\nKecilkan api dan rebus 3–4 menit sampai pekat.\nSaring ke gelas, tambahkan susu dan gula.\nAduk rata dan sajikan panas.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h4", "base": "teh", "sub": "seduh", "gaya": "china", "type": "hot", "c": ["#6b3b1e"], "f": "#d9a86b", "name": "Pu-erh Hangat", "desc": "Teh fermentasi dengan aroma tanah yang dalam dan rasa tebal. Pas setelah makan berat.", "ing": "5 g teh pu-erh\n150 ml air 95°C", "steps": "Bilas pu-erh sekali dengan air panas, buang airnya.\nSeduh 20–30 detik di gaiwan.\nTuang ke gelas.\nSeduh ulang beberapa kali, tiap kali sedikit lebih lama.", "needs": ["gaiwan", "kettle", "glass"]},
    {"id": "h5", "base": "teh", "sub": "seduh", "gaya": "jepang", "type": "hot", "c": ["#a3b85a"], "f": "#e6efd0", "name": "Sencha Panas", "desc": "Teh hijau harian di Jepang. Segar, sedikit sepat, dan manis di akhir bila airnya tidak terlalu panas.", "ing": "4 g sencha\n150 ml air 70–75°C", "steps": "Dinginkan air panas sampai 70–75°C.\nMasukkan sencha ke teko, tuang air.\nSeduh 60–90 detik, jangan lebih lama agar tidak pahit.\nTuang sampai tetes terakhir ke gelas.", "needs": ["teapot", "kettle", "thermo", "glass"]},
    {"id": "h6", "base": "teh", "sub": "seduh", "gaya": "jepang", "type": "hot", "c": ["#c4a24a"], "f": "#f0e2b0", "name": "Genmaicha", "desc": "Teh hijau dicampur beras panggang. Aromanya gurih dan rasanya lebih ringan.", "ing": "4 g genmaicha\n200 ml air 85°C", "steps": "Panaskan air hingga 85°C.\nSeduh genmaicha 1–2 menit.\nSaring dan tuang ke gelas.", "needs": ["teapot", "kettle", "strainer", "glass"]},
    {"id": "h7", "base": "teh", "sub": "seduh", "gaya": "jepang", "type": "hot", "c": ["#9a6a3a"], "f": "#f3e2c8", "name": "Hojicha Latte", "desc": "Teh hijau yang disangrai. Rasa panggang, manis, dan rendah pahit, jadi latte yang lembut.", "ing": "5 g hojicha\n80 ml air 95°C\n150 ml susu\n1 sdt gula (opsional)", "steps": "Seduh hojicha dengan air 95°C selama 3 menit, lalu saring.\nBusakan susu hangat.\nTuang susu ke atas seduhan hojicha.\nTambahkan gula bila perlu.", "needs": ["teapot", "kettle", "strainer", "frother", "glass"]},
    {"id": "h8", "base": "teh", "sub": "seduh", "gaya": "jepang", "type": "iced", "c": ["#f3e2c8", "#9a6a3a"], "name": "Es Hojicha Latte", "desc": "Hojicha pekat dengan susu dingin. Manis sangrai yang segar.", "ing": "5 g hojicha\n80 ml air 95°C\n150 ml susu dingin\n1 sdt gula\nEs batu", "steps": "Seduh hojicha 3 menit, saring, larutkan gula.\nIsi gelas dengan es batu.\nTuang hojicha, lalu susu dingin pelan-pelan.", "needs": ["teapot", "kettle", "strainer", "glass"]},
    {"id": "h9", "base": "teh", "sub": "seduh", "gaya": "jepang", "type": "hot", "c": ["#c28a55"], "f": "#f2dfc2", "name": "Royal Milk Tea", "desc": "Teh hitam yang direbus langsung dalam susu. Versi Jepang dari teh susu: tebal dan manis lembut.", "ing": "3 g teh hitam\n100 ml air\n200 ml susu\n1 sdm gula", "steps": "Didihkan air, masukkan teh hitam dan seduh 1 menit.\nTambahkan susu, panaskan dengan api kecil, jangan sampai mendidih.\nDiamkan 2–3 menit agar rasa teh keluar, tambahkan gula.\nSaring dan sajikan.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h10", "base": "teh", "sub": "seduh", "gaya": "korea", "type": "hot", "c": ["#e8b83a"], "f": "#f6e6a8", "name": "Yuja-cha", "desc": "Selai yuja yang dilarutkan dalam air panas. Asam-manis, wangi jeruk, dan menghangatkan. Bisa diganti selai jeruk mandarin plus sedikit lemon.", "ing": "2 sdm selai yuja (yuja-cheong)\n200 ml air panas", "steps": "Taruh selai yuja di gelas.\nTuang air panas.\nAduk sampai larut. Potongan kulitnya boleh dimakan.", "needs": ["kettle", "glass"]},
    {"id": "h11", "base": "teh", "sub": "seduh", "gaya": "korea", "type": "iced", "c": ["#f6e6a8", "#e8b83a"], "name": "Yuja Ade", "desc": "Selai yuja dengan air soda dan es. Segar dan berkarbonasi.", "ing": "2 sdm selai yuja (yuja-cheong)\n50 ml air panas\n150 ml air soda\nEs batu", "steps": "Larutkan selai yuja dengan air panas.\nIsi gelas dengan es batu.\nTuang larutan yuja, lalu air soda pelan-pelan.\nAduk sekali dengan lembut.", "needs": ["kettle", "glass"]},
    {"id": "h12", "base": "teh", "sub": "seduh", "gaya": "korea", "type": "hot", "c": ["#a8452a"], "f": "#e0a070", "name": "Daechu-cha (Teh Kurma Merah)", "desc": "Rebusan kurma merah kering (jujube). Manis alami, kental, dan harum.", "ing": "8 buah kurma merah kering (jujube)\n500 ml air\n1 sdm madu", "steps": "Cuci dan iris kurma merah.\nRebus bersama air dengan api kecil 30 menit.\nSaring ke gelas.\nTambahkan madu saat sudah suam-suam kuku.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h13", "base": "teh", "sub": "seduh", "gaya": "korea", "type": "hot", "c": ["#d9a441"], "f": "#f0d28a", "name": "Saenggang-cha (Teh Jahe)", "desc": "Jahe iris yang direbus lama. Pedas hangat dan manis dengan madu.", "ing": "20 g jahe iris tipis\n400 ml air\n1 sdm madu", "steps": "Iris jahe tipis.\nRebus dengan air api kecil 20 menit.\nSaring ke gelas.\nTambahkan madu saat sudah suam-suam kuku.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h14", "base": "teh", "sub": "seduh", "gaya": "korea", "type": "iced", "c": ["#b9773a", "#e8d5bf"], "name": "Boricha Dingin (Teh Jelai)", "desc": "Teh jelai panggang yang di Korea sering diminum seperti air putih. Tanpa kafein dan wangi gurih.", "ing": "15 g jelai panggang (boricha)\n1 liter air\nEs batu", "steps": "Rebus air dan jelai 10 menit, atau rendam di kulkas semalaman.\nSaring dan dinginkan.\nTuang ke gelas berisi es batu.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h15", "base": "teh", "sub": "seduh", "gaya": "inggris", "type": "hot", "c": ["#b8793e"], "f": "#efddc2", "name": "Earl Grey Klasik", "desc": "Teh hitam beraroma bergamot. Harum jeruk, enak polos atau dengan sedikit susu.", "ing": "3 g teh Earl Grey\n250 ml air 98°C", "steps": "Didihkan air, tunggu sebentar sampai sekitar 98°C.\nSeduh Earl Grey di teko 3–4 menit.\nSaring ke gelas. Tambahkan susu atau lemon bila suka.", "needs": ["teapot", "kettle", "strainer", "glass"]},
    {"id": "h16", "base": "teh", "sub": "seduh", "gaya": "inggris", "type": "hot", "c": ["#8a5a2a"], "f": "#e6c79a", "name": "Builder's Tea", "desc": "Teh hitam kuat dengan susu dan gula, minuman sehari-hari di Inggris. Pekat dan mengenyangkan.", "ing": "1 kantong atau 3 g teh hitam\n250 ml air mendidih\n40 ml susu\n1 sdt gula", "steps": "Seduh teh hitam dengan air mendidih 2–3 menit.\nAngkat kantong atau saring.\nTambahkan susu dan gula, aduk.", "needs": ["teapot", "kettle", "glass"]},
    {"id": "h17", "base": "teh", "sub": "seduh", "gaya": "inggris", "type": "iced", "c": ["#e9d36b", "#b8793e"], "name": "Es Earl Grey Lemon", "desc": "Earl Grey dingin dengan perasan lemon. Segar dan wangi bergamot.", "ing": "4 g teh Earl Grey\n200 ml air panas\n1 sdm gula\n1/2 buah lemon\nEs batu", "steps": "Seduh Earl Grey pekat 4 menit, tambahkan gula.\nDinginkan sebentar.\nTuang ke gelas berisi es batu dan peras lemon.", "needs": ["teapot", "kettle", "glass"]},
    {"id": "h18", "base": "teh", "sub": "seduh", "gaya": "jepang", "type": "iced", "c": ["#e8d5a0", "#9a6a3a"], "f": null, "name": "Mugicha Dingin", "desc": "Teh jelai panggang ala Jepang yang diminum dingin di musim panas. Tanpa kafein, rasanya gurih ringan.", "ing": "20 g jelai panggang (mugicha)\n1 liter air\nEs batu", "steps": "Rebus jelai panggang dengan air mendidih selama 10 menit.\nSaring dan dinginkan di kulkas.\nTuang ke gelas berisi es batu sebelum disajikan.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h19", "base": "teh", "sub": "seduh", "gaya": "turki", "type": "hot", "c": ["#8a2a1a", "#e0a070"], "f": "#f0d28a", "name": "Çay (Teh Turki)", "desc": "Teh hitam pekat yang diseduh bertingkat dalam dua panci, lalu diencerkan sesuai selera di gelas tulip kecil.", "ing": "2 sdm teh hitam Turki\n500 ml air\nGula batu secukupnya", "steps": "Didihkan air di panci bawah (çaydanlık).\nMasukkan teh hitam ke panci kecil di atasnya, tuang sedikit air mendidih, lalu seduh pekat selama 15 menit di atas uap panci bawah.\nTuang seduhan pekat ke gelas tulip sekitar sepertiga penuh.\nEncerkan dengan air panas dari panci bawah sesuai kepekatan yang disuka.\nSajikan dengan gula batu di sampingnya.", "needs": ["teapot", "saucepan", "glass"]},
    {"id": "h20", "base": "teh", "sub": "seduh", "gaya": "india", "type": "hot", "c": ["#b8793e", "#efddc2"], "f": "#f0d28a", "name": "Masala Chai", "desc": "Teh hitam yang direbus bersama susu dan rempah hangat. Pekat, manis, dan harum rempah.", "ing": "3 g teh hitam\n200 ml air\n150 ml susu\n2 ruas jahe geprek\n2 butir kapulaga geprek\n1 batang kayu manis kecil\n1 sdm gula", "steps": "Rebus air bersama jahe, kapulaga, dan kayu manis selama 5 menit.\nMasukkan teh hitam, seduh 2 menit.\nTuang susu dan gula, panaskan lagi sambil diaduk sampai mendidih pelan.\nSaring ke gelas, sajikan hangat.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "h21", "base": "teh", "sub": "seduh", "gaya": "maroko", "type": "hot", "c": ["#7fa04f", "#cfe3a3"], "f": "#e6efd0", "name": "Teh Mint Maroko", "desc": "Teh hijau gunpowder dan daun mint segar yang dituang dari ketinggian agar berbusa tipis di gelas kecil.", "ing": "2 sdm teh hijau gunpowder\nSegenggam daun mint segar\n500 ml air panas\n2–3 sdm gula", "steps": "Bilas teh gunpowder sebentar dengan sedikit air panas, lalu buang airnya.\nMasukkan teh, daun mint, dan gula ke teko.\nTuang air panas, seduh selama 5 menit.\nTuang dari ketinggian ke gelas kecil agar berbusa tipis di permukaan.", "needs": ["teapot", "kettle", "glass"]},
    {"id": "h22", "base": "teh", "sub": "seduh", "gaya": "taiwan", "type": "iced", "c": ["#c99a6b", "#3a2a1a"], "f": null, "name": "Bubble Milk Tea", "desc": "Teh hitam susu dingin dengan mutiara tapioka kenyal di dasar gelas. Dikocok dulu di shaker agar tercampur rata.", "ing": "4 g teh hitam\n150 ml air panas\n100 ml susu\n2 sdm gula\n4 sdm boba (mutiara tapioka) matang\nEs batu", "steps": "Seduh teh hitam pekat 4 menit, saring, larutkan gula selagi hangat.\nMasukkan boba matang ke dasar gelas saji.\nIsi shaker dengan es, tuang teh dan susu, kocok 15 detik.\nTuang campuran teh susu ke gelas berisi boba.", "needs": ["teapot", "strainer", "shaker", "glass"]},
    {"id": "h23", "base": "teh", "sub": "seduh", "type": "iced", "c": ["#c0203a", "#f0a8b8"], "f": null, "name": "Teh Rosella", "desc": "Seduhan bunga rosella kering yang asam segar dan merah menyala. Tanpa kafein, enak panas maupun dingin.", "ing": "8 kuntum bunga rosella kering\n300 ml air panas\n2 sdm gula\nEs batu", "steps": "Seduh bunga rosella dengan air panas selama 8–10 menit sampai warnanya merah pekat.\nSaring, lalu larutkan gula selagi hangat.\nDinginkan, tuang ke gelas berisi es batu.", "needs": ["teapot", "kettle", "strainer", "glass"]},
    {"id": "h24", "base": "teh", "sub": "seduh", "gaya": "india", "type": "iced", "c": ["#efddc2", "#b8793e"], "f": null, "name": "Es Chai Latte", "desc": "Versi dingin masala chai: rebusan teh rempah pekat yang dikocok dengan es dan susu dingin.", "ing": "3 g teh hitam\n100 ml air\n2 ruas jahe geprek\n2 butir kapulaga geprek\n1 batang kayu manis kecil\n1 sdm gula\n150 ml susu dingin\nEs batu", "steps": "Rebus air bersama jahe, kapulaga, dan kayu manis 5 menit.\nMasukkan teh hitam dan gula, seduh pekat 3 menit, lalu saring dan dinginkan.\nIsi gelas dengan es batu, tuang seduhan chai pekat.\nTuang susu dingin perlahan di atasnya.", "needs": ["saucepan", "strainer", "glass"]},
    {"id": "o1", "base": "coklat", "gaya": "china", "type": "hot", "c": ["#6b3a22"], "f": "#e0b890", "name": "Coklat Jahe Gula Merah", "desc": "Perpaduan modern, bukan resep tradisional: coklat panas dengan jahe dan gula merah ala minuman penghangat China.", "ing": "40 g coklat batang\n250 ml susu\n15 g jahe iris tipis\n1 sdm gula merah", "steps": "Hangatkan susu dan jahe dengan api kecil 5 menit, jangan sampai mendidih.\nSaring jahenya, lalu masukkan coklat cincang dan gula merah.\nAduk dengan whisk sampai larut.", "needs": ["saucepan", "whisk", "strainer", "glass"]},
    {"id": "o2", "base": "coklat", "gaya": "china", "type": "hot", "c": ["#3a2a22"], "f": "#c9b8a8", "name": "Coklat Wijen Hitam", "desc": "Perpaduan modern, bukan resep tradisional: coklat panas dengan wijen hitam yang gurih, terinspirasi minuman wijen hitam China.", "ing": "30 g coklat batang\n250 ml susu\n1 sdm bubuk wijen hitam atau pasta wijen hitam\n1 sdt gula", "steps": "Hangatkan susu di panci kecil.\nMasukkan coklat cincang, wijen hitam, dan gula.\nAduk dengan whisk hingga halus dan kental.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o3", "base": "coklat", "gaya": "jepang", "type": "hot", "c": ["#6a3220"], "f": "#f1dcc8", "name": "Cocoa Panas Jepang", "desc": "Cocoa ala Jepang yang manis dan ringan. Bubuk dilarutkan pekat dulu agar tidak menggumpal.", "ing": "2 sdm bubuk coklat\n2 sdm gula\n40 ml air panas\n200 ml susu", "steps": "Campur bubuk coklat, gula, dan air panas jadi pasta licin.\nHangatkan susu di panci kecil.\nTuang susu ke pasta sambil diaduk.\nBusakan dengan whisk bila suka.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o4", "base": "coklat", "gaya": "jepang", "type": "hot", "c": ["#9dba6a"], "f": "#f1ecd8", "name": "Coklat Putih Matcha", "desc": "Coklat putih yang manis berpadu pahit lembut matcha. Hijau pucat dan creamy.", "ing": "40 g coklat putih\n2 g matcha\n40 ml air panas\n200 ml susu", "steps": "Kocok matcha dengan air panas sampai tidak ada gumpalan.\nHangatkan susu, masukkan coklat putih cincang, aduk sampai larut.\nTuang campuran matcha, aduk rata.", "needs": ["saucepan", "whisk", "strainer", "glass"]},
    {"id": "o5", "base": "coklat", "gaya": "jepang", "type": "hot", "c": ["#7a4a2a"], "f": "#e8c9a0", "name": "Coklat Hojicha", "desc": "Pahit manis coklat bertemu aroma sangrai hojicha. Hangat dan dalam.", "ing": "40 g coklat batang\n5 g hojicha\n80 ml air panas\n170 ml susu", "steps": "Seduh hojicha dengan air panas 3 menit, lalu saring.\nHangatkan susu, masukkan coklat cincang.\nTuang seduhan hojicha, aduk dengan whisk.", "needs": ["saucepan", "whisk", "strainer", "glass"]},
    {"id": "o6", "base": "coklat", "gaya": "korea", "type": "iced", "c": ["#5e2616", "#e8c9ae"], "name": "Es Coklat Dalgona", "desc": "Es coklat susu dengan remah dalgona, permen karamel renyah khas Korea.", "ing": "3 sdm bubuk coklat\n2 sdm gula\n200 ml susu dingin\nEs batu\n2 keping dalgona atau honeycomb toffee", "steps": "Larutkan bubuk coklat dan gula dengan sedikit air panas.\nKocok larutan coklat, susu, dan es di shaker 15 detik, lalu tuang ke gelas.\nRemukkan dalgona di atasnya sesaat sebelum diminum agar tetap renyah.", "needs": ["shaker", "glass"]},
    {"id": "o7", "base": "coklat", "gaya": "korea", "type": "hot", "c": ["#7a3a1c"], "f": "#e8c9a0", "name": "Coklat Yuja Hangat", "desc": "Perpaduan modern: coklat panas dengan selai yuja. Manis coklat bertemu segar jeruk yang harum.", "ing": "40 g coklat batang\n250 ml susu\n1 sdm selai yuja (yuja-cheong)", "steps": "Hangatkan susu, masukkan coklat cincang.\nAduk dengan whisk hingga larut.\nTuang ke gelas, tambahkan selai yuja dan aduk perlahan.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o8", "base": "coklat", "gaya": "inggris", "type": "hot", "c": ["#4a1f10"], "f": "#b9805e", "name": "Coklat Panas Kental Inggris", "desc": "Drinking chocolate yang pekat dan tidak terlalu manis. Lebih mirip puding cair daripada minuman biasa.", "ing": "50 g coklat batang gelap\n200 ml susu\n1 sdt gula\nSejumput garam", "steps": "Hangatkan susu sampai mengepul.\nMasukkan coklat cincang, gula, dan garam, aduk dengan whisk.\nPanaskan dengan api kecil sambil diaduk sampai mengental.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o9", "base": "coklat", "gaya": "inggris", "type": "hot", "c": ["#7a4a2a"], "f": "#f1dcc8", "name": "Coklat Malt Hangat", "desc": "Coklat panas dengan bubuk malt. Rasanya gurih-manis seperti biskuit.", "ing": "2 sdm bubuk coklat\n2 sdm bubuk malt\n1 sdm gula\n250 ml susu", "steps": "Campur bubuk coklat, malt, dan gula.\nHangatkan susu di panci kecil.\nTuang sedikit susu panas ke bubuk, aduk jadi pasta, lalu tuang sisanya.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o10", "base": "coklat", "gaya": "inggris", "type": "hot", "c": ["#6a2d12"], "f": "#e8b98a", "name": "Coklat Jeruk Hangat", "desc": "Coklat dan jeruk adalah pasangan klasik di Inggris. Hangat, manis, dengan wangi kulit jeruk.", "ing": "40 g coklat batang\n250 ml susu\nParutan kulit 1/2 jeruk", "steps": "Hangatkan susu bersama parutan kulit jeruk, jangan sampai mendidih.\nSaring, lalu masukkan coklat cincang.\nAduk dengan whisk hingga larut dan mengilap.", "needs": ["saucepan", "whisk", "strainer", "glass"]},
    {"id": "o11", "base": "coklat", "gaya": "meksiko", "type": "hot", "c": ["#4a2410"], "f": "#b9805e", "name": "Champurrado", "desc": "Coklat panas Meksiko yang dikentalkan dengan tepung jagung hingga seperti puding cair. Mengenyangkan dan menghangatkan.", "ing": "40 g coklat batang\n300 ml susu\n2 sdm tepung maizena\n1 sdm gula\n100 ml air", "steps": "Larutkan tepung maizena dengan 100 ml air, sisihkan.\nHangatkan susu di panci kecil, masukkan coklat cincang dan gula, aduk hingga larut.\nTuang larutan maizena sambil terus diaduk dengan whisk.\nMasak dengan api kecil 3–4 menit sampai mengental, lalu sajikan panas.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o12", "base": "coklat", "gaya": "spanyol", "type": "hot", "c": ["#3a1f10"], "f": "#8a5a35", "name": "Chocolate a la Taza", "desc": "Coklat panas Spanyol yang sangat kental, hampir seperti puding, biasa dicocol dengan churros.", "ing": "60 g coklat batang gelap\n250 ml susu\n1 sdm tepung maizena\n1 sdm gula", "steps": "Larutkan tepung maizena dengan sedikit susu dingin, sisihkan.\nHangatkan sisa susu di panci kecil, masukkan coklat cincang dan gula.\nAduk dengan whisk hingga coklat larut, lalu tuang larutan maizena.\nMasak sambil terus diaduk sampai sangat kental, sekitar 5 menit.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "o13", "base": "coklat", "gaya": "italia", "type": "hot", "c": ["#2a150a"], "f": "#6a3220", "name": "Cioccolata Calda Densa", "desc": "Coklat panas Italia yang pekat seperti coklat leleh, disendok bukan diminum lewat sedotan.", "ing": "80 g coklat batang gelap\n200 ml susu\n1 sdm tepung maizena\n1 sdt gula", "steps": "Larutkan tepung maizena dengan sedikit susu dingin, sisihkan.\nHangatkan sisa susu, masukkan coklat cincang, aduk dengan whisk hingga meleleh.\nTuang larutan maizena, masak dengan api kecil sambil diaduk sampai sangat kental dan mengilap, sekitar 4 menit.\nSajikan hangat, sendokkan bila terlalu pekat untuk diminum.", "needs": ["saucepan", "whisk", "glass"]},
    {"id": "s13","base": "kopi","type": "hot","c": ["#2a150a"],"f": "#c9965f","name": "Ristretto","desc": "Espresso pendek dengan hasil lebih sedikit dan karakter pekat. Cocok untuk biji yang manis dan seimbang.","ing": "18 g kopi bubuk halus\nAir 90–93°C","steps": "Giling kopi halus dan ratakan di portafilter.\nEkstrak dengan tekanan mesin espresso.\nHentikan saat hasil sekitar 18–22 ml, umumnya 20–25 detik.\nSajikan segera dalam cangkir kecil.","needs": ["espresso","grinder","scale","glass"]},
    {"id": "s14","base": "kopi","type": "hot","c": ["#6a3d1f","#f1e4cf"],"f": "#d9b98f","name": "Espresso Macchiato","desc": "Espresso yang diberi sedikit busa susu. Rasa kopi tetap dominan dengan sentuhan creamy.","ing": "1 shot espresso\n30 ml susu segar","steps": "Seduh satu shot espresso ke cangkir kecil.\nPanaskan dan busakan susu hingga 55–60°C dengan tekstur halus.\nLetakkan satu sendok busa susu di tengah espresso.\nSajikan selagi hangat.","needs": ["espresso","frother","glass"]},
    {"id": "s15","base": "kopi","type": "hot","c": ["#4a2c17","#e8d5bf"],"f": "#c9965f","name": "Café Bombón","desc": "Espresso berlapis susu kental manis. Kontras pahit kopi dan manis karamel dari susu kental menjadi ciri utamanya.","ing": "1 shot espresso\n30 ml susu kental manis","steps": "Tuang susu kental manis ke dasar gelas kecil bening.\nSeduh satu shot espresso.\nTuang espresso perlahan di atas susu kental manis agar terbentuk dua lapisan.\nSajikan tanpa diaduk; aduk sebelum diminum.","needs": ["espresso","glass"]},
    {"id": "s16","base": "kopi","type": "iced","c": ["#e8d5bf","#3a1f10"],"name": "Caffè Shakerato","desc": "Espresso dingin yang dikocok bersama es hingga berbusa halus. Segar, ringan, dan tanpa tambahan alkohol.","ing": "2 shot espresso\n1 sdm gula cair\n120 g es batu","steps": "Seduh dua shot espresso.\nLarutkan gula cair ke dalam espresso selagi masih hangat.\nMasukkan espresso dan es ke shaker.\nKocok kuat selama 10–15 detik hingga dingin dan berbusa.\nSaring ke gelas saji dingin tanpa es.","needs": ["espresso","shaker","glass"]},
    {"id": "m7","base": "teh","sub": "matcha","gaya": "jepang","type": "iced","c": ["#d96b70","#f0f2e0","#7fa04f"],"name": "Strawberry Matcha Latte","desc": "Puree stroberi, susu dingin, dan matcha berlapis. Rasa buah yang segar menyeimbangkan umami matcha.","ing": "50 g puree stroberi\n150 ml susu dingin\n2 g matcha\n40 ml air 75–80°C\nEs batu","steps": "Tuang puree stroberi ke dasar gelas.\nTambahkan es batu dan susu dingin secara perlahan.\nAyak matcha ke chawan, lalu kocok dengan air 75–80°C sampai halus.\nTuang matcha perlahan di atas susu.\nAduk sebelum diminum.","needs": ["chawan","chasen","chashaku","strainer","glass"]},
    {"id": "m8","base": "teh","sub": "matcha","gaya": "jepang","type": "bowl","c": ["#618a3b"],"f": "#cfe3a3","name": "Koicha (Matcha Kental)","desc": "Matcha tradisional dengan konsentrasi tinggi dan tekstur kental seperti sirup. Gunakan matcha seremonial berkualitas baik.","ing": "4 g matcha seremonial\n30 ml air 70–75°C","steps": "Ayak matcha ke chawan agar tidak menggumpal.\nTuang sekitar setengah air, lalu aduk perlahan hingga menjadi pasta.\nTambahkan sisa air sedikit demi sedikit.\nUleni dan aduk perlahan dengan chasen sampai licin dan mengilap; jangan membuat busa tebal.\nNikmati dalam tegukan kecil.","needs": ["chawan","chasen","chashaku","strainer","kettle"]},
    {"id": "h25","base": "teh","sub": "seduh","gaya": "china","type": "iced","c": ["#e8d5a0","#cfe3a3"],"name": "Cold Brew Jasmine Tea","desc": "Teh melati yang diekstraksi perlahan dengan air dingin. Aromanya lembut, minim rasa sepat, dan cocok sebagai teh dingin tanpa susu.","ing": "6 g teh melati\n500 ml air dingin 4–8°C\nEs batu","steps": "Masukkan teh melati dan air dingin ke teko atau botol bersih.\nTutup dan simpan di kulkas selama 6–8 jam.\nSaring daun teh, lalu simpan hasil seduhan tetap dingin.\nTuang ke gelas berisi es batu.","needs": ["teapot","strainer","glass"]},
    {"id": "o14","base": "coklat","gaya": "inggris","type": "hot","c": ["#5e2616"],"f": "#c98a6b","name": "Salted Caramel Hot Chocolate","desc": "Cokelat panas yang kaya dengan karamel dan sejumput garam laut. Rasa manis menjadi lebih seimbang dan dalam.","ing": "35 g coklat batang gelap\n250 ml susu\n15 ml sirup karamel\nSejumput garam laut","steps": "Hangatkan susu dengan api kecil hingga 65–70°C; jangan sampai mendidih.\nMasukkan coklat batang yang sudah dicincang.\nAduk dengan whisk sampai larut dan mengilap.\nTambahkan sirup karamel dan sejumput garam laut.\nAduk rata dan sajikan hangat.","needs": ["saucepan","whisk","thermo","glass"]},
    {"id": "o15","base": "coklat","gaya": "inggris","type": "iced","c": ["#4a2410","#e8d5bf"],"name": "Iced Sea Salt Cocoa","desc": "Kakao dingin dengan susu, karamel tipis, dan garam laut. Rasa cokelat tetap dominan dengan akhir yang bersih.","ing": "25 g bubuk coklat tanpa gula\n30 ml air 85–90°C\n180 ml susu dingin\n10 ml sirup karamel\nSejumput garam laut\nEs batu","steps": "Campur bubuk coklat dengan air 85–90°C hingga menjadi pasta halus.\nTambahkan sirup karamel dan garam laut, aduk rata.\nIsi gelas dengan es batu, lalu tuang susu dingin.\nTuang pasta kakao perlahan di atas susu.\nAduk sebelum diminum.","needs": ["saucepan","whisk","glass"]},
    {"id": "o16","base": "coklat","gaya": "lainnya","type": "iced","c": ["#5e2616","#cfe3a3"],"name": "Iced Chocolate Mint","desc": "Cokelat dingin dengan aroma mint yang menyegarkan. Perpaduan rasa kakao dan mint terasa seperti cokelat mint klasik.","ing": "20 g bubuk coklat\n30 ml air 85–90°C\n180 ml susu dingin\n10 ml sirup mint\nEs batu","steps": "Larutkan bubuk coklat dengan air 85–90°C hingga halus.\nTambahkan sirup mint dan aduk.\nIsi shaker dengan susu dingin dan es batu.\nTuang larutan cokelat, kocok selama 10–15 detik.\nTuang ke gelas saji.","needs": ["saucepan","whisk","shaker","glass"]},
    {"id": "o17","base": "coklat","gaya": "asia","type": "hot","c": ["#6b3a22"],"f": "#e0b890","name": "Coconut Cacao Velvet","desc": "Kakao hangat berbasis santan dengan tekstur lembut dan aroma kelapa. Alternatif bebas susu sapi yang tetap kaya rasa.","ing": "25 g bubuk coklat tanpa gula\n220 ml santan cair\n40 ml air panas 85–90°C\n1 sdm gula pasir\nSejumput garam","steps": "Campur bubuk coklat, gula, garam, dan air panas hingga menjadi pasta.\nPanaskan santan dengan api kecil hingga 65–70°C sambil diaduk.\nTuang santan sedikit demi sedikit ke pasta kakao.\nAduk atau whisk sampai halus dan berbusa tipis.\nSajikan hangat.","needs": ["saucepan","whisk","thermo","glass"]}
  ];

  /* Temperatur resep (°C): rentang numerik agar dapat dipakai ulang oleh UI, filter, atau kalkulator. */
  function temperatureFor(m) {
    const text = (m.name + " " + (m.ing || "") + " " + (m.steps || "")).toLowerCase();
    const out = [];
    const add = (stage, min, max, note) => out.push({ stage, min, max, ...(note ? { note } : {}) });
    const isCold = m.type === "iced";
    const hasMilk = /susu|santan|coklat panas klasik/.test((m.ing || "").toLowerCase());
    const explicit = (m.ing + "\n" + m.steps).match(/(\d{2,3})(?:\s?[–-]\s?(\d{2,3}))?\s?°C/i);
    const explicitRange = explicit ? [+explicit[1], +(explicit[2] || explicit[1])] : null;

    if (m.base === "kopi") {
      if (/cold brew|cold drip/.test(text)) add("Air rendam kopi", 4, 8, "Rendam dalam kulkas; jangan gunakan air hangat.");
      else if (/aeropress/.test(text)) add("Air seduh kopi", 85, 90);
      else if (/kopi turki/.test(text)) add("Air di cezve", 90, 95, "Angkat saat buih naik; hindari didihan bergolak.");
      else if (/kopi tubruk|percolator|napoletana|filter kaapi/.test(text)) add("Air seduh kopi", 95, 100);
      else if (/moka pot/.test(text)) add("Air moka pot", 95, 100, "Gunakan api kecil dan hentikan ekstraksi sebelum terdengar mendesis keras.");
      else if (/dalgona coffee/.test(text)) add("Air untuk melarutkan kopi", 85, 95);
      else if (/ristretto/.test(text)) add("Air ekstraksi espresso", 90, 93);
      else if (/espresso|macchiato|bomb[oó]n|shakerato|cappuccino|latte|americano|cortado|piccolo|mocha|flat white/.test(text)) add("Air ekstraksi espresso", 90, 94);
      else if (/hoffmann/.test(text)) add("Air seduh kopi", 96, 100, "Gunakan air baru mendidih sesuai metode yang dicantumkan.");
      else if (explicitRange) add("Air seduh / ekstraksi", explicitRange[0], explicitRange[1]);
      else add("Air seduh kopi", 92, 94);

      if (hasMilk) {
        if (isCold) add("Susu dingin", 2, 5);
        else if (/bomb[oó]n/.test(text)) add("Susu kental manis", 20, 25, "Gunakan suhu ruang; espresso panas akan membentuk lapisan.");
        else if (/macchiato/.test(text)) add("Susu steam", 55, 60, "Buat busa mikro secukupnya; kopi tetap menjadi rasa utama.");
        else add("Susu steam / campuran", 55, 65, "Hentikan sebelum 70°C agar susu tidak terasa terlalu matang.");
      }
    } else if (m.base === "teh" && m.sub === "matcha") {
      if (/matcha kocok shaker/.test(text)) add("Air pelarut matcha", 10, 25, "Gunakan air dingin atau suhu ruang; kocok hingga tidak bergerindil.");
      else if (/koicha/.test(text)) add("Air matcha", 70, 75, "Air lebih sejuk menjaga umami dan mengurangi rasa pahit.");
      else add("Air matcha", 75, 80, "Ayak bubuk dan kocok sampai halus; hindari air mendidih.");
      if (/es teh matcha lemon/.test(text)) add("Air seduh teh hitam", 95, 100);
      if (hasMilk) add(isCold ? "Susu dingin" : "Susu steam", isCold ? 2 : 55, isCold ? 5 : 65);
    } else if (m.base === "teh") {
      let range;
      if (/cold brew jasmine/.test(text)) range = [4, 8];
      else if (explicitRange) range = explicitRange;
      else if (/sencha/.test(text)) range = [70, 75];
      else if (/melati/.test(text)) range = [80, 85];
      else if (/genmaicha/.test(text)) range = [80, 85];
      else if (/gunpowder|mint maroko/.test(text)) range = [85, 90];
      else if (/oolong/.test(text)) range = [90, 95];
      else if (/hojicha/.test(text)) range = [90, 95];
      else if (/krisan|yuja/.test(text)) range = [85, 90];
      else if (/rosella/.test(text)) range = [90, 95];
      else if (/boricha|mugicha/.test(text)) range = [95, 100];
      else if (/kurma merah|daechu|jahe|saenggang/.test(text)) range = [95, 100];
      else range = [95, 100];
      add(/cold brew jasmine/.test(text) ? "Air rendam teh" : "Air seduh / rebusan teh", range[0], range[1], /cold brew jasmine/.test(text) ? "Seduh tertutup di kulkas selama 6–8 jam." : undefined);
      if (/boricha/.test(text)) add("Alternatif rendam dingin", 4, 8, "Bila memakai metode rendam kulkas semalaman.");
      if (/es teh matcha lemon/.test(text)) add("Air untuk matcha", 75, 80);
      if (hasMilk) {
        if (isCold) add("Susu dingin", 2, 5);
        else if (/masala chai|royal milk tea/.test(text)) add("Susu / campuran", 65, 75, "Panaskan perlahan dan jangan biarkan mendidih kuat.");
        else add("Susu / campuran", 55, 65);
      }
    } else if (m.base === "coklat") {
      if (/matcha/.test(text) && /air/.test(text)) add("Air untuk matcha", 75, 80, "Gunakan air lebih sejuk agar matcha tidak terlalu pahit.");
      else if (/hojicha/.test(text) && /air/.test(text)) add("Air seduh hojicha", 90, 95);
      else if (/bubuk coklat|cocoa/.test(text) && /air/.test(text)) add("Air untuk pasta / pelarutan", 85, 90, "Larutkan bubuk menjadi pasta sebelum dicampur cairan utama.");
      if (hasMilk) {
        if (isCold) add("Susu / santan dingin", 2, 5);
        else if (/champurrado|chocolate a la taza|cioccolata calda/.test(text)) add("Susu / campuran cokelat kental", 85, 90, "Aduk terus saat pengental mulai bekerja; jangan biarkan dasar panci gosong.");
        else add("Susu / campuran cokelat", 65, 75, "Jaga api kecil; jangan sampai mendidih agar tekstur tetap halus.");
      }
    }

    if (isCold) add("Suhu penyajian", 2, 6, "Sajikan segera dengan es padat.");
    else if (m.type === "bowl") add("Suhu penyajian", 50, 60, "Hangat, bukan mendidih.");
    else add("Suhu penyajian", 55, 65, "Rentang nyaman untuk diminum; sesuaikan preferensi.");
    return out;
  }
  /* Suhu dihitung malas (sekali per menu) dan di-cache, jadi menu buatan sendiri juga ikut punya data suhu. */
  const TEMP_CACHE = new WeakMap();
  function tempOf(m) {
    if (Array.isArray(m.temperature) && m.temperature.length) return m.temperature;
    let t = TEMP_CACHE.get(m);
    if (!t) { try { t = temperatureFor(m); } catch (e) { t = []; } TEMP_CACHE.set(m, t); }
    return t;
  }
  const fmtRange = t => t.min === t.max ? t.min + "°C" : t.min + "–" + t.max + "°C";
  /* Ringkasan untuk kartu: suhu seduh/olah utama + suhu penyajian. */
  function tempBrief(m) {
    const T = tempOf(m); if (!T.length) return null;
    const serve = T.find(t => t.stage === "Suhu penyajian");
    const main = T.find(t => t !== serve);
    return { main: main && !(m.type === "iced" && /susu/i.test(main.stage)) ? main : null, serve: serve || null, all: T };
  }

  const KSUB = { s1: "espresso", s2: "espresso", s3: "espresso", s6: "espresso", s7: "espresso", s9: "espresso", s10: "espresso", s11: "espresso", s13: "espresso", s14: "espresso", s15: "espresso", s16: "espresso", s4: "v60", s5: "manual", s8: "manual", s12: "manual" };
  SEED.forEach(m => { if (m.base === "kopi" && !m.sub) m.sub = KSUB[m.id] || (/^v\d/.test(m.id) ? "v60" : "manual"); });
  const GAYA = [{ id: "semua", label: "Semua gaya" }, { id: "china", label: "China" }, { id: "jepang", label: "Jepang" }, { id: "korea", label: "Korea" }, { id: "inggris", label: "Inggris" }, { id: "turki", label: "Turki" }, { id: "india", label: "India" }, { id: "maroko", label: "Maroko" }, { id: "taiwan", label: "Taiwan" }, { id: "meksiko", label: "Meksiko" }, { id: "spanyol", label: "Spanyol" }, { id: "italia", label: "Italia" }, { id: "lainnya", label: "Lainnya" }];
  const GAYA_LABEL = { china: "China", jepang: "Jepang", korea: "Korea", inggris: "Inggris", turki: "Turki", india: "India", maroko: "Maroko", taiwan: "Taiwan", meksiko: "Meksiko", spanyol: "Spanyol", italia: "Italia" };
  const GAYA_OLD = { m1: "jepang", m2: "jepang", m3: "jepang", m4: "jepang", m5: "jepang", m6: "jepang", t1: "china", t4: "inggris" };
  SEED.forEach(m => { if (!m.gaya && GAYA_OLD[m.id]) m.gaya = GAYA_OLD[m.id]; });
  /* Sejarah singkat tiap menu bawaan: y = tahun/era, p = asal, t = judul, s = cerita, tl = penanda waktu, f = fakta menarik */
  const HIST = {
    "h1": {"y": "Tradisi lama", "p": "Chaozhou, China", "t": "Seduh dengan keterampilan", "s": "Gong fu cha berarti menyeduh dengan keterampilan. Tradisi ini dikaitkan dengan kawasan Chaozhou di Guangdong dan Fujian: daun teh dalam jumlah banyak diseduh singkat berkali-kali di teko atau gaiwan kecil.", "tl": [], "f": "Daun oolong yang baik bisa diseduh berkali-kali, dan rasanya berubah di tiap seduhan."},
    "h3": {"y": "Abad ke-20", "p": "Hong Kong", "t": "Teh Inggris yang berubah rasa", "s": "Teh susu Hong Kong berkembang dari kebiasaan minum teh ala Inggris di masa kolonial. Tehnya direbus pekat, dicampur susu evaporasi, lalu disaring dengan kantong kain.", "tl": [], "f": "Kantong kain penyaringnya dijuluki stocking, karena warnanya yang cokelat dan bentuknya yang panjang."},
    "h7": {"y": "1920-an", "p": "Kyoto, Jepang", "t": "Teh yang disangrai", "s": "Hojicha dibuat dengan menyangrai daun teh hijau pada suhu tinggi. Prosesnya mengubah warna menjadi cokelat dan membuat rasanya lebih manis serta tidak terlalu pahit. Hojicha diyakini pertama dibuat di Kyoto sekitar 1920-an.", "tl": [], "f": "Aroma sangrai hojicha cocok dengan susu, itu sebabnya latte hojicha mudah disukai."},
    "h10": {"y": "Tradisi lama", "p": "Korea", "t": "Teh dari selai jeruk", "s": "Yuja-cha dibuat dari irisan yuja yang diawetkan dengan gula atau madu (yuja-cheong). Di Korea, minuman ini lazim dinikmati saat cuaca dingin.", "tl": []},
    "h12": {"y": "Tradisi lama", "p": "Korea", "t": "Manis dari kurma merah", "s": "Daechu adalah kurma merah (jujube) dalam bahasa Korea. Rebusannya dikenal sebagai teh herbal dengan manis alami.", "tl": []},
    "h14": {"y": "Tradisi lama", "p": "Korea", "t": "Teh jelai pengganti air putih", "s": "Boricha berarti teh jelai. Di Korea, minuman ini sering disajikan seperti air putih, baik panas maupun dingin, dan tidak mengandung kafein.", "tl": []},
    "h15": {"y": "Abad ke-19", "p": "Inggris", "t": "Teh hitam beraroma bergamot", "s": "Earl Grey adalah teh hitam yang diberi minyak bergamot. Namanya sering dikaitkan dengan Earl Grey ke-2, perdana menteri Inggris pada 1830-an, tetapi asal-usul resepnya masih diperdebatkan.", "tl": []},
    "h16": {"y": "", "p": "Inggris", "t": "Teh kuat untuk sehari-hari", "s": "Builder's tea adalah sebutan di Inggris untuk teh hitam kuat dengan susu dan gula, yang dulu identik dengan para pekerja bangunan.", "tl": []},
    "v2": {"y":"2016","p":"Jepang","t":"Resep juara dunia","s":"Metode 4:6 dikembangkan Tetsu Kasuya, barista Jepang yang menjuarai World Brewers Cup 2016. Idenya sederhana: tuangan awal mengatur rasa manis dan asam, tuangan akhir mengatur kekuatan.","f":"Tuangan awal lebih sedikit membuat seduhan lebih manis, lebih banyak membuatnya lebih asam.","tl":[]},
    "v3": {"y":"Akhir 2010-an","p":"Inggris","t":"Teknik yang viral lewat video","s":"James Hoffmann, barista dan penulis asal Inggris, membagikan tekniknya lewat video 'Ultimate V60' yang kemudian ditiru banyak penyeduh rumahan di seluruh dunia.","f":"Memutar dripper di akhir membantu bubuk kopi di dinding filter turun dan permukaan jadi rata.","tl":[]},
    "v4": {"y":"Era modern","p":"Jepang","t":"Didinginkan sambil diseduh","s":"Kopi es gaya Jepang diseduh langsung di atas es. Karena es ikut mencair, air seduhan dibuat lebih sedikit supaya kopinya tidak encer.","f":"Pendinginan cepat menjaga aroma yang biasanya hilang pada kopi seduh yang didinginkan pelan-pelan.","tl":[]},
    "k1": {"y":"1933","p":"Italia","t":"Panci kopi rumah tangga Italia","s":"Moka pot dipatenkan Alfonso Bialetti pada 1933 dan menjadi alat kopi rumahan paling umum di Italia. Uap bertekanan mendorong air panas naik melewati bubuk kopi.","f":"Bentuk segi delapan khas moka pot membantu panas menyebar rata ke seluruh badan pot.","tl":[]},
    "s10": {"y":"2010-an","p":"Kafe Asia","t":"Lapisan yang sengaja dibiarkan","s":"Dirty latte dikenal lewat kafe-kafe di Asia yang menuang espresso panas ke susu dingin. Panas dan dinginnya bertemu, sehingga tampak berlapis dan teksturnya lebih creamy. Asal pastinya belum jelas.","f":"Jangan diaduk dulu: tegukan pertama terasa kopi pekat, lalu perlahan menyatu dengan susu.","tl":[]},
    "s11": {"y":"1980-an","p":"Australia dan Selandia Baru","t":"Dua negara, satu klaim","s":"Flat white sering dikaitkan dengan kafe di Australia dan Selandia Baru pada 1980-an. Keduanya sama-sama mengklaim sebagai asalnya. Ciri khasnya adalah susu steam halus dengan busa yang tipis.","f":"Dibanding cappuccino, flat white hampir tanpa busa tebal, jadi rasa kopinya lebih menonjol.","tl":[]},
    "s12": {"y":"2005","p":"Amerika Serikat","t":"Dari penemu lempar cakram","s":"Aeropress diciptakan Alan Adler, insinyur yang juga membuat Aerobie, cakram lempar. Alat ini diluncurkan pada 2005 dan cepat disukai karena ringkas, murah, dan sulit gagal.","f":"Ada kejuaraan dunia Aeropress setiap tahun, dan resep pemenangnya sering berbeda-beda.","tl":[]},
    "s6": {"y":"1940-an","p":"Italia dan Amerika","t":"Espresso yang dibuat ramah","s":"Cerita populer menyebut tentara Amerika di Italia mengencerkan espresso dengan air panas agar mirip kopi saring dari kampung halaman. Dari situ muncul nama americano.","f":"Karena dasarnya espresso, rasanya tetap lebih pekat daripada kopi saring biasa.","tl":[]},
    "s7": {"y":"1900-an","p":"Wina dan Italia","t":"Warna jubah biarawan","s":"Namanya sering dikaitkan dengan warna jubah biarawan Kapusin, coklat kemerahan seperti campuran kopi dan susu. Versi berbasis espresso menyebar luas setelah mesin espresso masuk ke kafe-kafe Italia.","f":"Cappuccino klasik dibagi kira-kira sepertiga espresso, sepertiga susu, dan sepertiga busa.","tl":[]},
    "s8": {"y":"Era kolonial hingga kini","p":"Jawa, Indonesia","t":"Kopi rakyat di tengah sistem tanam paksa","s":"Tubruk berarti bertabrakan: bubuk kopi langsung bertemu air panas tanpa disaring. Pada masa cultuurstelsel (1830–1870), petani Jawa diwajibkan menanam kopi untuk disetor ke pemerintah kolonial Belanda, dan biji-biji terbaik hampir selalu dikirim untuk diekspor. Rakyat kebanyakan hanya kebagian biji sisa atau kualitas rendah, lalu menyeduhnya dengan cara paling sederhana yang tidak butuh alat saring apa pun. Sebagian orang memaknai kesederhanaan ini sebagai simbol rakyat tetap mempertahankan cara minum kopinya sendiri di tengah sistem ekonomi kolonial yang eksploitatif, meski ini lebih merupakan pemaknaan budaya yang berkembang belakangan daripada catatan sejarah yang tercatat resmi.","f":"Setelah ampas turun, jangan diaduk lagi supaya kopi tidak terasa pahit berpasir.","tl":[["1830–1870","Cultuurstelsel mewajibkan petani Jawa menanam kopi untuk ekspor, sementara biji terbaik jarang dinikmati rakyat sendiri."],["Turun-temurun","Kopi tubruk bertahan sebagai cara seduh rumahan paling sederhana dan murah."],["Kini","Tetap jadi minuman sehari-hari di warung dan rumah-rumah di Indonesia."]]},
    "s9": {"y":"Sekitar 2007","p":"Swedia","t":"Segar dari dapur barista","s":"Espresso tonic sering dikaitkan dengan sebuah kedai kopi di Swedia pada pertengahan 2000-an, lalu menyebar ke kafe di banyak negara sebagai minuman musim panas.","f":"Tonik membuat espresso terasa lebih cerah, dengan sedikit pahit dan sedikit manis.","tl":[]},
    "c5": {"y":"Sebelum 1500","p":"Mesoamerika","t":"Coklat dengan gigitan","s":"Suku Maya dan Aztek meminum coklat dengan cabai dan rempah, jauh sebelum gula masuk ke resepnya. Tradisi itu masih hidup dalam coklat panas ala Meksiko.","f":"Rasa pedas cabai terasa di tenggorokan, jadi hangatnya bertahan lama.","tl":[]},
    "c6": {"y":"1800-an","p":"Yaman dan Eropa","t":"Dari pelabuhan kopi","s":"Nama mocha berasal dari pelabuhan Mokha di Yaman, pusat perdagangan kopi pada masa lalu. Dari sana, kata ini melekat pada kopi beraroma coklat, lalu pada campuran kopi dan coklat.","f":"Awalnya mocha adalah nama jenis kopi, belum berarti campuran dengan coklat.","tl":[]},
    "t5": {"y":"1900-an","p":"Malaysia","t":"Ditarik sampai berbusa","s":"Teh tarik populer lewat warung-warung pedagang keturunan India di Malaysia. Menuang bolak-balik antara dua wadah mendinginkan teh sekaligus membuat busanya.","f":"Tarik berarti menarik: tinggi tuangannya jadi pertunjukan tersendiri.","tl":[]},
    "m6": {"y":"2010-an","p":"Indonesia","t":"Gula aren bertemu matcha","s":"Setelah kopi susu gula aren ramai, kedai-kedai mencoba pemanis yang sama pada matcha. Rasa karamel gula aren menyeimbangkan pahit dan gurih matcha.","f":"Tuang matcha terakhir agar lapisan hijau, putih, dan coklatnya terlihat jelas.","tl":[]},
    "t6": {"y":"Turun-temurun","p":"Nusantara","t":"Hangat untuk hujan","s":"Jahe sudah lama dipakai sebagai penghangat badan di Indonesia, dari wedang sampai bandrek. Menambahkannya ke teh hitam membuat minuman sederhana ini terasa lebih hangat.","f":"Geprek jahe dulu agar sarinya keluar lebih banyak ke dalam air.","tl":[]},
    "s1": {
      "y": "1901",
      "p": "Milan, Italia",
      "t": "Kopi dalam hitungan detik",
      "s": "Di awal abad ke-20, kafe Italia butuh cara menyajikan kopi lebih cepat daripada seduhan biasa. Mesin bertekanan menjawabnya: satu cangkir dibuat khusus untuk satu pelanggan. Nama espresso sering dijelaskan sebagai “diperas keluar” atau “dibuat khusus saat dipesan”.",
      "tl": [
        [
          "1901",
          "Luigi Bezzera mematenkan mesin espresso di Milan."
        ],
        [
          "1905",
          "Desiderio Pavoni membeli patennya dan mulai memproduksinya."
        ],
        [
          "1948",
          "Achille Gaggia memperkenalkan mesin bertuas yang menghasilkan crema."
        ]
      ],
      "f": "Satu shot espresso hanya sekitar 30 ml, tetapi diseduh dengan tekanan sekitar 9 bar, kira-kira sembilan kali tekanan udara di sekitar kita."
    },
    "s2": {
      "y": "1950-an",
      "p": "Italia dan California",
      "t": "Sarapan Italia yang naik kelas",
      "s": "Di rumah-rumah Italia, kopi dicampur susu hangat sudah lama jadi sarapan. Versi kafe dengan espresso dan susu steam sering dikaitkan dengan kafe di Berkeley, California, pada 1950-an. Setelahnya, budaya kedai kopi Seattle membuatnya dikenal ke banyak negara.",
      "tl": [
        [
          "1867",
          "Istilah “caffè latte” tercatat dalam bahasa Inggris."
        ],
        [
          "1950-an",
          "Kafe di Berkeley mempopulerkan latte berbasis espresso."
        ],
        [
          "1980–90-an",
          "Gerai kopi besar menjadikannya menu andalan."
        ]
      ],
      "f": "Di Italia, memesan “latte” saja akan membuatmu menerima segelas susu. Sebut lengkap: caffè latte."
    },
    "s3": {
      "y": "2010-an",
      "p": "Indonesia",
      "t": "Kopi susu khas anak kota",
      "s": "Kopi susu bukan hal baru di warung Indonesia, tetapi kombinasi espresso, susu segar, dan gula aren yang disajikan dingin menjadi tren sejak pertengahan 2010-an. Banyak yang mengaitkan ledakannya dengan kedai kopi di Jakarta yang menjual kopi susu dalam gelas bawa pulang.",
      "tl": [
        [
          "Turun-temurun",
          "Gula aren sudah lama menjadi pemanis di dapur Nusantara."
        ],
        [
          "Sekitar 2015",
          "Kedai kopi kekinian mempopulerkan kopi susu gula aren."
        ],
        [
          "Kini",
          "Hampir setiap kedai punya versinya sendiri."
        ]
      ],
      "f": "Gula aren dibuat dengan merebus nira, cairan manis yang disadap dari tandan bunga pohon aren."
    },
    "s4": {
      "y": "1908",
      "p": "Dresden, Jerman",
      "t": "Dari kertas buku tulis sampai dripper kerucut",
      "s": "Melitta Bentz, ibu rumah tangga di Dresden, kesal pada kopi yang pahit dan berampas. Ia melubangi wadah kuningan, melapisinya dengan kertas isap dari buku tulis anaknya, dan lahirlah filter kopi kertas. Seabad kemudian, dripper V60 dari Jepang membuat seduhan manual jadi gaya hidup.",
      "tl": [
        [
          "1908",
          "Melitta Bentz mematenkan filter kopi kertas."
        ],
        [
          "Sekitar 2004",
          "Hario meluncurkan dripper V60 di Jepang."
        ],
        [
          "2010-an",
          "V60 menjadi alat wajib barista dan penyeduh rumahan."
        ]
      ],
      "f": "Angka 60 pada V60 merujuk pada sudut kerucutnya, yaitu 60 derajat. Huruf V berasal dari bentuknya."
    },
    "s5": {
      "y": "1960-an",
      "p": "Jepang dan Amerika Serikat",
      "t": "Sabar demi rasa yang halus",
      "s": "Merendam kopi dalam air dingin berjam-jam sudah dikenal lama, antara lain di Jepang lewat kopi tetes dingin gaya Kyoto. Cold brew rendam seperti ini memasyarakat di Amerika lewat alat Toddy pada 1960-an, lalu menjadi minuman botolan populer di 2010-an.",
      "tl": [
        [
          "Kyoto",
          "Kopi tetes dingin diseduh dengan air es yang menetes perlahan."
        ],
        [
          "1964",
          "Todd Simpson memperkenalkan sistem Toddy untuk rendaman dingin."
        ],
        [
          "2010-an",
          "Cold brew botolan masuk ke kafe dan toko swalayan."
        ]
      ],
      "f": "Air dingin mengekstrak lebih sedikit senyawa asam dan pahit, itu sebabnya rasanya halus. Harganya: waktu 12–16 jam."
    },
    "c1": {
      "y": "1500-an",
      "p": "Mesoamerika dan Spanyol",
      "t": "Minuman para dewa, sebelum jadi manis",
      "s": "Suku Maya dan Aztek meminum coklat dalam keadaan dingin, pahit, dan berbusa, kadang dengan cabai dan vanili. Setelah Spanyol menaklukkan Meksiko, coklat dibawa ke Eropa, dicampur gula, lalu dipanaskan, dan menjadi minuman kaum bangsawan.",
      "tl": [
        [
          "Sebelum 1500",
          "Bangsa Aztek memakai biji kakao sebagai alat tukar."
        ],
        [
          "1500-an",
          "Spanyol membawa kakao ke Eropa dan mulai menambahkan gula."
        ],
        [
          "Pertengahan 1600-an",
          "Rumah coklat bermunculan di London."
        ]
      ],
      "f": "Nama ilmiah pohon kakao, Theobroma cacao, berarti “makanan para dewa”."
    },
    "c2": {
      "y": "1800-an",
      "p": "Prancis",
      "t": "Permen dari tanaman rawa",
      "s": "Nama marshmallow berasal dari tanaman marsh mallow yang tumbuh di tepi rawa. Getah akarnya sejak zaman kuno diolah dengan madu menjadi permen dan obat sakit tenggorokan. Pembuat permen Prancis kemudian menjadikannya sajian lembut yang kini dibuat dari gula dan gelatin.",
      "tl": [
        [
          "Zaman kuno",
          "Getah akar marsh mallow dipakai sebagai obat dan permen."
        ],
        [
          "1800-an",
          "Pembuat permen Prancis mengolahnya menjadi guimauve."
        ],
        [
          "1948",
          "Proses ekstrusi Alex Doumak memungkinkan produksi massal."
        ]
      ],
      "f": "Marshmallow modern hampir tidak mengandung bagian dari tanaman marsh mallow, yang jadi asal namanya."
    },
    "c3": {
      "y": "1828",
      "p": "Amsterdam, Belanda",
      "t": "Bubuk yang gampang larut",
      "s": "Sebelum 1828, coklat sulit dilarutkan karena kaya lemak kakao. Coenraad van Houten dari Belanda menemukan pengepres yang memisahkan lemak dari bubuk kakao, lalu mengolahnya dengan alkali agar lebih lembut dan mudah larut. Dari sinilah bubuk coklat praktis seperti yang kamu pakai berasal.",
      "tl": [
        [
          "1828",
          "Van Houten mematenkan pengepres kakao di Amsterdam."
        ],
        [
          "1847",
          "Fry’s di Inggris memasarkan coklat batang padat."
        ],
        [
          "Kini",
          "Bubuk coklat menjadi dasar minuman coklat dingin."
        ]
      ],
      "f": "Pengolahan dengan alkali itu sampai sekarang disebut “Dutch process”, mengikuti asal penemunya."
    },
    "c4": {
      "y": "Era kolonial",
      "p": "Meksiko",
      "t": "Busa itu seni tersendiri",
      "s": "Bagi Maya dan Aztek, busa tebal adalah bagian terbaik dari minuman coklat. Mereka menuang coklat dari ketinggian bolak-balik antar wadah untuk mendapatkannya. Di Meksiko masa kolonial dikenal molinillo, pengocok kayu berukir yang diputar di antara kedua telapak tangan.",
      "tl": [
        [
          "Mesoamerika",
          "Coklat dituang dari ketinggian agar berbusa."
        ],
        [
          "Era kolonial",
          "Molinillo dikenal di Meksiko dan Spanyol."
        ],
        [
          "Kini",
          "Frother tangan atau listrik menggantikan putaran telapak tangan."
        ]
      ],
      "f": "Molinillo biasanya diukir dari satu potong kayu, dengan cincin kayu longgar di ujungnya."
    },
    "m1": {
      "y": "1191",
      "p": "China ke Jepang",
      "t": "Bubuk hijau dari seberang laut",
      "s": "Biksu Eisai pulang dari China pada 1191 dengan membawa benih teh dan cara meminum teh bubuk. Seiring waktu, teh bubuk menjadi pusat upacara minum teh Jepang. Usucha, yang berarti “teh encer”, adalah sajian paling umum di sana, sedangkan versi pekatnya disebut koicha.",
      "tl": [
        [
          "1191",
          "Eisai membawa benih teh dan tradisi teh bubuk dari China."
        ],
        [
          "1211",
          "Eisai menulis buku tentang kesehatan lewat teh, Kissa Yōjōki."
        ],
        [
          "Abad ke-16",
          "Sen no Rikyū menyempurnakan upacara minum teh."
        ]
      ],
      "f": "Mengocok membentuk huruf M atau W membantu memecah gumpalan dan menghasilkan busa yang halus."
    },
    "m2": {
      "y": "Era modern",
      "p": "Jepang dan kafe dunia",
      "t": "Tradisi yang diajak ke kafe",
      "s": "Di Jepang, matcha lama diminum murni dengan air saja. Menambahkan susu hangat adalah adaptasi kafe modern, yang menyebar ke banyak negara bersama naiknya minat pada matcha sejak sekitar 2000-an.",
      "tl": [
        [
          "Tradisional",
          "Matcha diminum murni, tanpa susu."
        ],
        [
          "Sekitar 2000-an",
          "Kafe di Jepang dan Barat menawarkan matcha latte."
        ]
      ],
      "f": "Daun matcha dinaungi selama beberapa pekan sebelum dipanen, sehingga hijaunya pekat dan rasa gurihnya (umami) kuat."
    },
    "m3": {
      "y": "2010-an",
      "p": "Kafe dan media sosial",
      "t": "Hijau yang mendunia",
      "s": "Matcha dingin dengan susu naik daun bersama tren gaya hidup sehat dan media sosial di 2010-an. Warna hijaunya enak difoto, dan rasanya lebih bersahabat bagi yang belum terbiasa dengan pahit teh hijau.",
      "tl": [
        [
          "Awalnya",
          "Matcha identik dengan upacara teh dan minuman panas."
        ],
        [
          "2010-an",
          "Versi dingin dengan susu dan es menjamur di kafe."
        ]
      ],
      "f": "Matcha tidak benar-benar larut dalam air. Partikelnya melayang, jadi harus dikocok atau diaduk sebelum diminum."
    },
    "m4": {
      "y": "Modern",
      "p": "Dapur rumahan",
      "t": "Akal-akalan tanpa chasen",
      "s": "Tidak ada catatan resmi untuk resep ini. Ia lahir dari kebutuhan praktis: tidak semua orang punya chasen, jadi penyeduh rumahan memakai shaker untuk melarutkan matcha bersama es dan susu.",
      "tl": [
        [
          "Dulu",
          "Matcha dikocok dengan chasen bambu."
        ],
        [
          "Kini",
          "Shaker dan botol kocok menggantikannya di rumah."
        ]
      ],
      "f": "Mengayak matcha sebelum dikocok adalah langkah kecil yang paling menentukan tekstur akhirnya."
    },
    "m5": {
      "y": "Modern",
      "p": "Fusion kafe",
      "t": "Dua teh dalam satu gelas",
      "s": "Resep ini perpaduan dua dunia: es teh lemon, pasangan klasik di banyak negara, dengan lapisan matcha di atasnya ala minuman berlapis kafe masa kini. Tidak ada asal-usul tunggal yang tercatat.",
      "tl": [
        [
          "Klasik",
          "Teh hitam dingin dengan lemon sudah lama dikenal."
        ],
        [
          "Kini",
          "Lapisan matcha membuat gelas berlapis dan rasanya lebih berlapis juga."
        ]
      ],
      "f": "Lapisan terbentuk karena perbedaan kepadatan cairan. Yang lebih manis dan padat tinggal di bawah, yang ringan mengambang di atas."
    },
    "t1": {
      "y": "Dinasti Song",
      "p": "Fujian, China",
      "t": "Teh yang menginap bersama bunga",
      "s": "Pembuat teh di Fujian menyimpan daun teh hijau bersama bunga melati segar semalaman. Daun menyerap wanginya, bunga disaring, lalu daun dikeringkan lagi. Proses itu bisa diulang beberapa kali agar aromanya lebih kuat, dan dari sanalah teh melati menyebar sampai ke Indonesia.",
      "tl": [
        [
          "Dinasti Song",
          "Teh beraroma bunga mulai dibuat di China."
        ],
        [
          "Dinasti Qing",
          "Teh melati makin populer dan diekspor."
        ],
        [
          "1969",
          "Teh Botol Sosro membawa teh melati kemasan botol ke Indonesia."
        ]
      ],
      "f": "Kuncup melati dipetik sore hari lalu mekar malam hari bersama daun teh, saat wanginya paling kuat."
    },
    "t2": {
      "y": "1879",
      "p": "Amerika Serikat",
      "t": "Segar sejak sebelum ada kulkas",
      "s": "Resep teh dingin sudah tercatat dalam buku masak Amerika pada 1879, lama sebelum kulkas rumahan ada. Popularitasnya sering dikaitkan dengan Pameran Dunia St. Louis pada 1904, walau resepnya jauh lebih tua. Lemon menjadi pasangan klasik karena asamnya menyegarkan.",
      "tl": [
        [
          "1879",
          "Buku masak Housekeeping in Old Virginia memuat resep teh dingin."
        ],
        [
          "1904",
          "Pameran Dunia St. Louis sering disebut awal ledakan popularitasnya."
        ],
        [
          "Kini",
          "Es teh jadi minuman harian di banyak negara, termasuk Indonesia."
        ]
      ],
      "f": "Di Indonesia, “es teh” hampir selalu manis. Kalau mau tanpa gula, harus bilang “tawar”."
    },
    "t3": {
      "y": "Abad ke-20",
      "p": "Thailand",
      "t": "Oranye yang mudah dikenali",
      "s": "Cha yen, begitu orang Thailand menyebutnya, dibuat dari teh hitam pekat yang diberi susu kental manis. Warna oranyenya yang terang umumnya berasal dari pewarna makanan atau campuran dalam teh. Minuman jajanan ini mendunia lewat restoran Thailand di luar negeri.",
      "tl": [
        [
          "Abad ke-20",
          "Teh pekat, susu kental manis, dan es jadi jajanan khas Thailand."
        ],
        [
          "Kini",
          "Menu populer di restoran Thailand dan kedai boba dunia."
        ]
      ],
      "f": "Susu cair yang dituang terakhir membentuk gradasi oranye dan putih, ciri yang membuat Thai tea mudah dikenali."
    },
    "t4": {
      "y": "1600-an",
      "p": "Inggris",
      "t": "Teh yang dilembutkan susu",
      "s": "Teh tiba di Inggris pada pertengahan 1600-an dan segera dipadukan dengan susu dan gula. Susu melembutkan rasa sepat teh hitam pekat. Ada cerita bahwa susu juga melindungi cangkir porselen dari retak, tetapi itu lebih mirip legenda.",
      "tl": [
        [
          "1662",
          "Catherine of Braganza menikah dengan Raja Charles II dan memopulerkan teh di istana."
        ],
        [
          "1700-an",
          "Teh bersusu menyebar ke berbagai kalangan."
        ],
        [
          "Kini",
          "Tiap negara punya versinya: milk tea, teh tarik, chai."
        ]
      ],
      "f": "Di Inggris, perdebatan “susu dulu atau teh dulu” sudah berlangsung berabad-abad dan masih jadi bahan candaan."
    },
    "k4": {"y": "Abad ke-15 (catatan tertua)", "p": "Turki", "t": "Diseduh, bukan disaring", "s": "Kopi Turki dimasak langsung bersama bubuk yang sangat halus hingga berbusa, tanpa disaring. Caranya menyebar dari Kesultanan Utsmaniyah ke Timur Tengah, Balkan, dan Eropa, dan sekarang diakui UNESCO sebagai warisan budaya takbenda.", "f": "Ampas yang mengendap di dasar cangkir kadang dibaca sebagai ramalan, tradisi yang disebut tasseography.", "tl": []},
    "k5": {"y": "2020", "p": "Lewat tren Makau dan Korea Selatan", "t": "Viral lewat video pendek", "s": "Kopi kocok ala Makau sudah lama ada, tetapi namanya meledak sebagai 'dalgona coffee' pada awal 2020 setelah seorang aktor Korea membandingkan buihnya dengan permen dalgona di acara televisi, lalu videonya menyebar luas di media sosial.", "f": "Buihnya bisa bertahan mengambang di atas susu selama beberapa menit sebelum perlahan tenggelam.", "tl": []},
    "h18": {"y": "Zaman Edo", "p": "Jepang", "t": "Teh musim panas tanpa kafein", "s": "Mugicha dibuat dari jelai yang disangrai lalu direbus. Karena tidak mengandung daun teh, minuman ini bebas kafein dan jadi minuman penyegar musim panas yang umum di rumah tangga Jepang.", "f": "Mugicha sering diseduh dalam jumlah besar lalu disimpan dingin di kulkas sepanjang musim panas.", "tl": []},
    "h19": {"y": "Abad ke-20", "p": "Turki", "t": "Diminum sepanjang hari", "s": "Setelah kopi menjadi mahal pada masa Perang Dunia I, teh yang ditanam di kawasan Laut Hitam berkembang jadi minuman sehari-hari di Turki. Diseduh bertingkat di çaydanlık, lalu diencerkan sesuai selera masing-masing.", "f": "Gelas tulip kecil dipilih supaya teh tetap panas tapi cepat habis dan gampang dituang ulang.", "tl": []},
    "h20": {"y": "Tradisi lama", "p": "India", "t": "Rempah dan teh dalam satu gelas", "s": "Masala berarti campuran rempah. Chai dengan rempah sudah lama diminum di India, lalu berkembang memakai daun teh hitam setelah perkebunan teh dibuka di masa kolonial Inggris, menghasilkan minuman manis dan hangat yang dijual pedagang di pinggir jalan.", "f": "Campuran rempahnya tidak baku, tiap keluarga dan pedagang chai biasanya punya takaran sendiri.", "tl": []},
    "h21": {"y": "Abad ke-19", "p": "Maroko", "t": "Dituang dari ketinggian", "s": "Teh hijau masuk ke Maroko lewat jalur dagang dengan Inggris, lalu dipadukan dengan mint segar yang tumbuh subur di sana. Menuangnya dari ketinggian membantu teh berbusa tipis dan menjadi bagian dari keramahan menyambut tamu.", "f": "Di Maroko, teh ini biasa disebut 'teh Sahara' dan dianggap simbol keramahtamahan tuan rumah.", "tl": []},
    "h22": {"y": "1980-an", "p": "Taichung, Taiwan", "t": "Dari iseng di kedai teh", "s": "Bubble tea diyakini lahir di sebuah kedai teh di Taichung, saat mutiara tapioka yang biasa jadi camilan dicoba dimasukkan ke teh susu dingin. Kombinasi tekstur kenyal dan teh dingin ini lalu menyebar ke seluruh dunia.", "f": "Sedotan besar yang dipakai untuk bubble tea sengaja dibuat lebar agar mutiaranya bisa lewat.", "tl": []},
    "h23": {"y": "Tradisi lama", "p": "Afrika Barat dan dunia tropis", "t": "Merah dari kelopak bunga", "s": "Seduhan rosella dibuat dari kelopak bunga rosella kering, dikenal luas di Afrika Barat, Mesir (dikenal sebagai karkade), hingga Asia Tenggara. Warna merahnya berasal dari antosianin pada kelopaknya.", "f": "Semakin lama diseduh, warna dan rasa asamnya semakin pekat.", "tl": []},
    "h24": {"y": "2000-an", "p": "Kedai kopi global", "t": "Chai yang disesuaikan selera dunia", "s": "Saat masala chai populer di luar India lewat kedai-kedai kopi internasional, versi dinginnya dibuat agar cocok diminum di cuaca panas, dengan rempah yang sering disesuaikan jadi lebih ringan dari versi aslinya.", "f": "Chai latte di kedai kopi sering dibuat dari sirup konsentrat, berbeda dari masala chai rumahan yang direbus langsung dengan rempah segar.", "tl": []},
    "k6": {"y": "1941", "p": "Jerman dan Amerika Serikat", "t": "Dirancang seorang ahli kimia", "s": "Chemex diciptakan Peter Schlumbohm, ahli kimia asal Jerman yang pindah ke Amerika Serikat. Bentuknya terinspirasi labu laboratorium, dan desainnya bahkan masuk koleksi museum seni modern.", "f": "Filter Chemex lebih tebal daripada filter dripper biasa, sehingga menyaring lebih banyak minyak kopi dan hasilnya terasa lebih ringan.", "tl": []},
    "k7": {"y": "1950-an, populer lagi 2000-an", "p": "Jepang", "t": "Dasar rata untuk hasil merata", "s": "Kalita, perusahaan asal Jepang, merancang dripper dasar rata dengan tiga lubang kecil agar air tidak langsung mengucur seperti pada dripper berlubang satu, sehingga ekstraksi kopi lebih merata di seluruh bubuk.", "f": "Karena aliran air lebih lambat dan terkendali, Kalita Wave disebut lebih memaafkan kesalahan teknik tuang dibanding dripper kerucut.", "tl": []},
    "k8": {"y": "Masa kolonial Prancis", "p": "Vietnam", "t": "Susu kental menggantikan susu segar", "s": "Karena susu segar sulit didapat di Vietnam pada masa kolonial, susu kental manis dipakai sebagai gantinya untuk melembutkan kopi robusta yang pekat dan pahit dari phin logam.", "f": "Dituang ke atas es, lapisan kopi pekat dan susu kental awalnya terpisah sebelum diaduk saat diminum.", "tl": []},
    "k9": {"y": "Awal 1800-an", "p": "Eropa (Jerman dan Prancis)", "t": "Kopi yang dipertontonkan", "s": "Alat siphon awalnya dikembangkan di Eropa pada awal abad ke-19, memakai prinsip tekanan uap untuk mendorong air naik dan turun. Prosesnya yang dramatis membuatnya sering disebut sebagai 'teater kopi'.", "f": "Siphon dipopulerkan kembali oleh kedai-kedai kopi Jepang pada abad ke-20 yang menyukai ketepatan dan tampilannya yang unik.", "tl": []},
    "o11": {"y": "Pra-Kolumbus, berkembang era kolonial", "p": "Meksiko", "t": "Minuman jagung dan coklat", "s": "Champurrado memadukan dua bahan pokok Mesoamerika, jagung dan coklat, jadi minuman kental yang mengenyangkan. Minuman ini biasa disajikan hangat saat pagi atau malam yang dingin, sering bersama tamale.", "f": "Di Meksiko, champurrado tradisional diaduk dengan molinillo, pengocok kayu berukir, agar berbusa.", "tl": []},
    "o12": {"y": "Abad ke-16", "p": "Spanyol", "t": "Coklat Dunia Baru ala Eropa", "s": "Setelah coklat dibawa dari Mesoamerika ke Spanyol, biarawan dan bangsawan Spanyol mengolahnya jadi minuman kental bergula, berbeda dari minuman coklat pahit-pedas aslinya. Chocolate a la taza masih disajikan kental hingga sekarang, biasa dengan churros.", "f": "Kekentalannya sengaja dibuat agar churros bisa dicelupkan tanpa hancur.", "tl": []},
    "o13": {"y": "Abad ke-20", "p": "Italia", "t": "Diminum dengan sendok", "s": "Cioccolata calda di Italia dikenal jauh lebih kental daripada coklat panas di negara lain, kadang begitu pekat sampai harus disendok, bukan diseruput lewat gelas.", "f": "Beberapa kedai di Italia menyajikannya dengan whipped cream di atasnya sebagai kontras rasa dingin dan panas.", "tl": []},
    "k10": {"y": "Abad ke-19", "p": "India Selatan (Tamil Nadu, Karnataka)", "t": "Tuang bolak-balik biar berbusa", "s": "Kopi saring India berkembang dari kebiasaan rumah tangga di India Selatan, dicampur cikori untuk menghemat biji kopi yang dulu mahal. Tuang bolak-balik antara tumbler dan davarah menciptakan busa sekaligus mendinginkan sedikit sebelum diminum.", "f": "Istilah 'degree coffee' konon berasal dari kebiasaan pedagang susu mengencerkan susu, sehingga susu murni dijuluki '90 derajat' seperti pada termometer.", "tl": []},
    "k11": {"y": "Awal 1800-an", "p": "Amerika Serikat", "t": "Kopi kemah yang mendunia", "s": "Percolator dipatenkan pada awal abad ke-19 dan jadi alat seduh rumah tangga paling umum di Amerika sebelum era mesin kopi listrik. Kesederhanaannya membuat alat ini juga populer dibawa berkemah.", "f": "Air yang terus bersirkulasi lewat kopi yang sama membuat percolator mudah menghasilkan kopi yang terlalu pahit jika dibiarkan terlalu lama.", "tl": []},
    "k12": {"y": "Abad ke-17, populer lagi di abad ke-20", "p": "Kyoto, Jepang", "t": "Jam demi jam, setetes demi setetes", "s": "Teknik tetes dingin dipercaya berasal dari pelaut Belanda yang menyeduh kopi dingin di kapal tanpa api. Tekniknya kemudian dikembangkan jadi menara kaca bertingkat yang elegan di Kyoto, Jepang.", "f": "Karena tetesannya sangat lambat, satu sesi cold drip bisa berlangsung 3 sampai 8 jam tergantung jumlah kopi yang diseduh.", "tl": []},
    "k13": {"y": "1819", "p": "Napoli, Italia", "t": "Dibalik, bukan ditekan", "s": "Napoletana ditemukan di Napoli pada awal abad ke-19, sebelum mesin espresso ada. Cara membaliknya yang khas membuat alat ini dijuluki 'cuccumella' dalam dialek Napoli.", "f": "Karena harus dibalik saat masih panas, menyeduh dengan napoletana sering dianggap sedikit berisiko bagi pemula.", "tl": []},
    "v1": {"y":"Awal 2000-an","p":"Jepang","t":"Kerucut 60 derajat","s":"V60 dibuat perusahaan kaca Jepang Hario. Namanya merujuk pada sudut kerucut 60 derajat dan huruf V pada bentuknya. Lubang besar di dasar dan alur spiral membuat kecepatan aliran bisa diatur lewat cara menuang.","f":"Rasio 1:15 berarti 1 g kopi untuk 15 g air.","tl":[]},
    "v5": {"y":"Era modern","p":"Dunia kopi spesialti","t":"Satu tuangan, tanpa ribet","s":"Versi satu tuangan menyederhanakan V60 untuk pemula: air dituang sekali dan terus, tanpa banyak jeda. Hasilnya lebih mudah diulang, sehingga kamu bisa belajar mengatur gilingan dulu.","f":"Kalau hasil terlalu asam atau pahit, ubah satu hal saja per percobaan, misalnya gilingan.","tl":[]},
    "v6": {"y":"2000-an","p":"Gerakan kopi gelombang ketiga","t":"Menonjolkan rasa asli biji","s":"Sangrai terang banyak dikaitkan dengan gerakan kopi gelombang ketiga, yang ingin menonjolkan karakter asal biji. Rasanya cenderung cerah, dengan asam buah dan aroma bunga.","f":"Biji sangrai terang lebih padat, jadi air yang lebih panas membantu ekstraksinya.","tl":[]},
    "v7": {"y":"Tradisi lama","p":"Dunia kopi","t":"Manis karamel dari sangrai gelap","s":"Sangrai gelap memunculkan rasa karamel, cokelat, dan pahit yang tegas. Bijinya lebih rapuh, sehingga air yang sedikit lebih sejuk membantu menjaga rasa manis dan mengurangi pahit.","f":"Permukaan biji sangrai gelap tampak berminyak karena minyak dari dalam biji naik ke luar.","tl":[]},
    "v8": {"y":"Era modern","p":"Dunia kopi spesialti","t":"Seduh pekat, lalu encerkan","s":"Pada teknik bypass, kopi diseduh pekat lalu sebagian air panas ditambahkan setelah ekstraksi. Cara ini menjaga kopi tidak terekstraksi berlebihan sambil tetap bisa mengatur kekuatan akhir.","f":"Air tambahan tidak ikut mengekstraksi bubuk, jadi rasa pahit tidak bertambah.","tl":[]},
    "v9": {"y":"Era modern","p":"Kafe kopi dunia","t":"Kopi saring bertemu susu","s":"Kopi saring dengan susu hangat menjadi pilihan bagi yang suka rasa kopi bersih tetapi lebih lembut. Susu menambah manis alami dan mengurangi kesan asam.","f":"Tuang susu perlahan agar suhu minuman tetap nyaman diminum.","tl":[]},
    "k2": {"y":"1929","p":"Italia dan Prancis","t":"Rendam lalu tekan","s":"Desain French press modern dipatenkan di Italia pada 1929 oleh Attilio Calimani dan Giulio Moneta. Bentuk yang dikenal sekarang dipopulerkan di Prancis dan kemudian di Inggris.","f":"Karena memakai saringan logam, minyak kopi ikut masuk ke cangkir dan tubuh kopinya terasa lebih tebal.","tl":[]},
    "k3": {"y":"2005","p":"Amerika Serikat","t":"Alat dari penemu cakram terbang","s":"AeroPress diperkenalkan pada 2005 oleh Alan Adler, pendiri perusahaan Aerobie. Alat ini cepat, bersih, dan mudah dibawa, sehingga disukai pelancong dan penggemar kopi.","f":"Alan Adler juga dikenal sebagai penemu Aerobie, cakram terbang yang pernah memecahkan rekor lemparan.","tl":[]},
    "h2": {"y":"Tradisi lama","p":"China","t":"Teh bunga untuk menyegarkan","s":"Bunga krisan kering lama dipakai sebagai minuman di China dan sering dihidangkan di restoran, terutama bersama makanan berminyak. Rasanya ringan, wangi, dan sedikit manis.","f":"Teh ini biasanya diberi gula batu, bukan gula pasir.","tl":[]},
    "h4": {"y":"Tradisi lama","p":"Yunnan, China","t":"Teh yang menua","s":"Pu-erh adalah teh fermentasi pasca-produksi dari daun teh Yunnan. Rasanya dalam dan seperti tanah, dan beberapa jenisnya sengaja disimpan bertahun-tahun supaya berubah rasa.","f":"Pu-erh sering dipadatkan menjadi kue teh agar mudah disimpan dan dibawa.","tl":[]},
    "h5": {"y":"Sekitar 1738","p":"Uji, Jepang","t":"Daun hijau dikukus","s":"Sencha adalah teh hijau Jepang yang daunnya dikukus untuk menghentikan oksidasi. Metode pembuatan sencha modern dikaitkan dengan Nagatani Soen'en di Uji sekitar 1738.","f":"Pengukusan membuat sencha berwarna hijau cerah dan beraroma segar seperti rumput.","tl":[]},
    "h6": {"y":"Tradisi lama","p":"Jepang","t":"Teh hijau dengan beras sangrai","s":"Genmaicha adalah campuran teh hijau dan beras sangrai. Menurut cerita yang beredar, beras dicampur untuk menghemat daun teh pada masa lampau.","f":"Beberapa butir beras mengembang seperti popcorn saat disangrai.","tl":[]},
    "h8": {"y":"2000-an","p":"Kafe Jepang dan dunia","t":"Hojicha versi dingin","s":"Hojicha rendah kafein karena disangrai, jadi cocok untuk sore dan malam. Versi latte dingin ini populer di kafe karena rasa sangrainya manis dan tidak pahit.","f":"Aroma sangrai hojicha mirip kacang panggang dan karamel.","tl":[]},
    "h9": {"y":"Abad ke-20","p":"Jepang","t":"Teh direbus bersama susu","s":"Royal milk tea ala Jepang dibuat dengan merebus daun teh langsung di dalam susu, bukan menambah susu setelah diseduh. Hasilnya lebih kental, creamy, dan wangi teh yang pekat.","f":"Daun teh yang halus atau berbentuk CTC cepat melepas rasa di dalam susu.","tl":[]},
    "h11": {"y":"Abad ke-21","p":"Korea","t":"Yuja jadi minuman bersoda","s":"Yuja-cheong, selai yuja dengan gula, dilarutkan dalam air dingin atau soda menjadi minuman segar. Kafe Korea mempopulerkannya sebagai minuman musim panas.","f":"Yuja beraroma antara jeruk dan lemon, dengan wangi kulit yang kuat.","tl":[]},
    "h13": {"y":"Tradisi lama","p":"Korea","t":"Hangat dari jahe segar","s":"Saenggang-cha dibuat dari jahe segar yang direbus, biasanya diberi madu atau gula. Di Korea, minuman ini lazim dinikmati saat cuaca dingin atau ketika tubuh terasa kurang hangat.","f":"Saenggang berarti jahe dalam bahasa Korea.","tl":[]},
    "h17": {"y":"Era modern","p":"Inggris dan kafe dunia","t":"Bergamot bertemu lemon","s":"Earl Grey adalah teh hitam beraroma bergamot. Versi dingin dengan lemon menonjolkan sisi harum dan segar dari bergamot, cocok untuk cuaca panas.","f":"Bergamot adalah jeruk harum yang minyak kulitnya dipakai untuk mewangikan teh.","tl":[]},
    "o1": {"y":"Era modern","p":"China","t":"Penghangat dari jahe dan gula merah","s":"Jahe dan gula merah dipakai dalam minuman penghangat tradisional di China. Memadukannya dengan coklat adalah adaptasi modern yang memberi rasa hangat berempah.","f":"Gula merah memberi manis dalam dengan sedikit rasa karamel.","tl":[]},
    "o2": {"y":"Era modern","p":"China","t":"Wijen hitam dalam gelas","s":"Wijen hitam dalam masakan China dikenal lewat bubur wijen manis yang disajikan hangat. Rasa wijen sangrai yang gurih cocok berpasangan dengan coklat.","f":"Wijen hitam sering disangrai dulu supaya aromanya keluar.","tl":[]},
    "o3": {"y":"Abad ke-20","p":"Jepang","t":"Cocoa dari mesin penjual otomatis","s":"Cocoa panas di Jepang mudah ditemukan, termasuk dalam kaleng hangat di mesin penjual otomatis saat musim dingin. Rasanya cenderung manis dan lembut.","f":"Mesin penjual otomatis di Jepang bisa menyediakan minuman panas dan dingin sekaligus.","tl":[]},
    "o4": {"y":"Era modern","p":"Jepang","t":"Manis putih, pahit hijau","s":"Coklat putih dan matcha berpasangan karena manis krimi menyeimbangkan pahit dan umami matcha. Perpaduan ini populer pada camilan dan minuman Jepang.","f":"Matcha sebaiknya diayak dulu supaya tidak menggumpal.","tl":[]},
    "o5": {"y":"Era modern","p":"Jepang","t":"Sangrai bertemu coklat","s":"Hojicha yang disangrai punya rasa seperti kacang dan karamel, yang cocok dengan coklat. Minuman ini lebih lembut daripada matcha karena rendah pahit.","f":"Hojicha rendah kafein, jadi nyaman dinikmati malam hari.","tl":[]},
    "o6": {"y":"2020","p":"Korea Selatan","t":"Busa dalgona yang viral","s":"Dalgona coffee menjadi viral pada 2020, dan tekniknya dikocok hingga berbusa tebal. Versi coklat memakai prinsip yang sama untuk lapisan krim di atas susu dingin.","f":"Nama dalgona berasal dari permen gula karamel Korea, bukan dari kopi.","tl":[]},
    "o7": {"y":"Abad ke-21","p":"Korea","t":"Yuja untuk coklat","s":"Yuja-cheong biasanya dipakai untuk teh. Memadukannya dengan coklat memberi aroma jeruk yang tajam di atas rasa kakao yang dalam.","f":"Rasa jeruk dari yuja mirip dengan perpaduan coklat dan jeruk ala Eropa.","tl":[]},
    "o8": {"y":"Abad ke-17","p":"Inggris","t":"Rumah coklat London","s":"Coklat minum menjadi mode di Inggris pada abad ke-17, saat rumah coklat (chocolate house) bermunculan di London. Minuman ini awalnya mahal dan dinikmati kalangan atas.","f":"Rumah coklat pernah menjadi tempat berkumpul seperti kedai kopi.","tl":[]},
    "o9": {"y":"Akhir abad ke-19","p":"Inggris","t":"Malt sebelum tidur","s":"Minuman malt seperti Horlicks dikembangkan oleh kakak-beradik Horlick pada 1870-an. Di Inggris, minuman malt hangat identik dengan sebelum tidur.","f":"Malt berasal dari jelai yang dikecambahkan lalu dikeringkan.","tl":[]},
    "o10": {"y":"1932","p":"Inggris","t":"Jeruk dan coklat","s":"Perpaduan coklat dan jeruk di Inggris dikenal lewat Terry's Chocolate Orange, yang pertama dijual pada 1932. Rasa jeruk membuat coklat terasa lebih cerah.","f":"Kulit jeruk memberi aroma lebih kuat daripada air perasan.","tl":[]},
    "s13": {"y":"Abad ke-20","p":"Italia","t":"Lebih pendek, lebih pekat","s":"Ristretto berarti dibatasi dalam bahasa Italia, karena hasil ekstraksi dihentikan lebih cepat. Rasanya lebih pekat dan manis, dengan sedikit pahit.","f":"Karena singkat, ristretto biasanya memiliki lebih sedikit kafein dari yang dibayangkan banyak orang.","tl":[]},
    "s14": {"y":"Abad ke-20","p":"Italia","t":"Espresso yang ditandai susu","s":"Macchiato berarti ternoda atau bertanda dalam bahasa Italia, merujuk pada setitik busa susu di atas espresso. Karakter kopinya tetap dominan.","f":"Di Italia, memesan macchiato berarti espresso dengan sedikit susu, bukan minuman susu besar.","tl":[]},
    "s15": {"y":"Abad ke-20","p":"Valencia, Spanyol","t":"Dua lapisan manis dan pahit","s":"Café bombón dikaitkan dengan Valencia, Spanyol. Espresso dituang di atas susu kental manis sehingga terbentuk dua lapisan yang kontras.","f":"Gelas bening dipakai supaya lapisan terlihat.","tl":[]},
    "s16": {"y":"Abad ke-20","p":"Italia","t":"Dikocok sampai dingin","s":"Caffè shakerato adalah espresso yang dikocok bersama es hingga berbusa halus dan dingin. Minuman ini populer di Italia saat cuaca panas.","f":"Shakerato berarti dikocok dalam bahasa Italia.","tl":[]},
    "m7": {"y":"2020-an","p":"Kafe global","t":"Merah muda di atas hijau","s":"Strawberry matcha latte naik daun lewat media sosial karena lapisan warnanya. Manis asam stroberi menyeimbangkan rasa umami matcha.","f":"Aduk sebelum minum supaya rasa menyatu.","tl":[]},
    "m8": {"y":"Abad ke-16","p":"Jepang","t":"Matcha untuk upacara","s":"Koicha adalah matcha kental yang disajikan dalam upacara minum teh Jepang, sering dibagi dalam satu mangkuk. Teknik dan seleranya berkembang bersama tradisi cha-no-yu pada masa Sen no Rikyu.","f":"Daun untuk koicha biasanya berasal dari tanaman teh yang lebih tua.","tl":[]},
    "h25": {"y":"Era modern","p":"Fujian, China","t":"Melati tanpa panas","s":"Teh melati beraroma bunga melati yang dipetik dan dipakai untuk mewangikan daun teh, kawasan Fujian termasuk pusat produksinya. Cold brew mengeluarkan aroma lembut dengan sedikit sepat.","f":"Seduhan dingin biasanya lebih manis dan kurang sepat daripada seduhan panas.","tl":[]},
    "o14": {"y":"1970-an","p":"Brittany, Prancis","t":"Garam di atas karamel","s":"Karamel asin dikaitkan dengan Brittany, Prancis, tempat mentega asin menjadi ciri masakan setempat. Perpaduan manis dan asin kemudian meluas ke minuman dan kue.","f":"Sejumput garam membuat rasa coklat dan karamel lebih terasa.","tl":[]},
    "o15": {"y":"Abad ke-21","p":"Kafe global","t":"Kakao dingin yang bersih","s":"Coklat dingin dengan sedikit garam laut menjadi pilihan kafe saat cuaca panas. Garam memotong manis dan menegaskan rasa kakao.","f":"Aduk pasta kakao dulu supaya tidak menggumpal di susu dingin.","tl":[]},
    "o16": {"y":"Abad ke-20","p":"Inggris dan Amerika Serikat","t":"Segar seperti permen mint","s":"Perpaduan coklat dan mint populer sebagai permen dan es krim. Versi minuman dingin menonjolkan rasa mint yang menyegarkan di atas kakao.","f":"Sirup mint memberi rasa lebih merata daripada daun mint utuh.","tl":[]},
    "o17": {"y":"Era modern","p":"Asia Tenggara","t":"Santan sebagai pengganti susu","s":"Santan banyak dipakai di masakan Asia Tenggara, dan sebagai pengganti susu pada minuman. Teksturnya lembut dan aroma kelapanya cocok dengan coklat.","f":"Santan mudah pecah bila dipanaskan terlalu kuat, jadi gunakan api kecil.","tl":[]}
  };

  /* ---------- Storage (guarded) + migration from older versions ---------- */
  const KEY = "seduh.v1";
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) || {}; } catch (e) {}
    return {};
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ base: state.base, owned: state.owned, variant: state.variant, brand: state.brand, dose: state.dose, custom: state.custom, customGear: state.customGear, customIngr: state.customIngr.map(g => ({ id: g.id, name: g.name, ico: g.ico, for: g.for, d: g.d, custom: true })) })); }
    catch (e) { toast("Penyimpanan penuh. Coba foto yang lebih kecil."); }
  }
  const saved = load();
  if (saved.base === "matcha") saved.base = "teh";
  const state = {
    base: BASES[saved.base] ? saved.base : null,
    owned: Array.isArray(saved.owned) ? saved.owned : [],
    custom: (Array.isArray(saved.custom) ? saved.custom : []).map(m =>
      m.base === "matcha" ? Object.assign({}, m, { base: "teh", sub: "matcha" }) : m),
    customGear: Array.isArray(saved.customGear) ? saved.customGear : [],
    customIngr: (Array.isArray(saved.customIngr) ? saved.customIngr : []).map(g => Object.assign({}, g, { re: nameRe(g.name) })),
    variant: saved.variant || {}, brand: saved.brand || {}, dose: saved.dose || {},
    q: "", onlyReady: false, sub: "semua", gaya: "semua", temp: "semua"
  };

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const app = $("#app");
  const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduceMotion = () => rmq.matches;

  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function lines(t) {
    return String(t || "").split("\n").map(x => x.trim().replace(/^(\d+[.)]\s*|[-•*]\s*)/, "")).filter(Boolean);
  }
  const gearAll = () => GEAR.concat(state.customGear);
  const ingAll = () => INGR.concat(state.customIngr);
  const catSig = () => state.customGear.map(g => g.id).join(",") + "|" + state.customIngr.map(g => g.id).join(",");
  function gearForBase(base) { return gearAll().filter(g => g.for.includes(base)); }
  function allMenus() { return SEED.concat(state.custom); }
  let mcRef = null, mcLen = -1, mcBy = {};
  function menusOf(base) {   /* di-cache per kategori; direset saat menu buatan berubah */
    if (mcRef !== state.custom || mcLen !== state.custom.length) { mcRef = state.custom; mcLen = state.custom.length; mcBy = {}; }
    return mcBy[base] || (mcBy[base] = allMenus().filter(m => m.base === base));
  }
  function ingForBase(base) { return ingAll().filter(g => g.for.includes(base)); }
  const INEED = new WeakMap();
  function ingNeeds(m) {
    const sig = catSig(), hit = INEED.get(m);
    if (hit && hit.sig === sig && hit.ing === m.ing) return hit.ids;
    const all = ingAll();
    let ids;
    if (Array.isArray(m.ingIds)) ids = m.ingIds.filter(id => all.some(g => g.id === id));
    else { const t = String(m.ing || ""); ids = all.filter(g => g.for.includes(m.base) && g.re.test(t)).map(g => g.id); }
    INEED.set(m, { sig, ing: m.ing, ids });
    return ids;
  }
  let nmMap = null, nmSig = null;
  function nameOf(id) {
    const sig = catSig();
    if (nmSig !== sig) { nmMap = new Map(); gearAll().concat(ingAll()).forEach(g => { if (!nmMap.has(g.id)) nmMap.set(g.id, g.name); }); nmSig = sig; }
    return nmMap.has(id) ? nmMap.get(id) : id;
  }
  function missingOf(m) { return m.needs.concat(ingNeeds(m)).filter(n => !state.owned.includes(n)); }
  function isReady(m) { return !missingOf(m).length; }
  function readyText() { return menusOf(state.base).filter(isReady).length + " menu bisa dibuat sekarang"; }

  /* ---------- Illustrations ---------- */
  const OUT = 'stroke="#2b1b12" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
  let uid = 0;

  function steamSvg(x, y) {
    let s = "";
    for (let i = 0; i < 3; i++) {
      const dx = x + (i - 1) * 15;
      s += `<path class="steam" style="animation-delay:${(i * 0.8).toFixed(1)}s" d="M${dx} ${y} c-6 -7 6 -13 0 -20"/>`;
    }
    return `<g fill="none" stroke="rgba(43,27,18,.32)" stroke-width="4" stroke-linecap="round">${s}</g>`;
  }

  /* Karakter minuman: Si Hangat (panas) dan Si Sejuk (dingin) */
  function faceSvg(kind, x, y, k, plate) {
    const cold = kind === "cold", bd = "-" + (Math.random() * 4).toFixed(1) + "s", ink = "#2b1b12";
    return `<g transform="translate(${x} ${y}) scale(${k})"><g class="face ${kind}" style="--bd:${bd}">
      ${plate ? '<ellipse cx="0" cy="2" rx="25" ry="17" fill="rgba(255,250,242,.86)"/>' : ""}
      <g class="eo"><ellipse cx="-11" cy="-3" rx="3" ry="3.8" fill="${ink}"/><ellipse cx="11" cy="-3" rx="3" ry="3.8" fill="${ink}"/><circle cx="-10" cy="-4.4" r="1.1" fill="#fff"/><circle cx="12" cy="-4.4" r="1.1" fill="#fff"/></g>
      <g class="eh" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"><path d="M-15 -2 Q-11 -8 -7 -2"/><path d="M7 -2 Q11 -8 15 -2"/></g>
      <circle class="cheek" cx="-17" cy="5" r="4.2" fill="${cold ? "#7fb3de" : "#ff8a7a"}"/><circle class="cheek" cx="17" cy="5" r="4.2" fill="${cold ? "#7fb3de" : "#ff8a7a"}"/>
      <path class="ms" d="${cold ? "M-6 4 Q0 11 6 4" : "M-5 4 Q-2.5 9 0 4 Q2.5 9 5 4"}" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="mo" d="M-6 3 Q0 15 6 3 Z" fill="#c0392b" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path class="spark" d="M25 -15 v8 M21 -11 h8 M22.2 -14.2 l5.6 5.6 M27.8 -14.2 l-5.6 5.6" stroke="${cold ? "#7fb3de" : "#ff8a7a"}" stroke-width="1.7" stroke-linecap="round" fill="none"/>
    </g></g>`;
  }

  function mugSvg(c, f, o) {
    const marsh = o.marsh
      ? `<g fill="#fff" stroke="#2b1b12" stroke-width="2.2"><rect class="foam" x="42" y="47" width="14" height="12" rx="4"/><rect class="foam" style="animation-delay:.6s" x="58" y="45" width="14" height="13" rx="4"/><rect class="foam" style="animation-delay:1.2s" x="50" y="53" width="13" height="10" rx="4"/></g>`
      : "";
    return `<svg class="art-svg" viewBox="0 0 130 150" aria-hidden="true">
      ${steamSvg(57, 50)}
      <path d="M90 76 H102 Q118 76 118 92 Q118 108 102 108 H88" fill="none" ${OUT}/>
      <path d="M26 58 H90 V108 Q90 134 64 134 H52 Q26 134 26 108 Z" fill="#fffaf2" ${OUT}/>
      <ellipse cx="58" cy="58" rx="32" ry="8" fill="${c[0]}" ${OUT}/>
      <ellipse class="foam" cx="58" cy="58" rx="22" ry="5" fill="${f}"/>
      ${marsh}
      <path d="M34 82 Q36 118 52 125" stroke="#fff" stroke-opacity=".8" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${faceSvg("hot", 58, 100, 1, false)}
    </svg>`;
  }

  function bowlSvg(c, f) {
    return `<svg class="art-svg" viewBox="0 0 130 150" aria-hidden="true">
      ${steamSvg(65, 62)}
      <path d="M46 126 H84 V138 H46 Z" fill="#fffaf2" ${OUT}/>
      <path d="M14 72 H116 Q116 122 65 128 Q14 122 14 72 Z" fill="#fffaf2" ${OUT}/>
      <ellipse cx="65" cy="72" rx="51" ry="10" fill="${c[0]}" ${OUT}/>
      <ellipse class="foam" cx="65" cy="72" rx="39" ry="7" fill="${f}"/>
      <path d="M24 88 Q30 110 48 118" stroke="#fff" stroke-opacity=".8" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${faceSvg("hot", 65, 101, 1.2, false)}
    </svg>`;
  }

  function icedSvg(c) {
    const id = "g" + (++uid), n = c.length, top = 48, bot = 138, h = (bot - top) / n;
    let liq = "";
    for (let k = n - 1; k >= 0; k--) {
      const y = bot - (k + 1) * h;
      liq += k === n - 1
        ? `<g transform="translate(0 ${y})"><path class="wave" d="M-60 0 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V120 H-60 Z" fill="${c[k]}"/></g>`
        : `<rect x="0" y="${y}" width="130" height="120" fill="${c[k]}"/>`;
    }
    const cube = (x, y, r, d) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect class="ice" style="animation-delay:${d}s" width="21" height="21" rx="5" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.9)" stroke-width="2"/></g>`;
    return `<svg class="art-svg" viewBox="0 0 130 150" aria-hidden="true">
      <defs><clipPath id="${id}"><path d="M26 28 H98 L88 138 H36 Z"/></clipPath></defs>
      <path d="M26 28 H98 L88 138 H36 Z" fill="rgba(255,255,255,.55)"/>
      <g clip-path="url(#${id})">
        ${liq}
        ${cube(44, top + 4, -12, 0)}${cube(66, top + 14, 14, .9)}${cube(50, top + 36, 6, 1.7)}
        <g fill="rgba(255,255,255,.85)"><circle class="bubble" cx="46" cy="124" r="2.6"/><circle class="bubble" style="animation-delay:1.2s" cx="68" cy="128" r="2"/><circle class="bubble" style="animation-delay:2.2s" cx="78" cy="122" r="2.8"/></g>
      </g>
      <line x1="84" y1="8" x2="68" y2="112" style="stroke:var(--accent)" stroke-width="5" stroke-linecap="round"/>
      <path d="M26 28 H98 L88 138 H36 Z" fill="none" ${OUT}/>
      <path d="M33 42 L38 120" stroke="#fff" stroke-opacity=".75" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${faceSvg("cold", 62, 100, 1, true)}
    </svg>`;
  }

  function art(type, c, f, o) {
    c = Array.isArray(c) ? c : [c];
    o = o || {};
    const svg = type === "iced" ? icedSvg(c) : type === "bowl" ? bowlSvg(c, f || "#e6efd0") : mugSvg(c, f || "#e8d5bf", o);
    return `<span class="art" role="button" tabindex="0" aria-label="Sapa karakter minuman">${svg}</span>`;
  }

  /* Ilustrasi alat dan bahan (SVG, satu gaya dengan gelas minuman). {u} diganti id unik */
  const ICONS = {
    "espresso": "<rect x=\"8\" y=\"57\" width=\"48\" height=\"4\" rx=\"2\" fill=\"#5b4636\"/><rect x=\"10\" y=\"14\" width=\"44\" height=\"30\" rx=\"5\" fill=\"#d6dadd\"/><rect x=\"14\" y=\"6\" width=\"36\" height=\"9\" rx=\"3\" fill=\"#a4abb2\"/><circle cx=\"19\" cy=\"27\" r=\"5.5\" fill=\"#fffaf2\"/><path d=\"M19 27 L22 24\" stroke-width=\"1.8\"/><circle cx=\"45\" cy=\"26\" r=\"3.2\" fill=\"#c0392b\"/><rect x=\"26\" y=\"36\" width=\"12\" height=\"6\" rx=\"1.5\" fill=\"#a4abb2\"/><rect x=\"29.5\" y=\"42\" width=\"5\" height=\"4\" fill=\"#5b4636\"/><path d=\"M25 46 H39 V49 Q39 55 32 55 Q25 55 25 49 Z\" fill=\"#fffaf2\"/><path d=\"M39 47.5 Q43 47.5 43 50.5 Q43 53.5 39 53.5\"/><path d=\"M27.5 48.5 H36.5\" stroke=\"#5a3820\" stroke-width=\"2.4\"/>",
    "moka": "<path d=\"M46 21 H53 Q57 21 57 25 V33 Q57 37 53 37 H43\" stroke-width=\"6.4\"/><path d=\"M46 21 H53 Q57 21 57 25 V33 Q57 37 53 37 H43\" stroke=\"#c9965f\" stroke-width=\"2.4\"/><path d=\"M19 57 L22 38 H42 L45 57 Z\" fill=\"#d6dadd\"/><path d=\"M22 38 L18 17 H46 L42 38 Z\" fill=\"#a4abb2\"/><path d=\"M18 17 L11 14 L19 24\" fill=\"#a4abb2\"/><path d=\"M17 17 Q17 9 32 9 Q47 9 47 17 Z\" fill=\"#d6dadd\"/><circle cx=\"32\" cy=\"6.5\" r=\"2.6\" fill=\"#5b4636\"/><path d=\"M27 38 L26 57 M37 38 L38 57 M27 17 L28 38 M37 17 L36 38\" stroke-width=\"1.3\" opacity=\".45\"/>",
    "v60": "<path d=\"M18 40 H46 V46 Q46 58 32 58 Q18 58 18 46 Z\" fill=\"#fffaf2\"/><path d=\"M46 43 Q53 43 53 48.5 Q53 54 46 54\"/><path d=\"M10 12 H54 L40 34 H24 Z\" fill=\"#e8d5bf\"/><rect x=\"24\" y=\"34\" width=\"16\" height=\"5\" rx=\"1.5\" fill=\"#d6dadd\"/><ellipse cx=\"32\" cy=\"12\" rx=\"22\" ry=\"3\" fill=\"#5a3820\"/><path d=\"M21 17 L28 32 M32 17 V32 M43 17 L36 32\" stroke=\"#a88660\" stroke-width=\"1.5\"/><ellipse cx=\"32\" cy=\"48\" rx=\"2\" ry=\"2.8\" fill=\"#5a3820\" stroke=\"none\"/>",
    "frenchpress": "<path d=\"M44 24 H50 Q54 24 54 28 V42 Q54 46 50 46 H44\" stroke-width=\"6.4\"/><path d=\"M44 24 H50 Q54 24 54 28 V42 Q54 46 50 46 H44\" stroke=\"#c9965f\" stroke-width=\"2.4\"/><rect x=\"16\" y=\"16\" width=\"28\" height=\"40\" rx=\"3\" fill=\"#eaf3f2\"/><rect x=\"18\" y=\"31\" width=\"24\" height=\"23\" rx=\"1.5\" fill=\"#5a3820\" stroke=\"none\"/><rect x=\"18\" y=\"29\" width=\"24\" height=\"3.5\" fill=\"#d6dadd\"/><path d=\"M30 8 V29\"/><circle cx=\"30\" cy=\"6\" r=\"4\" fill=\"#c0392b\"/><rect x=\"13\" y=\"12\" width=\"34\" height=\"6\" rx=\"2.5\" fill=\"#a4abb2\"/><rect x=\"13\" y=\"52\" width=\"34\" height=\"7\" rx=\"2.5\" fill=\"#a4abb2\"/><path d=\"M21 22 V28\" stroke=\"#fff\" stroke-width=\"2.2\" opacity=\".9\"/>",
    "aeropress": '<path d="M17 44 H47 V52 Q47 58 41 58 H23 Q17 58 17 52 Z" fill="#fffaf2"/><rect x="22" y="16" width="20" height="30" rx="2" fill="#eaf3f2"/><rect x="23.5" y="31" width="17" height="13" fill="#5a3820" stroke="none"/><rect x="18" y="42" width="28" height="4.5" rx="1.5" fill="#d6dadd"/><rect x="25" y="5" width="14" height="22" rx="2" fill="#a4abb2"/><rect x="21" y="3" width="22" height="4" rx="1.5" fill="#d6dadd"/><path d="M26 20 V26" stroke="#fff" stroke-width="2" opacity=".8"/>',
    "saucepan": "<path d=\"M22 21 q-3 -5 0 -10 M30 21 q-3 -5 0 -10 M38 21 q-3 -5 0 -10\" stroke-opacity=\".3\" stroke-width=\"2.4\"/><path d=\"M12 28 H46 V45 Q46 52 39 52 H19 Q12 52 12 45 Z\" fill=\"#d6dadd\"/><rect x=\"46\" y=\"31\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#c9965f\"/><ellipse cx=\"29\" cy=\"28\" rx=\"17\" ry=\"5\" fill=\"#8a3b22\"/><ellipse cx=\"29\" cy=\"28\" rx=\"11\" ry=\"2.2\" fill=\"#c98a6b\" stroke=\"none\"/><path d=\"M18 36 V44\" stroke=\"#fff\" stroke-width=\"2.2\" opacity=\".75\"/>",
    "whisk": "<path d=\"M32 42 C12 38 13 8 32 5 C51 8 52 38 32 42 Z\" fill=\"#eef0f1\"/><path d=\"M32 42 C23 36 23 14 32 5 C41 14 41 36 32 42\" fill=\"none\"/><path d=\"M32 5 V42\" stroke-width=\"1.8\"/><rect x=\"26\" y=\"40\" width=\"12\" height=\"6\" rx=\"2\" fill=\"#a4abb2\"/><rect x=\"27.5\" y=\"45\" width=\"9\" height=\"15\" rx=\"4.5\" fill=\"#c9965f\"/><path d=\"M28 51 H36\" stroke-width=\"1.6\"/>",
    "teapot": "<path d=\"M46 29 Q58 29 56 40 Q54 50 44 48\" stroke-width=\"6.4\"/><path d=\"M46 29 Q58 29 56 40 Q54 50 44 48\" stroke=\"#7fa04f\" stroke-width=\"2.4\"/><path d=\"M13 36 L5 23 L10 20 L19 30\" fill=\"#7fa04f\"/><ellipse cx=\"30\" cy=\"38\" rx=\"19\" ry=\"16\" fill=\"#7fa04f\"/><path d=\"M12 40 Q30 49 48 40\" stroke=\"#cfe3a3\" stroke-width=\"2\"/><path d=\"M19 25 Q30 14 41 25 Z\" fill=\"#6f9448\"/><circle cx=\"30\" cy=\"14.5\" r=\"3\" fill=\"#2b1b12\"/><path d=\"M18 33 Q19 42 26 48\" stroke=\"#fff\" stroke-width=\"2.4\" opacity=\".6\"/>",
    "chawan": "<path d=\"M7 26 H57 Q57 55 32 56 Q7 55 7 26 Z\" fill=\"#d9c7a8\"/><rect x=\"23\" y=\"55\" width=\"18\" height=\"4.5\" rx=\"1.5\" fill=\"#b49f7c\"/><ellipse cx=\"32\" cy=\"26\" rx=\"25\" ry=\"5.5\" fill=\"#6f9448\"/><ellipse cx=\"32\" cy=\"26\" rx=\"18\" ry=\"3\" fill=\"#cfe3a3\" stroke=\"none\"/><path d=\"M11 33 Q24 42 31 34 Q38 43 53 33\" stroke=\"#8a6d3b\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M13 39 Q16 48 26 51\" stroke=\"#fff\" stroke-width=\"2.4\" opacity=\".65\"/>",
    "chasen": "<path d=\"M23 31 C12 37 10 51 16 59 H48 C54 51 52 37 41 31 Z\" fill=\"#efd9a6\"/><path d=\"M32 32 V59 M27.5 32 Q20 45 22 59 M36.5 32 Q44 45 42 59 M24 33 Q16 46 18.5 58 M40 33 Q48 46 45.5 58\" stroke-width=\"1.3\"/><rect x=\"23\" y=\"5\" width=\"18\" height=\"27\" rx=\"3\" fill=\"#e2c58a\"/><path d=\"M23 15 H41 M23 25 H41\" stroke-width=\"1.4\"/><path d=\"M23 31 H41\" stroke-width=\"3\"/>",
    "grinder": "<rect x=\"14\" y=\"28\" width=\"36\" height=\"28\" rx=\"3\" fill=\"#c9965f\"/><rect x=\"21\" y=\"43\" width=\"22\" height=\"9\" rx=\"1.5\" fill=\"#a67a45\"/><circle cx=\"32\" cy=\"47.5\" r=\"1.8\" fill=\"#2b1b12\" stroke=\"none\"/><path d=\"M17 28 Q17 20 24 18 H40 Q47 20 47 28 Z\" fill=\"#a4abb2\"/><path d=\"M32 18 V10 H50\"/><circle cx=\"32\" cy=\"10\" r=\"2.4\" fill=\"#2b1b12\"/><circle cx=\"52\" cy=\"10\" r=\"4\" fill=\"#5b4636\"/><path d=\"M19 34 H45\" stroke-width=\"1.3\" opacity=\".45\"/>",
    "chashaku": "<path d=\"M9 56 L44 21\" stroke-width=\"7\"/><path d=\"M9 56 L44 21\" stroke=\"#e2c58a\" stroke-width=\"3.6\"/><path d=\"M42 23 Q54 17 59 5 Q61 20 50 31 Z\" fill=\"#e2c58a\"/><ellipse cx=\"53\" cy=\"18\" rx=\"4.5\" ry=\"2.6\" transform=\"rotate(-50 53 18)\" fill=\"#7fa04f\" stroke=\"none\"/><path d=\"M22 43 l3 3 M30 35 l3 3\" stroke-width=\"1.4\"/>",
    "thermo": "<path d=\"M30 40 H34 V53 L32 60 L30 53 Z\" fill=\"#d6dadd\"/><circle cx=\"32\" cy=\"24\" r=\"19\" fill=\"#fffaf2\"/><circle cx=\"32\" cy=\"24\" r=\"14\" fill=\"#eef7e8\" stroke-width=\"1.5\"/><path d=\"M32 12.5 V15.5 M20.5 24 H23.5 M43.5 24 H40.5 M24 16 L26 18 M40 16 L38 18\" stroke-width=\"1.8\"/><path d=\"M32 24 L40 15.5\" stroke=\"#c0392b\" stroke-width=\"2.6\"/><circle cx=\"32\" cy=\"24\" r=\"2.4\" fill=\"#2b1b12\"/>",
    "kettle": "<path d=\"M22 20 Q32 0 44 20\" stroke-width=\"6.4\"/><path d=\"M22 20 Q32 0 44 20\" stroke=\"#c9965f\" stroke-width=\"2.4\"/><path d=\"M16 49 Q5 49 5 36 Q5 28 11 23\" stroke-width=\"6.4\"/><path d=\"M16 49 Q5 49 5 36 Q5 28 11 23\" stroke=\"#d6dadd\" stroke-width=\"2.6\"/><path d=\"M16 28 Q16 22 22 22 H42 Q48 22 48 28 V50 Q48 57 41 57 H23 Q16 57 16 50 Z\" fill=\"#d6dadd\"/><rect x=\"24\" y=\"17\" width=\"16\" height=\"6\" rx=\"2.5\" fill=\"#a4abb2\"/><path d=\"M22 30 V50\" stroke=\"#fff\" stroke-width=\"2.4\" opacity=\".75\"/>",
    "frother": "<rect x=\"27\" y=\"4\" width=\"10\" height=\"34\" rx=\"5\" fill=\"#5b4636\"/><circle cx=\"32\" cy=\"12\" r=\"2.6\" fill=\"#c0392b\"/><rect x=\"30\" y=\"36\" width=\"4\" height=\"10\" fill=\"#a4abb2\"/><path d=\"M24 47 Q32 42 40 47 Q32 52 24 47 Z M24 53 Q32 48 40 53 Q32 58 24 53 Z\" fill=\"#d6dadd\"/><circle cx=\"47\" cy=\"50\" r=\"3.2\" fill=\"#fff\"/><circle cx=\"51\" cy=\"43\" r=\"2.2\" fill=\"#fff\"/><circle cx=\"17\" cy=\"52\" r=\"2.6\" fill=\"#fff\"/><circle cx=\"13\" cy=\"45\" r=\"1.8\" fill=\"#fff\"/>",
    "shaker": "<path d=\"M19 22 H45 L42 54 Q42 58 38 58 H26 Q22 58 22 54 Z\" fill=\"#d6dadd\"/><path d=\"M23 22 L25 12 H39 L41 22 Z\" fill=\"#a4abb2\"/><rect x=\"27\" y=\"6\" width=\"10\" height=\"7\" rx=\"2.5\" fill=\"#d6dadd\"/><path d=\"M21 31 H43 M21.5 43 H42.5\" stroke-width=\"1.4\" opacity=\".5\"/><path d=\"M26 28 L28 52\" stroke=\"#fff\" stroke-width=\"2.4\" opacity=\".85\"/>",
    "strainer": "<rect x=\"49\" y=\"25\" width=\"14\" height=\"5.5\" rx=\"2.7\" fill=\"#c9965f\"/><path d=\"M7 29 H49 Q49 53 28 53 Q7 53 7 29 Z\" fill=\"#eef0f1\"/><clipPath id=\"sc{u}\"><path d=\"M7 29 H49 Q49 53 28 53 Q7 53 7 29 Z\"/></clipPath><g clip-path=\"url(#sc{u})\" stroke-width=\"1\" opacity=\".5\"><path d=\"M14 29 V53\"/><path d=\"M21 29 V53\"/><path d=\"M28 29 V53\"/><path d=\"M35 29 V53\"/><path d=\"M42 29 V53\"/><path d=\"M7 35 H49\"/><path d=\"M7 41 H49\"/><path d=\"M7 47 H49\"/></g><rect x=\"5\" y=\"26.5\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#a4abb2\"/>",
    "scale": "<path d=\"M20 30 Q20 16 32 16 Q44 16 44 30 Z\" fill=\"#fffaf2\"/><rect x=\"13\" y=\"29\" width=\"38\" height=\"6\" rx=\"3\" fill=\"#a4abb2\"/><rect x=\"8\" y=\"34\" width=\"48\" height=\"22\" rx=\"6\" fill=\"#d6dadd\"/><rect x=\"19\" y=\"40\" width=\"26\" height=\"10\" rx=\"2.5\" fill=\"#cfe3a3\"/><path d=\"M23 45 H27 M30 45 H34 M37 45 H41\" stroke-width=\"2\"/>",
    "glass": "<path d=\"M39 4 L32 38\" stroke-width=\"6.6\"/><path d=\"M39 4 L32 38\" stroke=\"var(--accent)\" stroke-width=\"3\"/><path d=\"M17 12 H47 L43 56 Q43 59 40 59 H24 Q21 59 21 56 Z\" fill=\"rgba(255,255,255,.6)\"/><path d=\"M22 50 H42\" stroke-width=\"1.5\" opacity=\".4\"/><path d=\"M23 20 L25.5 46\" stroke=\"#fff\" stroke-width=\"2.6\" opacity=\".95\"/>",
    "b_kopi": "<g transform=\"translate(22 32) rotate(-35)\"><ellipse rx=\"11\" ry=\"16\" fill=\"#4a2c17\"/><path d=\"M0 -13 Q-6 -4 0 0 Q6 4 0 13\" stroke=\"#f1e4cf\" stroke-width=\"2\"/></g><g transform=\"translate(43 28) rotate(28)\"><ellipse rx=\"11\" ry=\"16\" fill=\"#6a3d1f\"/><path d=\"M0 -13 Q-6 -4 0 0 Q6 4 0 13\" stroke=\"#f1e4cf\" stroke-width=\"2\"/></g><g transform=\"translate(34 47) rotate(78)\"><ellipse rx=\"10\" ry=\"14\" fill=\"#3a1f10\"/><path d=\"M0 -11 Q-6 -4 0 0 Q6 4 0 11\" stroke=\"#f1e4cf\" stroke-width=\"2\"/></g>",
    "b_batang": "<g transform=\"rotate(-8 32 32)\"><rect x=\"15\" y=\"8\" width=\"34\" height=\"46\" rx=\"3\" fill=\"#6b2f1d\"/><path d=\"M26.3 9 V38 M37.7 9 V38 M16 19.5 H48 M16 30 H48\" stroke=\"#8a3b22\" stroke-width=\"1.8\"/><path d=\"M15 38 L20 42 L25 38 L30 42 L35 38 L40 42 L45 38 L49 41 V52 Q49 54 47 54 H17 Q15 54 15 52 Z\" fill=\"#d6dadd\"/><path d=\"M21 48 H43\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".8\"/></g>",
    "b_bubuk": "<path d=\"M54 8 L42 27\" stroke-width=\"5.4\"/><path d=\"M54 8 L42 27\" stroke=\"#d6dadd\" stroke-width=\"2\"/><ellipse cx=\"41\" cy=\"30\" rx=\"5.5\" ry=\"3.6\" transform=\"rotate(-55 41 30)\" fill=\"#d6dadd\"/><path d=\"M12 40 Q18 20 32 18 Q46 20 52 40 Z\" fill=\"#5e2616\"/><path d=\"M9 40 H55 Q53 57 32 57 Q11 57 9 40 Z\" fill=\"#fffaf2\"/><path d=\"M22 32 l1 .1 M30 26 l1 .1 M38 33 l1 .1\" stroke=\"#8a3b22\" stroke-width=\"2.4\"/><path d=\"M15 46 Q17 52 24 54\" stroke=\"#e8d5bf\" stroke-width=\"2.2\"/>",
    "b_marsh": "<rect x=\"7\" y=\"33\" width=\"25\" height=\"21\" rx=\"9\" fill=\"#fffaf2\"/><rect x=\"32\" y=\"31\" width=\"25\" height=\"23\" rx=\"9\" fill=\"#f9d4dd\"/><g transform=\"rotate(-10 31 22)\"><rect x=\"18\" y=\"10\" width=\"26\" height=\"22\" rx=\"9\" fill=\"#fff\"/></g><path d=\"M12 47 Q19 51 27 47 M38 46 Q45 50 52 46\" stroke=\"#e1d3bc\" stroke-width=\"1.6\"/>",
    "b_matcha": "<path d=\"M14 20 V50 Q14 57 32 57 Q50 57 50 50 V20 Z\" fill=\"#4f7a3a\"/><ellipse cx=\"32\" cy=\"20\" rx=\"18\" ry=\"6.5\" fill=\"#a4abb2\"/><ellipse cx=\"32\" cy=\"20\" rx=\"14\" ry=\"4.4\" fill=\"#8bb04e\"/><path d=\"M25 48 Q25 36 38 34 Q38 46 25 48 Z\" fill=\"#fffaf2\" stroke-width=\"1.8\"/><path d=\"M27 46 L35 37\" stroke-width=\"1.2\"/>",
    "b_melati": "<path d=\"M40 56 Q54 54 58 40 Q44 40 40 56 Z\" fill=\"#6f9448\"/><path d=\"M24 57 Q10 54 7 43 Q22 41 24 57 Z\" fill=\"#6f9448\"/><g transform=\"translate(0 -4)\"><ellipse cx=\"32\" cy=\"19\" rx=\"7\" ry=\"12\" fill=\"#fffaf2\" transform=\"rotate(0 32 32)\"/><ellipse cx=\"32\" cy=\"19\" rx=\"7\" ry=\"12\" fill=\"#fffaf2\" transform=\"rotate(72 32 32)\"/><ellipse cx=\"32\" cy=\"19\" rx=\"7\" ry=\"12\" fill=\"#fffaf2\" transform=\"rotate(144 32 32)\"/><ellipse cx=\"32\" cy=\"19\" rx=\"7\" ry=\"12\" fill=\"#fffaf2\" transform=\"rotate(216 32 32)\"/><ellipse cx=\"32\" cy=\"19\" rx=\"7\" ry=\"12\" fill=\"#fffaf2\" transform=\"rotate(288 32 32)\"/><circle cx=\"32\" cy=\"32\" r=\"4.5\" fill=\"#e9d36b\"/></g>",
    "b_hitam": "<path d=\"M8 44 Q14 28 32 30 Q44 31 52 20 Q56 38 42 48 Q24 58 8 44 Z\" fill=\"#4a2c17\"/><path d=\"M12 41 Q26 36 48 26\" stroke=\"#c9a37a\" stroke-width=\"1.4\" opacity=\".75\"/><path d=\"M14 22 Q20 10 38 12 Q36 24 14 22 Z\" fill=\"#6a3d1f\"/><path d=\"M17 20 Q28 16 35 14\" stroke=\"#c9a37a\" stroke-width=\"1.2\"/>",
    "b_thai": "<rect x=\"16\" y=\"18\" width=\"32\" height=\"39\" rx=\"6\" fill=\"rgba(255,255,255,.65)\"/><path d=\"M17.5 38 Q32 32 46.5 38 V51 Q46.5 55.5 42 55.5 H22 Q17.5 55.5 17.5 51 Z\" fill=\"#e0752a\" stroke=\"none\"/><path d=\"M22 45 q4 -3 8 0 M32 49 q4 -3 8 0 M24 51 q3 -2 6 0\" stroke=\"#9c4a14\" stroke-width=\"1.4\"/><rect x=\"16\" y=\"18\" width=\"32\" height=\"39\" rx=\"6\" fill=\"none\"/><rect x=\"19\" y=\"10\" width=\"26\" height=\"9\" rx=\"3\" fill=\"#5b4636\"/><path d=\"M22 26 V34\" stroke=\"#fff\" stroke-width=\"2.2\" opacity=\".9\"/>",
    "b_susu": "<path d=\"M16 24 H44 V56 Q44 58 42 58 H18 Q16 58 16 56 Z\" fill=\"#fff\"/><path d=\"M16 24 L22 11 H38 L44 24 Z\" fill=\"#dbe9f5\"/><path d=\"M23 11 L32 5 L37 11 Z\" fill=\"#fff\"/><rect x=\"16\" y=\"33\" width=\"28\" height=\"9\" fill=\"#7fb3de\" stroke=\"none\"/><path d=\"M16 33 H44 M16 42 H44\" stroke-width=\"1.6\"/><path d=\"M30 45 Q24.5 51 28 55 Q30 56.5 32 55 Q35.5 51 30 45 Z\" fill=\"#7fb3de\"/>",
    "b_kental": "<path d=\"M16 17 V54 Q16 58 20 58 H44 Q48 58 48 54 V17 Z\" fill=\"#f2f2ef\"/><rect x=\"16\" y=\"26\" width=\"32\" height=\"24\" fill=\"#2f6db3\" stroke=\"none\"/><path d=\"M16 26 H48 M16 50 H48\" stroke-width=\"1.8\"/><path d=\"M22 40 Q27 34 32 40 T42 40\" stroke=\"#fffaf2\" stroke-width=\"2.2\"/><ellipse cx=\"32\" cy=\"17\" rx=\"16\" ry=\"5\" fill=\"#d6dadd\"/><ellipse cx=\"32\" cy=\"17\" rx=\"11\" ry=\"3\" fill=\"#fffaf2\" stroke-width=\"1.4\"/>",
    "b_gula": "<rect x=\"8\" y=\"35\" width=\"21\" height=\"20\" rx=\"3\" fill=\"#fff\"/><rect x=\"31\" y=\"31\" width=\"24\" height=\"24\" rx=\"3\" fill=\"#fffaf2\"/><g transform=\"rotate(-12 31 22)\"><rect x=\"19\" y=\"10\" width=\"22\" height=\"22\" rx=\"3\" fill=\"#fff\"/></g><g fill=\"#b9ab98\" stroke=\"none\"><circle cx=\"14\" cy=\"42\" r=\"1.1\"/><circle cx=\"22\" cy=\"49\" r=\"1.1\"/><circle cx=\"38\" cy=\"40\" r=\"1.1\"/><circle cx=\"47\" cy=\"48\" r=\"1.1\"/><circle cx=\"45\" cy=\"37\" r=\"1.1\"/><circle cx=\"26\" cy=\"18\" r=\"1.1\"/><circle cx=\"34\" cy=\"24\" r=\"1.1\"/><circle cx=\"23\" cy=\"26\" r=\"1.1\"/></g>",
    "b_sirup": "<rect x=\"25\" y=\"5\" width=\"14\" height=\"9\" rx=\"2.5\" fill=\"#5b4636\"/><path d=\"M26 14 H38 V19 Q47 24 47 34 V54 Q47 59 42 59 H22 Q17 59 17 54 V34 Q17 24 26 19 Z\" fill=\"#d98a2b\"/><rect x=\"21\" y=\"37\" width=\"22\" height=\"15\" rx=\"2.5\" fill=\"#fffaf2\" stroke-width=\"1.8\"/><path d=\"M32 40 Q28 45 31 48 Q33 49 34.5 48 Q36.5 45 32 40 Z\" fill=\"#d98a2b\" stroke=\"none\"/><path d=\"M22 28 Q22 33 21 35\" stroke=\"#fff\" stroke-width=\"2.4\" opacity=\".7\"/>",
    "b_lemon": "<path d=\"M34 13 Q44 3 55 9 Q47 20 34 13 Z\" fill=\"#6f9448\"/><circle cx=\"31\" cy=\"35\" r=\"22\" fill=\"#f2cf3a\"/><circle cx=\"31\" cy=\"35\" r=\"18\" fill=\"#fbe98a\" stroke-width=\"1.6\"/><path d=\"M31 20 V50 M16 35 H46 M20.4 24.4 L41.6 45.6 M41.6 24.4 L20.4 45.6\" stroke=\"#f2cf3a\" stroke-width=\"1.8\"/><circle cx=\"31\" cy=\"35\" r=\"3\" fill=\"#f2cf3a\" stroke=\"none\"/>",
    "b_es": "<rect x=\"7\" y=\"32\" width=\"24\" height=\"23\" rx=\"6\" fill=\"#cfe9f4\"/><g transform=\"rotate(10 43 40)\"><rect x=\"31\" y=\"27\" width=\"25\" height=\"26\" rx=\"6\" fill=\"#dff1f8\"/></g><g transform=\"rotate(-12 31 22)\"><rect x=\"19\" y=\"8\" width=\"24\" height=\"24\" rx=\"6\" fill=\"#eef9fd\"/></g><path d=\"M12 39 V44 M12 39 H17 M37 33 H42 M24 14 V19 M24 14 H29\" stroke=\"#fff\" stroke-width=\"2.2\"/><path d=\"M54 8 V16 M50 12 H58\" stroke=\"#7fb3de\" stroke-width=\"2\"/>",
    "_gear": "<path d=\"M12 54 L36 30\" stroke-width=\"6.4\"/><path d=\"M12 54 L36 30\" stroke=\"#d6dadd\" stroke-width=\"2.6\"/><ellipse cx=\"44\" cy=\"22\" rx=\"11\" ry=\"7.5\" transform=\"rotate(-45 44 22)\" fill=\"#d6dadd\"/><path d=\"M40 20 Q43 17 47 18\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".9\"/>",
    "_ing": "<path d=\"M40 14 Q50 8 57 15 Q48 22 40 14 Z\" fill=\"#6f9448\"/><path d=\"M12 34 Q16 20 32 18 Q48 20 52 34 Z\" fill=\"#e8d5bf\"/><path d=\"M8 34 H56 Q54 54 32 56 Q10 54 8 34 Z\" fill=\"#fffaf2\"/><g fill=\"#b9ab98\" stroke=\"none\"><circle cx=\"24\" cy=\"28\" r=\"1.2\"/><circle cx=\"33\" cy=\"24\" r=\"1.2\"/><circle cx=\"41\" cy=\"29\" r=\"1.2\"/></g><path d=\"M14 42 Q16 49 23 52\" stroke=\"#e8d5bf\" stroke-width=\"2.2\"/>"
  };
  function iconSvg(g) {
    const isIng = ingAll().some(x => x.id === g.id);
    const inner = (ICONS[g.id] || ICONS[isIng ? "_ing" : "_gear"]).replace(/\{u\}/g, ++uid);
    return `<svg class="gi" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#2b1b12" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }

  const DEFAULT_TONE = {
    kopi: { c: ["#4a2c17"], f: "#d9b98f" },
    coklat: { c: ["#5e2616"], f: "#c98a6b" },
    matcha: { c: ["#7fa04f"], f: "#cfe3a3" },
    seduh: { c: ["#c4742a"], f: "#efc98a" }
  };
  function tone(m) {
    if (m.c) return { c: m.c, f: m.f };
    if (m.base === "teh") return DEFAULT_TONE[m.sub === "matcha" ? "matcha" : "seduh"];
    return DEFAULT_TONE[m.base];
  }
  function drawMenu(m) {
    const t = tone(m);
    return art(m.type || "hot", t.c, t.f, { marsh: m.marsh });
  }

  function decorSvg(base, i) {
    if (base === "kopi") return `<svg viewBox="0 0 24 24" width="24" height="24"><ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(35 12 12)" fill="#5a3820"/><path d="M7 19 Q13 12 17 5" stroke="#f5eee2" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
    if (base === "coklat") return `<svg viewBox="0 0 24 24" width="24" height="24"><g transform="rotate(12 12 12)"><rect x="3" y="3" width="18" height="18" rx="3" fill="#7a2c19"/><path d="M9 4v16M15 4v16M4 9h16M4 15h16" stroke="#f1cdbd" stroke-opacity=".55" stroke-width="1"/></g></svg>`;
    const fill = i % 2 ? "#c4902f" : "#6f9448";
    return `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 20 C4 9 12 3 21 3 C21 13 15 21 4 20 Z" fill="${fill}"/><path d="M4 20 L16 8" stroke="#f5f0d8" stroke-width="1.3" fill="none"/></svg>`;
  }
  const DECO_POS = [[7, 9, 7.5, 0], [84, 7, 9, 1.4], [10, 50, 8.5, 2.2], [86, 46, 7, .6], [16, 84, 9.5, 3], [80, 80, 8, 1.9]];
  function decor(base) {
    return DECO_POS.map((p, i) =>
      `<span class="deco" aria-hidden="true" style="left:${p[0]}%;top:${p[1]}%;--t:${p[2]}s;--d:-${p[3]}s">${decorSvg(base, i)}</span>`).join("");
  }


  /* ---------- Beans + leaves ---------- */
  const BOT = {
    bean: c => `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="11" ry="16" transform="rotate(30 20 20)" fill="${c}"/><ellipse cx="16" cy="15" rx="3" ry="7" transform="rotate(30 16 15)" fill="#fff" opacity=".13"/><path d="M12.5 32 C21 25 19 15 27.5 8" stroke="#f1e4cf" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/></svg>`,
    cacao: c => `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="15" transform="rotate(-28 20 20)" fill="${c}"/><path d="M13 12 C19 18 21 24 27 30 M11 20 C17 22 20 27 22 33 M17 8 C22 13 26 17 30 20" stroke="#f1cdbd" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".55"/></svg>`,
    pod: () => `<svg viewBox="0 0 64 40"><path d="M2 20 C12 3 44 1 62 20 C44 39 12 37 2 20Z" fill="#b8562b"/><path d="M6 20 C20 9 44 9 58 20 M9 14 C24 6 42 8 54 15 M9 26 C24 34 42 32 54 25" stroke="#7d3517" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M12 14 C20 10 30 9 38 10" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".3"/></svg>`,
    leaf: (f, v) => `<svg viewBox="0 0 40 40"><path d="M4 36 C3 18 15 4 36 3 C37 22 25 37 4 36Z" fill="${f}"/><path d="M5 35 L30 9 M14 26 L12 17 M20 20 L19 11 M23 17 L31 18" stroke="${v}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/></svg>`,
    cleaf: () => `<svg viewBox="0 0 40 60"><path d="M20 58 C5 46 4 17 20 2 C36 17 35 46 20 58Z" fill="#2f5a35"/><path d="M20 56 V8 M20 44 L10 36 M20 44 L30 36 M20 32 L11 24 M20 32 L29 24 M20 20 L14 14 M20 20 L26 14" stroke="#9cc79a" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".75"/><path d="M13 20 C11 32 13 42 17 50" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".18"/></svg>`,
    sprig: () => `<svg viewBox="0 0 60 64"><path d="M30 62 C31 46 28 30 30 14" stroke="#4e6b2c" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M30 16 C25 9 27 3 30 0 C33 3 35 9 30 16Z" fill="#a8c76a"/><path d="M30 34 C17 32 8 25 6 14 C20 13 29 20 30 34Z" fill="#6f9448"/><path d="M30 30 C43 28 52 21 54 10 C40 9 31 16 30 30Z" fill="#86ad52"/><path d="M29 33 L11 18 M31 29 L49 14" stroke="#dce8b8" stroke-width="1.2" fill="none" opacity=".8"/></svg>`,
    cherry: () => `<svg viewBox="0 0 40 40"><path d="M21 3 C21 11 12 14 11 24 M21 3 C21 11 29 14 30 24" stroke="#3f5a22" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M21 3 C27 1 32 3 35 7 C29 9 24 8 21 3Z" fill="#4f7a3a"/><circle cx="11" cy="29" r="8" fill="#c0392b"/><circle cx="30" cy="29" r="8" fill="#d4483a"/><circle cx="8" cy="26" r="2.2" fill="#fff" opacity=".4"/><circle cx="27" cy="26" r="2.2" fill="#fff" opacity=".4"/></svg>`
  };
  const BOT_LAYOUT = {
    kopi: [
      ["cherry", null, 5, 5, 46, 1.4, -18, 0], ["cleaf", null, 78, 3, 40, 1.8, 26, 1.2], ["bean", "#4a2c17", 72, 31, 30, 2.4, 40, .6],
      ["bean", "#6a3d1f", 5, 37, 27, 2.8, -30, 1.8], ["bean", "#3a1f10", 86, 53, 24, 1.2, 12, 2.4], ["cleaf", null, 1, 53, 32, 1.5, -48, .9],
      ["bean", "#5a3820", 20, 14, 20, 2.1, 70, 2.9]
    ],
    coklat: [
      ["pod", null, 3, 4, 70, 1.5, -22, 0], ["cacao", "#6b2f1d", 80, 6, 30, 2.2, 35, 1.1], ["cacao", "#8a3b22", 87, 33, 25, 2.8, -20, 2],
      ["cacao", "#5a2616", 4, 38, 28, 2.4, 15, .5], ["leaf", ["#4f7a3a", "#cfe3a3"], 76, 50, 40, 1.3, 40, 1.6], ["cacao", "#7a3320", 20, 54, 22, 1.9, -50, 2.6]
    ],
    teh: [
      ["sprig", null, 3, 3, 62, 1.6, -14, 0], ["leaf", ["#6f9448", "#e4efc4"], 80, 5, 44, 2, 28, 1.3], ["leaf", ["#c4902f", "#f7e3ae"], 86, 34, 32, 2.7, -35, .7],
      ["leaf", ["#3f5a22", "#b9d58a"], 3, 40, 36, 2.2, 52, 1.9], ["sprig", null, 76, 49, 46, 1.2, 18, 2.5], ["leaf", ["#c4902f", "#f7e3ae"], 18, 55, 26, 1.8, -20, 2.8]
    ]
  };
  function botSvg(type, arg) {
    const f = BOT[type];
    return Array.isArray(arg) ? f(arg[0], arg[1]) : f(arg);
  }
  function botanicals(base) {
    return (BOT_LAYOUT[base] || []).map(([type, arg, x, y, w, k, r, d]) =>
      `<span class="bot" aria-hidden="true" style="left:${x}%;top:${y}%;width:${w}px;--k:${k};--r:${r}deg;--d:-${d}s;--dur:${(5 + (d * 1.3) % 3).toFixed(1)}s"><span class="sway">${botSvg(type, arg)}</span></span>`).join("");
  }
  /* Rangkaian biji dan daun besar sebagai ilustrasi utama tiap kartu (menggantikan gelas) */
  const EMB = {
    // [jenis, argumen, x, y, lebar, rotasi]
    kopi: [
      ["cleaf", null, 16, 26, 62, -28], ["cleaf", null, 124, 20, 58, 30], ["cherry", null, 74, 14, 58, 0],
      ["bean", "#4a2c17", 24, 98, 80, -22], ["bean", "#6a3d1f", 98, 106, 76, 28], ["bean", "#3a1f10", 60, 126, 72, 82]
    ],
    coklat: [
      ["leaf", ["#4f7a3a", "#cfe3a3"], 14, 34, 74, -12], ["leaf", ["#3f6a2e", "#cfe3a3"], 118, 30, 64, 52],
      ["pod", null, 36, 62, 128, -14],
      ["cacao", "#6b2f1d", 22, 124, 68, 20], ["cacao", "#8a3b22", 108, 128, 62, -36], ["cacao", "#5a2616", 68, 146, 56, 62]
    ],
    teh: [
      ["sprig", null, 52, 8, 96, 0], ["leaf", ["#6f9448", "#e4efc4"], 12, 88, 78, -40], ["leaf", ["#c4902f", "#f7e3ae"], 112, 84, 72, 36],
      ["leaf", ["#3f5a22", "#b9d58a"], 60, 124, 74, 8], ["leaf", ["#c4902f", "#f7e3ae"], 20, 148, 46, 62], ["sprig", null, 128, 138, 54, 22]
    ]
  };
  function emblem(base) {
    const ASPECT = { cleaf: 1.5, pod: .625, sprig: 1.0667 };
    const parts = (EMB[base] || []).map(([type, arg, x, y, w, r], i) => {
      const h = w * (ASPECT[type] || 1);
      const svg = botSvg(type, arg).replace("<svg ", `<svg x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}" overflow="visible" `);
      return `<g transform="rotate(${r} ${(x + w / 2).toFixed(1)} ${(y + h / 2).toFixed(1)})"><g class="pc" style="--d:-${(i * 0.9).toFixed(1)}s;--dur:${(4.6 + (i % 3) * 0.7).toFixed(1)}s">${svg}</g></g>`;
    }).join("");
    return `<span class="art"><svg class="art-svg emb" viewBox="0 -8 200 232" aria-hidden="true">${parts}</svg></span>`;
  }
  function stripHtml() {
    const items = [
      BOT.bean("#4a2c17"), BOT.leaf("#6f9448", "#e4efc4"), BOT.cacao("#6b2f1d"), BOT.sprig(),
      BOT.bean("#6a3d1f"), BOT.leaf("#c4902f", "#f7e3ae"), BOT.cleaf(), BOT.cherry(),
      BOT.cacao("#8a3b22"), BOT.leaf("#3f5a22", "#b9d58a"), BOT.bean("#3a1f10"), BOT.pod()
    ];
    const half = items.join("");
    return `<div class="strip" aria-hidden="true"><div class="strip-track">${half}${half}</div></div>`;
  }

  function countUp() {
    document.querySelectorAll("[data-count]").forEach(el => {
      const to = +el.dataset.count;
      if (!to || reduceMotion()) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 750;
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ---------- Router (state-based, hash is only for display) ---------- */
  const ROUTES = ["bahan", "perlengkapan", "menu"];
  function hashRoute() {
    const r = location.hash.replace(/^#\/?/, "") || "bahan";
    return ROUTES.includes(r) ? r : "bahan";
  }
  let current = hashRoute(), lastRoute = null, enterTimer;
  function route() { return current !== "bahan" && !state.base ? "bahan" : current; }
  function go(r) {
    if (!ROUTES.includes(r)) return;
    if (r !== "bahan" && !state.base) return;
    const changed = current !== r;
    current = r;
    try { history.pushState(null, "", "#/" + r); } catch (e) {}
    render();
    if (changed) window.scrollTo({ top: 0, behavior: "instant" });
  }
  function onHash() { current = hashRoute(); render(); }
  window.addEventListener("hashchange", onHash);
  window.addEventListener("popstate", onHash);

  function renderStepper(r) {
    const items = [["bahan", "Pilih minuman"], ["perlengkapan", "Alat & bahan"], ["menu", "Menu"]];
    const idx = ROUTES.indexOf(r);
    $("#stepper").innerHTML = items.map(([id, label], i) => {
      const locked = id !== "bahan" && !state.base;
      const cls = i === idx ? "on" : locked ? "off" : i < idx ? "done" : "";
      const inner = `<b>${i + 1}</b><span class="t">${label}</span>`;
      return `<li>${locked
        ? `<span class="st ${cls}" aria-disabled="true">${inner}</span>`
        : `<a class="st ${cls}" href="#/${id}" data-go="${id}" ${i === idx ? 'aria-current="step"' : ""}>${inner}</a>`}</li>`;
    }).join("");
  }

  function render() {
    const r = route();
    document.body.dataset.theme = state.base || ""; Scene.set(state.base || "mix");
    const changed = lastRoute !== r;
    lastRoute = r;
    clearTimeout(enterTimer);
    if (changed) {
      app.classList.add("enter");
      enterTimer = setTimeout(() => app.classList.remove("enter"), 1100);
    } else {
      app.classList.remove("enter");
    }
    renderStepper(r);
    if (r === "bahan") pageBahan();
    else if (r === "perlengkapan") pagePerlengkapan();
    else pageMenu();
    countUp();
    document.title = "Resep Minuman — " + ({ bahan: "Pilih minuman", perlengkapan: "Alat & bahan", menu: "Menu" })[r];
  }

  /* ---------- Page 1 ---------- */
  function pageBahan() {
    app.innerHTML = `
      <div class="hero reveal" style="--i:0">
        <div>
          <h1 class="page-title">Mau bikin<br>minuman apa?</h1>
          <p class="expand"><span class="gcs" aria-hidden="true"></span><span><b>Si Seduh</b> adalah Sistem Informasi Seputar Edukasi Dunia Hobi GCS.</span></p>
          <p class="lead">Pilih satu jenis, centang alat dan bahan yang kamu punya, lalu lihat menu yang bisa langsung dibuat di rumah.</p>
        </div>
        <div class="facts">
          <div class="fact"><strong data-count="${allMenus().length}">${allMenus().length}</strong><span>menu siap pakai</span></div>
          <div class="fact"><strong data-count="${gearAll().length + ingAll().length}">${gearAll().length + ingAll().length}</strong><span>alat &amp; bahan terdata</span></div>
          <div class="fact"><strong data-count="${state.custom.length}">${state.custom.length}</strong><span>menu buatanmu</span></div>
        </div>
      </div>
      <div class="reveal" style="--i:1">${stripHtml()}</div>
      <div class="bases">
        ${Object.entries(BASES).map(([id, b], i) => `
          <button class="base reveal" style="--tint:${b.tint};--deep:${b.deep};--i:${i + 2}" data-pick="${id}" aria-pressed="${state.base === id}">
            ${botanicals(id)}
            <span class="tick" aria-hidden="true">✓</span>
            ${emblem(id)}
            <span class="info">
              <h2>${b.name}</h2>
              <p>${b.blurb}</p>
              <span class="eg">Contoh: ${menusOf(id).slice(0, 3).map(m => esc(m.name)).join(", ")}</span>
              <span class="tags"><span>${menusOf(id).length} menu</span>${b.tags.map(t => `<span>${t}</span>`).join("")}</span>
              <span class="pick-note">${state.base === id ? "Dipilih ✓" : "Pilih " + b.name}</span>
            </span>
          </button>`).join("")}
      </div>
      <footer class="note">Menu tambahan dan pilihan perlengkapanmu tersimpan di browser ini.</footer>
      <div class="actions"><div class="wrap">
        <span class="hint">${state.base ? "Dipilih: " + BASES[state.base].name : "Pilih salah satu untuk melanjutkan"}</span>
        <button class="btn accent" data-go="perlengkapan" ${state.base ? "" : "disabled"}>Lanjut: pilih alat &amp; bahan</button>
      </div></div>`;
  }

  /* ---------- Page 2 ---------- */
  function meter(label, have, total) {
    const pct = total ? Math.round(have / total * 100) : 0;
    return `<div><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${have}" aria-label="${label}"><div style="width:${pct}%"></div></div>
      <small class="k" style="margin-top:6px">${label}: ${have} dari ${total} dipilih</small></div>`;
  }
  function asideHtml() {
    const b = BASES[state.base], g = gearForBase(state.base), n = ingForBase(state.base);
    const own = list => list.filter(x => state.owned.includes(x.id)).length;
    const menus = menusOf(state.base), ready = menus.filter(isReady);
    return `
      <div class="side-top">${art(b.art.type, b.art.c, b.art.f, { marsh: b.art.marsh })}<div><small>Minuman dipilih</small><strong>${b.name}</strong></div></div>
      ${meter("Alat", own(g), g.length)}
      ${meter("Bahan", own(n), n.length)}
      <div>
        <small class="k">Bisa dibuat sekarang</small>
        <p class="big">${ready.length} <span>dari ${menus.length} menu</span></p>
      </div>
      ${ready.length
        ? `<ul>${ready.slice(0, 6).map(m => `<li>${esc(m.name)}</li>`).join("")}${ready.length > 6 ? `<li>dan ${ready.length - 6} lainnya</li>` : ""}</ul>`
        : `<p class="note">Centang alat dan bahan di sebelah kiri. Menu yang bisa kamu buat akan muncul di sini.</p>`}
      <button class="btn ghost" data-go="bahan">Ganti minuman</button>`;
  }
  function itemBtn(g) {
    return `<button class="tool" data-gear="${g.id}" aria-pressed="${state.owned.includes(g.id)}">
      <span class="ico" aria-hidden="true">${iconSvg(g)}</span>
      <span><strong>${g.name}</strong><small>${g.d || ""}</small></span>
    </button>`;
  }
  function secHtml(letter, title, sub, items, i) {
    if (!items.length) return "";
    return `<section class="group reveal" style="--i:${i}">
      <div class="ghead">
        <div><h2><span class="lt">${letter}</span>${title}</h2><p>${sub}</p></div>
        <button class="link-btn" data-sec="${items.map(x => x.id).join(",")}">Pilih bagian ini</button>
      </div>
      <div class="gear">${items.map(itemBtn).join("")}</div>
    </section>`;
  }

  function pagePerlengkapan() {
    const list = gearForBase(state.base), b = BASES[state.base];
    app.innerHTML = `
      <div class="reveal" style="--i:0">
        <h1 class="page-title">Alat &amp; bahan ${b.name.toLowerCase()}<br>yang kamu punya</h1>
        <p class="lead">Centang yang sudah ada di rumah. Menu yang alat dan bahannya lengkap akan ditandai siap dibuat. Air biasa dianggap selalu ada.</p>
      </div>
      <div class="layout">
        <div>
          <div class="toolbar reveal" style="--i:1">
            <button class="link-btn" data-act="all">Pilih semua</button>
            <button class="link-btn" data-act="none">Kosongkan</button>
          </div>
          <div style="margin-top:18px">
            ${secHtml("A", GROUPS.main.title, GROUPS.main.sub, list.filter(g => g.grp === "main"), 2)}
            ${secHtml("B", GROUPS.aux.title, GROUPS.aux.sub, list.filter(g => g.grp === "aux"), 3)}
            ${secHtml("C", "Bahan", "Bahan yang dipakai di menu " + b.name.toLowerCase() + ". Centang yang ada di dapurmu.", ingForBase(state.base), 4)}
          </div>
        </div>
        <aside class="side reveal" style="--i:2" id="side" aria-label="Ringkasan">${asideHtml()}</aside>
      </div>
      <div class="actions"><div class="wrap">
        <button class="btn ghost" data-go="bahan">Kembali</button>
        <span class="hint" id="readyHint">${readyText()}</span>
        <button class="btn accent" data-go="menu">Lihat menu</button>
      </div></div>`;
  }

  /* ---------- Page 3 ---------- */
  const openCards = new Set();
  function histData(m) {
    if (HIST[m.id]) return HIST[m.id];
    return (m.hist || m.hy || m.hp || m.hf) ? { y: m.hy, p: m.hp, s: m.hist, f: m.hf, tl: [] } : null;
  }
  function histHtml(h) {
    const y = String(h.y || "").trim();
    return `<div class="hist">
      ${y || h.p ? `<div class="h-top">${y ? `<span class="h-year${y.length > 7 ? " long" : ""}">${esc(y)}</span>` : "<span></span>"}${h.p ? `<span class="h-where">${esc(h.p)}</span>` : ""}</div>` : ""}
      ${h.t ? `<h4 class="h-title">${esc(h.t)}</h4>` : ""}
      ${h.s ? `<p>${esc(h.s)}</p>` : ""}
      ${h.tl && h.tl.length ? `<ol class="tl">${h.tl.map(x => `<li><b>${esc(x[0])}</b>${esc(x[1])}</li>`).join("")}</ol>` : ""}
      ${h.f ? `<div class="h-fact"><span class="ic" aria-hidden="true">💡</span><div><strong>Tahukah kamu?</strong>${esc(h.f)}</div></div>` : ""}
    </div>`;
  }
  const CHEV = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function tempChip(m) {
    const b = tempBrief(m); if (!b) return "";
    const parts = [];
    if (b.main) parts.push(`<span><abbr title="${esc(b.main.stage)}">${m.type === "iced" ? "Seduh" : "Air"}</abbr> ${fmtRange(b.main)}</span>`);
    if (b.serve) parts.push(`<span>Sajikan ${fmtRange(b.serve)}</span>`);
    if (!parts.length) return "";
    const tip = b.all.map(t => t.stage + ": " + fmtRange(t)).join("; ");
    return `<div class="tmp-chip" title="${esc(tip)}"><span aria-hidden="true">🌡️</span>${parts.join('<i aria-hidden="true">·</i>')}</div>`;
  }
  (function () {
    const st = document.createElement("style");
    st.textContent = ".tmp-chip{display:flex;flex-wrap:wrap;align-items:center;gap:2px 8px;margin:6px 0 2px;font-size:.8rem;line-height:1.35;opacity:.85}.tmp-chip i{font-style:normal;opacity:.5}.tmp-chip abbr{text-decoration:none;border-bottom:1px dotted currentColor;cursor:help}";
    document.head.appendChild(st);
  })();
  function menuCard(m, i) {
    const miss = missingOf(m), ready = !miss.length, hist = histData(m), ings = ingNeeds(m);
    const photo = m.img ? `<img src="${esc(m.img)}" alt="Foto ${esc(m.name)}" loading="lazy" decoding="async">` : drawMenu(m);
    const chip = id => `<span class="chip ${state.owned.includes(id) ? "have" : "miss"}">${esc(nameOf(id))}</span>`;
    const isOpen = k => openCards.has(m.id + ":" + k);
    const tog = (k, html) => `<button type="button" class="tog" data-tog="${k}" data-id="${esc(m.id)}" aria-expanded="${isOpen(k)}" aria-controls="p-${esc(m.id)}-${k}">${html}${CHEV}</button>`;
    const panel = (k, html) => `<div class="panel" id="p-${esc(m.id)}-${k}" data-open="${isOpen(k)}"${isOpen(k) ? "" : " inert"}><div class="panel-in"><div>${html}</div></div></div>`;
    const about = m.desc ? `<p>${esc(m.desc)}</p>` : "";
    const gear = (m.needs.length ? `<h4>Alat</h4><div class="chips">${m.needs.map(chip).join("")}</div>` : "") + (ings.length ? `<h4>Bahan</h4><div class="chips">${ings.map(chip).join("")}</div>` : "");
    const status = ready ? "Alat dan bahan lengkap" : "Kurang: " + miss.slice(0, 2).map(n => esc(nameOf(n))).join(", ") + (miss.length > 2 ? " dan " + (miss.length - 2) + " lainnya" : "");
    return `
      <article class="card reveal t-${m.type === "iced" ? "cold" : "hot"}${ready ? " ready" : ""}" style="--i:${Math.min(i, 8)}">
        <div class="photo">
          <div class="badges"><span class="badge">${BASES[m.base].name}</span>${m.sub && SUB_LABEL[m.sub] && !(m.gaya && GAYA_LABEL[m.gaya]) ? `<span class="badge sub">${SUB_LABEL[m.sub]}</span>` : ""}${m.gaya && GAYA_LABEL[m.gaya] ? `<span class="badge sub">${GAYA_LABEL[m.gaya]}</span>` : ""}</div>
          <span class="tpill ${m.type === "iced" ? "cold" : "hot"}">${m.type === "iced" ? "Dingin" : "Panas"}</span>
          ${photo}
        </div>
        <div class="body">
          <h3>${esc(m.name)}</h3>
          <div class="status ${ready ? "ok" : "no"}">${status}</div>
          ${tempChip(m)}
          <div class="togs">
            ${about ? tog("about", "Deskripsi") : ""}
            ${hist ? tog("hist", "Sejarah") : ""}
            ${gear ? tog("gear", `Alat &amp; bahan <span class="cnt">${m.needs.length + ings.length}</span>`) : ""}
          </div>
          ${about ? panel("about", about) : ""}
          ${hist ? panel("hist", histHtml(hist)) : ""}
          ${gear ? panel("gear", gear) : ""}
          <div class="foot">
            <button class="btn accent small" data-guide="${esc(m.id)}">Lihat panduan <small>${lines(m.steps).length} langkah</small></button>
            ${m.custom ? `<button class="btn ghost small" data-del="${esc(m.id)}">Hapus</button>` : ""}
          </div>
        </div>
      </article>`;
  }

  const STXT = new WeakMap();
  function searchText(m) {
    let t = STXT.get(m);
    if (t === undefined) { t = (m.name + " " + (m.desc || "")).toLowerCase(); STXT.set(m, t); }
    return t;
  }
  function filteredMenus() {
    const q = state.q.trim().toLowerCase();
    return menusOf(state.base)
      .filter(m => !SUBS[state.base] || state.sub === "semua" || m.sub === state.sub)
      .filter(m => !hasGaya() || state.gaya === "semua" || (m.gaya || "lainnya") === state.gaya)
      .filter(m => !q || searchText(m).includes(q))
      .filter(m => !state.onlyReady || isReady(m))
      .filter(m => state.temp === "semua" || (state.temp === "cold") === (m.type === "iced"));
  }
  function refreshList() {
    const l = $("#menus"); if (!l) return;
    const list = filteredMenus();
    l.innerHTML = menuListHtml(list);
    const c = $("#cnt"); if (c) c.textContent = list.length + " menu";
    document.querySelectorAll("[data-temp]").forEach(b => b.setAttribute("aria-pressed", b.dataset.temp === state.temp));
  }
  function menuListHtml(list = filteredMenus()) {
    if (!list.length) {
      return `<div class="empty">${state.onlyReady || state.q
        ? "Tidak ada menu yang cocok. Ubah pencarian atau matikan filter perlengkapan."
        : "Belum ada menu di sini. Tambahkan yang pertama."}</div>`;
    }
    return list.map(menuCard).join("");
  }
  const hasGaya = () => state.base === "teh" || state.base === "coklat";
  function gayaHtml() {
    if (!hasGaya()) return "";
    const all = menusOf(state.base);
    const n = id => id === "semua" ? all.length : all.filter(m => (m.gaya || "lainnya") === id).length;
    return `<div class="tabs reveal" style="--i:2;margin-top:10px" role="group" aria-label="Gaya menu">${GAYA.filter(g => g.id === "semua" || n(g.id)).map(g =>
      `<button class="tab" data-gaya="${g.id}" aria-pressed="${state.gaya === g.id}">${g.label}<small>${n(g.id)}</small></button>`).join("")}</div>`;
  }
  function tabsHtml() { return tabsHtmlSub() + gayaHtml(); }
  function tabsHtmlSub() {
    const tabs = SUBS[state.base];
    if (!tabs) return "";
    const all = menusOf(state.base);
    return `<div class="tabs reveal" style="--i:2" role="group" aria-label="Jenis menu">${tabs.map(t => {
      const n = t.id === "semua" ? all.length : all.filter(m => m.sub === t.id).length;
      return `<button class="tab" data-sub="${t.id}" aria-pressed="${state.sub === t.id}">${t.label}<small>${n}</small></button>`;
    }).join("")}</div>`;
  }

  function pageMenu() {
    const b = BASES[state.base];
    const menus = menusOf(state.base);
    app.innerHTML = `
      <div class="banner reveal" style="--i:0">
        ${decor(state.base).split("</span>").slice(0, 3).join("</span>")}</span>
        <div>
          <h1 class="page-title">Menu ${b.name.toLowerCase()}</h1>
          <p class="lead" style="color:var(--ink);opacity:.75">${b.lead}</p>
          <div class="stats">
            <div class="stat"><strong data-count="${menus.length}">${menus.length}</strong><span>total menu</span></div>
            <div class="stat"><strong data-count="${menus.filter(isReady).length}">${menus.filter(isReady).length}</strong><span>siap dibuat</span></div>
            <div class="stat"><strong data-count="${menus.filter(m => m.custom).length}">${menus.filter(m => m.custom).length}</strong><span>buatanmu</span></div>
          </div>
        </div>
        ${art(b.art.type, b.art.c, b.art.f, { marsh: b.art.marsh })}
      </div>
      ${tabsHtml()}
      <div class="controls reveal" style="--i:3">
        <input class="search" id="q" type="search" placeholder="Cari menu" aria-label="Cari menu" value="${esc(state.q)}">
        <label class="check"><input type="checkbox" id="ready" ${state.onlyReady ? "checked" : ""}> Hanya yang bisa kubuat</label>
        <div class="seg" role="group" aria-label="Filter suhu">${[["semua","Semua"],["hot","Panas"],["cold","Dingin"]].map(([id,l]) => `<button type="button" class="segb ${id}" data-temp="${id}" aria-pressed="${state.temp === id}">${l}</button>`).join("")}</div>
        <span class="cnt" id="cnt" aria-live="polite">${filteredMenus().length} menu</span>
        <span class="grow"></span>
        <button type="button" class="btn ghost" id="rand">Pilih menu untukku</button>
        <button class="btn accent" id="openAdd">+ Tambah menu</button>
      </div>
      <div class="menus" id="menus">${menuListHtml()}</div>
      <footer class="note">Menu yang kamu tambahkan tersimpan di browser ini.</footer>
      <div class="actions"><div class="wrap">
        <button class="btn ghost" data-go="perlengkapan">Ubah alat &amp; bahan</button>
        <button class="link-btn" data-go="bahan">Ganti jenis minuman</button>
      </div></div>`;
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-go]");
    if (nav) {
      e.preventDefault();
      if (!nav.disabled) go(nav.dataset.go);
      return;
    }
    if (!app.contains(e.target)) return;

    const pick = e.target.closest("[data-pick]");
    if (pick) {
      const id = pick.dataset.pick;
      if (BASES[id]) {
        if (state.base !== id) { state.sub = "semua"; state.gaya = "semua"; }
        state.base = id; save(); render();
        setTimeout(() => { if (route() === "bahan" && state.base === id) go("perlengkapan"); }, 420);
      }
      return;
    }
    const g = e.target.closest("[data-gear]");
    if (g) {
      const id = g.dataset.gear;
      state.owned = state.owned.includes(id) ? state.owned.filter(x => x !== id) : state.owned.concat(id);
      save();
      g.setAttribute("aria-pressed", state.owned.includes(id));
      $("#side").innerHTML = asideHtml(); const rh = $("#readyHint"); if (rh) rh.textContent = readyText();
      return;
    }
    const sec = e.target.closest("[data-sec]");
    if (sec) {
      const ids = sec.dataset.sec.split(",");
      state.owned = ids.every(x => state.owned.includes(x))
        ? state.owned.filter(x => !ids.includes(x))
        : Array.from(new Set(state.owned.concat(ids)));
      save(); render();
      return;
    }
    const act = e.target.closest("[data-act]");
    if (act) {
      const ids = gearForBase(state.base).concat(ingForBase(state.base)).map(x => x.id);
      state.owned = act.dataset.act === "all"
        ? Array.from(new Set(state.owned.concat(ids)))
        : state.owned.filter(x => !ids.includes(x));
      save(); render();
      return;
    }
    const tg = e.target.closest("[data-tog]");
    if (tg) {
      const key = tg.dataset.id + ":" + tg.dataset.tog, pn = document.getElementById("p-" + tg.dataset.id + "-" + tg.dataset.tog);
      const on = tg.getAttribute("aria-expanded") !== "true";
      tg.setAttribute("aria-expanded", on);
      if (pn) { pn.dataset.open = on; pn.inert = !on; }
      if (on) openCards.add(key); else openCards.delete(key);
      return;
    }
    const gd = e.target.closest("[data-guide]");
    if (gd) { openGuide(gd.dataset.guide); return; }
    const tab = e.target.closest("[data-sub]");
    if (tab) { state.sub = tab.dataset.sub; render(); return; }
    const gtab = e.target.closest("[data-gaya]");
    if (gtab) { state.gaya = gtab.dataset.gaya; render(); return; }
    const tp = e.target.closest("[data-temp]");
    if (tp) { state.temp = tp.dataset.temp; refreshList(); return; }
    if (e.target.closest("#rand")) {
      const l = filteredMenus();
      if (!l.length) { toast("Belum ada menu yang cocok"); return; }
      const m = l[Math.floor(Math.random() * l.length)];
      toast("Coba: " + m.name); openGuide(m.id); return;
    }
    if (e.target.closest("#openAdd")) { openAdd(); return; }
    const del = e.target.closest("[data-del]");
    if (del && confirm("Hapus menu ini?")) {
      state.custom = state.custom.filter(m => m.id !== del.dataset.del);
      save(); render(); toast("Menu dihapus");
    }
  });

  app.addEventListener("input", e => {
    if (e.target.id === "q") { state.q = e.target.value; refreshList(); }
  });
  app.addEventListener("change", e => {
    if (e.target.id === "ready") { state.onlyReady = e.target.checked; refreshList(); }
  });

  /* Cup follows the pointer a little on the drink panels */
  app.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const b = e.target.closest(".base");
    if (!b) return;
    const r = b.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    b.style.setProperty("--tx", (px * 16).toFixed(1) + "px");
    b.style.setProperty("--ty", (py * 10).toFixed(1) + "px");
    b.style.setProperty("--rot", (px * 9).toFixed(1) + "deg");
  });
  app.addEventListener("pointerout", e => {
    const b = e.target.closest(".base");
    if (b && !b.contains(e.relatedTarget)) {
      b.style.removeProperty("--tx"); b.style.removeProperty("--ty"); b.style.removeProperty("--rot");
    }
  });


  /* ---------- Panduan ---------- */
  const gDlg = $("#guideDlg");
  const fmtQty = t => { const x = esc(t).match(/^(\d[\d\/.,–\s]*(?:g|ml|sdm|sdt|shot|porsi|buah)?)\s+(.+)$/); return x ? `<b class="q">${x[1].trim()}</b> ${x[2]}` : esc(t); };
  const fmtStep = t => esc(t).replace(/(\d+(?:[–-]\d+)?\s?(?:°C|ml|g\b|detik|menit|jam|sdm))/g, "<mark>$1</mark>");
  const fmtTime = s => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  function stepTime(t) {
    const m = String(t).match(/(\d+)(?:[–-](\d+))?\s*(detik|menit)/);
    return m ? +(m[2] || m[1]) * (m[3] === "menit" ? 60 : 1) : 0;
  }

  let tInt = null, tBox = null;
  const RING = 113.1;
  function paintTimer(b) {
    const tot = +b.dataset.total, left = +b.dataset.left;
    b.querySelector(".tt").textContent = fmtTime(left);
    b.querySelector(".prg").style.strokeDashoffset = (RING * (1 - left / tot)).toFixed(1);
  }
  function pauseTimer() {
    clearInterval(tInt); tInt = null;
    if (tBox) {
      tBox.classList.remove("run");
      const g = tBox.querySelector(".tgo");
      if (g && !tBox.classList.contains("done")) g.textContent = +tBox.dataset.left < +tBox.dataset.total ? "Lanjut" : "Mulai";
    }
  }
  function stopTimer() { pauseTimer(); tBox = null; }
  function resetTimer(b) {
    if (tBox === b) stopTimer();
    b.classList.remove("run", "done"); b.dataset.left = b.dataset.total;
    b.querySelector(".tgo").textContent = "Mulai"; b.querySelector(".tl").textContent = "Timer langkah ini";
    paintTimer(b);
  }
  function toggleTimer(b) {
    if (b.classList.contains("done")) { resetTimer(b); return; }
    if (tBox === b && tInt) { pauseTimer(); return; }
    stopTimer(); tBox = b; b.classList.add("run"); b.querySelector(".tgo").textContent = "Jeda";
    tInt = setInterval(() => {
      const l = +b.dataset.left - 1; b.dataset.left = l; paintTimer(b);
      if (l > 0) return;
      pauseTimer(); b.classList.add("done");
      b.querySelector(".tgo").textContent = "Ulangi"; b.querySelector(".tl").textContent = "Waktu habis! Lanjut ke langkah berikutnya.";
      try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
      chime();
    }, 1000);
  }
  gDlg.addEventListener("close", stopTimer);

  function openGuide(id) {
    const m = allMenus().find(x => x.id === id);
    if (!m) return;
    gMenu = m; gFired = false; gDlg.classList.remove("win");
    const vk = varKey(m), vOpts = VAR[vk], vSel = vOpts.find(o => o.id === state.variant[vk]) || vOpts[0], dose = +state.dose[vk] || 100, brand = state.brand[vk] || "";
    const R = buildDetail(m, vk, vSel, dose, brand), steps = R.steps, ings = R.ings, miss = R.miss;
    const photo = m.img ? `<img class="g-photo" src="${esc(m.img)}" alt="Foto ${esc(m.name)}">` : drawMenu(m);
    const lack = t => R.adIds.some(id => { const g = ingAll().find(x => x.id === id); return g && g.re.test(t) && !state.owned.includes(id); });
    $("#guideContent").innerHTML = `
      <div class="g-head">
        <div>
          <div class="badges"><span class="badge">${BASES[m.base].name}</span>${m.sub && SUB_LABEL[m.sub] && !(m.gaya && GAYA_LABEL[m.gaya]) ? `<span class="badge sub">${SUB_LABEL[m.sub]}</span>` : ""}${m.gaya && GAYA_LABEL[m.gaya] ? `<span class="badge sub">${GAYA_LABEL[m.gaya]}</span>` : ""}</div>
          <h2 id="gTitle">${esc(m.name)}</h2>
          ${m.desc ? `<p>${esc(m.desc)}</p>` : ""}
          <div class="g-meta">
            <span>${m.needs.length} alat</span><span>${ings.length} bahan</span><span>${steps.length} langkah</span>${vSel.id !== "umum" ? `<span>${esc(vSel.l)}</span>` : ""}${dose !== 100 ? `<span>Takaran ${dose}%</span>` : ""}${brand ? `<span>${esc(brand)}</span>` : ""}
          </div>
        </div>
        ${photo}
      </div>
      <div class="say-row"><div class="say" id="gSay" role="status" aria-live="polite">${esc(m.type === "iced" ? SAY.cs : SAY.hs)}</div></div>
      <div class="g-body">
        <section class="g-sec">
          <h3><span class="sn">1</span>Siapkan alat dan bahan</h3>
          <div class="vbox">
            <div class="vl">Bahan utama</div>
            <div class="vopts">${vOpts.map(o => `<button type="button" class="vopt" data-var="${o.id}" aria-pressed="${o === vSel}">${o.l}</button>`).join("")}</div>
            <p class="vnote">${esc(vSel.n)}</p>
            <div class="vrow">
              <label>Merek<input type="text" id="gBrand" maxlength="40" placeholder="Opsional" value="${esc(brand)}"></label>
              <label>Takaran<select id="gDose">${DOSE.map(d => `<option value="${d}"${d === dose ? " selected" : ""}>${d}%</option>`).join("")}</select></label>
            </div>
            <p class="vnote">Takaran mengubah berat bahan utama (gram atau sendok) beserta langkah yang menyebutnya. Beda merek bisa beda rasa, jadi tulis mereknya sebagai pengingat.</p>
          </div>
          ${(R.chg.length || R.note.length) ? `<div class="vchg">${R.chg.length ? `<b>Yang disesuaikan untuk pilihanmu</b><ul>${R.chg.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${R.note.length ? `<b${R.chg.length ? ' style="margin-top:8px"' : ""}>Catatan</b><ul>${R.note.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>` : ""}
          <h4>Ringkasan resep</h4>
          <div class="dfacts">${R.facts.map(r => `<div class="dfact"><small>${esc(r[0])}</small><b>${esc(r[1])}</b>${r[2] ? `<em>${esc(r[2])}</em>` : ""}</div>`).join("")}</div>
          ${R.subs.length ? `<details class="dsub"><summary>Alternatif untuk alat yang belum ada (${R.subs.length})</summary><ul>${R.subs.map(x => `<li><b>${esc(x[0])}:</b> ${esc(x[1])}</li>`).join("")}</ul></details>` : ""}
          ${miss.length
            ? `<div class="g-warn">Belum kamu punya: <b>${miss.map(n => esc(nameOf(n))).join(", ")}</b>. Ubah pilihanmu di langkah Alat &amp; bahan, atau cari penggantinya.</div>`
            : `<div class="g-ok">Alat dan bahan sudah lengkap. Siap mulai.</div>`}
          <h4>Alat</h4>
          <div class="chips">${m.needs.map(n => `<span class="chip ${state.owned.includes(n) ? "have" : "miss"}">${esc(nameOf(n))}</span>`).join("")}</div>
          <h4>Bahan <small>Centang saat sudah disiapkan</small></h4>
          ${ings.length
            ? `<ul class="ings">${ings.map(t => `<li><label class="ing${lack(t) ? " lack" : ""}"><input type="checkbox"><span>${fmtQty(t)}</span>${lack(t) ? '<em class="tag">belum ada</em>' : ""}</label></li>`).join("")}</ul>`
            : `<p class="g-empty">Belum ada daftar bahan untuk menu ini.</p>`}
        </section>
        <section class="g-sec">
          <h3><span class="sn">2</span>Ikuti langkahnya <small id="gCount">0 dari ${steps.length} selesai</small></h3>
          ${steps.length ? `
            ${R.tips.some(t => t.length) ? `<button type="button" class="link-btn gtips" id="gTips" aria-pressed="false">Buka semua detail</button>` : ""}
            <div class="progress" aria-hidden="true"><div id="gBar"></div></div>
            <ol class="steps">${steps.map((t, i) => {
              const sec = stepTime(t);
              return `<li class="stp" data-i="${i}">
                <button type="button" class="step" aria-pressed="false"><span class="n">${i + 1}</span><span class="tx">${fmtStep(t)}</span></button>
                ${sec ? `<div class="tmr" data-total="${sec}" data-left="${sec}"><svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="trk" cx="22" cy="22" r="18"/><circle class="prg" cx="22" cy="22" r="18"/></svg><span class="tt" role="timer">${fmtTime(sec)}</span><span class="tl">Timer langkah ini</span><button type="button" class="tgo" data-tgo>Mulai</button><button type="button" class="trs" data-trs aria-label="Atur ulang timer">↺</button></div>` : ""}
                ${R.tips[i] && R.tips[i].length ? `<details class="tip"><summary>Detail langkah</summary><ul>${R.tips[i].map(x => `<li>${esc(x)}</li>`).join("")}</ul></details>` : ""}
              </li>`; }).join("")}
            </ol>
            <div class="g-done" id="gDone">Selesai. Minumanmu siap disajikan.</div>`
            : `<p class="g-empty">Belum ada langkah untuk menu ini.</p>`}
        </section>
        ${R.fix.length ? `<section class="g-sec">
          <h3><span class="sn">3</span>Kalau rasanya kurang pas</h3>
          <p class="g-empty">Angka dihitung dari takaran ${dose}%${brand ? " dan merek " + esc(brand) : ""}. Ubah satu hal saja tiap percobaan.</p>
          ${R.fix.map(x => `<details class="tsi"><summary>${esc(x[0])}</summary><ul>${x[1].map(y => `<li>${esc(y)}</li>`).join("")}</ul></details>`).join("")}
        </section>` : ""}
      </div>
      <div class="g-foot">
        <span class="hint">Ketuk langkah untuk menandainya selesai</span>
        <span style="display:flex;gap:8px">
          <button type="button" class="btn ghost small" id="gReset">Ulangi</button>
          <button type="button" class="btn accent small" id="gNext" data-mode="${steps.length ? "next" : "close"}">${steps.length ? "Selesai langkah 1" : "Tutup"}</button>
        </span>
      </div>`;
    if (!gDlg.open) gDlg.showModal();
    const body = $(".g-body", gDlg); if (body) body.scrollTop = 0;
    updateGuideProgress(false);
  }
  function setStep(li, on) {
    li.querySelector(".step").setAttribute("aria-pressed", on);
    li.querySelector(".n").textContent = on ? "✓" : +li.dataset.i + 1;
  }
  function updateGuideProgress(scroll) {
    const li = Array.from(gDlg.querySelectorAll(".stp"));
    if (!li.length) return;
    const isDone = x => x.querySelector(".step").getAttribute("aria-pressed") === "true";
    const done = li.filter(isDone).length, cur = li.find(x => !isDone(x));
    li.forEach(x => x.classList.toggle("cur", x === cur));
    $("#gBar").style.width = Math.round(done / li.length * 100) + "%";
    $("#gCount").textContent = done + " dari " + li.length + " selesai";
    $("#gDone").classList.toggle("show", !cur); gDlg.classList.toggle("win", !cur);
    if (!cur && !gFired) { gFired = true; celebrate(); } else if (cur) gFired = false;
    const say = $("#gSay");
    if (say && gMenu) {
      const cold = gMenu.type === "iced";
      if (!cur) say.textContent = cold ? SAY.cd : SAY.hd;
      else if (scroll) { const L = cold ? SAY.c2 : SAY.h2; say.textContent = L[done % L.length]; const a = $(".g-head .art-svg"); if (a) { a.classList.remove("nod"); void a.getBoundingClientRect(); a.classList.add("nod"); } }
      else if (done === 0) say.textContent = cold ? SAY.cs : SAY.hs;
    }
    const nx = $("#gNext");
    nx.textContent = cur ? "Selesai langkah " + (li.indexOf(cur) + 1) : "Tutup";
    nx.dataset.mode = cur ? "next" : "close";
    if (cur && scroll) cur.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
  }
  gDlg.addEventListener("click", e => {
    if (e.target === gDlg || e.target.closest("#gClose")) { gDlg.close(); return; }
    const tgo = e.target.closest("[data-tgo]");
    if (tgo) { toggleTimer(tgo.closest(".tmr")); return; }
    const trs = e.target.closest("[data-trs]");
    if (trs) { resetTimer(trs.closest(".tmr")); return; }
    if (e.target.closest("#gNext")) {
      if ($("#gNext").dataset.mode === "close") { gDlg.close(); return; }
      const cur = gDlg.querySelector(".stp.cur");
      if (cur) { setStep(cur, true); stopTimer(); updateGuideProgress(true); }
      return;
    }
    const st = e.target.closest(".step");
    if (st) { const li = st.closest(".stp"); setStep(li, st.getAttribute("aria-pressed") !== "true"); updateGuideProgress(true); return; }
    if (e.target.closest("#gReset")) {
      stopTimer(); gDlg.querySelectorAll(".tmr").forEach(resetTimer);
      gDlg.querySelectorAll(".stp").forEach(li => setStep(li, false));
      gDlg.querySelectorAll(".ing input").forEach(c => { c.checked = false; });
      updateGuideProgress(false);
    }
  });

  /* ---------- Dimensi tema: latar hidup per kategori ---------- */
  const Scene = window.__scene = (() => {
    const el = $("#scene"), cv = el.querySelector("canvas"), cx = cv.getContext("2d");
    const R = (a, b) => a + Math.random() * (b - a), pick = a => a[(Math.random() * a.length) | 0];
    const BC = ["#4a2c17", "#6a3d1f", "#3a1f10"], NC = ["#6b2f1d", "#8a3b22", "#5a2616"], LC = ["#6f9448", "#86ad52", "#c4902f", "#3f5a22"], MC = ["#fffaf2", "#f9d4dd"];
    const CONF = { kopi: [["bean", 22]], coklat: [["nib", 12], ["marsh", 7], ["bub", 10]], teh: [["leaf", 18]], mix: [["bean", 6], ["leaf", 6], ["nib", 5]] };
    const WAVES = {
      kopi: [{ b: .9, a: 10, f: .006, s: .5, c: "rgba(120,78,44,.30)", p: .04 }, { b: .94, a: 8, f: .009, s: -.7, c: "rgba(255,244,226,.55)", p: .07 }],
      coklat: [{ b: .9, a: 11, f: .007, s: .6, c: "rgba(94,38,22,.32)", p: .04 }, { b: .95, a: 8, f: .01, s: -.8, c: "rgba(70,26,14,.45)", p: .07 }],
      teh: [{ b: .8, a: 18, f: .004, s: .3, c: "rgba(111,148,72,.30)", p: .03 }, { b: .87, a: 14, f: .006, s: -.4, c: "rgba(79,122,58,.36)", p: .05 }, { b: .94, a: 10, f: .009, s: .5, c: "rgba(63,90,34,.42)", p: .08 }]
    };
    let W = 0, H = 0, theme = "mix", P = [], raf = 0, last = 0, t = 0, fade = 1, sy = 0, mx = 0, my = 0, mxs = 0, mys = 0;
    function mk(k) {
      const z = R(.3, 1), base = { bean: 10, leaf: 14, nib: 8, marsh: 8, bub: 5 }[k], grow = { bean: 20, leaf: 18, nib: 9, marsh: 10, bub: 10 }[k];
      return { k, x: R(0, W), y: R(0, H), z, s: base + z * grow, r: R(0, 6.28), vr: R(-.5, .5), vy: k === "leaf" ? R(14, 26) * z + 8 : -(R(6, 14) * z + 4), vx: R(-4, 4), sw: R(6, 18), ph: R(0, 6.28),
        c: k === "bean" ? pick(BC) : k === "nib" ? pick(NC) : k === "leaf" ? pick(LC) : k === "marsh" ? pick(MC) : "#fff" };
    }
    function spawn() { P = []; const f = W < 760 ? .55 : 1; CONF[theme].forEach(([k, n]) => { for (let i = 0; i < Math.round(n * f); i++) P.push(mk(k)); }); P.sort((a, b) => a.z - b.z); }
    function size() { const d = Math.min(1.5, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); spawn(); if (!raf) draw(0); }
    function wave(L) {
      cx.beginPath(); cx.moveTo(0, H);
      for (let x = 0; x <= W + 24; x += 24) cx.lineTo(x, H * L.b + Math.sin(x * L.f + t * L.s) * L.a + Math.min(sy, 300) * L.p);
      cx.lineTo(W, H); cx.closePath(); cx.fillStyle = L.c; cx.fill();
    }
    function shape(p) {
      const s = p.s;
      if (p.k === "bean") { cx.fillStyle = p.c; cx.beginPath(); cx.ellipse(0, 0, s * .55, s * .8, 0, 0, 6.28); cx.fill(); cx.strokeStyle = "rgba(241,228,207,.7)"; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(0, -s * .7); cx.quadraticCurveTo(-s * .3, 0, 0, 0); cx.quadraticCurveTo(s * .3, 0, 0, s * .7); cx.stroke(); }
      else if (p.k === "leaf") { cx.fillStyle = p.c; cx.beginPath(); cx.moveTo(0, -s); cx.quadraticCurveTo(s * .8, 0, 0, s); cx.quadraticCurveTo(-s * .8, 0, 0, -s); cx.fill(); cx.strokeStyle = "rgba(255,255,255,.4)"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(0, -s * .9); cx.lineTo(0, s * .9); cx.stroke(); }
      else if (p.k === "bub") { cx.strokeStyle = "rgba(255,255,255,.7)"; cx.fillStyle = "rgba(255,255,255,.14)"; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(0, 0, s * .6, 0, 6.28); cx.fill(); cx.stroke(); cx.fillStyle = "rgba(255,255,255,.8)"; cx.beginPath(); cx.arc(-s * .2, -s * .2, s * .12, 0, 6.28); cx.fill(); }
      else { cx.fillStyle = p.c; cx.beginPath(); const w = p.k === "marsh" ? s * 1.1 : s * .8; if (cx.roundRect) cx.roundRect(-w / 2, -w / 2, w, w, w * .3); else cx.rect(-w / 2, -w / 2, w, w); cx.fill(); }
    }
    function draw(dt) {
      cx.clearRect(0, 0, W, H); mxs += (mx - mxs) * .05; mys += (my - mys) * .05;
      cx.globalAlpha = fade;
      if (theme === "teh") for (let i = 0; i < 2; i++) { const X = (((t * 8 * (i ? -1 : 1) + i * W * .6) % (W * 1.4)) + W * 1.4) % (W * 1.4) - W * .2, Y = H * (.35 + i * .3), g = cx.createRadialGradient(X, Y, 0, X, Y, W * .45); g.addColorStop(0, "rgba(255,255,255,.35)"); g.addColorStop(1, "rgba(255,255,255,0)"); cx.fillStyle = g; cx.fillRect(0, 0, W, H); }
      if (theme === "kopi") for (let i = 0; i < 4; i++) {
        const u = ((t * (.03 + i * .006) + i * .27) % 1), cy = H * (1 - u), x = W * (.15 + i * .23), a = Math.sin(u * Math.PI) * .2 * fade;
        cx.strokeStyle = "rgba(255,255,255," + a.toFixed(3) + ")"; cx.lineWidth = 16; cx.lineCap = "round"; cx.beginPath();
        for (let k = 0; k <= 12; k++) { const py = cy + k * H * .02, px = x + Math.sin(py * .012 + t * .8 + i) * 24 + mxs * 20; k ? cx.lineTo(px, py) : cx.moveTo(px, py); }
        cx.stroke();
      }
      (WAVES[theme] || []).forEach(wave);
      P.forEach(p => {
        p.y += p.vy * dt; p.r += p.vr * dt; p.x += (p.vx + Math.sin(t * .8 + p.ph) * p.sw) * dt;
        if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40;
        if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;
        const X = p.x + mxs * p.z * 36, Y = ((p.y - sy * p.z * .18 + 40) % (H + 80) + (H + 80)) % (H + 80) - 40 + mys * p.z * 18;
        cx.save(); cx.globalAlpha = fade * (.35 + .5 * p.z); cx.translate(X, Y); cx.rotate(p.r); shape(p); cx.restore();
      });
      cx.globalAlpha = 1;
    }
    function frame(ts) { raf = requestAnimationFrame(frame); const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts; t += dt; fade = Math.min(1, fade + dt / .7); draw(dt); }
    function start() { if (reduceMotion()) { fade = 1; draw(0); return; } if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    window.addEventListener("resize", size);
    window.addEventListener("scroll", () => { sy = window.scrollY; }, { passive: true });
    window.addEventListener("pointermove", e => { if (e.pointerType === "mouse") { mx = e.clientX / (W || 1) - .5; my = e.clientY / (H || 1) - .5; } }, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });
    size(); start();
    return { set(id) { if (!CONF[id]) id = "mix"; if (id === theme) return; theme = id; el.dataset.t = id; fade = 0; spawn(); if (!raf) { fade = 1; draw(0); } } };
  })();
  /* pratinjau tema saat kartu pilihan disorot */
  const themeBack = () => { document.body.dataset.theme = state.base || ""; Scene.set(state.base || "mix"); };
  const themePeek = id => { document.body.dataset.theme = id; Scene.set(id); };
  app.addEventListener("pointerover", e => { if (e.pointerType !== "mouse") return; const b = e.target.closest(".base"); if (b && b.dataset.pick) themePeek(b.dataset.pick); });
  app.addEventListener("pointerout", e => { if (e.pointerType !== "mouse") return; const b = e.target.closest(".base"); if (b && !b.contains(e.relatedTarget)) themeBack(); });
  app.addEventListener("focusin", e => { const b = e.target.closest(".base"); if (b && b.dataset.pick) themePeek(b.dataset.pick); });
  app.addEventListener("focusout", e => { const b = e.target.closest(".base"); if (b && !b.contains(e.relatedTarget)) themeBack(); });

  /* ---------- Ucapan karakter ---------- */
  const SAY = {
    hs: "Halo, aku Si Hangat! Ayo seduh bareng, pelan-pelan saja.",
    cs: "Brrr, aku Si Sejuk! Yuk bikin yang segar.",
    h2: ["Mantap! Lanjut ke langkah berikutnya.", "Wanginya sudah mulai terasa nih.", "Bagus, jaga suhunya ya.", "Sedikit lagi hangatnya jadi!"],
    c2: ["Sip! Es batunya jangan lupa.", "Segarnya makin dekat nih.", "Keren, terus kocok yang rata.", "Tinggal sedikit lagi, semangat!"],
    hd: "Hangatnya pas! Selamat menikmati, ya.",
    cd: "Segar banget! Cheers!"
  };
  /* ---------- Jenis bahan utama, merek, takaran ---------- */
  const VAR = {
    kopi: [
      { id: "umum", l: "Umum", n: "Resep standar, cocok untuk biji atau bubuk apa saja." },
      { id: "biji", l: "Biji utuh", n: "Giling sendiri sesaat sebelum menyeduh. Halus untuk espresso, sedang untuk V60, kasar untuk cold brew.", pre: "Giling biji kopi sesuai takaran." },
      { id: "bubuk", l: "Bubuk siap seduh", n: "Langkah menggiling dilewati. Kehalusan tiap merek berbeda: kalau terlalu pahit, kurangi takaran 10%; kalau hambar, tambah 10%.", skip: /^giling/i }
    ],
    coklat: [
      { id: "umum", l: "Umum", n: "Resep standar." },
      { id: "batang", l: "Coklat batang", n: "Cincang halus agar cepat meleleh dan tidak bergerindil." },
      { id: "bubuk", l: "Bubuk coklat", n: "Bubuk biasanya tidak semanis batang. Sebagai perkiraan, 3 sdm bubuk setara 40 g batang; tambah gula sesuai selera." }
    ],
    teh: [
      { id: "umum", l: "Umum", n: "Resep standar." },
      { id: "daun", l: "Daun lepas", n: "Takar sesuai resep, lalu saring setelah diseduh." },
      { id: "kantong", l: "Kantong celup", n: "Satu kantong celup kira-kira 2 g. Rendam sesuai petunjuk kemasan dan jangan diperas agar tidak sepat." }
    ],
    matcha: [
      { id: "umum", l: "Umum", n: "Resep standar." },
      { id: "seremonial", l: "Grade seremonial", n: "Lembut dan manis alami. Cocok untuk usucha atau dinikmati tanpa susu." },
      { id: "kuliner", l: "Grade kuliner", n: "Lebih pahit dan tegas. Cocok untuk latte; tambahkan sedikit pemanis bila perlu." }
    ]
  };
  const DOSE = [80, 90, 100, 110, 120];
  const varKey = m => m.sub === "matcha" ? "matcha" : m.base;
  const scaleLine = (t, d) => d === 100 ? t : t.replace(/^(\d+(?:[.,]\d+)?)(\s?g\b)/, (_, n, u) => String(+(parseFloat(n.replace(",", ".")) * d / 100).toFixed(1)).replace(".", ",") + u);
  /* ---------- Detail resep: dihitung dari bahan utama, merek, takaran, dan alat yang kamu punya ---------- */
  const fx1 = n => String(+n.toFixed(1)).replace(".", ",");
  const px1 = s => parseFloat(String(s).replace(",", "."));
  const half = n => Math.round(n * 2) / 2;
  const MAIN_RE = /kopi|espresso|teh\b|matcha|coklat|jahe|krisan|oolong|sencha|hojicha|genmaicha|malt|wijen|jelai|kurma|pu-?erh|earl grey/i;
  const QTY_RE = /^(\d+(?:[.,]\d+)?)(?:(\s?[–-]\s?)(\d+(?:[.,]\d+)?))?(\s?)(g|sdm|sdt)\b/;
  const G_STEP = /(\d+(?:[.,]\d+)?)(?:(\s?[–-]\s?)(\d+(?:[.,]\d+)?))?(\s?g\b)(?!\s+es\b)/g;
  /* Takaran mengubah berat bahan utama (g, sdm, sdt). Volume cairan, suhu, dan waktu tetap. */
  function scaleIng(t, d) {
    if (d === 100 || !MAIN_RE.test(t)) return t;
    return t.replace(QTY_RE, (_, a, sep, b, sp, u) => {
      const f = x => u === "g" ? fx1(px1(x) * d / 100) : fx1(half(px1(x) * d / 100));
      return f(a) + (b ? sep + f(b) : "") + sp + u;
    });
  }
  const scaleStep = (t, d) => d === 100 ? t : t.replace(G_STEP, (_, a, sep, b, u) => fx1(px1(a) * d / 100) + (b ? sep + fx1(px1(b) * d / 100) : "") + u);

  const GRIND_D = { "halus": ["Halus", "seperti gula pasir halus"], "halus-sedang": ["Halus–sedang", "seperti pasir pantai halus"], "sedang-halus": ["Sedang–halus", "sedikit lebih halus dari garam meja"], "sedang": ["Sedang", "seperti garam meja"], "kasar-sedang": ["Kasar–sedang", "antara garam meja dan garam kasar"], "kasar": ["Kasar", "seperti garam kasar"] };
  const GRIND_L = { espresso: "espresso", moka: "moka pot", aeropress: "AeroPress atau drip halus", v60: "V60 atau pour over", frenchpress: "French press" };
  function grindOf(m) {
    if (m.base !== "kopi") return null;
    const nd = m.needs || [], w = (String(m.ing || "").match(/kopi bubuk\s+(halus-sedang|sedang-halus|kasar-sedang|halus|sedang|kasar)/i) || [])[1];
    const k = w ? w.toLowerCase() : nd.includes("espresso") ? "halus" : nd.includes("moka") || nd.includes("aeropress") ? "halus-sedang" : nd.includes("v60") ? "sedang" : nd.includes("frenchpress") ? "kasar" : "";
    if (!GRIND_D[k]) return null;
    const lab = ["espresso", "moka", "aeropress", "v60", "frenchpress"].find(x => nd.includes(x));
    return { l: GRIND_D[k][0], d: GRIND_D[k][1], lab: GRIND_L[lab] || "" };
  }

  /* Bahan utama: ganti bahan dan langkah sesuai pilihan (biji/bubuk, batang/bubuk, daun/kantong, grade matcha) */
  function applyVariant(m, vk, vid, d, ings, steps) {
    const chg = [], note = [], diff = (a, b) => a.length !== b.length || a.some((x, i) => x !== b[i]);
    let i2 = ings.slice(), s2 = steps.slice();
    if (d !== 100) chg.push("Takaran " + d + "%: berat bahan utama dikali " + fx1(d / 100) + ". Volume cairan, suhu, dan waktu tetap.");
    if (vk === "kopi" && vid === "biji") {
      i2 = i2.map(t => t.replace(/kopi bubuk(?:\s+(halus-sedang|sedang-halus|kasar-sedang|halus|sedang|kasar))?/i, (_, w) => "biji kopi utuh" + (w ? " (digiling " + w.toLowerCase() + ")" : "")));
      if (diff(ings, i2)) chg.push("Kopi bubuk diganti biji utuh yang digiling sendiri.");
    }
    if (vk === "coklat" && vid === "batang") {
      i2 = i2.map(t => t.replace(/^(\d+(?:[.,]\d+)?)\s*sdm bubuk coklat/i, (_, n) => Math.round(px1(n) * 13.3) + " g coklat batang cincang"));
      if (diff(ings, i2)) {
        s2 = s2.map(t => t.replace(/bubuk coklat/gi, "coklat batang cincang"));
        chg.push("Bubuk coklat diganti coklat batang (1 sdm bubuk setara sekitar 13 g batang).");
        note.push("Coklat batang sudah manis. Kurangi gula sekitar 1 sdm, lalu tambahkan lagi kalau kurang manis.");
      }
    }
    if (vk === "coklat" && vid === "bubuk") {
      let dark = false;
      i2 = i2.map(t => t.replace(/^(\d+(?:[.,]\d+)?)\s*g\s+coklat batang(\s+gelap)?/i, (_, n, g) => { if (g) dark = true; return fx1(half(px1(n) / 13.3)) + " sdm bubuk coklat (setara " + n + " g batang)"; }));
      if (diff(ings, i2)) {
        s2 = s2.map(t => t.replace(/coklat cincang/gi, "bubuk coklat"));
        if (!dark) i2.push("1 sdm gula tambahan (bubuk kurang manis dari batang)");
        chg.push("Coklat batang diganti bubuk coklat (sekitar 13 g batang per sdm bubuk).");
        note.push("Larutkan bubuk dengan sedikit susu panas menjadi pasta dulu, baru tambahkan sisanya agar tidak bergerindil.");
      }
    }
    if (vk === "teh" && vid === "kantong") {
      i2 = i2.map(t => /kantong/i.test(t) ? t : t.replace(/^(\d+(?:[.,]\d+)?)\s*g\s+(?=teh\b|sencha|genmaicha|hojicha|oolong|pu-?erh|earl grey)/i, (_, n) => Math.max(1, Math.round(px1(n) / 2)) + " kantong "));
      if (diff(ings, i2)) {
        const rp = /jahe|krisan|jelai|kurma/i.test(ings.join(" ")) ? "Angkat kantong dan saring" : "Angkat kantong";
        s2 = s2.map(t => t
          .replace(/^Saring ke gelas/i, rp + ", lalu tuang ke gelas")
          .replace(/^Saring\b/i, rp)
          .replace(/\blalu saring\b/gi, "lalu " + rp.toLowerCase())
          .replace(/([,;])\s*saring\b/gi, "$1 " + rp.toLowerCase()));
        chg.push("Daun teh diganti kantong celup (sekitar 2 g per kantong). Menyaring diganti mengangkat kantong.");
        note.push("Jangan peras kantong celup dan angkat tepat waktu agar tidak sepat.");
      }
    }
    if (vk === "matcha" && vid === "kuliner") {
      if (/susu/i.test(ings.join(" "))) { i2.push("1 sdt gula atau sirup (opsional, penyeimbang pahit grade kuliner)"); chg.push("Ditambah pemanis opsional untuk menyeimbangkan pahit grade kuliner."); }
      else if (/usucha/i.test(m.name)) note.push("Grade kuliner terasa lebih pahit. Untuk usucha murni, grade seremonial lebih enak.");
    }
    if (vk === "matcha" && vid === "seremonial" && /susu/i.test(ings.join(" "))) note.push("Grade seremonial sudah lembut dan manis alami. Coba dulu tanpa pemanis tambahan.");
    return { ings: i2, steps: s2, chg: chg, note: note };
  }

  const SUBST = {
    espresso: "Seduh pekat dengan moka pot atau AeroPress (sekitar 15–18 g kopi untuk 60–80 ml air). Rasanya mendekati espresso untuk dicampur susu.",
    moka: "Seduh pekat dengan AeroPress (18 g kopi, 100 ml air) lalu pakai seperti kopi moka.",
    v60: "Pakai saringan teh atau corong dengan kertas filter kopi di atas gelas, lalu tuang air perlahan dengan pola yang sama.",
    frenchpress: "Rendam kopi di toples atau teko, lalu saring dengan kertas filter atau kain bersih.",
    aeropress: "Pakai French press atau V60 dengan takaran yang sama. Rasanya akan sedikit berbeda.",
    saucepan: "Pakai panci apa saja, atau panaskan di microwave 30 detik bergantian sambil diaduk.",
    whisk: "Pakai garpu atau sendok dengan gerakan cepat, atau kocok di botol tertutup.",
    teapot: "Pakai gelas atau teko tahan panas, lalu tutup dengan piring kecil agar panas tertahan.",
    chawan: "Pakai mangkuk kecil yang lebar agar mudah dikocok.",
    gaiwan: "Pakai cangkir bertutup atau teko kecil dengan waktu seduh yang sama.",
    chasen: "Pakai whisk kecil atau frother tangan, atau kocok di botol tertutup rapat.",
    grinder: "Pilih opsi Bubuk siap seduh di atas, lalu beli bubuk berlabel sesuai alat seduhmu.",
    chashaku: "Satu sendok bambu kira-kira 1 g. Sebagai pengganti, pakai 1/2 sdt datar untuk tiap 1 g.",
    thermo: "Perkiraan kasar: tunggu sekitar 30 detik setelah mendidih untuk 95°C, 1 menit untuk 90°C, dan 3 menit untuk 80°C.",
    kettle: "Rebus air di panci, matikan api, lalu tunggu sesuai suhu yang dibutuhkan.",
    frother: "Kocok susu hangat di toples tertutup rapat selama 30–40 detik, atau pakai whisk.",
    shaker: "Pakai botol atau toples yang tertutup rapat.",
    strainer: "Pakai saringan teh, kain bersih, atau kertas filter kopi.",
    scale: "Tanpa timbangan: 1 sdm kopi bubuk kira-kira 5–6 g, 1 sdt matcha kira-kira 2 g, dan 1 ml air kira-kira 1 g (pakai gelas ukur)."
  };

  /* Tips per langkah: dicocokkan dari isi langkah, lalu disesuaikan dengan variabel */
  const TIP_RULES = [
    [/^giling/i, c => [c.grind ? "Kehalusan: " + c.grind.l + ", " + c.grind.d + "." + (c.grind.lab ? " Pilih setelan penggiling untuk " + c.grind.lab + "." : "") : "Sesuaikan kehalusan dengan alat seduh: makin cepat air lewat, makin halus gilingannya.", "Giling sesaat sebelum menyeduh. Aroma kopi cepat menguap setelah digiling."]],
    [/^(takar|timbang)/i, c => ["Timbang dalam gram, bukan sendok. Bubuk kopi beda merek dan tingkat sangrai punya kepadatan berbeda." + (c.grind && c.grind.lab ? " Pilih bubuk berlabel " + c.grind.lab + "." : "")]],
    [/bilas.*filter/i, () => ["Membilas membuang rasa kertas dan memanaskan dripper serta gelas, jadi suhu seduhan lebih stabil."]],
    [/membasahi|bubuk basah|bloom/i, () => ["Ini fase bloom: gas CO₂ keluar dan permukaan kopi menggembung. Kopi yang masih segar menggembung lebih besar. Kalau datar, kopinya mungkin sudah lama."]],
    [/melingkar/i, () => ["Tuang dari tengah ke luar dengan aliran kecil. Hindari menuang ke dinding filter agar air tidak lewat tanpa menyentuh kopi."]],
    [/sampai\s+\d+\s*ml/i, c => c.vk === "kopi" && c.needs.includes("v60") && !c.seen.sc && (c.seen.sc = 1) ? [c.scale ? "Nol-kan timbanganmu sebelum menuang. Angka di langkah adalah total kumulatif, bukan tambahan." : "Tanpa timbangan: 1 ml air kira-kira 1 g, jadi pakai gelas ukur dan tuang sampai angka total yang disebut."] : []],
    [/menetes habis|habis menetes/i, c => c.vk === "kopi" && c.needs.includes("v60") ? ["Total waktu seduh yang ideal sekitar 2:30–3:30 menit. Lebih cepat dari itu → giling lebih halus. Lebih lambat → giling lebih kasar."] : []],
    [/ekstrak|seduh[^.]*(shot|espresso)/i, c => c.needs.includes("espresso") ? ["Target rasio 1:2" + (c.cg ? ": " + fx1(c.cg) + " g kopi menjadi sekitar " + fx1(c.cg * 2) + " g espresso" : "") + " dalam 25–30 detik.", "Mengalir terlalu cepat dan terasa asam → giling lebih halus. Menetes terlalu lambat dan pahit → giling lebih kasar."] : []],
    [/api kecil[^.]*mengalir|desis/i, c => c.needs.includes("moka") ? ["Api kecil menjaga kopi tidak gosong. Dinginkan dasar pot agar ekstraksi berhenti dan rasa tidak pahit."] : []],
    [/plunger/i, () => ["Tekan perlahan sekitar 20–30 detik. Menekan cepat membuat ampas naik dan seduhan keruh."]],
    [/busakan|busa[^.]*susu|susu[^.]*busa/i, c => ["Panaskan susu sampai " + (c.thermo ? "60–65°C di termometermu" : "hangat di punggung tangan (sekitar 55–65°C)") + ". Di atas 70°C rasa susu jadi hambar dan busa cepat pecah."]],
    [/(hangatkan|panaskan)[^.]*susu/i, c => ["Panaskan dengan api kecil sambil sesekali diaduk. Berhenti saat mengepul " + (c.thermo ? "(60–65°C di termometer)" : "dan tepi panci mulai berbuih kecil") + ". Susu yang mendidih membentuk kulit dan terasa gosong."]],
    [/whisk/i, () => ["Aduk membentuk angka 8 atau zig-zag agar coklat cepat larut dan tidak menggumpal."]],
    [/cincang/i, () => ["Cincang halus seukuran butir beras. Makin kecil, makin cepat meleleh tanpa perlu panas tinggi."]],
    [/pasta|larutkan[^.]*bubuk coklat|bubuk coklat[^.]*air panas/i, () => ["Larutkan jadi pasta kental dulu, baru tambahkan cairan lainnya. Bubuk yang langsung bertemu banyak cairan mudah bergerindil."]],
    [/ayak|kocok[^.]*matcha|matcha[^.]*kocok/i, c => ["Ayak dulu agar tidak bergerindil. Kocok dengan gerakan M atau W dari pergelangan, bukan memutar, sampai busa halus.", "Pakai air sekitar 80°C. Air mendidih membuat matcha pahit." + (c.vid === "kuliner" ? " Grade kuliner memang lebih pahit, jadi pemanis tipis membantu." : c.vid === "seremonial" ? " Grade seremonial paling enak dengan air tidak terlalu panas." : "")]],
    [/seduh|rendam/i, (c, t) => {
      if (c.vk !== "teh") return [];
      const tp = (t.match(/(\d{2,3})\s?°C/) || [])[1], out = [];
      if (tp) out.push(+tp <= 85 ? "Teh hijau dan melati cepat pahit di air terlalu panas. Suhu " + tp + "°C menjaga rasa manisnya." : "Teh hitam, oolong, dan pu-erh tahan air hampir mendidih untuk mengeluarkan rasa penuh.");
      out.push(c.vid === "kantong" ? "Jangan peras kantong celup karena memeras mengeluarkan rasa sepat." : c.vid === "daun" ? "Beri daun ruang untuk mengembang. Teko yang terlalu sempit membuat seduhan tidak rata." : "Lebih lama berarti lebih pekat dan sepat. Ikuti waktu di langkah ini.");
      return out;
    }],
    [/rebus/i, () => ["Jaga api kecil dan biarkan mendidih lembut. Api besar membuat rebusan cepat pahit dan airnya menguap."]],
    [/shaker|kocok kuat|kocok[^.]*\bes\b/i, () => ["Isi shaker setengah penuh dan tutup rapat sebelum dikocok. Kocokan kuat mendinginkan cepat dan membuat busa tipis."]],
    [/\bes batu\b|berisi es|\bes\b[^.]*gelas/i, c => c.cold ? ["Isi gelas dengan es lebih dulu. Es padat dan besar mencair lebih lambat sehingga minuman tidak cepat encer."] : []],
    [/perlahan di atas|di atasnya|di atas (susu|tonik|teh)/i, c => c.cold ? ["Tuang pelan lewat punggung sendok yang menempel di sisi gelas supaya lapisan tidak tercampur."] : []],
    [/dinginkan/i, c => c.cold ? ["Dinginkan sekitar 5 menit sebelum dituang ke es. Teh yang terlalu panas langsung melelehkan es dan membuatnya encer."] : []],
    [/saring/i, c => c.vk === "teh" || c.vk === "coklat" ? ["Menyaring menghentikan ekstraksi dan membuang ampas atau daun, supaya rasa tidak makin pahit."] : []]
  ];
  function stepTips(t, c) {
    const out = [];
    for (const [re, fn] of TIP_RULES) {
      if (out.length >= 3) break;
      if (re.test(t)) fn(c, t).filter(Boolean).forEach(x => { if (out.length < 3) out.push(x); });
    }
    return out;
  }

  /* Ringkasan teknis yang dihitung dari bahan dan langkah yang sudah disesuaikan */
  function detFacts(m, ings, steps, d, vSel, brand, grind) {
    let cg = null, tg = null, mg = null, water = 0, vol = 0, ice = 0, x;
    ings.forEach(t => {
      if ((x = t.match(/^(\d+(?:[.,]\d+)?)\s*g\s+(?:biji kopi|kopi)/i))) cg = cg || px1(x[1]);
      else if ((x = t.match(/^(\d+(?:[.,]\d+)?)\s*g\s+(?:teh\b|sencha|genmaicha|hojicha|oolong|pu-?erh|earl grey)/i))) tg = tg || px1(x[1]);
      else if ((x = t.match(/^(\d+(?:[.,]\d+)?)\s*g\s+matcha/i))) mg = mg || px1(x[1]);
      if ((x = t.match(/^(\d+(?:[.,]\d+)?)\s*ml\s+(.*)/i))) { const v = px1(x[1]); vol += v; if (/^air(?!\s+(tonik|soda))/i.test(x[2])) water += v; }
      if ((x = t.match(/^(\d+(?:[.,]\d+)?)\s*g\s+es batu/i))) ice += px1(x[1]);
      if ((x = t.match(/^(\d+)\s*shot/i))) vol += 30 * +x[1];
    });
    const cold = m.type === "iced", f = [];
    f.push(["Sajian", cold ? "Dingin" : "Panas", cold ? "Pakai es padat agar tidak cepat encer" : "Enak diminum sekitar 55–65°C"]);
    f.push(["Kekuatan", d === 100 ? "Standar" : d > 100 ? "Lebih kuat" : "Lebih ringan", "Takaran " + d + "%"]);
    if (cg && water) {
      const r = (water + ice) / cg;
      f.push([ice ? "Rasio kopi : air + es" : "Rasio kopi : air", "1 : " + fx1(r), r <= 14.5 ? "Pekat" : r <= 16.5 ? "Seimbang" : "Ringan"]);
    }
    if (tg && water) f.push(["Takaran teh", fx1(tg / water * 100) + " g / 100 ml"]);
    if (mg && water) f.push(["Matcha : air", fx1(mg) + " g : " + fx1(water) + " ml"]);
    if (tempOf(m).length) {
      tempOf(m).forEach(t => {
        f.push([t.stage, fmtRange(t), t.note || ""]);
      });
    } else {
      const T = [];
      (ings.join("\n") + "\n" + steps.join("\n")).replace(/(\d{2,3})(?:\s?[–-]\s?(\d{2,3}))?\s?°C/g, (a, p, q) => { const s = p + (q ? "–" + q : "") + "°C"; if (!T.includes(s)) T.push(s); return a; });
      if (T.length) f.push(["Suhu air", T.slice(0, 3).join(" / ")]);
    }
    if (grind) f.push(["Gilingan", grind.l, grind.d]);
    const sec = steps.reduce((a, t) => a + stepTime(t), 0);
    if (sec) f.push(["Waktu di timer", fmtTime(sec), "Total langkah yang bertimer"]);
    if (vol) f.push(["Volume cairan", "± " + fx1(Math.round(vol)) + " ml"]);
    if (ice) f.push(["Es batu", fx1(ice) + " g"]);
    if (vSel.id !== "umum") f.push(["Bahan utama", vSel.l]);
    if (brand) f.push(["Merek", brand]);
    return { rows: f, cg: cg, tg: tg, mg: mg, water: water, main: cg || tg || mg };
  }

  /* Saran perbaikan rasa, dengan angka dari takaran yang sedang dipakai */
  function detFix(m, vk, vid, d, F) {
    const i = DOSE.indexOf(d), lo = i > 0 ? DOSE[i - 1] : 0, hi = i >= 0 ? DOSE[i + 1] : 0, nd = m.needs || [];
    const gAt = p => F.main ? " (" + fx1(F.main * p / d) + " g)" : "";
    const ratio = p => F.cg && F.water ? ", rasio menjadi 1 : " + fx1(F.water / (F.cg * p / d)) : "";
    const less = lo ? "Kurangi takaran ke " + lo + "%" + gAt(lo) + "." : "Takaran sudah di batas terendah, ubah suhu atau waktu.";
    const more = hi ? "Naikkan takaran ke " + hi + "%" + gAt(hi) + ratio(hi) + "." : "Takaran sudah di batas tertinggi, ubah suhu atau waktu.";
    let r = [];
    if (vk === "kopi") {
      const esp = nd.includes("espresso");
      r = [
        ["Terlalu pahit atau kering", [esp ? "Hentikan shot lebih awal (sekitar 25 detik) atau giling sedikit lebih kasar." : "Giling satu tingkat lebih kasar.", esp ? "" : "Turunkan suhu air 2–3°C.", less, vid === "biji" ? "Biji sangrai gelap cenderung pahit, jadi pakai air 88–90°C." : ""]],
        ["Terlalu asam atau tajam", [esp ? "Perpanjang shot sampai sekitar 30 detik atau giling sedikit lebih halus." : "Giling satu tingkat lebih halus.", esp ? "" : "Naikkan suhu air 2–3°C atau perpanjang waktu seduh.", vid === "biji" ? "Biji sangrai terang cenderung asam, jadi pakai air 94–96°C." : ""]],
        ["Hambar atau encer", [more, esp ? "Pastikan shot berhenti di sekitar rasio 1:2." : "Giling sedikit lebih halus.", cold(m) ? "Kurangi es atau pakai es yang lebih padat." : ""]]
      ];
    } else if (vk === "matcha") {
      r = [
        ["Terlalu pahit", ["Pakai air sekitar 75–80°C, bukan mendidih.", less, vid === "kuliner" ? "Grade kuliner memang lebih pahit. Tambahkan 1 sdt sirup atau gula." : ""]],
        ["Bergerindil atau berpasir", ["Ayak matcha dua kali sebelum dikocok.", "Mulai dengan sedikit air untuk membuat pasta, lalu tambahkan sisanya sambil dikocok membentuk huruf M."]],
        ["Hambar atau pucat", [more, "Pastikan matcha masih segar. Matcha yang lama terbuka jadi kusam."]]
      ];
    } else if (vk === "teh") {
      r = [
        ["Terlalu pahit atau sepat", ["Turunkan suhu air sekitar 5°C.", "Pendekkan waktu seduh sekitar 30 detik.", less, vid === "kantong" ? "Angkat kantong tepat waktu dan jangan diperas." : ""]],
        ["Hambar atau encer", ["Tambah waktu seduh sekitar 30 detik.", more, "Pastikan airnya cukup panas untuk jenis tehnya."]],
        cold(m) ? ["Kurang segar", ["Tambah perasan lemon atau es.", "Kurangi gula atau sirup agar rasa tehnya terasa."]] : null
      ].filter(Boolean);
    } else if (vk === "coklat") {
      r = [
        ["Terlalu manis", ["Kurangi gula sekitar 1 sdt.", vid === "batang" ? "Pakai coklat batang yang lebih gelap." : "Pakai bubuk tanpa gula tambahan."]],
        ["Terlalu encer atau kurang pekat", [more, "Panaskan sedikit lebih lama dengan api kecil sambil diaduk."]],
        ["Bergerindil atau menggumpal", ["Angkat dari api, lalu aduk kuat dengan whisk.", vid === "bubuk" ? "Larutkan bubuk jadi pasta dulu sebelum menambah susu." : "Cincang lebih halus dan jaga api tetap kecil.", "Saring bila perlu."]]
      ];
    }
    return r.map(x => [x[0], x[1].filter(Boolean)]).filter(x => x[1].length);
  }
  const cold = m => m.type === "iced";

  function buildDetail(m, vk, vSel, d, brand) {
    const vid = vSel.id, grind = grindOf(m), nd = m.needs || [];
    let ings = lines(m.ing).map(t => scaleIng(t, d)), steps = lines(m.steps).map(t => scaleStep(t, d)), removed = false;
    if (vSel.skip) { const n = steps.length; steps = steps.filter(t => !vSel.skip.test(t)); removed = steps.length < n; }
    const av = applyVariant(m, vk, vid, d, ings, steps);
    ings = av.ings; steps = av.steps;
    const cgM = ings.map(t => t.match(/^(\d+(?:[.,]\d+)?)\s*g\s+(?:biji kopi|kopi)/i)).find(Boolean), cg0 = cgM ? px1(cgM[1]) : null;
    if (vk === "kopi" && vid === "biji" && !steps.some(t => /giling/i.test(t))) {
      steps.unshift("Giling " + (cg0 ? fx1(cg0) + " g " : "") + "biji kopi" + (grind ? " hingga " + grind.l.toLowerCase() + " (" + grind.d + ")" : " sesuai takaran") + ".");
    } else if (vk === "kopi" && vid === "bubuk" && removed && cg0) {
      steps.unshift("Timbang " + fx1(cg0) + " g kopi bubuk" + (grind && grind.lab ? " berlabel " + grind.lab : "") + ".");
    }
    const F = detFacts(m, ings, steps, d, vSel, brand, grind);
    const adIds = Array.isArray(m.ingIds) ? ingNeeds(m) : Array.from(new Set(ingAll().filter(g => g.for.includes(m.base) && g.re.test(ings.join("\n"))).map(g => g.id)));
    const miss = Array.from(new Set(nd.concat(adIds))).filter(n => !state.owned.includes(n));
    const ctx = { m: m, vk: vk, vid: vid, d: d, cold: cold(m), grind: grind, cg: F.cg || cg0, needs: nd, seen: {}, thermo: state.owned.includes("thermo"), scale: state.owned.includes("scale") };
    const tips = steps.map(t => stepTips(t, ctx));
    if (tips.length && brand) tips[0].push("Merek " + brand + ": cicipi hasil pertama, lalu atur takaran ±10% di bagian Takaran. Rasa tiap merek bisa berbeda.");
    const subs = nd.filter(n => !state.owned.includes(n) && SUBST[n]).map(n => [nameOf(n), SUBST[n]]);
    return { ings: ings, steps: steps, tips: tips, facts: F.rows, chg: av.chg, note: av.note, subs: subs, fix: detFix(m, vk, vid, d, F), adIds: adIds, miss: miss };
  }
  gDlg.addEventListener("click", e => {
    const b = e.target.closest("#gTips"); if (!b) return;
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", on); b.textContent = on ? "Tutup semua detail" : "Buka semua detail";
    gDlg.querySelectorAll(".tip").forEach(x => { x.open = on; });
  });
  gDlg.addEventListener("click", e => {
    const vo = e.target.closest("[data-var]");
    if (vo && gMenu) { state.variant[varKey(gMenu)] = vo.dataset.var; save(); openGuide(gMenu.id); }
  });
  gDlg.addEventListener("change", e => {
    if (!gMenu) return;
    if (e.target.id === "gDose") { state.dose[varKey(gMenu)] = +e.target.value; save(); openGuide(gMenu.id); }
    else if (e.target.id === "gBrand") { state.brand[varKey(gMenu)] = e.target.value.trim(); save(); toast("Merek disimpan"); }
  });

  /* ---------- Suara + efek visual saat selesai menyeduh ---------- */
  let gMenu = null, gFired = false, actx = null, fxRaf = 0, muted = false;
  try { muted = localStorage.getItem("seduh.mute") === "1"; } catch (e) {}
  const sBtn = $("#sndBtn"), fxc = $("#fx");
  function paintSnd() { sBtn.textContent = muted ? "🔇" : "🔊"; sBtn.setAttribute("aria-label", muted ? "Nyalakan suara" : "Matikan suara"); }
  paintSnd();
  sBtn.addEventListener("click", () => { muted = !muted; try { localStorage.setItem("seduh.mute", muted ? "1" : "0"); } catch (e) {} paintSnd(); toast(muted ? "Suara dimatikan" : "Suara dinyalakan"); if (!muted) chime(); });
  function chime() {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const N = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5], D = [.16, .16, .16, .22, .14, .14, .7];
      let t = actx.currentTime + .05;
      N.forEach((f, i) => {
        [[1, .16], [2, .05], [3, .02]].forEach(([h, v]) => {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = "sine"; o.frequency.value = f * h;
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + D[i] + .5);
          o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + D[i] + .55);
        });
        t += D[i];
      });
    } catch (e) {}
  }
  const PAL = { kopi: ["#4a2c17", "#6a3d1f", "#c9965f", "#f1e4cf", "#c0392b"], coklat: ["#5e2616", "#8a3b22", "#c98a6b", "#f1cdbd", "#fff"], teh: ["#6f9448", "#c4902f", "#cfe3a3", "#e9d36b", "#fffaf2"] };
  function stopFx() { cancelAnimationFrame(fxRaf); fxc.style.display = "none"; }
  function burst(base) {
    if (reduceMotion()) return;
    const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
    fxc.width = W * dpr; fxc.height = H * dpr; fxc.style.display = "block";
    const x = fxc.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pal = PAL[base] || PAL.kopi, ps = [], sp = [];
    for (let i = 0; i < 110; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.5, v = 9 + Math.random() * 10; ps.push({ x: W / 2, y: H * .72, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, s: 5 + Math.random() * 7, c: pal[i % pal.length], k: i % 3 }); }
    let f = 0;
    (function tick() {
      f++; x.clearRect(0, 0, W, H);
      if (f < 40 && f % 3 === 0) sp.push({ x: Math.random() * W, y: Math.random() * H * .6, l: 0 });
      sp.forEach(q => { q.l++; const a = Math.sin(q.l / 22 * Math.PI); if (a <= 0) return; x.globalAlpha = a; x.fillStyle = "#ffd966"; x.beginPath(); for (let j = 0; j < 8; j++) { const rr = j % 2 ? 3 : 11 * a, th = j * Math.PI / 4; x.lineTo(q.x + Math.cos(th) * rr, q.y + Math.sin(th) * rr); } x.fill(); });
      ps.forEach(p => {
        p.vy += .28; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        x.globalAlpha = Math.max(0, 1 - f / 150); x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.r);
        if (p.k === 0) { x.beginPath(); x.ellipse(0, 0, p.s * .55, p.s, 0, 0, 6.28); x.fill(); }
        else if (p.k === 1) x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        else { x.beginPath(); x.moveTo(0, -p.s); x.quadraticCurveTo(p.s, 0, 0, p.s); x.quadraticCurveTo(-p.s, 0, 0, -p.s); x.fill(); }
        x.restore();
      });
      x.globalAlpha = 1;
      if (f < 160) fxRaf = requestAnimationFrame(tick); else stopFx();
    })();
  }
  function celebrate() {
    if (!gMenu) return;
    const d = $("#gDone");
    d.innerHTML = (gMenu.type === "iced" ? "🧊" : "☕") + " Selesai! <b>" + esc(gMenu.name) + "</b> siap dinikmati. Selamat menyeduh!";
    chime(); burst(gMenu.base);
    try { window.SeduhMusic && SeduhMusic.duck(4500); } catch (e) {}
    try { navigator.vibrate && navigator.vibrate([80, 60, 160]); } catch (e) {}
    d.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
  }
  /* ---------- Musik latar: dirender sekali jadi audio, diputar lewat <audio> ---------- */
  const CH = [[[261.63, 329.63, 392, 493.88], 130.81], [[220, 261.63, 329.63, 392], 110], [[293.66, 349.23, 440, 523.25], 146.83], [[196, 246.94, 293.66, 349.23], 98]];
  const PENT = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const BEAT = 60 / 72, SR = 22050;
  let mOn = false, mBuf = null, mEl = null, mSrc = null;
  const mBtn = $("#musBtn");
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
  async function musicStart() {
    try {
      if (!mBuf) mBuf = renderLoop();
      if (!mEl) { mEl = new Audio(URL.createObjectURL(toWav(mBuf))); mEl.loop = true; }
      mEl.volume = 1; await mEl.play(); return;
    } catch (e) {}
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") await actx.resume();
      const bf = actx.createBuffer(1, mBuf.length, SR); bf.copyToChannel(mBuf, 0);
      if (mSrc) { try { mSrc.stop(); } catch (e) {} }
      mSrc = actx.createBufferSource(); mSrc.buffer = bf; mSrc.loop = true; mSrc.connect(actx.destination); mSrc.start();
    } catch (e) { mOn = false; paintMus(); toast("Browser ini menolak memutar audio di halaman ini."); }
  }
  function musicStop() {
    try { if (mEl) mEl.pause(); } catch (e) {}
    try { if (mSrc) mSrc.stop(); } catch (e) {}
    mSrc = null;
  }
  function paintMus() { mBtn.classList.toggle("on", mOn); mBtn.classList.toggle("off", !mOn); mBtn.setAttribute("aria-pressed", mOn); mBtn.setAttribute("aria-label", mOn ? "Hentikan musik latar" : "Putar musik latar"); }
  function setMusic(on, quiet) {
    mOn = on; paintMus();
    try { localStorage.setItem("seduh.music", on ? "1" : "0"); } catch (e) {}
    if (on) musicStart(); else musicStop();
    if (!quiet) toast(on ? "Musik latar menyala" : "Musik latar dimatikan");
  }
  mBtn.addEventListener("click", () => setMusic(!mOn));
  document.addEventListener("visibilitychange", () => { document.body.classList.toggle("idle", document.hidden); if (!mOn) return; if (document.hidden) musicStop(); else musicStart(); });
  let wantMusic = false;
  
  if (wantMusic) {
    const first = e => { document.removeEventListener("pointerdown", first); document.removeEventListener("keydown", first); if (e.target.closest && e.target.closest("#musBtn")) return; setMusic(true, true); };
    document.addEventListener("pointerdown", first); document.addEventListener("keydown", first);
  }

  const hdr = $("header"), setHH = () => document.documentElement.style.setProperty("--hh", hdr.offsetHeight + "px");
  setHH(); $("#sndBtn").title = "Suara efek"; window.addEventListener("resize", setHH); if (window.ResizeObserver) new ResizeObserver(setHH).observe(hdr);
  gDlg.addEventListener("close", stopFx);

  /* ---------- Add menu dialog ---------- */
  const dlg = $("#addDlg"), form = $("#addForm");
  let imgData = "";

  let pend = { gear: [], ingr: [] };
  const checkedIds = sel => new Set(Array.from(document.querySelectorAll(sel + " input:checked")).map(i => i.value));
  function renderPicks(kg, ki) {
    const base = $("#fBase").value;
    const cb = (id, name, on, isNew) => `<label><input type="checkbox" value="${esc(id)}"${on ? " checked" : ""}><span>${esc(name)}${isNew ? "<em>baru</em>" : ""}</span></label>`;
    $("#fNeeds").innerHTML = gearForBase(base).map(g => cb(g.id, g.name, kg.has(g.id))).join("") + pend.gear.map(p => cb(p.id, p.name, kg.has(p.id), true)).join("");
    $("#fIngPick").innerHTML = ingForBase(base).map(g => cb(g.id, g.name, ki.has(g.id))).join("") + pend.ingr.map(p => cb(p.id, p.name, ki.has(p.id), true)).join("");
    $("#fSubWrap").style.display = base === "teh" ? "grid" : "none";
  }
  function addPending(kind) {
    const inp = $(kind === "gear" ? "#fNewGear" : "#fNewIngr");
    const name = inp.value.trim().replace(/\s+/g, " ");
    if (!name) return;
    const base = $("#fBase").value, kg = checkedIds("#fNeeds"), ki = checkedIds("#fIngPick");
    const known = (kind === "gear" ? gearForBase(base) : ingForBase(base)).concat(pend[kind]);
    const hit = known.find(x => x.name.toLowerCase() === name.toLowerCase());
    const keep = kind === "gear" ? kg : ki;
    if (hit) keep.add(hit.id);
    else { const p = { id: "p" + Math.random().toString(36).slice(2, 8), name }; pend[kind].push(p); keep.add(p.id); }
    inp.value = ""; renderPicks(kg, ki); inp.focus();
  }
  function openAdd() {
    form.reset(); imgData = ""; pend = { gear: [], ingr: [] };
    $("#fImgPrev").innerHTML = "📷"; $("#fErr").textContent = "";
    $("#fBase").innerHTML = Object.entries(BASES).map(([id, b]) => `<option value="${id}">${b.name}</option>`).join("");
    $("#fBase").value = state.base;
    if (state.base === "teh" && state.sub !== "semua") $("#fSub").value = state.sub;
    renderPicks(new Set(), new Set());
    dlg.showModal();
    $("#fName").focus();
  }
  $("#fBase").addEventListener("change", () => renderPicks(checkedIds("#fNeeds"), checkedIds("#fIngPick")));
  $("#fAddGear").addEventListener("click", () => addPending("gear"));
  $("#fAddIngr").addEventListener("click", () => addPending("ingr"));
  [["fNewGear", "gear"], ["fNewIngr", "ingr"]].forEach(([id, k]) => {
    $("#" + id).addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addPending(k); } });
  });
  $("#fIng").addEventListener("input", e => {
    const txt = e.target.value;
    const on = (id, re) => { if (re.test(txt)) { const c = document.querySelector('#fIngPick input[value="' + id + '"]'); if (c) c.checked = true; } };
    ingForBase($("#fBase").value).forEach(g => on(g.id, g.re));
    pend.ingr.forEach(p => on(p.id, nameRe(p.name)));
  });
  $("#fCancel").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  $("#fImg").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 640, scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        imgData = c.toDataURL("image/jpeg", 0.8);
        $("#fImgPrev").innerHTML = `<img src="${imgData}" alt="Pratinjau foto" style="width:64px;height:64px;border-radius:12px;object-fit:cover">`;
      };
      img.onerror = () => { $("#fErr").textContent = "File ini bukan gambar yang bisa dibuka."; };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#fName").value.trim();
    if (!name) { $("#fErr").textContent = "Isi nama minuman dulu."; return; }
    const base = $("#fBase").value;
    const gIds = Array.from(checkedIds("#fNeeds")), iIds = Array.from(checkedIds("#fIngPick"));
    const map = {};
    /* Alat/bahan baru dibuat hanya jika tercentang, dan langsung dianggap sudah kamu punya */
    const commit = (list, ids, mk, target) => list.filter(p => ids.includes(p.id)).forEach(p => {
      const item = mk(p, "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
      target.push(item); map[p.id] = item.id;
      if (!state.owned.includes(item.id)) state.owned.push(item.id);
    });
    commit(pend.gear, gIds, (p, id) => ({ id, name: p.name, ico: "🔧", grp: "aux", for: [base], d: "Ditambahkan olehmu", custom: true }), state.customGear);
    commit(pend.ingr, iIds, (p, id) => ({ id, name: p.name, ico: "🧂", for: [base], d: "Ditambahkan olehmu", custom: true, re: nameRe(p.name) }), state.customIngr);
    const m = {
      id: "u" + Date.now().toString(36),
      base, name,
      type: $("#fType").value,
      desc: $("#fDesc").value.trim(),
      hist: $("#fHist").value.trim(),
      hy: $("#fHistY").value.trim(),
      hp: $("#fHistP").value.trim(),
      hf: $("#fFact").value.trim(),
      ing: $("#fIng").value.trim(),
      steps: $("#fSteps").value.trim(),
      needs: gIds.map(x => map[x] || x),
      ingIds: iIds.map(x => map[x] || x),
      img: imgData, custom: true
    };
    if (base === "teh") m.sub = $("#fSub").value;
    state.custom.push(m);
    if (state.base !== base) { state.sub = "semua"; state.gaya = "semua"; }
    state.base = base;
    state.sub = "semua"; state.gaya = "semua";
    save(); dlg.close();
    go("menu");
    render();
    toast("Menu disimpan");
  });


  /* ---------- Karakter interaktif: suara, bubble perkenalan, efek layar penuh ---------- */
  const INTRO = {
    hot: [n => "Halo! Aku Si Hangat, penjaga minuman panas di Si Seduh." + (n ? " Hari ini aku jadi " + n + "!" : ""),
      "Aku paling betah di cangkir yang mengepul. Tiup dulu sebelum minum, ya!",
      "Rahasiaku: suhu air yang pas bikin rasa jauh lebih enak.",
      "Hehe, geli! Ayo lanjut menyeduh.",
      "Air untuk kopi enaknya sekitar 92–94°C, jangan langsung yang mendidih.",
      "Teh melati paling wangi kalau diseduh sekitar 85°C.",
      "Hangatkan gelasmu dulu, supaya minumanmu tidak cepat dingin.",
      "Susu jangan sampai mendidih ya, nanti rasanya berubah.",
      "Uap yang naik itu bukan asap, itu aromaku yang lagi menyapa!",
      "Coklat panas paling enak diaduk pelan sampai mengilap.",
      "Kopi yang baru digiling wanginya juara. Hirup dulu sebelum menyeduh!",
      "Sabar ya, seduhan yang baik memang butuh waktu.",
      "Lagi hujan atau udara dingin? Itu waktu terbaikku.",
      "Jangan lupa pakai timer, biar seduhanmu tidak kelamaan.",
      "Cangkir kecil, kehangatan besar. Itu mottoku!",
      "Menimbang takaran bukan ribet, itu rahasia rasa yang konsisten.",
      "Kalau kopinya terlalu pahit, coba kurangi takaran atau seduh lebih singkat.",
      "Aku bisa jadi kopi, coklat, atau teh. Pilih yang kamu suka!",
      "Ssst, tegukan pertama yang masih hangat itu paling nikmat.",
      "Terima kasih sudah mampir ke Si Seduh. Semoga seduhanmu enak!"],
    cold: [n => "Brrr, halo! Aku Si Sejuk, penjaga minuman dingin di Si Seduh." + (n ? " Hari ini aku jadi " + n + "!" : ""),
      "Es batuku jangan dibiarkan meleleh lama-lama, ya!",
      "Kocok yang kuat biar rasanya menyatu dan segar.",
      "Sejuk banget! Tos dulu, yuk.",
      "Biar tidak cepat encer, pakai es batu yang besar dan padat.",
      "Cold brew butuh sabar 12–16 jam, tapi hasilnya halus banget.",
      "Dinginkan tehmu dulu sebelum dituang ke es, supaya tidak cepat cair.",
      "Matcha dingin enaknya dikocok sampai tidak ada gumpalan.",
      "Isi gelas dengan es dulu, baru tuang cairannya.",
      "Lapisan yang cantik rahasianya satu: tuang pelan-pelan.",
      "Lemon sedikit saja sudah bikin es teh terasa jauh lebih segar.",
      "Siang terik? Itu waktuku bersinar!",
      "Brrr! Jangan lupa sedotannya, ya.",
      "Sirup gula aren di dasar gelas bikin tiap tegukan beda rasa.",
      "Gelembung-gelembung ini lagi joget, tahu!",
      "Susu dingin plus espresso panas? Seru, kan, kontrasnya!",
      "Jangan buru-buru diaduk, nikmati dulu lapisannya.",
      "Aku bisa jadi kopi, coklat, atau teh. Semuanya segar kalau dingin!",
      "Es batu yang padat meleleh lebih lambat, lho.",
      "Terima kasih sudah mampir ke Si Seduh. Semoga minumanmu segar!"]
  };
  const lastIx = { hot: -1, cold: -1 };
  const FACTS = {
    hot: [
      "Satu shot espresso diseduh dengan tekanan sekitar 9 bar, kira-kira sembilan kali tekanan udara di sekitar kita.",
      "Tanaman kopi diperkirakan berasal dari dataran tinggi Ethiopia.",
      "Indonesia termasuk salah satu produsen kopi terbesar di dunia.",
      "Biji kopi sebenarnya biji dari buah ceri kopi yang dikeringkan dan disangrai.",
      "Teh hijau, hitam, oolong, dan putih berasal dari tanaman yang sama: Camellia sinensis.",
      "Nama ilmiah pohon kakao, Theobroma cacao, berarti “makanan para dewa”.",
      "Nama cappuccino sering dikaitkan dengan warna jubah biarawan Kapusin.",
      "Air yang terlalu panas bisa menarik rasa pahit berlebih dari kopi.",
      "Sebagian besar rasa yang kita “cicipi” sebenarnya datang dari aroma yang tercium hidung.",
      "Daun matcha dinaungi beberapa pekan sebelum dipanen, itu sebabnya hijaunya pekat dan gurih.",
      "Aeropress diciptakan Alan Adler, orang yang sama di balik cakram lempar Aerobie.",
      "Dalam teh tarik, menuang bolak-balik dari ketinggian membuat teh berbusa sekaligus lebih cepat dingin."
    ],
    cold: [
      "Cold brew terasa halus karena air dingin menarik lebih sedikit senyawa asam dan pahit.",
      "Air yang membeku mengembang sekitar 9%, makanya es batu mengapung.",
      "Resep teh dingin sudah tercatat dalam buku masak Amerika pada 1879.",
      "Air tonik terasa pahit karena mengandung kuinina.",
      "Minuman dingin cenderung terasa kurang manis daripada saat hangat, jadi es kopi sering butuh gula lebih banyak.",
      "Embun di luar gelas es berasal dari uap air di udara yang mengembun, bukan dari gelas yang bocor.",
      "Lapisan di gelas berlapis terbentuk karena perbedaan kepadatan cairan: yang lebih padat tinggal di bawah.",
      "Gula aren dibuat dengan merebus nira, cairan manis yang disadap dari tandan bunga pohon aren.",
      "Perasan lemon yang asam bisa membuat warna teh pekat jadi lebih terang.",
      "Matcha tidak benar-benar larut dalam air. Partikelnya melayang, jadi harus dikocok dulu.",
      "Marshmallow modern hampir tidak mengandung tanaman marsh mallow yang jadi asal namanya.",
      "Thai tea terlihat oranye terang karena pewarna atau campuran khusus di dalam tehnya."
    ]
  };
  const lastFx = { hot: -1, cold: -1 };
  const tapN = { hot: 0, cold: 0 };
  let bubEl = null, bubTimer, fxCv = null;
  function clearBub() { clearTimeout(bubTimer); if (bubEl) { bubEl.remove(); bubEl = null; } }
  gDlg.addEventListener("close", clearBub);

  function charSound(kind) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t0 = actx.currentTime + .02;
      const note = (f, t, d, type, v, f2) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t0 + t);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + t + d * .5);
        g.gain.setValueAtTime(0, t0 + t); g.gain.linearRampToValueAtTime(v, t0 + t + .015);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + t + d);
        o.connect(g); g.connect(actx.destination); o.start(t0 + t); o.stop(t0 + t + d + .05);
      };
      if (kind === "hot") {
        note(300, 0, .22, "square", .08, 720);
        [261.63, 329.63, 392, 523.25, 659.25, 784].forEach((f, i) => note(f, .1 + i * .07, .6, "triangle", .2));
        note(130.81, 0, 1.1, "sine", .28);
      } else {
        note(900, 0, .2, "square", .06, 1500);
        [1318.5, 1568, 2093, 1760, 2349, 2637].forEach((f, i) => note(f, .1 + i * .06, .7, "sine", .13));
        note(880, .05, .5, "triangle", .1);
      }
    } catch (e) {}
  }

  function bigFx(kind, ox, oy) {
    if (reduceMotion()) return;
    if (fxCv) fxCv.remove();
    const host = gDlg.open ? gDlg : document.body;
    const cv = document.createElement("canvas"); fxCv = cv;
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:99999";
    const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight, F = 180, hot = kind === "hot";
    cv.width = W * dpr; cv.height = H * dpr; host.appendChild(cv);
    const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = hot ? ["#ff3d2e", "#ff7a2e", "#ffc23e", "#fff1b8"] : ["#ffffff", "#d6ecff", "#8ec8ff", "#4a9bf0"];
    const R = (a, b) => a + Math.random() * (b - a), ps = [];
    for (let i = 0; i < 140; i++) { const a = R(0, 6.283), v = R(6, 18); ps.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (hot ? 3 : 0), g: hot ? -.1 : .14, s: R(3, 9), r: R(0, 6.28), vr: R(-.25, .25), c: cols[i % 4], life: R(80, 150), a: 0, dl: 0, d: .985 }); }
    for (let i = 0; i < 170; i++) ps.push({ x: R(0, W), y: hot ? H + 30 : -30, vx: R(-1, 1), vy: hot ? -R(2, 7) : R(2, 6), g: 0, s: R(3, 10), r: R(0, 6.28), vr: R(-.1, .1), c: cols[i % 4], life: R(70, 130), a: 0, dl: R(0, 70), d: 1 });
    const app_ = $("#app"); if (app_) { app_.classList.remove("shake"); void app_.offsetWidth; app_.classList.add("shake"); }
    let f = 0;
    (function tick() {
      f++; x.clearRect(0, 0, W, H);
      const env = Math.sin(Math.min(1, f / F) * Math.PI);
      // kilat awal
      if (f < 14) { x.fillStyle = hot ? "rgba(255,236,190," + (.6 * (1 - f / 14)).toFixed(2) + ")" : "rgba(235,246,255," + (.7 * (1 - f / 14)).toFixed(2) + ")"; x.fillRect(0, 0, W, H); }
      // tepi layar menyala / membeku
      const g = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .25, W / 2, H / 2, Math.max(W, H) * .75);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, hot ? "rgba(255,80,30," + (.5 * env).toFixed(2) + ")" : "rgba(90,170,255," + (.55 * env).toFixed(2) + ")");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      // gelombang kejut
      for (let k = 0; k < 3; k++) {
        const t = f - k * 9; if (t <= 0) continue;
        const rr = t * 20, al = Math.max(0, 1 - rr / (Math.max(W, H) * 1.1));
        x.strokeStyle = (hot ? "rgba(255,150,60," : "rgba(160,210,255,") + (al * .8).toFixed(2) + ")"; x.lineWidth = 14 - k * 3;
        x.beginPath(); x.arc(ox, oy, rr, 0, 6.283); x.stroke();
      }
      // uap / gelembung besar
      for (let k = 0; k < 7; k++) {
        const bx = (k + .5) * W / 7 + Math.sin(f / 22 + k) * 30, by = hot ? H - f * (2 + k % 3) : f * (2 + k % 3), br = 60 + (k % 3) * 40;
        if (hot) { x.fillStyle = "rgba(255,255,255," + (.1 * env).toFixed(3) + ")"; x.beginPath(); x.arc(bx, by, br, 0, 6.283); x.fill(); }
        else { x.strokeStyle = "rgba(255,255,255," + (.55 * env).toFixed(2) + ")"; x.lineWidth = 3; x.beginPath(); x.arc(bx, by, br * .5, 0, 6.283); x.stroke(); }
      }
      // partikel
      x.globalCompositeOperation = hot ? "lighter" : "source-over";
      ps.forEach(p => {
        if (f < p.dl) return; p.a++;
        p.vy += p.g; p.vx *= p.d; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        const al = Math.max(0, Math.min(1, (p.life - p.a) / 30)); if (al <= 0) return;
        x.globalAlpha = al; x.fillStyle = x.strokeStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.r);
        if (hot) { x.beginPath(); x.arc(0, 0, p.s, 0, 6.283); x.fill(); }
        else { x.lineWidth = 1.8; x.lineCap = "round"; x.beginPath(); for (let j = 0; j < 3; j++) { const th = j * Math.PI / 3; x.moveTo(Math.cos(th) * p.s * 1.6, Math.sin(th) * p.s * 1.6); x.lineTo(-Math.cos(th) * p.s * 1.6, -Math.sin(th) * p.s * 1.6); } x.stroke(); }
        x.restore();
      });
      x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
      if (f < F && cv.isConnected) requestAnimationFrame(tick); else { cv.remove(); if (fxCv === cv) fxCv = null; }
    })();
  }

  function charTap(art) {
    const face = art.querySelector(".face"); if (!face) return;
    const kind = face.classList.contains("cold") ? "cold" : "hot";
    const r = art.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height * .6;
    const host = gDlg.open ? gDlg : document.body;
    const cardEl = art.closest(".card"), nm = gDlg.open ? (($("#gTitle") || {}).textContent || "") : (cardEl ? (cardEl.querySelector("h3") || {}).textContent || "" : "");
    const lines = INTRO[kind]; let ix = 0;
    const first = tapN[kind]++ === 0, useFact = !first && Math.random() < .5;   /* tap pertama: perkenalan; sisanya 50% fun fact, 50% percakapan */
    let line;
    if (useFact) {
      const fl = FACTS[kind]; let fi;
      do { fi = Math.floor(Math.random() * fl.length); } while (fi === lastFx[kind]);
      lastFx[kind] = fi; line = fl[fi];
    } else {
      if (!first) { do { ix = 1 + Math.floor(Math.random() * (lines.length - 1)); } while (ix === lastIx[kind]); }
      lastIx[kind] = ix;
      line = typeof lines[ix] === "function" ? lines[ix](nm.trim()) : lines[ix];
    }
    // animasi karakter
    const sv = art.querySelector(".art-svg");
    if (sv) { sv.classList.remove("jump"); void sv.getBoundingClientRect(); sv.classList.add("jump"); }
    face.classList.add("happy"); setTimeout(() => face.classList.remove("happy"), 2600);
    // bubble
    clearBub();
    const b = document.createElement("div"); b.className = "cbub " + kind; b.setAttribute("role", "status");
    b.innerHTML = "<b>" + (kind === "hot" ? "Si Hangat" : "Si Sejuk") + "</b>" + (useFact ? '<i class="tag">💡 Tahukah kamu?</i>' : "") + esc(line);
    host.appendChild(b); bubEl = b;
    const W = innerWidth, cx = Math.max(150, Math.min(W - 150, ox)), below = r.top < 150;
    b.style.left = cx + "px";
    if (below) { b.classList.add("below"); b.style.top = (r.bottom + 14) + "px"; } else b.style.bottom = (innerHeight - r.top + 14) + "px";
    bubTimer = setTimeout(clearBub, 8000);
    charSound(kind); bigFx(kind, ox, oy);
  }
  document.addEventListener("click", e => { const a = e.target.closest(".art"); if (a && a.querySelector(".face")) charTap(a); });
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("art") && e.target.querySelector(".face")) { e.preventDefault(); charTap(e.target); }
  });


  /* ---------- Kembali ke beranda lewat logo GCS: transisi dramatis ---------- */
  let homeBusy = false;
  function homeSound() {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t0 = actx.currentTime + .02;
      const tone = (f, t, d, type, v, f2) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t0 + t);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + t + d);
        g.gain.setValueAtTime(0, t0 + t); g.gain.linearRampToValueAtTime(v, t0 + t + .03);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + t + d);
        o.connect(g); g.connect(actx.destination); o.start(t0 + t); o.stop(t0 + t + d + .05);
      };
      [.3, .9, 1.5, 2.1].forEach((t, i) => tone(70, t, .4, "sine", .32 + i * .06, 40));   /* detak jantung */
      const o = actx.createOscillator(), g = actx.createGain();                          /* riser */
      o.type = "sawtooth"; o.frequency.setValueAtTime(100, t0); o.frequency.exponentialRampToValueAtTime(1400, t0 + 2.6);
      g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.07, t0 + 2.55); g.gain.linearRampToValueAtTime(0, t0 + 2.7);
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + 2.8);
      [130.81, 196, 261.63, 329.63].forEach(f => tone(f, 2.7, 2.4, "triangle", .2));      /* ledakan akor */
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, 2.8 + i * .1, 1.7, "sine", .16));
      [1568, 2093, 2637].forEach((f, i) => tone(f, 3.4 + i * .12, 1.1, "sine", .09));
    } catch (e) {}
  }
  function homeFx(logo) {
    if (homeBusy) return;
    if (reduceMotion()) { lastRoute = null; go("bahan"); window.scrollTo(0, 0); return; }
    homeBusy = true; clearBub();
    const r = logo.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    const ov = document.createElement("div"); ov.className = "homefx";
    ov.style.setProperty("--x", (r.left + r.width / 2) + "px"); ov.style.setProperty("--y", (r.top + r.height / 2) + "px");
    ov.innerHTML = '<div class="hf-wipe"></div><div class="hf-rays"></div><canvas></canvas><div class="hf-core"><div class="hf-badge"><i class="hf-ring r1"></i><i class="hf-ring r2"></i><span class="gcs hf-logo"></span></div><div class="hf-title"><b>Si Seduh</b><small>Sistem Informasi Seputar Edukasi Dunia Hobi GCS</small></div><div class="hf-words"><span class="w1" style="--d:1.9s">Panas</span><span class="w2" style="--d:2.4s">Dingin</span><span class="w3" style="--d:2.9s">Seduh!</span></div></div><div class="hf-flash"></div>';
    ov.setAttribute("aria-hidden", "true");
    document.body.appendChild(ov);
    homeSound();
    const cv = ov.querySelector("canvas"), dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const R = (a, b) => a + Math.random() * (b - a), kinds = ["bean", "leaf", "cacao", "bean", "leaf"];
    const BC = ["#4a2c17", "#6a3d1f", "#3a1f10"], LC = ["#6f9448", "#86ad52", "#c4902f", "#3f5a22"], CC = ["#6b2f1d", "#8a3b22", "#5a2616"];
    const EC = ["#ff5a2e", "#ff9a3e", "#ffd35a"], SC = ["#ffffff", "#cfe8ff", "#8ec8ff"];
    const cx0 = W / 2, cy0 = H * .44; let ps = [];
    function burst(n, vmax) {
      for (let i = 0; i < n; i++) {
        const k = kinds[i % 5], a = R(0, 6.283), v = R(8, vmax);
        ps.push({ k, x: cx0, y: cy0, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, g: .32, s: R(10, 32), r: R(0, 6.28), vr: R(-.3, .3), life: R(100, 190), a: 0,
          c: k === "bean" ? BC[i % 3] : k === "leaf" ? LC[i % 4] : CC[i % 3] });
      }
    }
    function ambient(dt) {
      for (let n = 0; n < 3; n++) {
        if (Math.random() < dt * .8) ps.push({ k: "ember", x: R(0, W), y: H + 10, vx: R(-1, 1), vy: -R(3, 9), g: 0, s: R(2, 6), r: 0, vr: 0, life: R(70, 120), a: 0, c: EC[n % 3] });
        if (Math.random() < dt * .8) ps.push({ k: "snow", x: R(0, W), y: -10, vx: R(-1.2, 1.2), vy: R(2, 6), g: 0, s: R(3, 9), r: R(0, 6), vr: R(-.08, .08), life: R(80, 140), a: 0, c: SC[n % 3] });
      }
    }
    let last = performance.now(); const t0 = last; let w1 = false, w2 = false;
    function tick(now) {
      if (!ov.isConnected) return;
      const el = now - t0, dt = Math.min(3, (now - last) / 16.67); last = now;
      x.clearRect(0, 0, W, H);
      if (!w1 && el > 900) { w1 = true; burst(200, 26); }
      if (!w2 && el > 2750) { w2 = true; burst(320, 36); }
      if (el > 1100 && el < 4300) ambient(dt);
      x.globalAlpha = 1;
      ps = ps.filter(p => p.a < p.life);
      ps.forEach(p => {
        p.a += dt; p.vy += p.g * dt; p.vx *= Math.pow(.985, dt); p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        const al = Math.max(0, Math.min(1, (p.life - p.a) / 25)); if (al <= 0) return;
        x.globalAlpha = al; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = x.strokeStyle = p.c; const s = p.s;
        if (p.k === "bean") { x.beginPath(); x.ellipse(0, 0, s * .5, s * .78, 0, 0, 6.283); x.fill(); x.strokeStyle = "rgba(241,228,207,.8)"; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -s * .6); x.quadraticCurveTo(-s * .25, 0, 0, 0); x.quadraticCurveTo(s * .25, 0, 0, s * .6); x.stroke(); }
        else if (p.k === "leaf") { x.beginPath(); x.moveTo(0, -s); x.quadraticCurveTo(s * .8, 0, 0, s); x.quadraticCurveTo(-s * .8, 0, 0, -s); x.fill(); }
        else if (p.k === "cacao") { x.beginPath(); if (x.roundRect) x.roundRect(-s * .4, -s * .4, s * .8, s * .8, s * .2); else x.rect(-s * .4, -s * .4, s * .8, s * .8); x.fill(); }
        else if (p.k === "ember") { x.beginPath(); x.arc(0, 0, s, 0, 6.283); x.fill(); }
        else { x.lineWidth = 1.8; x.lineCap = "round"; x.beginPath(); for (let j = 0; j < 3; j++) { const th = j * Math.PI / 3; x.moveTo(Math.cos(th) * s * 1.5, Math.sin(th) * s * 1.5); x.lineTo(-Math.cos(th) * s * 1.5, -Math.sin(th) * s * 1.5); } x.stroke(); }
        x.restore();
      });
      x.globalAlpha = 1;
      if (el < 4900) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    setTimeout(() => {   /* kilat putih: ganti halaman di balik layar */
      if (gDlg.open) gDlg.close();
      lastRoute = null; go("bahan"); window.scrollTo(0, 0);
    }, 2850);
    setTimeout(() => ov.classList.add("out"), 4600);
    setTimeout(() => { ov.remove(); homeBusy = false; }, 5600);
  }
  document.addEventListener("click", e => {
    const l = e.target.closest("header .logo");
    if (!l) return;
    e.preventDefault(); e.stopImmediatePropagation(); homeFx(l);
  }, true);

  const up = document.createElement("button");
  up.type = "button"; up.className = "totop"; up.setAttribute("aria-label", "Kembali ke atas"); up.textContent = "↑";
  up.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" }));
  document.body.appendChild(up);
  window.addEventListener("scroll", () => up.classList.toggle("show", window.scrollY > 600), { passive: true });

  render();
})();
}catch(e){console.error("[resep]",e)}
