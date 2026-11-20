// =======================
// グローバル変数
// =======================

let population = [];
let currentSample = [];

let trueMeanHeight = 0;

let histChart = null;
let relationChart = null;

// =======================
// CSV読込
// =======================

Papa.parse(
    "statistics_population_50000.csv",
    {
        download: true,
        header: true,

        complete: function(results){

            population =
                results.data.filter(
                    row => row.ID
                );

            let totalHeight = 0;

            population.forEach(row => {

                totalHeight +=
                    Number(
                        row["身長_cm"]
                    );

            });

            trueMeanHeight =
                totalHeight /
                population.length;

            document
                .getElementById(
                    "summary"
                )
                .innerHTML =

                `
                母集団読込完了

                <br><br>

                母集団人数：
                ${population.length} 人
                `;
        },

        error: function(error){

            console.error(
                error
            );

            alert(
                "CSV読込に失敗しました"
            );

        }
    }
);

// =======================
// 平均計算
// =======================

function average(key){

    if(
        currentSample.length === 0
    ){
        return 0;
    }

    let total = 0;

    currentSample.forEach(row => {

        total += Number(
            row[key]
        );

    });

    return (
        total /
        currentSample.length
    );

}

// =======================
// 標本抽出
// =======================

function runSample(){

    if(
        population.length === 0
    ){

        alert(
            "CSV読込中です"
        );

        return;
    }

    const sampleSize =
        Number(
            document.getElementById(
                "sampleSize"
            ).value
        );

    const gender =
        document.getElementById(
            "gender"
        ).value;

    const minAge =
        Number(
            document.getElementById(
                "minAge"
            ).value
        );

    const maxAge =
        Number(
            document.getElementById(
                "maxAge"
            ).value
        );

    const minSleep =
        Number(
            document.getElementById(
                "minSleep"
            ).value
        );

    const maxSleep =
        Number(
            document.getElementById(
                "maxSleep"
            ).value
        );

    const minWork =
        Number(
            document.getElementById(
                "minWork"
            ).value
        );

    const maxWork =
        Number(
            document.getElementById(
                "maxWork"
            ).value
        );

    let filtered =
        population.filter(
            row => {

                const age =
                    Number(
                        row["年齢"]
                    );

                const sleep =
                    Number(
                        row["睡眠時間_h"]
                    );

                const work =
                    Number(
                        row["労働学業時間_h"]
                    );

                if(
                    gender &&
                    row["性別"] !== gender
                ){
                    return false;
                }

                if(
                    age < minAge ||
                    age > maxAge
                ){
                    return false;
                }

                if(
                    sleep < minSleep ||
                    sleep > maxSleep
                ){
                    return false;
                }

                if(
                    work < minWork ||
                    work > maxWork
                ){
                    return false;
                }

                return true;
            }
        );

    if(
        filtered.length === 0
    ){

        alert(
            "条件に一致するデータがありません"
        );

        return;
    }

    currentSample = [];

    for(
        let i = 0;
        i < sampleSize;
        i++
    ){

        const index =
            Math.floor(
                Math.random() *
                filtered.length
            );

        currentSample.push(
            filtered[index]
        );

    }

    showSummary();

    showTable();

    updateHistogram();

    drawRelationship();
}

// =======================
// 統計表示
// =======================

function showSummary(){

    const avgAge =
        average(
            "年齢"
        );

    const avgHeight =
        average(
            "身長_cm"
        );

    const avgSleep =
        average(
            "睡眠時間_h"
        );

    const avgWork =
        average(
            "労働学業時間_h"
        );

    const error =
        Math.abs(
            avgHeight -
            trueMeanHeight
        );

    document
        .getElementById(
            "summary"
        )
        .innerHTML =

        `
        標本数：
        ${currentSample.length} 人

        <br><br>

        平均年齢：
        ${avgAge.toFixed(2)} 歳

        <br><br>

        平均身長：
        ${avgHeight.toFixed(2)} cm

        <br><br>

        平均睡眠時間：
        ${avgSleep.toFixed(2)} 時間

        <br><br>

        平均労働学業時間：
        ${avgWork.toFixed(2)} 時間

        <br><br>

        母平均身長：
        ${trueMeanHeight.toFixed(2)} cm

        <br><br>

        誤差：
        ${error.toFixed(2)} cm
        `;
}

// =======================
// 表表示
// =======================

function showTable(){

    let html =

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
        .forEach(row=>{

            html +=

            `
            <tr>

            <td>${row["ID"]}</td>

            <td>${row["名前"]}</td>

            <td>${row["性別"]}</td>

            <td>${row["年齢"]}</td>

            <td>${row["身長_cm"]}</td>

            <td>${row["睡眠時間_h"]}</td>

            <td>${row["労働学業時間_h"]}</td>

            </tr>
            `;
        });

    html +=
        "</table>";

    document
        .getElementById(
            "tableArea"
        )
        .innerHTML =
        html;
}

// =======================
// ヒストグラム
// =======================

function updateHistogram(){

    if(
        currentSample.length===0
    ){
        return;
    }

    const key =
        document.getElementById(
            "histTarget"
        ).value;

    let bins = {};

    currentSample.forEach(row=>{

        const value =
            Number(
                row[key]
            );

        const bin =
            Math.floor(
                value / 5
            ) * 5;

        bins[bin] =
            (bins[bin] || 0)
            + 1;

    });

    if(histChart){
        histChart.destroy();
    }

    histChart =
        new Chart(
            document.getElementById(
                "histChart"
            ),
            {
                type:"bar",

                data:{
                    labels:Object.keys(
                        bins
                    ),

                    datasets:[
                        {
                            label:key,

                            data:Object.values(
                                bins
                            ),

                            backgroundColor:
                            "steelblue"
                        }
                    ]
                }
            }
        );
}

// =======================
// 相関図
// =======================

function drawRelationship(){

    if(
        currentSample.length===0
    ){
        return;
    }

    const type =
        document.getElementById(
            "scatterType"
        ).value;

    let data = [];
    let xLabel = "";

    if(type==="age"){

        xLabel="年齢";

        data =
        currentSample.map(
            row=>({
                x:Number(
                    row["年齢"]
                ),
                y:Number(
                    row["身長_cm"]
                )
            })
        );
    }

    else if(type==="sleep"){

        xLabel="睡眠時間";

        data =
        currentSample.map(
            row=>({
                x:Number(
                    row["睡眠時間_h"]
                ),
                y:Number(
                    row["身長_cm"]
                )
            })
        );
    }

    else{

        xLabel="労働学業時間";

        data =
        currentSample.map(
            row=>({
                x:Number(
                    row["労働学業時間_h"]
                ),
                y:Number(
                    row["身長_cm"]
                )
            })
        );
    }

    if(relationChart){
        relationChart.destroy();
    }

    relationChart =
    new Chart(

        document.getElementById(
            "relationChart"
        ),

        {

            type:"scatter",

            data:{

                datasets:[{

                    label:
                    "身長との関係",

                    data:data,

                    backgroundColor:
                    "red"

                }]

            },

            options:{

                scales:{

                    x:{
                        title:{
                            display:true,
                            text:xLabel
                        }
                    },

                    y:{
                        title:{
                            display:true,
                            text:"身長(cm)"
                        }
                    }

                }

            }

        }

    );

}
