/* Si SEDUH · Tab Beverage: sejarah kopi, teh, dan cokelat.
   Dirender malas saat #/beverage dibuka. Gaya disuntik sendiri (tidak mengubah style.css).
   Sumber isi: dua dokumen "Sejarah Kopi, Teh, Cokelat" (makalah lengkap dan edisi sejarah global + Indonesia). */
try{
(function(){
"use strict";
const root=document.getElementById("sv-beverage");
if(!root)return;

const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").toLowerCase();

/* ================= DATA ================= */
const BEV={
kopi:{id:"kopi",name:"Kopi",emoji:"☕",tag:"Ethiopia • Yaman",bg:"#ffd36b",sh:"#e0b23c",c:"var(--kopi)",t:"var(--kopi-tint)",
 blurb:"Dari penggembala legendaris di Ethiopia, pelabuhan Mocha, kedai kopi Eropa, sampai kebun kolonial di Jawa dan kafe spesialti.",
 intro:"Kopi dibuat dari biji di dalam buah tanaman Coffea. Tanamannya tumbuh alami di Afrika, tetapi budaya minum dan perdagangan kopi yang terorganisasi berkembang kuat di sekitar Laut Merah sebelum menjadi komoditas kebun dunia.",
 facts:[["Tanaman","Coffea arabica dan C. canephora (robusta)"],["Bagian dipakai","Biji di dalam buah kopi"],["Wilayah awal","Ethiopia dan Yaman"],["Pengolahan khas","Sangrai, giling, ekstraksi"]],
 secs:[
 {t:"Asal tanaman dan legenda Kaldi",p:[
  "Coffea arabica punya hubungan genetik dan sejarah budidaya dengan dataran tinggi Ethiopia, sedangkan Yaman di seberang Laut Merah menjadi wilayah kunci bagi budaya minum dan produksi kopi yang terdokumentasi.",
  "Legenda Kaldi, penggembala kambing yang melihat ternaknya aktif setelah memakan buah kopi, enak sebagai cerita pengantar. Tetapi cerita itu muncul jauh lebih belakangan daripada masa yang dikisahkan, jadi bukan catatan penemuan yang terverifikasi."],
  note:"Bedakan asal tanaman dari sejarah minuman seduh: tanaman tumbuh alami di Afrika, sementara pengolahan biji menjadi minuman dagang berkembang kuat di Yaman."},
 {t:"Yaman, para sufi, dan pelabuhan Mocha",p:[
  "Pada abad ke-15 kopi dibudidayakan di Yaman dan dipakai sebagian komunitas sufi untuk membantu berjaga saat ibadah malam. Dari sana kopi bergerak lewat jaringan Laut Merah dan Laut Arab ke Semenanjung Arab, Mesir, Persia, dan wilayah Utsmaniyah.",
  "Pelabuhan Mocha (al-Mukha) menjadi nama terkenal dalam perdagangan kopi. Biji dari dataran tinggi Yaman dibawa ke sana, lalu dikirim ke Jeddah, Kairo, dan pasar Mediterania. Kata “mocha” masa kini bisa berarti karakter rasa tertentu, tetapi jejak namanya ada di pelabuhan itu.",
  "Popularitas kopi juga memunculkan perdebatan: apakah minuman ini memengaruhi kesadaran dan apakah dibolehkan menurut norma agama. Ada larangan di tempat dan masa tertentu, tetapi kopi tetap berkembang."]},
 {t:"Kedai kopi sebagai ruang publik",p:[
  "Kedai kopi berkembang sebagai tempat bercakap-cakap, mendengar musik atau pembacaan, bermain, bertukar kabar, dan membahas urusan perdagangan. Karena kabar dan kritik bisa menyebar di sana, penguasa kadang memandangnya dengan curiga.",
  "Di Eropa abad ke-17, kedai kopi tumbuh di London, Paris, Amsterdam, dan Wina. Di London, pedagang, pialang, dan pemilik kapal bertukar informasi di kedai, dan sejumlah lembaga niaga dikaitkan dengan lingkungan itu. Julukan “universitas rakyat” menggambarkan fungsi edukatif yang informal, bukan lembaga pendidikan formal."],
  note:"Kisah Wina 1683 (pasukan Utsmaniyah meninggalkan karung kopi) sering diulang, tetapi kopi sudah beredar di Eropa sebelumnya. Lebih tepat disebut cerita populer, bukan satu-satunya jalur masuk kopi ke Eropa."},
 {t:"Dari Yaman ke perkebunan kolonial",p:[
  "Permintaan Eropa mendorong pencarian cara menanam kopi di luar Yaman. Pada akhir abad ke-17 dan awal abad ke-18, Belanda berhasil membangun budidaya di Jawa; kekuatan Eropa lain kemudian membuka kebun di Karibia dan Amerika.",
  "Ekspansi ini tak lepas dari kolonialisme. Di banyak kebun Atlantik produksi memakai kerja paksa dan perbudakan; di Jawa terkait pengiriman wajib dan tanam paksa. Harga kopi yang terjangkau di Eropa dibangun lewat jaringan yang tidak selalu menguntungkan orang yang menanam dan memanennya."]},
 {t:"Kopi masuk Jawa: VOC dan Priangan",p:[
  "Kopi masuk lewat jaringan dagang VOC pada akhir abad ke-17. Kronologi yang sering dirujuk menyebut pengiriman bibit arabika lewat Batavia pada 1696; upaya awal gagal (antara lain karena banjir), sedangkan penanaman pada akhir 1690-an lebih berhasil. Ekspor kopi Jawa ke Eropa dimulai awal abad ke-18. Angka dan rincian bisa sedikit berbeda antar sumber."],
  ul:[["Priangan, Jawa Barat","Salah satu pusat produksi utama. Sistem penyerahan wajib (Preangerstelsel) membentuk penggunaan lahan dan tenaga kerja di dataran tinggi."],
      ["1799","VOC dibubarkan; pemerintah kolonial Belanda mengambil alih banyak fungsi administrasi."],
      ["Sejak 1830","Cultuurstelsel (Tanam Paksa) memperluas produksi ekspor, termasuk kopi di wilayah tertentu. Penerapannya berbeda menurut daerah."],
      ["Akhir abad ke-19","Karat daun (Hemileia vastatrix) merusak kebun arabika di Asia, termasuk Jawa. Robusta lalu berperan lebih besar."]],
  note:"Tidak semua kebun, daerah, dan periode punya pola eksploitasi yang sama: ada kebun pemerintah, perkebunan swasta, dan petani kecil. Namun dominasi ekspor kopi masa kolonial berhubungan kuat dengan pembatasan kebebasan produksi dan perdagangan bagi banyak petani."},
 {t:"Ragam kopi Indonesia",p:["Nama daerah menunjukkan asal geografis atau tradisi dagang, tetapi mutu akhir ditentukan pemetikan, fermentasi, pengeringan, penyimpanan, sangrai, dan penyeduhan. Sebagian besar kopi Indonesia berasal dari kebun rakyat."],
  ul:[["Java / Priangan","Nama historis yang kuat di pasar global; terhubung dengan sejarah perkebunan kolonial dan dataran tinggi Jawa Barat."],
      ["Gayo, Aceh","Banyak dari dataran tinggi; sering diproses dengan metode yang memberi karakter khas."],
      ["Mandailing, Sumatra Utara","Nama asal yang mapan; tidak selalu berarti seluruh kopi berasal dari satu wilayah kecil."],
      ["Toraja, Sulawesi Selatan","Dihubungkan dengan lanskap pegunungan dan tradisi pascapanen yang beragam."],
      ["Kintamani, Bali","Ditanam di lanskap vulkanik; sebagian kebun memakai pola agroforestri."],
      ["Flores","Kopi dataran tinggi dengan kondisi tumbuh yang bervariasi."],
      ["Liberika, sebagian Sumatra","Jenis berbeda dari arabika dan robusta; dikenal di sejumlah wilayah dataran rendah dan lahan gambut."]],
  note:"Kopi tubruk (bubuk diseduh langsung, ampas dibiarkan mengendap) tetap hidup berdampingan dengan kopi sachet, jaringan kafe, kedai spesialti, dan roastery mikro."},
 {t:"Espresso dan kopi modern",p:[
  "Mesin espresso berkembang lewat serangkaian inovasi, bukan dari satu penemu. Luigi Bezzera mematenkan desain mesin pada 1901; sistem tuas pada pertengahan abad ke-20 memungkinkan tekanan lebih tinggi dan menghasilkan crema yang kita kenal. Espresso lalu menjadi dasar menu kafe: susu, air panas, cokelat, krim, atau es krim.",
  "Kopi instan, kemasan kedap udara, dan rantai ritel membuat kopi praktis. Pada akhir abad ke-20 muncul perhatian pada asal kebun, varietas, ketinggian, proses pascapanen, profil sangrai, dan teknik seduh, yang dikenal sebagai kopi spesialti."],
  note:"“Gelombang” kopi (first, second, third wave) hanyalah kerangka populer, bukan periodisasi sejarah yang berlaku universal."},
 {t:"Cara menyeduh kopi",ul:[
  ["Rebus langsung","Kopi dan air dipanaskan bersama; dipakai di sejumlah tradisi regional."],
  ["Ibrik / cezve","Kopi sangat halus dipanaskan di wadah kecil, sering tanpa filtrasi (kopi Turki dan sekitarnya)."],
  ["Filter / pour-over","Air melewati bubuk dan filter; laju alir dan ukuran giling memengaruhi ekstraksi."],
  ["French press","Bubuk direndam lalu dipisahkan memakai saringan tekan."],
  ["Espresso","Ekstraksi cepat dengan tekanan tinggi; dasar minuman espresso modern."],
  ["Cold brew","Kopi direndam air dingin atau suhu ruang dalam waktu relatif lama."]]},
 {t:"Kopi dan kesehatan: apa kata bukti",p:[
  "Kafein bekerja terutama dengan menghambat reseptor adenosin, sehingga kewaspadaan meningkat dan rasa kantuk berkurang untuk sementara. Pada sebagian orang kafein bisa menimbulkan gelisah, jantung berdebar, gangguan tidur, atau keluhan pencernaan.",
  "Sejumlah studi observasional mengaitkan kebiasaan minum kopi moderat dengan risiko lebih rendah untuk beberapa kondisi, termasuk diabetes tipe 2. Asosiasi tidak membuktikan kopi mencegah penyakit, dan bukti sebab-akibat belum selalu konsisten (Reis dkk., 2019).",
  "Pernyataan ilmiah American Heart Association (Marcus dkk., 2026) menyebut hingga sekitar 400 mg kafein per hari umumnya dapat ditoleransi banyak orang dewasa sehat. Angka itu bukan target konsumsi, dan respons tiap orang berbeda: kehamilan, obat tertentu, gangguan tidur, kecemasan, dan gangguan irama jantung dapat mengubah batas yang sesuai."],
  note:"Kopi yang sangat manis dengan krim dan sirup punya profil gizi lain daripada kopi hitam. Bukti dari kopi juga tidak otomatis berlaku untuk minuman energi berkafein tinggi."}
 ]},

teh:{id:"teh",name:"Teh",emoji:"🍵",tag:"Tiongkok • Asia",bg:"#a9e29b",sh:"#7fc66f",c:"var(--teh)",t:"var(--teh-tint)",
 blurb:"Dari Kitab Teh Lu Yu dan upacara chanoyu, ke kapal East India Company, Boston Tea Party, dan kebun-kebun teh Jawa Barat.",
 intro:"Teh dibuat dari daun dan pucuk muda Camellia sinensis. Jenis hijau, hitam, oolong, dan putih berasal dari tanaman yang sama; yang membedakan adalah cara pelayuan, penggulungan, oksidasi, dan pengeringan.",
 facts:[["Tanaman","Camellia sinensis"],["Bagian dipakai","Daun dan pucuk muda"],["Wilayah awal","Tiongkok dan Asia Timur"],["Pengolahan khas","Pelayuan, oksidasi, pengeringan"]],
 secs:[
 {t:"Tanaman dan legenda Shennong",p:[
  "Cerita tradisional Tiongkok menyebut Kaisar Shennong menemukan teh pada 2737 SM ketika daun jatuh ke air panasnya. Itu legenda budaya, bukan laporan yang bisa diverifikasi, dan kapan manusia pertama kali minum teh tidak bisa dipastikan dengan satu tanggal.",
  "Konsumsi teh berkembang bertahap. Sebelum menjadi minuman massal, teh berada dalam konteks kuliner, pengobatan tradisional, kegiatan istana, dan kehidupan biara."]},
 {t:"Tang, Song, Ming: cara minum berubah",ul:[
  ["Dinasti Tang (618–907)","Budaya teh tercatat lebih jelas dalam teks. Lu Yu menulis Cha Jing (Kitab Teh) pada abad ke-8, membahas tanaman, pengolahan, air, peralatan, dan tata cara menyiapkan teh."],
  ["Dinasti Song (960–1279)","Teh bubuk dan kebiasaan mengocoknya dalam mangkuk penting di kalangan elite. Bentuk ini ikut melatari tradisi matcha di Jepang."],
  ["Dinasti Ming (1368–1644)","Penyeduhan daun lepas makin menonjol dan memengaruhi cara teh disajikan di banyak wilayah Asia."]],
  note:"Pergantian metode tidak berarti gaya lama lenyap; beberapa cara hidup berdampingan."},
 {t:"Teh di Jepang dan chanoyu",p:[
  "Teh sampai ke Jepang lewat hubungan dengan Tiongkok dan perjalanan para biksu; pada abad ke-9 teh sudah dikenal. Pada abad ke-15 dan ke-16, kalangan elite, samurai, dan pencinta seni mengembangkan pertemuan minum teh yang kemudian disebut chanoyu.",
  "Sen no Rikyū (1522–1591) berperan penting dalam estetika wabi-cha yang menekankan kesederhanaan, perhatian pada momen, dan keindahan benda yang tidak mencolok. Matcha dibuat dari daun teh yang digiling halus lalu dikocok dengan chasen, pengocok bambu."]},
 {t:"Teh, imperium, dan perdagangan dunia",p:[
  "Teh sampai ke Eropa lewat perdagangan Asia pada abad ke-16 dan ke-17. Di Inggris teh mula-mula barang mahal untuk kalangan berada, lalu menjadi minuman harian dan simbol sosial. Pajak tinggi mendorong penyelundupan.",
  "Karena banyak teh Inggris berasal dari Tiongkok, pemerintah dan East India Company mencari pasokan alternatif dan membangun perkebunan di Assam (India) dan Ceylon (Sri Lanka) pada abad ke-19. Untuk mengurangi pembayaran dengan perak, jaringan dagang Inggris meningkatkan perdagangan opium ke Tiongkok, yang memperburuk konflik hingga Perang Opium. Hubungan ini bukan akibat teh semata, melainkan bagian dari struktur ekonomi dan kekuasaan yang lebih besar.",
  "Pada 16 Desember 1773, para penentang kebijakan Inggris membuang 342 peti teh ke Pelabuhan Boston. Peristiwa itu berkaitan dengan Tea Act 1773, yang memberi East India Company posisi istimewa menjual teh di koloni Amerika. Boston Tea Party menjadi pemicu penting menuju Revolusi Amerika, tetapi bukan satu-satunya sebab."]},
 {t:"Teh di Indonesia dan Jawa Barat",p:[
  "Kronologi yang dirangkum Dinas Perkebunan Provinsi Jawa Barat menyebut tanaman teh sudah ditanam di Batavia pada akhir abad ke-17, antara lain sebagai tanaman hias. Percobaan dengan bibit dari Tiongkok pada awal abad ke-18 belum memuaskan. Upaya 1824–1826 dengan bibit dari Jepang di Kebun Raya Bogor dan Cisurupan, Garut, memberi hasil lebih menjanjikan.",
  "Pada 1828, J. I. L. L. Jacobson dikaitkan dengan perluasan penanaman di Wanayasa, Purwakarta, dan Gunung Raung. Dekade 1830-an kebun berkembang di pegunungan Jawa Barat, Jawa Tengah, dan Jawa Timur; bibit Assam mulai ditanam pada 1870-an. Pendudukan Jepang 1942–1945 membuat sebagian areal dialihkan ke tanaman pangan atau terbengkalai."],
  note:"Sejarah teh Indonesia bukan hanya sejarah perusahaan. Pengetahuan pemetik, pengolah, dan komunitas lokal ikut membentuk mutu produk dan identitas tempat."},
 {t:"Jenis teh dan pengolahannya",ul:[
  ["Teh putih","Pucuk dan daun muda dilayukan dan dikeringkan dengan pemrosesan relatif ringan. Halus dan ringan."],
  ["Teh hijau","Oksidasi enzimatis ditekan (misalnya dengan pemanasan), lalu digulung dan dikeringkan. Segar, rentang rasa luas."],
  ["Oolong","Daun mengalami oksidasi parsial yang dikendalikan. Dari floral sampai panggang."],
  ["Teh hitam","Daun dilayukan, digulung atau dimemarkan agar teroksidasi, lalu dikeringkan. Rasa dan warna lebih kuat."],
  ["Pu-erh","Teh pascafermentasi yang dimatangkan lewat tahap mikrobiologis tertentu."],
  ["Teh wangi / campuran","Teh diberi aroma bunga, rempah, atau buah; karakter ditentukan bahan dasar dan campurannya."]],
  note:"Dalam industri, kata “fermentasi” sering dipakai untuk oksidasi enzimatis pada teh hitam. Secara teknis itu bukan fermentasi mikroba seperti pada sebagian pu-erh."},
 {t:"Teh dan kesehatan: apa kata bukti",p:[
  "Teh mengandung kafein, asam amino L-theanine, dan polifenol termasuk katekin. Kadarnya dipengaruhi varietas, lokasi, musim panen, suhu air, dan lama seduh, sehingga tiap cangkir bisa berbeda.",
  "Studi observasional tentang kesehatan kardiovaskular dan metabolisme tampak menjanjikan, tetapi besaran efek, dosis, dan hubungan sebab-akibat belum pasti (Hayat dkk., 2015). Kata “antioksidan” tidak boleh dipakai sebagai klaim bahwa teh pasti mencegah penyakit tertentu.",
  "Teh manis kemasan tidak setara dengan seduhan tanpa gula. Kafein dapat mengganggu tidur bila diminum menjelang istirahat; tanin dapat menghambat penyerapan zat besi non-heme pada kondisi tertentu; teh yang sangat panas berisiko menimbulkan luka bakar."]}
 ],
 extra:{title:"Budaya penyajian teh dunia",items:[
  ["Jepang","Chanoyu / chado","Keramahan, kemurnian, dan ketenangan. Matcha dikocok dengan chasen; mangkuk, ruang, musim, dan kondisi tamu menjadi bagian dari pengalaman."],
  ["Tiongkok","Gongfu cha","Keterampilan menyeduh: pilihan daun, suhu air, rasio, dan waktu infusi. Seduhan berulang dalam poci kecil atau gaiwan memperlihatkan perubahan aroma tiap seduhan."],
  ["Inggris","Afternoon tea","Kebiasaan sosial abad ke-19: teh dengan scones, kue, dan sandwich kecil. Berbeda dari high tea, yang secara historis merujuk hidangan lebih mengenyangkan."],
  ["Maroko","Teh mint","Teh hijau, mint segar, dan gula, dituang dari ketinggian hingga berbusa. Menawarkan teh kepada tamu menandai keramahan dan penghormatan."],
  ["India","Chai","Teh hitam direbus bersama susu, gula, dan rempah seperti jahe, kapulaga, kayu manis, atau cengkih. Minuman rumah tangga, stasiun, dan warung."],
  ["Indonesia","Teh sehari-hari","Teh tubruk, teh manis panas, es teh manis, teh melati, dan teh poci. Lebih terikat pada makan bersama, keramahan, dan kebiasaan menjamu."]]}},

coklat:{id:"coklat",name:"Cokelat",emoji:"🍫",tag:"Amazon • Mesoamerika",bg:"#ffb59a",sh:"#e98f70",c:"var(--coklat)",t:"var(--coklat-tint)",
 blurb:"Dari residu kakao berusia 5.300 tahun di Ekuador dan minuman berbusa suku Maya, ke pengepres Van Houten dan batangan modern.",
 intro:"Kakao adalah bahan dari biji buah Theobroma cacao; cokelat adalah produk yang dibuat dari bahan kakao, sering bersama gula dan bahan lain. Biji difermentasi, dikeringkan, disangrai, lalu diolah menjadi massa, bubuk, lemak, atau batangan.",
 facts:[["Tanaman","Theobroma cacao"],["Bagian dipakai","Biji di dalam buah (polong)"],["Wilayah awal","Amazon Hulu dan Mesoamerika"],["Pengolahan khas","Fermentasi, sangrai, conching, tempering"]],
 secs:[
 {t:"Asal tanaman: Amazon dan bukti arkeologis",p:[
  "Kakao berasal dari neotropis Amerika Selatan. Residu pati kakao, teobromin, dan DNA kuno pada artefak dari situs Santa Ana-La Florida di tenggara Ekuador berusia sekitar 5.300 tahun. Temuan ini menunjukkan penggunaan dan domestikasi kakao di Amazon Hulu jauh sebelum bukti Mesoamerika yang paling terkenal (Zarrillo dkk., 2018).",
  "Itu tidak mengurangi pentingnya Mesoamerika. Tanaman dan pengetahuan pengolahannya bergerak ke wilayah lain, dan masyarakat seperti Mokaya, Olmek, Maya, lalu Aztek mengembangkan kakao dalam konteks sosial, perdagangan, kuliner, dan ritual."],
  note:"Sejarah kakao adalah lintasan panjang yang melibatkan banyak masyarakat, bukan satu peradaban yang “menemukan” cokelat modern."},
 {t:"Maya dan Aztek: minuman berbusa, bukan cokelat panas manis",p:[
  "Bagi masyarakat Maya, kakao penting dalam jamuan, ritual, dan hubungan sosial elite; biji juga bernilai tukar di beberapa tempat dan masa. Di masyarakat Aztek, kakao termasuk barang berharga dan dapat menjadi alat tukar.",
  "Minumannya berbusa karena dituang dari wadah ke wadah atau dikocok, rasanya cenderung pahit atau pahit-rempah, dan tidak selalu diberi gula. Sebagian resep memakai cabai, vanila, bunga, atau jagung. Banyak catatan tertulis berasal dari masa kontak dengan Eropa, jadi sudut pandang penulis kolonial perlu dipertimbangkan."]},
 {t:"Cokelat memasuki Eropa",p:[
  "Setelah Spanyol tiba di Amerika pada abad ke-16, kakao dan pengetahuan pengolahannya masuk ke jaringan kolonial Eropa. Tidak ada satu tanggal “masuknya cokelat”; prosesnya berlangsung bertahap lewat pelayaran, perdagangan, dan perubahan selera. Minuman yang pahit diadaptasi dengan gula dan rempah.",
  "Pada abad ke-17 cokelat menjadi minuman populer di kalangan elite Eropa dan simbol status. Klaim pengobatan masa itu tidak boleh disamakan dengan bukti medis modern, tetapi menjelaskan bagaimana persepsi manfaat ikut membentuk pasar."],
  note:"Gula bukan bahan yang netral secara sejarah: produksi gula kolonial di Karibia dan Amerika terhubung dengan perampasan tanah dan perbudakan. Minuman mewah di istana Eropa terhubung dengan kerja berat di koloni."},
 {t:"Revolusi teknologi abad ke-19",ul:[
  ["1828","Coenraad van Houten mengembangkan pengepresan yang memisahkan sebagian lemak kakao dari massa kakao, menghasilkan bubuk yang lebih mudah dipakai. Pengolahan dengan alkali (Dutching) kemudian mengubah warna, rasa, dan kemudahan larut."],
  ["1847","J. S. Fry & Sons di Inggris dikaitkan dengan cokelat batangan modern dari campuran kakao, gula, dan lemak kakao."],
  ["1870-an","Daniel Peter berperan dalam pengembangan cokelat susu dengan memanfaatkan susu kental."],
  ["1879","Rodolphe Lindt memperkenalkan conching, pengadukan dan penghalusan yang menghasilkan tekstur lebih lembut."]],
  note:"Kemajuan muncul dari rangkaian eksperimen, mesin, bahan baku, energi, kemasan, dan jaringan ritel, bukan dari satu penemu."},
 {t:"Dari biji ke batangan: tahapan pengolahan",ol:[
  ["Panen dan pembukaan buah","Memilih buah matang dan memisahkan biji.","Risiko: biji tidak matang atau busuk memberi cacat rasa."],
  ["Fermentasi","Membangun prekursor aroma dan mengurangi rasa mentah.","Risiko: under- atau over-fermentation menurunkan mutu."],
  ["Pengeringan","Menurunkan kadar air agar aman disimpan.","Risiko: kelembapan tinggi mendorong jamur dan cacat."],
  ["Pembersihan dan sangrai","Menghilangkan kotoran dan membentuk aroma.","Risiko: sangrai tidak merata menyebabkan rasa mentah atau gosong."],
  ["Pemecahan dan penggilingan","Membentuk nibs dan massa kakao.","Risiko: kontaminasi kulit atau partikel kasar."],
  ["Pencampuran, refining, conching","Mencapai komposisi, kehalusan, dan rasa yang diinginkan.","Risiko: tekstur berpasir dan aroma tidak seimbang."],
  ["Tempering dan pencetakan","Mengontrol kristalisasi lemak kakao.","Risiko: bloom, permukaan kusam, atau tekstur rapuh."],
  ["Pengemasan dan penyimpanan","Melindungi dari kelembapan, panas, cahaya, dan bau.","Risiko: ketengikan, bloom, dan aroma menurun."]]},
 {t:"Jenis cokelat modern",ul:[
  ["Dark chocolate","Padatan kakao dan lemak kakao dengan kadar gula yang bervariasi."],
  ["Milk chocolate","Menambahkan bahan susu, sehingga rasa dan tekstur lebih lembut."],
  ["White chocolate","Lemak kakao, gula, dan bahan susu tanpa padatan kakao nonlemak; warna dan rasanya berbeda dari dark."],
  ["Bean-to-bar","Pendekatan yang menekankan kendali proses dari biji sampai produk akhir. Istilah ini tidak otomatis menjamin mutu lebih tinggi."]]},
 {t:"Kakao di Indonesia",p:[
  "Kakao bukan tanaman asli Indonesia. Catatan menunjukkan penanaman diperkenalkan di Jawa pada masa kolonial, tetapi ekspansi awal terkendala hama dan penyakit. Produksi skala luas berkembang jauh kemudian, terutama saat budidaya meluas di Sulawesi pada paruh akhir abad ke-20, dengan pertumbuhan pesat pada 1980-an dan 1990-an. Tahun awal introduksi sebaiknya tidak dianggap titik tunggal tanpa dukungan arsip.",
  "Sebagian besar kebun dikelola petani kecil yang menghadapi produktivitas dan umur pohon, hama dan penyakit, mutu fermentasi, akses pembeli, dan harga dunia yang naik turun. Meningkatkan nilai kakao Indonesia butuh pascapanen yang kuat, keterlacakan, pengolahan lokal, dan hubungan petani-pembeli yang transparan."]},
 {t:"Kakao, cokelat, dan kesehatan: apa kata bukti",p:[
  "Biji kakao mengandung flavanol, teobromin, dan sedikit kafein. Namun fermentasi, sangrai, alkalisasi, dan pemanasan mengubah kandungannya, dan cokelat komersial mengandung gula, lemak, dan susu dalam jumlah berbeda-beda. Temuan pada ekstrak atau minuman kakao tinggi flavanol tidak otomatis berlaku untuk semua cokelat batangan.",
  "Otoritas Uni Eropa mengizinkan klaim terbatas bahwa flavanol kakao membantu mempertahankan elastisitas pembuluh darah, dengan syarat konsumsi 200 mg flavanol tertentu per hari. Ketentuan ini berlaku pada produk yang memenuhi syarat penggunaan klaim, bukan berarti semua cokelat memiliki dosis itu (European Commission, 2015)."],
  note:"Cokelat padat energi. Tidak tepat menyimpulkan bahwa makan cokelat tanpa batas akan meningkatkan fungsi kognitif atau menyembuhkan penyakit."}
 ]}
};

const COMPARE=[
 ["Bahan utama","Biji buah Coffea","Daun Camellia sinensis","Biji buah Theobroma cacao"],
 ["Wilayah sejarah utama","Ethiopia dan Yaman; kemudian jaringan global","Asia Timur, terutama tradisi Tiongkok; kemudian jaringan Asia dan Eropa","Amazon Hulu dan Mesoamerika; kemudian Atlantik dan Eropa"],
 ["Transformasi utama","Sangrai, giling, ekstraksi; espresso dan instan","Pelayuan, penggulungan, oksidasi, pengeringan","Fermentasi, pengeringan, sangrai, penggilingan, pengepresan, tempering"],
 ["Peran budaya menonjol","Kedai, percakapan publik, kafe","Ritual, jamuan, rumah tangga, upacara","Ritual dan elite pra-Kolumbus; hadiah, pangan, dessert modern"],
 ["Tantangan rantai pasok","Pendapatan petani, mutu, penyakit, perubahan iklim","Mutu daun, produktivitas, tenaga kerja, perubahan iklim","Fermentasi, penyakit, pendapatan petani kecil, deforestasi dan iklim"],
 ["Peluang nilai tambah","Specialty coffee, roasting, asal kebun, pengalaman kafe","Teh premium, produk siap minum, wisata kebun","Bean-to-bar, cokelat asal tunggal, produk fermentasi bermutu"]
];

const MYTHS=[
 ["Kaldi si penggembala","Legenda","Muncul jauh lebih belakangan daripada masa yang dikisahkan. Tidak ada bukti kuat bahwa seorang Kaldi adalah penemu kopi."],
 ["Shennong dan teh, 2737 SM","Legenda","Bagian dari tradisi budaya Tiongkok, bukan tanggal yang bisa diverifikasi. Kebiasaan minum teh tumbuh bertahap."],
 ["Karung kopi di Wina, 1683","Cerita populer","Kopi sudah beredar di Eropa sebelum peristiwa itu, jadi kisah ini bukan satu-satunya jalur masuk."],
 ["Cokelat itu asli Meksiko","Direvisi","Bukti tertua ada di Amazon Hulu, Ekuador (sekitar 5.300 tahun lalu), sebelum bukti Mesoamerika yang terkenal."]
];

const PATTERNS=[
 ["Minuman adalah ruang sosial","Kedai kopi, upacara teh, jamuan cokelat, dan warung kopi berfungsi lebih dari sekadar menghilangkan haus: menandai keramahan, status, keanggotaan kelompok, atau waktu berdiskusi."],
 ["Globalisasi tidak netral","Penyebaran ketiganya didorong perdagangan, tetapi juga kolonialisme, monopoli, perbudakan, kerja paksa, dan pengaturan tanah. Ada inovasi dan pertukaran budaya, sekaligus biaya manusia."],
 ["Pengetahuan lokal tetap penting","Memilih daun, mengolah buah, menjemur biji, mengatur fermentasi, meracik rempah, atau menjamu tamu terus diwariskan dan diadaptasi di samping teknologi industri."],
 ["Dari komoditas ke asal-usul","Pasar kini menuntut informasi asal kebun, varietas, kondisi kerja, dan dampak lingkungan. Label “asal tunggal” atau “berkelanjutan” adalah klaim yang perlu dibuktikan."]
];

const INDO=[
 ["kopi","1696–1699","Kopi tiba di Jawa lewat VOC; ekspor ke Eropa dimulai awal abad ke-18."],
 ["teh","1824–1828","Bibit teh Jepang diuji di Bogor dan Garut; penanaman meluas di Jawa Barat."],
 ["coklat","1980–1990-an","Budidaya kakao meluas pesat di Sulawesi lewat kebun petani kecil."]
];

const TODAY=[
 ["Perubahan iklim","Arabika butuh suhu relatif sejuk, sehingga pemanasan dapat menggeser zona tanam ke tempat lebih tinggi. Teh dipengaruhi pola hujan dan suhu; kakao rentan kekeringan, panas, dan hama. Adaptasi tidak bisa dibebankan hanya pada petani."],
 ["Sertifikasi","Fairtrade, Rainforest Alliance, dan organik tidak setara satu sama lain dan tidak otomatis menjamin semua dimensi keberlanjutan. UTZ bergabung dengan Rainforest Alliance pada 2018; standar baru diperkenalkan 2020 dan label UTZ berangsur dihentikan."],
 ["Rantai pasok yang adil","Pendapatan layak, kontrak transparan, pembayaran tepat waktu, pendampingan mutu, dan ketertelusuran yang diverifikasi menentukan masa depan. Keberhasilan dinilai dari hasil terukur, bukan jumlah logo."]
];

const TL=[
 ["Sekitar 3300 SM","coklat","Kakao di Amazon Hulu","Residu kakao di situs Santa Ana-La Florida, Ekuador, berusia sekitar 5.300 tahun."],
 ["Sekitar 1900 SM","coklat","Kakao di Mesoamerika","Bukti pemanfaatan kakao di Meksiko selatan; tradisi berkembang beragam (Mokaya, Olmek, lalu Maya dan Aztek)."],
 ["Abad ke-8","teh","Cha Jing","Lu Yu menyusun Kitab Teh pada masa Dinasti Tang."],
 ["Abad ke-9","teh","Teh di Jepang","Teh dikenal di Jepang lewat hubungan dengan Tiongkok dan perjalanan para biksu."],
 ["Abad ke-15","kopi","Kopi di Yaman","Kopi dibudidayakan dan diminum di Yaman, antara lain oleh komunitas sufi; jaringan Laut Merah meluas."],
 ["Abad ke-15–16","teh","Lahirnya chanoyu","Elite dan samurai mengembangkan upacara teh; Sen no Rikyū (1522–1591) membentuk estetika wabi-cha."],
 ["Abad ke-16","coklat","Kakao ke Eropa","Setelah Spanyol tiba di Amerika, kakao masuk jaringan kolonial dan resepnya dimaniskan."],
 ["Abad ke-16","kopi","Kopi menyebar di dunia Islam","Kopi menjangkau Mesir, Persia, dan wilayah Utsmaniyah."],
 ["Abad ke-16–17","teh","Teh menuju Eropa","Pedagang Portugis, Belanda, dan Inggris membawa teh; mula-mula barang mewah."],
 ["Abad ke-17","kopi","Kedai kopi Eropa","Kedai kopi tumbuh di London, Paris, Amsterdam, dan Wina."],
 ["Abad ke-17","coklat","Cokelat jadi minuman elite","Dinikmati di istana dan kota-kota Eropa sebagai simbol status."],
 ["1696–1699","kopi","Kopi tiba di Jawa","Bibit arabika lewat Batavia; upaya awal gagal, penanaman akhir 1690-an lebih berhasil."],
 ["1773","teh","Boston Tea Party","16 Desember: 342 peti teh dibuang ke Pelabuhan Boston memprotes Tea Act dan pajak."],
 ["1799","kopi","VOC dibubarkan","Pemerintah kolonial Belanda mengambil alih banyak fungsi administrasi."],
 ["1824–1826","teh","Teh Jepang di Bogor dan Garut","Bibit teh dari Jepang diuji di Kebun Raya Bogor dan Cisurupan; hasilnya lebih menjanjikan."],
 ["1828","coklat","Pengepres Van Houten","Memisahkan sebagian lemak kakao dari massa; bubuk kakao lebih mudah diproduksi."],
 ["1830","kopi","Sistem Tanam Paksa","Cultuurstelsel memperluas kontrol kolonial atas produksi ekspor di Jawa, termasuk kopi."],
 ["1830-an","teh","Kebun teh di pegunungan Jawa","Kebun berkembang di Jawa Barat, Tengah, dan Timur; Jacobson dikaitkan dengan perluasan sejak 1828."],
 ["1847","coklat","Cokelat batangan Fry","J. S. Fry & Sons mencampur kakao, gula, dan lemak kakao menjadi cokelat padat."],
 ["Abad ke-19","teh","Perkebunan India dan Ceylon","Permintaan Inggris mendorong perkebunan teh di Assam dan Sri Lanka."],
 ["1870-an–1879","coklat","Cokelat susu dan conching","Daniel Peter mengembangkan cokelat susu; Rodolphe Lindt memperkenalkan conching."],
 ["Akhir abad ke-19","kopi","Karat daun","Hemileia vastatrix menghancurkan banyak kebun arabika di Asia; robusta berperan lebih besar."],
 ["1901","kopi","Paten mesin espresso","Luigi Bezzera mematenkan desain mesin espresso di Milan."],
 ["1942–1945","teh","Pendudukan Jepang","Sebagian areal kebun teh dialihkan ke tanaman pangan atau terbengkalai."],
 ["1963","kopi","International Coffee Organization","Forum antarpemerintah dan sumber statistik sektor kopi dibentuk."],
 ["Abad ke-20","umum","Konsumsi massal","Kopi instan, teh celup, dan cokelat batangan menjadi produk konsumsi luas."],
 ["Akhir abad ke-20–kini","umum","Era asal-usul","Kopi spesialti, teh artisan, dan bean-to-bar menonjolkan asal, proses, dan keterlacakan."],
 ["2018–2020","umum","UTZ dan Rainforest Alliance","UTZ bergabung dengan Rainforest Alliance; program sertifikasi baru diluncurkan."]
];
const KIND={kopi:["Kopi","var(--kopi)"],teh:["Teh","var(--teh)"],coklat:["Cokelat","var(--coklat)"],umum:["Umum","var(--ink)"]};
const TLF=[["semua","Semua"],["kopi","Kopi"],["teh","Teh"],["coklat","Cokelat"]];

const GLOS=[
 ["Arabika","Jenis kopi Coffea arabica; berhubungan dengan sejarah budidaya Ethiopia–Yaman."],
 ["Robusta","Nama umum Coffea canephora; banyak kultivar penting untuk produksi kopi komersial."],
 ["Crema","Lapisan busa halus yang terbentuk di permukaan espresso."],
 ["Espresso","Kopi yang diekstraksi cepat dengan air panas bertekanan."],
 ["Microfoam","Susu bertekstur dengan gelembung sangat halus."],
 ["Specialty coffee","Istilah pasar untuk kopi yang menekankan kualitas, penilaian, asal, dan karakter produk."],
 ["Oksidasi teh","Reaksi enzimatis daun setelah struktur sel rusak; berbeda dari fermentasi mikroba."],
 ["Matcha","Bubuk teh hijau yang disiapkan dengan dikocok bersama air."],
 ["Chanoyu / chado","Tradisi terstruktur penyajian teh di Jepang."],
 ["Gongfu cha","Tradisi penyeduhan teh yang menekankan teknik dan seduhan berulang."],
 ["Kakao / cacao","Biji atau bahan dari tanaman Theobroma cacao; pemakaian istilah bisa berbeda menurut konteks."],
 ["Massa kakao / cocoa liquor","Hasil penggilingan nib kakao; bukan minuman beralkohol meskipun memakai istilah liquor."],
 ["Mentega kakao","Lemak alami yang terdapat dalam biji kakao."],
 ["Conching","Pengadukan dan penghalusan cokelat untuk mengembangkan tekstur dan rasa."],
 ["Tempering","Pengaturan kristalisasi lemak kakao agar cokelat stabil, mengilap, dan patahannya bagus."],
 ["Tanam Paksa / Cultuurstelsel","Sistem kolonial abad ke-19 yang mewajibkan produksi tanaman ekspor tertentu di Hindia Belanda."]
];

const SRC=[
 ["Tuchscherer, M. (2024). The Ethiopian and Yemeni roots of coffee. Oxford Research Encyclopedia of Food Studies.","https://doi.org/10.1093/acrefore/9780197762530.013.25"],
 ["Fernando, M. R. (2009). Coffee cultivation in Java, 1830–1917. Cambridge University Press.",""],
 ["Zarrillo, S., dkk. (2018). The use and domestication of Theobroma cacao during the mid-Holocene in the upper Amazon. Nature Ecology & Evolution.","https://doi.org/10.1038/s41559-018-0697-x"],
 ["Fiegl, A. (2008). A brief history of chocolate. Smithsonian Magazine.","https://www.smithsonianmag.com/arts-culture/a-brief-history-of-chocolate-21860917/"],
 ["National Park Service. Boston Tea Party in real time.","https://www.nps.gov/articles/000/boston-tea-party-in-real-time.htm"],
 ["Dinas Perkebunan Provinsi Jawa Barat (2025). Perjalanan historis teh di Jawa Barat.","https://balinbun.jabarprov.go.id/postingan/perjalanan-historis-teh-di-jawa-barat-67c7b04401af265fc2340b4e"],
 ["Liu, A. B. (2020). The two tea countries. Dalam Tea War. Yale University Press.","https://doi.org/10.12987/yale/9780300243734.003.0002"],
 ["Neilson, J. (2008). Global private regulation and value-chain restructuring in Indonesian smallholder coffee systems. World Development.","https://doi.org/10.1016/j.worlddev.2007.09.005"],
 ["Reis, C. E. G., dkk. (2019). Effects of coffee consumption on glucose metabolism. Journal of Traditional and Complementary Medicine.","https://doi.org/10.1016/j.jtcme.2018.01.001"],
 ["Marcus, G. M., dkk. (2026). Caffeine and cardiovascular disease: A scientific statement from the American Heart Association. Circulation.","https://doi.org/10.1161/CIR.0000000000001454"],
 ["Hayat, K., dkk. (2015). Tea and its consumption: Benefits and risks. Critical Reviews in Food Science and Nutrition.","https://doi.org/10.1080/10408398.2012.678949"],
 ["European Commission (2015). Commission Regulation (EU) 2015/539 (klaim kesehatan flavanol kakao).","https://eur-lex.europa.eu/eli/reg/2015/539/oj/eng"],
 ["Bunn, C., dkk. (2015). A bitter cup: Climate change profile of global production of Arabica and Robusta coffee. Climatic Change.","https://doi.org/10.1007/s10584-014-1306-x"],
 ["Rainforest Alliance. UTZ certification (now part of the Rainforest Alliance).","https://www.rainforest-alliance.org/utz/"]
];

const VIEWS=[["ringkas","Ringkasan"],["kopi","Kopi"],["teh","Teh"],["coklat","Cokelat"],["tl","Garis Waktu"],["istilah","Istilah"]];
const S={view:"ringkas",tl:"semua",gq:""};

/* ================= GAYA ================= */
const CSS=`
#sv-beverage .bv-hero .page-title{line-height:.96}
#sv-beverage .bv-lead{max-width:640px;color:var(--muted);font-size:18px;line-height:1.65;margin:10px 0 0}
#sv-beverage .bv-tabs{display:flex;flex-wrap:nowrap;gap:8px;margin:22px 0 24px;padding:4px 2px 10px;overflow-x:auto;scrollbar-width:none}
#sv-beverage .bv-tabs::-webkit-scrollbar{display:none}
#sv-beverage .bv-tabs .tab{flex:none;white-space:nowrap}
#sv-beverage .bv-grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
#sv-beverage .bv-sec{margin:34px 0 0}
#sv-beverage .bv-sec>h2{font-size:clamp(24px,3.4vw,34px);margin:0 0 6px}
#sv-beverage .bv-sub{color:var(--muted);margin:0 0 16px;max-width:64ch}
#sv-beverage .bv-card{background:var(--paper);border-radius:24px;box-shadow:0 6px 0 var(--edge);padding:22px 24px}
#sv-beverage .bv-card h3{font-size:20px;margin:0 0 8px}
#sv-beverage .bv-card p{margin:0;color:var(--muted);line-height:1.65}
#sv-beverage .bv-tile{display:flex;flex-direction:column;gap:8px;min-height:230px;padding:24px;border:0;border-radius:24px;background:var(--tb);box-shadow:0 6px 0 var(--ts);color:var(--ink);text-align:left;transition:transform .12s cubic-bezier(.3,1.6,.5,1),box-shadow .12s}
#sv-beverage .bv-tile:hover{transform:translateY(-2px)}
#sv-beverage .bv-tile:active{transform:translateY(4px);box-shadow:0 2px 0 var(--ts)}
#sv-beverage .bv-tile .ic{display:grid;place-items:center;width:56px;height:56px;border-radius:16px;background:rgba(255,255,255,.55);font-size:28px}
#sv-beverage .bv-tile h2{font-size:26px;font-weight:800;margin:4px 0 0}
#sv-beverage .bv-tile small{font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
#sv-beverage .bv-tile p{margin:0;font-size:15px;line-height:1.55}
#sv-beverage .bv-tile .go{margin-top:auto;padding-top:6px;font-weight:800}
#sv-beverage .bv-pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
#sv-beverage .bv-pill{padding:6px 14px;border-radius:999px;background:var(--paper);border:2px solid var(--line);font-size:14px}
#sv-beverage .bv-myth{display:flex;flex-direction:column;gap:8px}
#sv-beverage .bv-chip{align-self:flex-start;padding:3px 10px;border-radius:999px;background:var(--ink);color:var(--paper);font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
#sv-beverage .bv-tbl{overflow-x:auto;border-radius:20px;box-shadow:0 6px 0 var(--edge);background:var(--paper)}
#sv-beverage .bv-tbl table{width:100%;min-width:680px;border-collapse:collapse;font-size:14.5px}
#sv-beverage .bv-tbl th,#sv-beverage .bv-tbl td{padding:12px 14px;text-align:left;vertical-align:top;border-bottom:2px solid var(--line)}
#sv-beverage .bv-tbl tr:last-child td{border-bottom:0}
#sv-beverage .bv-tbl thead th{font:900 15px var(--display)}
#sv-beverage .bv-tbl th[scope=row]{font-weight:800;white-space:nowrap}
#sv-beverage .bv-indo{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
#sv-beverage .bv-indo div{padding:16px 18px;border-radius:20px;background:var(--bt);border-left:8px solid var(--bc)}
#sv-beverage .bv-indo b{display:block;font:900 20px var(--display)}
#sv-beverage .bv-indo span{font-size:14.5px;line-height:1.5}
#sv-beverage .bv-bhero{display:flex;gap:20px;align-items:flex-start;padding:24px;border-radius:24px;background:var(--bt);box-shadow:0 6px 0 rgba(0,0,0,.12)}
#sv-beverage .bv-bhero .ic{flex:none;display:grid;place-items:center;width:84px;height:84px;border-radius:24px;background:rgba(255,255,255,.6);font-size:44px}
#sv-beverage .bv-bhero h2{font-size:clamp(30px,4.4vw,46px);margin:0}
#sv-beverage .bv-bhero small{font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
#sv-beverage .bv-bhero p{margin:8px 0 0;line-height:1.65;max-width:70ch}
#sv-beverage .bv-facts{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin:18px 0 6px}
#sv-beverage .bv-fact{padding:12px 16px;border-radius:18px;background:var(--paper);box-shadow:0 4px 0 var(--edge)}
#sv-beverage .bv-fact small{display:block;color:var(--muted);font-size:12.5px}
#sv-beverage .bv-fact b{font-size:15px}
#sv-beverage .bv-bar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:22px 0 12px;flex-wrap:wrap}
#sv-beverage .bv-bar h2{font-size:24px;margin:0}
#sv-beverage .bv-link{border:0;background:none;color:var(--accent);font-weight:800;padding:6px 4px;text-decoration:underline;text-underline-offset:3px}
#sv-beverage .bv-det{margin:0 0 14px;overflow:hidden;border-radius:20px;background:var(--paper);box-shadow:0 4px 0 var(--edge)}
#sv-beverage .bv-det summary{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 20px;list-style:none;cursor:pointer;font:900 18px var(--display)}
#sv-beverage .bv-det summary::-webkit-details-marker{display:none}
#sv-beverage .bv-det summary::after{content:"";flex:none;width:10px;height:10px;margin-top:-4px;border-right:3px solid currentColor;border-bottom:3px solid currentColor;transform:rotate(45deg);transition:transform .2s}
#sv-beverage .bv-det[open] summary::after{margin-top:4px;transform:rotate(-135deg)}
#sv-beverage .bv-det .in{padding:0 20px 18px}
#sv-beverage .bv-det .in>p{margin:0 0 12px;line-height:1.72;max-width:72ch}
#sv-beverage .bv-note{padding:12px 14px;border-radius:14px;background:var(--bt,var(--kopi-tint));font-size:14.5px;line-height:1.6;max-width:72ch}
#sv-beverage .bv-dl{list-style:none;margin:4px 0 12px;padding:0}
#sv-beverage .bv-dl li{display:grid;grid-template-columns:minmax(120px,210px) 1fr;gap:4px 18px;padding:11px 0;border-top:2px dashed var(--line);line-height:1.6}
#sv-beverage .bv-dl li:first-child{border-top:0}
#sv-beverage .bv-dl li>b{font-weight:800}
#sv-beverage .bv-ol{list-style:none;margin:4px 0 12px;padding:0;display:grid;gap:10px}
#sv-beverage .bv-ol li{display:flex;gap:14px;align-items:flex-start}
#sv-beverage .bv-ol .n{flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--ink);color:var(--paper);font-weight:800}
#sv-beverage .bv-ol div{display:grid;gap:2px;line-height:1.5}
#sv-beverage .bv-ol em{color:var(--muted);font-size:14px;font-style:normal}
#sv-beverage .bv-ext{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
#sv-beverage .bv-ext .bv-card small{font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--teh)}
#sv-beverage .bv-tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 18px}
#sv-beverage .bv-q{flex:1 1 240px;max-width:380px;padding:12px 18px;border:2px solid var(--line);border-radius:999px;background:var(--paper);color:var(--ink)}
#sv-beverage .bv-count{color:var(--muted);font-size:14px;margin:0 0 14px}
#sv-beverage .bv-tl{list-style:none;margin:0 0 0 10px;padding:0 0 0 22px;border-left:4px solid var(--edge)}
#sv-beverage .bv-tl li{position:relative;padding:0 0 20px 14px;line-height:1.55}
#sv-beverage .bv-tl li::before{content:"";position:absolute;left:-36px;top:5px;width:18px;height:18px;border-radius:50%;background:var(--c);border:4px solid var(--foam)}
#sv-beverage .bv-tl .y{font:900 15px var(--display)}
#sv-beverage .bv-tl .k{margin-left:8px;padding:1px 8px;border-radius:999px;background:var(--c);color:#fff;font-size:11.5px;font-weight:800;vertical-align:1px}
#sv-beverage .bv-tl h3{font-size:19px;margin:2px 0 2px}
#sv-beverage .bv-tl p{margin:0;color:var(--muted)}
#sv-beverage .bv-gl{margin:0;display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
#sv-beverage .bv-gl div{padding:14px 18px;border-radius:18px;background:var(--paper);box-shadow:0 4px 0 var(--edge)}
#sv-beverage .bv-gl dt{font-weight:800}
#sv-beverage .bv-gl dd{margin:2px 0 0;color:var(--muted);font-size:14.5px;line-height:1.55}
#sv-beverage .bv-empty{padding:28px;border-radius:20px;background:var(--paper);text-align:center;color:var(--muted)}
#sv-beverage .bv-src{margin:40px 0 0}
#sv-beverage .bv-src ul{margin:10px 0 0;padding-left:20px;font-size:13.5px;line-height:1.6;color:var(--muted)}
#sv-beverage .bv-src a{color:var(--accent)}
#sv-beverage .bv-src p{margin:8px 0 0;font-size:13.5px;color:var(--muted);max-width:72ch}
@media(max-width:700px){
 #sv-beverage .bv-bhero{flex-direction:column;gap:12px;padding:20px}
 #sv-beverage .bv-bhero .ic{width:64px;height:64px;font-size:34px}
 #sv-beverage .bv-dl li{grid-template-columns:1fr;gap:2px}
 #sv-beverage .bv-lead{font-size:16px}
}`;

/* ================= PEMBANGUN HTML ================= */
const sourcesHtml=()=>'<details class="bv-det bv-src"><summary>Sumber dan catatan metode</summary><div class="in">'
 +'<p>Isi tab ini diringkas dari dua dokumen: makalah kajian “Sejarah Kopi, Teh, dan Cokelat” (tinjauan pustaka naratif) dan edisi sejarah global dan Indonesia. Legenda dipisahkan dari bukti arkeologis dan arsip tertulis; klaim kesehatan ditulis sebagai asosiasi atau potensi manfaat bila bukti belum menunjukkan sebab-akibat. Tanggal awal sering berupa perkiraan, dan rincian bisa berbeda antar sumber.</p>'
 +'<ul>'+SRC.map(r=>'<li>'+(r[1]?'<a href="'+esc(r[1])+'" target="_blank" rel="noopener">'+esc(r[0])+'</a>':esc(r[0]))+'</li>').join("")+'</ul></div></details>';

function detHtml(s,open){
 let h='<details class="bv-det"'+(open?" open":"")+'><summary>'+esc(s.t)+'</summary><div class="in">';
 (s.p||[]).forEach(t=>{h+="<p>"+esc(t)+"</p>"});
 if(s.ul)h+='<ul class="bv-dl">'+s.ul.map(x=>"<li><b>"+esc(x[0])+"</b><span>"+esc(x[1])+"</span></li>").join("")+"</ul>";
 if(s.ol)h+='<ol class="bv-ol">'+s.ol.map((x,i)=>'<li><span class="n">'+(i+1)+"</span><div><b>"+esc(x[0])+"</b><span>"+esc(x[1])+"</span><em>"+esc(x[2])+"</em></div></li>").join("")+"</ol>";
 if(s.note)h+='<p class="bv-note">'+esc(s.note)+"</p>";
 return h+"</div></details>";
}

function viewOverview(){
 const tiles=["kopi","teh","coklat"].map(id=>{const b=BEV[id];
  return '<button type="button" class="bv-tile" data-bvgo="'+id+'" style="--tb:'+b.bg+';--ts:'+b.sh+'"><span class="ic" aria-hidden="true">'+b.emoji+'</span><h2>'+b.name+'</h2><small>'+esc(b.tag)+'</small><p>'+esc(b.blurb)+'</p><span class="go">Baca sejarahnya →</span></button>'}).join("");
 const th=COMPARE.length?'<thead><tr><th scope="col"></th><th scope="col" style="background:var(--kopi-tint)">Kopi</th><th scope="col" style="background:var(--teh-tint)">Teh</th><th scope="col" style="background:var(--coklat-tint)">Cokelat</th></tr></thead>':"";
 const tb='<tbody>'+COMPARE.map(r=>'<tr><th scope="row">'+esc(r[0])+'</th><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td></tr>').join("")+'</tbody>';
 return '<div class="bv-grid">'+tiles+'</div>'
 +'<div class="bv-pills"><span class="bv-pill"><b>3</b> minuman</span><span class="bv-pill"><b>'+TL.length+'</b> peristiwa di garis waktu</span><span class="bv-pill">Fokus <b>Indonesia</b></span></div>'
 +'<section class="bv-sec"><h2>Legenda atau bukti?</h2><p class="bv-sub">Cerita asal-usul populer sering lebih meyakinkan daripada buktinya. Ini empat yang paling sering ditemui.</p><div class="bv-grid">'
 +MYTHS.map(m=>'<div class="bv-card bv-myth"><span class="bv-chip">'+esc(m[1])+'</span><h3>'+esc(m[0])+'</h3><p>'+esc(m[2])+'</p></div>').join("")+'</div></section>'
 +'<section class="bv-sec"><h2>Tiga minuman, satu perbandingan</h2><p class="bv-sub">Geser ke samping bila tabel terpotong di layar kecil.</p><div class="bv-tbl"><table>'+th+tb+'</table></div></section>'
 +'<section class="bv-sec"><h2>Pola yang sama di balik ketiganya</h2><div class="bv-grid">'
 +PATTERNS.map(p=>'<div class="bv-card"><h3>'+esc(p[0])+'</h3><p>'+esc(p[1])+'</p></div>').join("")+'</div></section>'
 +'<section class="bv-sec"><h2>Jejak di Indonesia</h2><p class="bv-sub">Ketiganya tumbuh di iklim tropis dan menjadi bagian dari sejarah perkebunan, tenaga kerja, ekspor, dan mata pencaharian petani.</p><div class="bv-indo">'
 +INDO.map(x=>{const b=BEV[x[0]];return '<div style="--bt:'+b.t+';--bc:'+b.c+'"><b>'+esc(b.name)+' · '+esc(x[1])+'</b><span>'+esc(x[2])+'</span></div>'}).join("")+'</div></section>'
 +'<section class="bv-sec"><h2>Tantangan masa kini</h2><div class="bv-grid">'
 +TODAY.map(p=>'<div class="bv-card"><h3>'+esc(p[0])+'</h3><p>'+esc(p[1])+'</p></div>').join("")+'</div></section>'
 +sourcesHtml();
}

function viewBev(id){
 const b=BEV[id];if(!b)return viewOverview();
 let h='<div class="bv-bhero" style="--bt:'+b.t+'"><span class="ic" aria-hidden="true">'+b.emoji+'</span><div><small>'+esc(b.tag)+'</small><h2>'+esc(b.name)+'</h2><p>'+esc(b.intro)+'</p></div></div>'
 +'<div class="bv-facts">'+b.facts.map(f=>'<div class="bv-fact"><small>'+esc(f[0])+'</small><b>'+esc(f[1])+'</b></div>').join("")+'</div>'
 +'<div class="bv-bar"><h2>Perjalanan sejarahnya</h2><span><button type="button" class="bv-link" data-bvall="open">Buka semua</button> <button type="button" class="bv-link" data-bvall="close">Tutup semua</button></span></div>'
 +'<div style="--bt:'+b.t+'">'+b.secs.map((s,i)=>detHtml(s,i===0)).join("")+'</div>';
 if(b.extra)h+='<section class="bv-sec"><h2>'+esc(b.extra.title)+'</h2><div class="bv-ext">'
  +b.extra.items.map(x=>'<div class="bv-card"><small>'+esc(x[0])+'</small><h3>'+esc(x[1])+'</h3><p>'+esc(x[2])+'</p></div>').join("")+'</div></section>';
 return h+sourcesHtml();
}

function tlList(){
 const r=TL.filter(x=>S.tl==="semua"||x[1]===S.tl||x[1]==="umum");
 return '<ol class="bv-tl">'+r.map(x=>{const k=KIND[x[1]];return '<li style="--c:'+k[1]+'"><span class="y">'+esc(x[0])+'</span><span class="k">'+k[0]+'</span><h3>'+esc(x[2])+'</h3><p>'+esc(x[3])+'</p></li>'}).join("")+'</ol>';
}
function viewTl(){
 return '<h2 style="font-size:clamp(24px,3.4vw,34px)">Garis waktu gabungan</h2><p class="bv-sub">Tanggal awal menunjukkan rentang bukti atau perkiraan sejarah, bukan selalu tanggal penciptaan yang pasti. Peristiwa umum selalu ikut tampil.</p>'
 +'<div class="tabs" role="group" aria-label="Filter garis waktu" style="margin:0 0 22px">'+TLF.map(f=>'<button type="button" class="tab" data-bvtl="'+f[0]+'" aria-pressed="'+(S.tl===f[0])+'">'+f[1]+'</button>').join("")+'</div>'
 +tlList()+sourcesHtml();
}

function glossList(){
 const q=norm(S.gq).trim(),r=GLOS.filter(g=>!q||norm(g.join(" ")).includes(q));
 return {n:r.length,html:r.length?'<dl class="bv-gl">'+r.map(g=>'<div><dt>'+esc(g[0])+'</dt><dd>'+esc(g[1])+'</dd></div>').join("")+'</dl>':'<div class="bv-empty">Istilah tidak ditemukan.</div>'};
}
function viewGloss(){
 const l=glossList();
 return '<h2 style="font-size:clamp(24px,3.4vw,34px)">Glosarium ringkas</h2><p class="bv-sub">Istilah yang sering muncul di sejarah dan proses pembuatan kopi, teh, dan cokelat.</p>'
 +'<div class="bv-tools"><input id="bvGq" class="bv-q" type="search" placeholder="Cari istilah" aria-label="Cari istilah" value="'+esc(S.gq)+'"></div>'
 +'<p class="bv-count" id="bvGc" aria-live="polite">'+l.n+' istilah</p><div id="bvGl">'+l.html+'</div>'+sourcesHtml();
}

/* ================= RENDER + EVENT ================= */
function shell(){
 root.innerHTML='<div class="wrap hb bv">'
 +'<div class="bv-hero rv" style="--i:0"><h1 class="page-title">Sejarah kopi,<br>teh &amp; cokelat</h1><p class="bv-lead">Tiga tanaman yang membentuk jalur dagang, kebiasaan sosial, dan kekuasaan lintas benua. Dari legenda sampai bukti arkeologis, dari kedai kopi sampai kebun di Jawa.</p></div>'
 +'<div class="bv-tabs tabs rv" style="--i:1" role="group" aria-label="Bagian Beverage">'+VIEWS.map(v=>'<button type="button" class="tab" data-bvview="'+v[0]+'" aria-pressed="false">'+v[1]+'</button>').join("")+'</div>'
 +'<div id="bvBody"></div></div>';
}
function paint(){
 const b=root.querySelector("#bvBody");if(!b)return;
 const v=S.view;
 b.innerHTML=v==="tl"?viewTl():v==="istilah"?viewGloss():v==="ringkas"?viewOverview():viewBev(v);
 root.querySelectorAll("[data-bvview]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.bvview===v)));
}

root.addEventListener("click",e=>{
 const t=e.target.closest("[data-bvview],[data-bvgo],[data-bvtl],[data-bvall]");
 if(!t)return;
 const d=t.dataset;
 if(d.bvview||d.bvgo){S.view=d.bvview||d.bvgo;paint();window.scrollTo(0,0);return}
 if(d.bvtl){S.tl=d.bvtl;paint();return}
 if(d.bvall){const open=d.bvall==="open";root.querySelectorAll("#bvBody .bv-det").forEach(x=>{if(!x.classList.contains("bv-src"))x.open=open})}
});
root.addEventListener("input",e=>{
 if(e.target.id==="bvGq"){S.gq=e.target.value;const l=glossList();root.querySelector("#bvGl").innerHTML=l.html;root.querySelector("#bvGc").textContent=l.n+" istilah"}
});

/* dirender saat tab dibuka pertama kali */
let built=false;
function sync(){
 if(location.hash.replace(/^#\/?/,"")!=="beverage")return;
 if(built)return;
 const st=document.createElement("style");st.id="bvCss";st.textContent=CSS;document.head.appendChild(st);
 shell();paint();built=true;
}
addEventListener("hashchange",sync);
addEventListener("popstate",sync);
sync();
})();
}catch(e){console.error("[beverage]",e)}
