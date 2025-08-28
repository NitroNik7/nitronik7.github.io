var width, height;
var margin = { top: 10, right: 70, bottom: 20, left: 20 }

var offsetTop;
var rawDailyData, todaysData;
var divId, params, period;
var today;
var smallDimension;

var xAxisTickSpacing;

var xAxisStyle = "stroke-width: 1.5; ";
var yAxisStyle = "stroke-width: 1.5; ";

var lineStyle = 'fill: none; stroke-width: 2;'
var circleStyle = 'fill-opacity: 0.2; stroke-width: 2;';
let circleRadius = 4;
var crosshairStyle = 'stroke: gray; stroke-width: 1; stroke-dasharray: 3;';

let url, dateFormat;
let svgId;

let tooltipStyle = ` 
        display: block; 
        position: absolute; 
        border: 5px solid lightgray; 
        border-radius: 10px; 
        padding: 5px;
        background-color: white;
        box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
    `;

function setDimensions(params, chartDiv) {
    // TODO
    // width = mintJsUtil.isNull(params.width) ? 300 : params.width;
    // height = mintJsUtil.isNull(params.height) ? 300 : params.height;

    width = chartDiv.width() - 100;

    smallDimension = width < 500 ? true : false;

    // if (smallDimension) {
    //     margin.left = 5;
    //     margin.right = 5;
    //     margin.top = 5;
    //     margin.bottom = 35;
    // }

    width = chartDiv.width() - margin.left - margin.right;

    if (window.innerHeight < chartDiv.height()) {
        height = window.innerHeight - margin.top - margin.bottom - 50;;
    } else {
        height = chartDiv.height() - margin.top - margin.bottom;
    }

    offsetTop = chartDiv.offset().top;
    // height = div.height()- margin.top - margin.bottom;

    // if(isMobile()){
    // 	width = $('#'+divId).width();
    // }
}

function downloadData() {
    var filePrefix = ''
    if (today) {
        filePrefix = 'today';
    } else {
        filePrefix = 'D';
    }

    // var url = '//' + window.location.hostname + '/charts/'

    // TODO
    // if(jsu.isMigContext()){

    //     if(jsu.isUsContext()){
    //         url += 'US/';
    //     }else if(jsu.isUkContext()){
    //         url += 'UK/';
    //     }else if(jsu.isCaContext()){
    //         url += 'CA/';
    //     }else if(jsu.isAuContext()){
    //         url += 'AU/';
    //     }

    // }

    // url +=   'csv/'+secId+'/'+equityId+filePrefix+'.csv' + '?var='+Math.floor((Math.random()*100)+1);;

    // var url = mintJsUtil.getBaseUrl()+'/charts/csv/'+secId +'/'+equityId+ filePrefix + '.csv?var='+Math.floor((Math.random()*100)+1);
    /*
            d3.csv(url, function(error, upData) {
            if (error){
                console.log(error);
            } else{
                if(today){
                    todaysData = upData;
                }else{
                    rawDailyData = upData;
                }
                drawChartFromData();
            }
            });   
    */

    // hardcoding
    // url = "https://raw.githubusercontent.com/NitroNik7/nitronik7.github.io/refs/heads/nitro/AdvanceDeclineRatio/AdvanceDeclineRatio/AdvanceDeclineDataDaily.csv";
    // url = "https://raw.githubusercontent.com/NitroNik7/TSR-Frontend/refs/heads/nitro/AdvanceDeclineRatio/AdvanceDeclineRatio/AdvanceDeclineData.csv";
    downloadAndProcess(url)
}

async function downloadAndProcess(url) {
    let upData = await d3.csv(url, d => d);

    if (today) {
        todaysData = upData;
    } else {
        rawDailyData = upData;
    }
    drawChartFromData();
}

// TODO
function parseDate(date, dateFormat) {
    // The date and time string to parse
    let dateString = '' + date;

    if (dateFormat == 'dd/MM/yyyy') {
        const parts = dateString.split('/');

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Months are 0-based in JavaScript (0 = January)
        const year = parseInt(parts[2]);

        const parsedDate = new Date(year, month, day);

        return parsedDate;
    }
    else {
        // Split the string into components: day, month, year, hour, and minute
        const parts = dateString.split('_');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Months are 0-based in JavaScript (0 = January)
        const year = parseInt(parts[2]);
        const hour = parseInt(parts[3]);
        const minute = parseInt(parts[4]);

        // Create a new Date object
        const parsedDate = new Date(year, month, day, hour, minute);

        // Log the result to the console
        return parsedDate;
    }
}

function drawChart(divIdArg, paramsArg) {
    divId = divIdArg;
    params = paramsArg;

    if (params == null || params.period == null) {
        today = true;
        period = '1D';
    } else {
        today = false;
        period = params.period;
    }

    downloadData();
}

function drawChartFromData() {


    var upData = null;

    if (period == '1D') {
        upData = todaysData;
    } else {
        upData = rawDailyData;
    }

    // TODO
    // if (isNull(upData) || upData.length == 0) {
    //     // console.log('no up Data');
    //     return;
    // }

    // TODO
    /*
    
        var latestDate = upData[upData.length - 1].Date;
        var startDate = null;

        if (!today) {
            latestDate = parseTime(latestDate);

            startDate = new Date(latestDate.getTime());// cloning 
            if (period == '1W') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (period == '2W') {
                startDate = startDate.setDate(startDate.getDate() - 14);
            } else if (period == '1M') {
                startDate.setMonth(startDate.getMonth() - 1);
            } else if (period == '3M') {
                startDate.setMonth(startDate.getMonth() - 3);
            } else if (period == '6M') {
                startDate.setMonth(startDate.getMonth() - 6);
            } else if (period == '1Y') {
                startDate.setFullYear(startDate.getFullYear() - 1);
            } else if (period == '2Y') {
                startDate.setFullYear(startDate.getFullYear() - 2);
            } else if (period == '5Y') {
                startDate.setFullYear(startDate.getFullYear() - 5);
            }
        }

        var data = [];
        // format the data
        if (today) {
            for (var i = 0; i < upData.length; i++) {
                var d = upData[i];
                data.push({ 'Date': parseDate(d.Date), 'Advances': Number(d.Advances), 'Declines': Number(d.Declines) });
            }
        } else {
            for (var i = 0; i < upData.length; i++) {
                var d = upData[i];
                var runningDate = parseTime(d.Date);

                if (runningDate < startDate) continue;
                data.push({ 'Date': runningDate, 'Close': Number(d.Close) });
            }
        }


        var div = $('#' + divId);


        div.empty();

        */

    var chartContainer = $('#' + divId);
    chartContainer.empty();
    $('#tooltipDiv').remove();

    setDimensions(params, $(`#${divId}`));

    var data = [];
    // code starts here
    for (var i = 0; i < upData.length; i++) {
        var d = upData[i];
        // console.log(d, d.Date, d.Advances);
        if (!isNaN(parseDate(d.Date, dateFormat)) && d.Advances != '' && d.Declines != '')
            data.push({ 'Date': parseDate(d.Date, dateFormat), 'Advances': Number(d.Advances), 'Declines': Number(d.Declines) });
    }

    const svg = d3.select(`#${divId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let xAxisTickFreq = parseInt((width + margin.left + margin.right) / xAxisTickSpacing);

    const x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.Date }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
        .call(d3.axisBottom(x)
        .ticks(xAxisTickFreq))
        .attr("style", xAxisStyle);

    let totalStocks = d3.max(data, function (d) { return d.Declines + d.Advances });
    let minY = d3.min(data, function (d) { return d.Declines });
    minY = parseInt(minY - ((5 / 100) * totalStocks));
    let maxY = d3.max(data, function (d) { return d.Advances });
    maxY = parseInt(maxY + ((5 / 100) * totalStocks));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([minY, maxY])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(y))
        .attr("style", yAxisStyle);

    let advances = d3.line()
        .x(function (d) { return x(d.Date) })
        .y(function (d) { return y(d.Advances) })

    // Advances
    svg.append("path")
        .datum(data)
        .attr("style", lineStyle)
        .attr("stroke", "green")
        .attr("d", advances)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let declines = d3.line()
        .x(function (d) { return x(d.Date) })
        .y(function (d) { return y(d.Declines) })

    // Declines
    svg.append("path")
        .datum(data)
        .attr("style", lineStyle)
        .attr("stroke", "red")
        .attr("d", declines)
        .attr("transform", `translate(${margin.left}, 0)`);

    let circleAdvances = svg.append("g")
        .append("circle")
        .attr("r", circleRadius)
        .attr("style", circleStyle)
        .attr("fill", "green")
        .attr("stroke", "green")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("opacity", 0);

    let circleDeclines = svg.append("g")
        .append("circle")
        .attr("r", circleRadius)
        .attr("style", circleStyle)
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .attr("opacity", 0);

    // rect for capturing mouse interactions
    svg.append("rect")
        .attr("id", "rectOverlay")
        .attr("width", width)
        .attr("height", height)
        .attr("opacity", 0)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .on("mouseover", function (e) { mouseover(e) })
        .on("mousemove", function (e) { mousemove(e) })
        .on("mouseout", function (e) { mouseout(e) });

    // // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function (d) { return d.Date; }).left;

    // tooltip div
    let div = document.createElement("div");
    div.id = "tooltipDiv";
    div.style.display = "block";
    div.style.position = "absolute";
    div.setAttribute("style", tooltipStyle);
    div.addEventListener("mouseover", function (e) { mouseover(e) });
    div.addEventListener("mousemove", function (e) { mousemove(e) });
    div.addEventListener("mouseout", function (e) { mouseout(e) });

    svg.append("line")
        .attr("id", "crosshair")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)
        .attr("opacity", 0)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    function mouseover(e) {
        circleAdvances.attr("opacity", 1);
        circleDeclines.attr("opacity", 1);

        div.style.opacity = "1";

        d3.select("#crosshair")
            .attr("opacity", "1");

        if (!div.isConnected)
            document.body.appendChild(div);
    }

    function mousemove(e) {
        let x0 = x.invert(e.pageX - margin.left - 8);

        var index = bisect(data, x0, 1);
        if (index <= data.length - 1) {

            let selectedData = data[index];

            let xCord = x(selectedData.Date);

            circleAdvances.attr("cx", xCord);
            circleAdvances.attr("cy", y(selectedData.Advances));

            circleDeclines.attr("cx", xCord);
            circleDeclines.attr("cy", y(selectedData.Declines));

            if (xCord > window.innerWidth / 2) { // if mouse is on rhs of screen
                div.style.left = xCord - div.getBoundingClientRect().width + 15 + "px"
            }
            else {
                div.style.left = xCord + 40 + "px";
            }

            div.style.top = ((e.pageY)) + "px";

            div.innerHTML = `
                    <b>${(selectedData.Date.toLocaleString())}</b>
                    <br>
                    <span style="color: green">
                        Advances: ${selectedData.Advances}
                    </span>
                    <br>
                    <span style="color: red">
                        Declines: ${selectedData.Declines}
                    </span>
                `;

            svg.select("#crosshair")
                .attr("x1", xCord)
                .attr("y1", 0)
                .attr("x2", xCord)
                .attr("y2", height)
                .attr("style", crosshairStyle)
        }
    }

    function mouseout(e) {

        circleAdvances.attr("opacity", 0);
        circleDeclines.attr("opacity", 0);

        d3.select("#crosshair")
            .attr("opacity", "0");

        if (e.target != div || e.target != document.getElementById("rectOverlay"))
            document.body.removeChild(div);
    }
}

function draw(tick) {
    xAxisTickSpacing = 100;
    if (tick == 'intraday') {
        dateFormat = ``;
        url = `https://raw.githubusercontent.com/NitroNik7/TSR-Frontend/refs/heads/nitro/AdvanceDeclineRatio/AdvanceDeclineRatio/AdvanceDeclineData.csv`;
    }
    else if (tick == "eod") {
        dateFormat = `dd/MM/yyyy`;
        url = `https://raw.githubusercontent.com/NitroNik7/nitronik7.github.io/refs/heads/nitro/AdvanceDeclineRatio/AdvanceDeclineRatio/AdvanceDeclineDataDaily.csv`;
    }
    drawChart('chartContainer', null);
}

$(window).resize(function () {

    drawChart
    // reDraw();
    drawChart('chartContainer', null);
    // lc.dcfd();
});

