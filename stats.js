const teams=["DC","CC","CV","FB","KT"];
const results=JSON.parse(localStorage.getItem("results"))||{};

let html="<table><tr><th>Team</th><th>Runs</th><th>Matches</th></tr>";
teams.forEach(t=>{
 let runs=0,m=0;
 Object.values(results).forEach(r=>{
  if(r.w===t){runs+=r.r1+r.r2; m++;}
 });
 html+=`<tr><td>${t}</td><td>${runs}</td><td>${m}</td></tr>`;
});
html+="</table>";
document.getElementById("teamStats").innerHTML=html;
