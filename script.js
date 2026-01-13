const teams=["DC","CC","CV","FB","KT"];
const fixtures=[
 {m:1,t1:"DC",t2:"FB"},
 {m:2,t1:"KT",t2:"CV"},
 {m:3,t1:"CC",t2:"FB"},
 {m:4,t1:"FB",t2:"CV"},
 {m:5,t1:"KT",t2:"DC"},
 {m:6,t1:"CV",t2:"CC"},
 {m:7,t1:"DC",t2:"CV"},
 {m:8,t1:"FB",t2:"KT"},
 {m:9,t1:"CC",t2:"KT"},
 {m:10,t1:"DC",t2:"CC"},
 {m:11,t1:"FB",t2:"CV"},
 {m:12,t1:"KT",t2:"CC"},
 {m:13,t1:"CV",t2:"DC"},
 {m:14,t1:"FB",t2:"KT"},
 {m:15,t1:"DC",t2:"KT"},
 {m:16,t1:"FB",t2:"CC"},
 {m:17,t1:"CV",t2:"CC"},
 {m:18,t1:"KT",t2:"CV"},
 {m:19,t1:"DC",t2:"CC"},
 {m:20,t1:"FB",t2:"DC"}
];

let results=JSON.parse(localStorage.getItem("results"))||{
 1:{r1:16,o1:4,r2:15,o2:4.3,w:"DC"},
 2:{r1:0,o1:2.3,r2:35,o2:2.4,w:"CV"},
 3:{r1:20,o1:3,r2:21,o2:1.3,w:"FB"},
 4:{r1:20,o1:5,r2:19,o2:4.2,w:"FB"},
 5:{r1:52,o1:5,r2:18,o2:1.3,w:"KT"},
 6:{r1:35,o1:4,r2:24,o2:5,w:"CV"},
 7:{r1:18,o1:2.5,r2:19,o2:2.1,w:"CV"},
 8:{r1:19,o1:0.4,r2:14,o2:2.4,w:"FB"},
 9:{r1:52,o1:5,r2:25,o2:3.5,w:"CC"}
};

function oversToBalls(o){let x=Math.floor(o);return x*6+Math.round((o-x)*10);}

function renderFixtures(){
 const tb=document.querySelector("#fixtureTable tbody");
 tb.innerHTML="";
 fixtures.forEach(f=>{
  let r=results[f.m];
  let tr=document.createElement("tr");
  tr.innerHTML=`
   <td>${f.m}</td><td>${f.t1}</td><td>${f.t2}</td>
   <td><input id="r1${f.m}" value="${r?.r1||""}"></td>
   <td><input id="o1${f.m}" value="${r?.o1||""}"></td>
   <td><input id="r2${f.m}" value="${r?.r2||""}"></td>
   <td><input id="o2${f.m}" value="${r?.o2||""}"></td>
   <td>
    <select id="w${f.m}">
     <option></option>
     <option ${r?.w===f.t1?"selected":""}>${f.t1}</option>
     <option ${r?.w===f.t2?"selected":""}>${f.t2}</option>
    </select>
   </td>
   <td><button onclick="saveMatch(${f.m})">💾</button></td>`;
  if(r) tr.classList.add("locked");
  tb.appendChild(tr);
 });
}

function saveMatch(m){
 results[m]={
  r1:+document.getElementById(`r1${m}`).value,
  o1:+document.getElementById(`o1${m}`).value,
  r2:+document.getElementById(`r2${m}`).value,
  o2:+document.getElementById(`o2${m}`).value,
  w:document.getElementById(`w${m}`).value
 };
 localStorage.setItem("results",JSON.stringify(results));
 renderAll();
}

function renderPoints(){
 let s={}; teams.forEach(t=>s[t]={m:0,w:0,rf:0,ra:0,bf:0,bb:0});
 Object.keys(results).forEach(i=>{
  let f=fixtures[i-1],r=results[i];
  let b1=oversToBalls(r.o1),b2=oversToBalls(r.o2);
  s[f.t1].m++; s[f.t2].m++;
  s[f.t1].rf+=r.r1; s[f.t1].ra+=r.r2;
  s[f.t2].rf+=r.r2; s[f.t2].ra+=r.r1;
  s[f.t1].bf+=b1; s[f.t1].bb+=b2;
  s[f.t2].bf+=b2; s[f.t2].bb+=b1;
  s[r.w].w++;
 });
 let rows=teams.map(t=>{
  let x=s[t];
  let n=x.bf?(((x.rf/x.bf)-(x.ra/x.bb))*6).toFixed(2):"0.00";
  return {t,m:x.m,w:x.w,l:x.m-x.w,p:x.w*2,n};
 }).sort((a,b)=>b.p-a.p||b.n-a.n||b.w-a.w);

 let tb=document.querySelector("#pointsTable tbody"); tb.innerHTML="";
 rows.forEach((r,i)=>{
  let tr=document.createElement("tr");
  tr.className=i<2?"qualifier":i<4?"eliminator":"eliminated";
  tr.innerHTML=`<td>${i+1}</td><td>${r.t}</td><td>${r.m}</td>
  <td>${r.w}</td><td>${r.l}</td><td>${r.p}</td><td>${r.n}</td>`;
  tb.appendChild(tr);
 });
 renderPlayoffs(rows);
}

function renderPlayoffs(r){
 document.getElementById("playoffs").innerHTML=`
 <div class="card">Qualifier<br>${r[0].t} vs ${r[1].t}</div>
 <div class="card">Eliminator<br>${r[2].t} vs ${r[3].t}</div>
 <div class="card">Final<br>Winner Q vs Winner E</div>`;
}

function renderAll(){
 renderFixtures();
 renderPoints();
}

renderAll();
