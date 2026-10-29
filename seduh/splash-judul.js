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
