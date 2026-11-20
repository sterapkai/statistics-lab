// =====================
// グローバル変数
// =====================

let population = [];

let currentSample = [];

let trueMeanHeight = 0;

let histogramChart = null;

let scatterChart = null;


// =====================
// CSV読込
// =====================

Papa.parse(
    "statistics_population_50000.csv",
    {
        download: true,
        header: true,

        complete: function (results) {

            population = results.data.filter(
                p => p["ID"]
            );

            calculatePopulationStats();

        }
    }
);


// =====================
// 母平均計算
// =====================

function calculatePopulationStats() {

    let sum = 0;

    population.forEach(p => {

        sum += Number(
            p["身長_cm"]
        );

    });

    trueMeanHeight =
        sum / population.length;

}


// =====================
// 標本抽出
// =====================

function runSample() {

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

    let filtered =
        population.filter(p => {

            const age =
                Number(
                    p["年齢"]
                );

            if (
                gender &&
                p["性別"] !== gender
            ) {
                return false;
            }

            return (
                age >= minAge &&
                age <= maxAge
            );

        });

    if (filtered.length === 0) {

        alert(
            "条件に一致するデータがありません"
        );

        return;
    }

    currentSample = [];

    for (
        let i = 0;
        i < sampleSize;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                filtered.length
            );

        currentSample.push(
            filtered[randomIndex]
        );

    }

    showStatistics();

    showTable();

    drawHistogram(
        document.getElementById(
            "histTarget"
        ).value
    );

    drawScatter(
        document.getElementById(
            "xAxis"
        ).value,

        document.getElementById(
            "yAxis"
        ).value
    );
}


// =====================
// 統計量表示
// =====================

function showStatistics() {

    
