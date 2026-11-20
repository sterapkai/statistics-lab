let population=[];

let trueMeanHeight=0;

let histogramChart=null;
let scatterChart=null;

Papa.parse(
"statistics_population_50000.csv",
{
download:true,
header:true,

complete:function(results){

population=results.data;

let sum=0;

population.forEach(p=>{

sum+=Number(p["身長_cm"]);

});

trueMeanHeight=
sum/population.length;

}
}
);

function runSample(){

const n=
Number(
document.getElementById("sampleSize").value
);

const gender=
document.getElementById("gender").value;

const minAge=
Number(
document.getElementById("minAge").value
);

const maxAge=
Number(
document.getElementById("maxAge").value
);

let filtered=
population.filter(p=>{

const age=
Number(p["年齢"]);

if(
gender &&
p["性別"]!==gender
)
return false;

return age>=minAge &&
age<=maxAge;

});

if(filtered.length===0){

alert("データが見つかりません");

return;

}

const sample=[];

for(let i=0;i<n;i++){

sample.push(

filtered[
Math.floor(
Math.random()*filtered.length
)
]

);

}

showResult(sample);
showTable(sample);
drawHistogram(sample);
drawScatter(sample);

}

function showResult(sample){

let total=0;

sample.forEach(p=>{

total+=Number(
p["身長_cm"]
);

});

const mean=
total/sample.length;

const error=
Math.abs(
mean-
trueMeanHeight
);

document
.getElementById("result")
.innerHTML=

`
標本平均身長 :
${mean.toFixed(2)}cm

<br><br>

母平均との差 :
${error.toFixed(2)}cm
`;
}

function showTable(sample){

let html=
"<table>";

html+=
`
<tr>
<th>ID</th>
<th>性別</th>
<th>年齢</th>
<th>身長</th>
</tr>
`;

sample.slice(0,100)
.forEach(p=>{

html+=
`
<tr>

<td>${p.ID}</td>

<td>${p["性別"]}</td>

<td>${p["年齢"]}</td>

<td>${p["身長_cm"]}</td>

</tr>
`;

});

html+="</table>";

document
.getElementById("tableArea")
.innerHTML=
html;

}

function drawHistogram(sample){

const groups={};

sample.forEach(p=>{

let h=
Number(p["身長_cm"]);

let bin=
Math.floor(h/5)*5;

groups[bin]=
(groups[bin]||0)+1;

});

if(histogramChart)
histogramChart.destroy();

histogramChart=
new Chart(
document
.getElementById("histogram"),
{
type:"bar",

data:{

labels:
Object.keys(groups),

datasets:[{

label:"人数",

data:
Object.values(groups)

}]

}

}
);

}

function drawScatter(sample){

if(scatterChart)
scatterChart.destroy();

scatterChart=
new Chart(
document
.getElementById("scatter"),
{

type:"scatter",

data:{

datasets:[{

label:
"年齢×身長",

data:
sample.map(p=>({

x:Number(
p["年齢"]
),

y:Number(
p["身長_cm"]
)

}))

}]

}

}

);

}
