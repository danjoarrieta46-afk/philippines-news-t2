let all=[];let lang=localStorage.getItem("ph_lang")||"en";
const $=s=>document.querySelector(s);
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=s=>{let d=document.createElement("div");d.innerHTML=s||"";return(d.textContent||"").replace(/\s+/g," ").trim()};
function ago(x){let n=(Date.now()-new Date(x))/1000;if(!isFinite(n))return"";if(n<3600)return Math.max(1,Math.floor(n/60))+"m ago";if(n<86400)return Math.floor(n/3600)+"h ago";return Math.floor(n/86400)+"d ago"}
function applyLang(){document.documentElement.lang=lang==="fil"?"fil":"en";document.querySelectorAll("[data-en]").forEach(e=>e.innerHTML=e.dataset[lang]);$("#lang").textContent=lang==="en"?"EN / FIL":"FIL / EN";$("#search").placeholder=lang==="en"?"Search headlines…":"Maghanap ng headline…"}
function render(){
 let q=$("#search").value.toLowerCase(),s=$("#source").value,c=$("#category").value;
 let list=all.filter(a=>(!q||(a.title+" "+a.description).toLowerCase().includes(q))&&(s==="all"||a.source===s)&&(c==="all"||a.category===c));
 $("#count").textContent=list.length;
 $("#grid").innerHTML=list.map(a=>`<article class="card"><div class="thumb">${a.image?`<img loading="lazy" src="${esc(a.image)}" alt="">`:`<div class="placeholder">${esc((a.source||"PH").slice(0,2).toUpperCase())}</div>`}</div><div class="content"><div class="meta"><span class="source">${esc(a.source)}</span><span>${ago(a.date)}</span></div><h3>${esc(a.title)}</h3><p>${esc(clean(a.description).slice(0,155))}${clean(a.description).length>155?"…":""}</p><a class="read" target="_blank" rel="noopener noreferrer" href="${esc(a.link)}">Read original →</a></div></article>`).join("");
 $("#empty").hidden=list.length>0;
 $("#status").textContent=`${list.length} stories`;
}
async function load(){
 $("#status").textContent="Updating…";$("#grid").innerHTML="<div class='skeleton'></div><div class='skeleton'></div><div class='skeleton'></div>";
 try{let r=await fetch("data/news.json?"+Date.now());if(!r.ok)throw Error();let j=await r.json();all=j.items||[];$("#updated").textContent=j.updated?new Date(j.updated).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}):"now";
 }catch(e){all=[];$("#status").textContent="Could not load the news cache."}
 let names=[...new Set(all.map(x=>x.source))];$("#source").innerHTML='<option value="all">All sources</option>'+names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("");
 let b=all[0];$("#breakingLink").textContent=b?b.title:"Latest headlines will appear here";if(b)$("#breakingLink").href=b.link;render();
}
["input","change"].forEach(ev=>{$("#search").addEventListener(ev,render);$("#source").addEventListener(ev,render);$("#category").addEventListener(ev,render)});
$("#refresh").onclick=load;$("#lang").onclick=()=>{lang=lang==="en"?"fil":"en";localStorage.setItem("ph_lang",lang);applyLang()};$("#theme").onclick=()=>{let d=document.documentElement,t=d.dataset.theme==="dark"?"":"dark";d.dataset.theme=t;localStorage.setItem("ph_theme",t);$("#theme").textContent=t?"☀":"☾"};
document.documentElement.dataset.theme=localStorage.getItem("ph_theme")||"";applyLang();load();
