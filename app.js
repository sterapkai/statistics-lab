let population=[];

let currentSample=[];

let trueMeanHeight=0;

let histChart=null;

let scatterChart=null;

Papa.parse(
"statistics_population_50000.csv",
{
download:true,

header:true,

complete:function(result){

population=
result.data.filter(
row=>row.ID
);

let total=0;

population.forEach(row=>{

total+=
Number(
row.身長_cm
);

});

trueMeanHeight=
total/
population.length;

console.log(
"CSV読込完了",
population.length
);

}
}
);

function runSample(){

if(population.length===0){

alert(
"CSV読込中です"
);

return;

}

let sampleSize=

Number(
document.getElementById(
"sampleSize"
).value
);

let gender=

document.getElementById(
"gender"
).value;

let minAge=

Number(
document.getElementById(
"minAge"
).value
);

let maxAge=

Number(
document.getElementById(
"maxAge"
).value
);

let filtered=

population.filter(r=>{

let age=
Number(r.年齢);

if(
gender!=="" &&
r.性別!==gender
){
return false;
}

return (
age>=minAge &&
age<=maxAge
);

});

if(filtered.length===0){

alert(
"条件に合うデータなし"
);

return;

}

currentSample=[];

for(
let i=0;
i<sampleSize;
i++
){

let index=

Math.floor(
Math.random()*
filtered.length
);

currentSample.push(
filtered[index]
);

}

showSummary();

showTable();

updateHistogram();

updateScatter();

}

function average(key){

let total=0;

currentSample.forEach(r=>{

total+=
Number(r[key]);

});

return total/currentSample.length;

}

function showSummary(){

let avgAge=
average("年齢");

let avgHeight=
average("身長_cm");

let avgSleep=
average("睡眠時間_h");

let avgWork=
average("労働学業時間_h");

let error=

Math.abs(
avgHeight-
trueMeanHeight
);

document.getElementById(
"summary"
).innerHTML=

`
平均年齢：
${avgAge.toFixed(2)}歳

<br><br>

平均身長：
${avgHeight.toFixed(2)}cm

<br><br>

平均睡眠時間：
${avgSleep.toFixed(2)}時間

<br><br>

平均労働学業時間：
${avgWork.toFixed(2)}時間

<br><br>

母平均身長：
${trueMeanHeight.toFixed(2)}cm

<br><br>

誤差：
${error.toFixed(2)}cm
`;

}

function showTable(){

let html=

`
<table>

<tr>

<th>ID</th>

<th>名前</th>

<th>性別</th>

<th>年齢</th>

<th>身長</th>

<th>睡眠</th>

<th>労働学業</th>

</tr>

`;

currentSample
.slice(0,100)
.forEach(r=>{

html+=`

<tr>

<td>${r.ID}</td>

<td>${r.名前}</td>

<td>${r.性別}</td>

<td>${r.年齢}</td>

<td>${r.身長_cm}</td>

<td>${r.睡眠時間_h}</td>

<td>${r.労働学業時間_h}</td>

</tr>

`;

});

html+="</table>";

document.getElementById(
"tableArea"
).innerHTML=html;

}

function updateHistogram(){

if(currentSample.length===0)
return;

let key=

document.getElementById(
"histTarget"
).value;

let bins={};

currentSample.forEach(r=>{

let value=
Number(r[key]);

let bin=
Math.floor(value/5)*5;

bins[bin]=
(bins[bin]||0)+1;

});

if(histChart)
histChart.destroy();

histChart=
new Chart(

document.getElementById(
"histChart"
),

{

type:"bar",

data:{

labels:
Object.keys(bins),

datasets:[{

label:key,

data:
Object.values(bins),

backgroundColor:
"steelblue"

}]

}

}

);

}

function updateScatter(){

if(currentSample.length===0)
return;

let xKey=

document.getElementById(
"xAxis"
).value;

let yKey=

document.getElementById(
"yAxis"
).value;

let points=

currentSample.map(r=>({

x:Number(r[xKey]),

y:Number(r[yKey])

}));

if(scatterChart)
scatterChart.destroy();

scatterChart=
new Chart(

document.getElementById(
"scatterChart"
),

{

type:"scatter",

data:{

datasets:[{

label:
`${xKey} × ${yKey}`,

data:points,

backgroundColor:
"red"

}]

},

options:{

scales:{

x:{
title:{
display:true,
text:xKey
}
},

y:{
title:{
display:true,
text:yKey
}
}

}

}

}

);

}
