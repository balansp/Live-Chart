<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Realtime Line chart</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js"></script>
    <link rel="stylesheet" href="style.css" >
</head>
<body>

<div id="d3_chart"></div>
<div id="d3_chart1"></div>
<script src="scripts.js"></script>
<script type="text/javascript">
    function autorun() {
        let voltChart = new LIVE_LINE_CHART();
        voltChart.options.legendName="volt";
        voltChart.options.color="green";
        voltChart.init('#d3_chart');

        let ampChart = new LIVE_LINE_CHART();
        ampChart.options.legendName="Amp";
        ampChart.options.color="red";
        ampChart.init('#d3_chart1');

        updateVoltData = function(){
            let lineData = {
                time: new Date(),
                val: Math.floor(Math.random() * (240 - 230 + 1) + 230) //Live Value
            };

            voltChart.dataSource.push(lineData);
            voltChart.draw();
 
      }
      updateAmpData = function(){
            let lineData = {
                time: new Date(),
                val: Math.floor(Math.random() * (240 - 230 + 1) + 230) //Live Value
            };
            ampChart.dataSource.push(lineData);
            ampChart.draw();
      }


        window.setInterval(updateVoltData, 1000);
        window.setInterval(updateAmpData, 500);
 
    }

    if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
    else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
    else window.onload = autorun;
</script>
</body>
</html>
