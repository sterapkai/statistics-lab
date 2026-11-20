let population = [];

let currentSample = [];

let trueMeanHeight = 0;

let histChart = null;



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

            let total = 0;

            population.forEach(row => {

                total +=
                Number(
                    row["身長_cm"]
                );

            });

            trueMeanHeight =
                total /
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
            ${population.length}人
            `;
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

    population.filter(row=>{

        let age =
        Number(row["年齢"]);

        let sleep =
        Number(row["睡眠時間_h"]);

        let work =
        Number(
            row["労働学業時間_h"]
        );

        if(
            gender &&
            row["性別"]!==gender
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

    });



    if(filtered.length===0){

        alert(
            "条件に一致するデータがありません"
        );

        return;

    }



    currentSample = [];



    for(
        let i=0;
        i<sampleSize;
        i++
    ){

        const index =

        Math.floor(
            Math.random()
            * filtered.length
        );

        currentSample.push(
            filtered[index]
        );

    }



    showSummary();

    showTable();

    updateHistogram();

}



function average(key){

    let total = 0;

    currentSample.forEach(row=>{

        total +=
        Number(row[key]);

    });

    return total /
    currentSample.length;

}



function showSummary(){

    let avgAge =
    average("年齢");

    let avgHeight =
    average("身長_cm");

    let avgSleep =
    average("睡眠時間_h");

    let avgWork =
    average(
        "労働学業時間_h"
    );

    let error =

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
    ${currentSample.length}人

    <br><br>

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

        let value =
        Number(
            row[key]
        );

        let bin =

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

                labels:
                Object.keys(
                    bins
                ),

                datasets:[{

                    label:key,

                    data:
                    Object.values(
                        bins
                    ),

                    backgroundColor:
                    "steelblue"

                }]

            }

        }

    );

}
