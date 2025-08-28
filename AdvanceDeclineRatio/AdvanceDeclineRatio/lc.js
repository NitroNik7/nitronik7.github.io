// import {d3} from './d3.v7';

var lc = (function () {

	// var jsu = mintJsUtil;
	// var htmlU = mintHtmlUtil;

	// css 
	var lineStyle = 'fill: none;stroke: #00557F;stroke-width: 1.25	px;'
	var circleStyle = 'fill: orange;';
	var tooltipStyle = 'fill: white;stroke: #000;';
	var tooltipTextStyle = 'font-weight: bold; transition: all 0.25s;border-radius: 4px; -webkit-transition: all 0.25s;'
		+ '-moz-transition: all 0.25s; -ms-transition: all 0.25s; -o-transition: all 0.25s;';
	var focusStyle = '  font-size: 14px;    ';

	var stocknameStyle = 'font-size:10px; fill:grey;  stroke-width:1;';

	// http://bl.ocks.org/mikehadlow/93b471e569e31af07cd3 line chart with cross hair.
	// var margin =50;
	var width, height;
	var margin = { top: 10, right: 70, bottom: 20, left: 60 }

	var parseTime = d3.timeParse("%d-%b-%y");
	var bisectDate = d3.bisector(function (d) { return d.Date; }).left
	var formatValue = d3.format(",");
	var dateFormatter = d3.timeFormat("%d-%b-%y");
	var tooltip = { width: 50, height: 50, x: 10, y: -30 };

	var smallDimention;

	var rawDailyData, todaysData;

	var equityId, secId, divId, params, period;

	var today;

	// var x ,y;

	function setDimentions(params, div) {
		// width =  mintJsUtil.isNull(params.width) ? 300 : params.width ;
		// height = mintJsUtil.isNull(params.height) ? 300 : params.height ;


		width = div.width() - 100;





		smallDimention = width < 500 ? true : false;

		if (smallDimention) {
			margin.left = 5;
			margin.right = 5;
			margin.top = 5;
			margin.bottom = 35;
		}

		width = div.width() - margin.left - margin.right;


		if (window.innerHeight < div.height()) {
			height = window.innerHeight - margin.top - margin.bottom - 50;;
		} else {
			height = div.height() - margin.top - margin.bottom;
		}

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

		var url = '//' + window.location.hostname + '/charts/'

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


		url = "https://raw.githubusercontent.com/NitroNik7/TSR-Frontend/refs/heads/main/AdvanceDeclineData.csv";

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


	function drawChart(equityIdArg, secIdArg, divIdArg, paramsArg) {

		equityId = equityIdArg;
		secId = secIdArg;
		divId = divIdArg;
		params = paramsArg;


		if (params == null || params.period == null) {
			period = '1D';
			today = true;
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

		if (isNull(upData) || upData.length == 0) {
			// console.log('no up Data');
			return;
		}

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

		setDimentions(params, div);
		// var url = 'https://www.tsruat.com/charts/csv/141/243DLIne.csv?var=88';


		// set the ranges
		var x = d3.scaleTime().range([0, width]);
		var y = d3.scaleLinear().range([height, 0]);
		// var dateFormatter = d3.time.format("%m/%d/%y");
		// define the line
		var valueline = d3.line()
			.x(function (d) { return x(d.Date); })
			.y(function (d) { return y(d.Advances); });

		var svg = d3.select("#" + divId).append("svg").attr("width", width + margin.left + margin.right)
			.attr("height", (height + margin.top + margin.bottom)).append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



		var minDate = d3.min(data, function (d) { return d.Date; });
		var maxDate = d3.max(data, function (d) { return d.Date; });

		// Scale the range of the data
		x.domain(d3.extent(data, function (d) { return d.Date; }));
		y.domain([d3.min(data, function (d) { return d.Advances; }), d3.max(data, function (d) { return d.Advances; })]);

		// Add the valueline path.
		svg.append("path").data([data]).attr('style', lineStyle).attr("d", valueline);

		// Add the X Axis



		svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

		var yAxis = null;

		if (smallDimention) {
			yAxis = d3.axisRight().scale(y).tickFormat(d3.format("k"));

			if (today) {
				xAxis = d3.axisBottom(x).ticks(5);//.tickFormat(d3.timeFormat("%H:%M"))//.attr("transform", "rotate(-65)");



			} else {
				xAxis = d3.axisBottom(x).ticks(8);
			}

			svg.append("g").attr("transform", "translate(0," + height + ")").call(xAxis);

			svg.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function (d) {
					return "rotate(-30)"
				});


			// .tickFormat(dateFormatter);
		} else {
			yAxis = d3.axisLeft().scale(y).tickFormat(d3.format("k"));
			xAxis = d3.axisBottom(x);
			svg.append("g").attr("transform", "translate(0," + height + ")").call(xAxis);
		}







		// if

		// var xAxis = d3.svg.axis()
		//     .scale(x)
		//     .orient("bottom")
		//     .tickFormat(dateFormatter);


		// Add the Y Axis
		svg.append("g").call(yAxis);

		var labelPosi = width / 2 - 40;

		// if (mintJsUtil.isNotNull(params.name)) {
		// 	svg.append("g").append("text").attr("x", labelPosi).attr("y", 25)
		// 		.attr("style", stocknameStyle).text(params.name);
		// }

		var focus = svg.append("g").attr("style", focusStyle).style("display", "none");

		focus.append("circle").attr('style', circleStyle).attr("r", 3);

		focus.append("rect")
			.attr("style", tooltipStyle)
			.attr("width", 80)
			.attr("height", 37)
			.attr("x", 5)
			.attr("y", -22)
			.attr("rx", 4)
			.attr("ry", 4);

		focus.append("text").attr('class', 'ttDate').attr("x", 10).attr("y", -7);

		// focus.append("text")
		//     .attr("x", 18)
		//     .attr("y", 2	)
		//     .text("Price:");

		focus.append("text").attr('class', 'ttPrice').attr("x", 10).attr("y", 9);

		svg.append("rect").attr("class", "overlay").attr("width", width).attr("height", height)
			.on("mouseover", function () { focus.style("display", null); })
			.on("mouseout", function () { focus.style("display", "none"); })
			.on("mousemove", function (event) { handleMousemove(event) });



		function handleMousemove(e) {
			var x0 = x.invert(d3.pointer(e)[0]),
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
			// console.log(x0);

			focus.attr("transform", "translate(" + x(d.Date) + "," + y(d.Advances) + ")");


			focus.select(".ttPrice").text(formatValue(d.Advances));

			$('#displayChartData').empty();
			if (today) {

				var formattedDate = d3.timeFormat("%H:%M %p")(d.Date);
				focus.select(".ttDate").text(formattedDate);
				$('#displayChartData').append('<span style="font-size:10px; font-weight: bold;"> Time : ' + formattedDate + ",  Price " + formatValue(d.Advances) + "</font>");

			} else {
				focus.select(".ttDate").text(dateFormatter(d.Date));
				$('#displayChartData').append('<span style="font-size:10px; font-weight: bold;"> Time : ' + dateFormatter(d.Date) + ",  Price " + formatValue(d.Advances) + "</font>");
			}



		}



	}


	function periodChange(newPeriod) {
		// console.log(newPeriod);

		period = newPeriod;

		today = (period == '1D');// ? true : false;

		if (today) {
			if (isNotNull(todaysData)) {
				drawChartFromData();
			} else {
				downloadData();
			}
		} else {
			if (isNotNull(rawDailyData)) {
				drawChartFromData();
			} else {
				downloadData();
			}
		}
	}

	return {
		lc: drawChart,
		pc: periodChange,
		dcfd: drawChartFromData
	}


})(); // module createFormElem		

lc.lc(0, 0, "chartContainer", null)
// $(window).resize(function() {

//     	// reDraw();
//     	lc.dcfd();
//     });

function isNull(obj) {
	if (obj == null)
		return true;

	return false;
}

function parseDate(date) {
	// The date and time string to parse
	let dateString = '' + date;
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