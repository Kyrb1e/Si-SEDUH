(function(){const el=document.getElementById("slg");if(!el)return;
const L=["Seduh, tarik, tos, lanjut!","Dari biji sampai nongkrong.","Satu aplikasi, sejuta seduhan.","Racik dulu, ngopi kemudian.","Shot sempurna, kafe terbaik.","Ngopi jadi petualangan seru!"];
let i=0;const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
setInterval(()=>{if(document.hidden)return;i=(i+1)%L.length;
 if(rm){el.textContent=L[i];return}
 el.animate([{opacity:1},{opacity:.05,offset:.5},{opacity:1}],{duration:520,easing:"ease-in-out"});setTimeout(()=>{el.textContent=L[i]},260)},3800);
})();
