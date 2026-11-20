let population = [];
let currentSample = [];
let trueMeanHeight = 0;

let histChart = null;
let relationChart = null;

Papa.parse(
    "statistics_population_50000.csv",
    {
        download:true,
        header:true,

        complete:function(results){

            population =
            results.data.filter(
                row=>row.ID
            );

            let total = 0;

            population.forEach(row=>{

                total += Number(
                    row["身長_cm"]
                );

            });

            trueMeanHeight =
            total / population.length;

            document
            .getElementById("summary")
            .innerHTML =

            `母集団読込完了<br><br>
             母集団人数：${population.length}人`;

        }
    }
);

function runSample(){

    if(population.length===0){

        alert("CSV読込中です");

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

        const age =
        Number(row["年齢"]);

        const sleep =
        Number(row["睡眠時間_h"]);

        const work =
        Number(row["労働学業時間_h"]);

        if(
            gender &&
            row["性別"]!==gender
        ){
            return false;
        }

        if(age<minAge || age>maxAge){
            return false;
        }

        if(sleep<minSleep || sleep>maxSleep){
            return false;
        }

        if(work<minWork || work>maxWork){
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
    drawRelationship();

}
