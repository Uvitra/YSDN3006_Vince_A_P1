/* global d3 */
/* */

// Global Javascript

// document.querySelector("p").setAttribute("style", "background-color: hsla(180, 75%, 75%, 0.75);");

// let rotateThatBall = setTimeout(function(){
// 	let randomDegree = Math.floor(Math.random()*45-23);
// 	let currentBallRotation = document.getElementById("Ball");
// 	currentBallRotation.setAttribute("style", `transform: rotate(${randomDegree}deg);`);
// }, 500);

// D3 Related

// d3.select(window).on("resize", callFunction);
//
// callFunction();
// function callFunction() {

// start of Wins Graph Code
let winsGraphData = d3.csv("../assets/data/winsData.csv", function (d) {
	// console.log(d);
	return {
		city: d.city,
		date: new Date(d.date.slice(0,4), d.date.slice(4,6)-1, d.date.slice(6,8)),
		winAmount: +d.wins
	};
});

// console.log(winsGraphData);

let dataDates = [];
let winValues = [];

winsGraphData.then(function(d) {
	for (var i = 0; i < d.length; i++) {
		dataDates[i] = d[i].date;
		winValues[i] = d[i].winAmount;
	}
	// console.log(dataDates);
	// expected output: list of dates

	// console.log(winValues);
	// expected output: 24, 24, 23, 23, ...

	// console.log(d3.extent(dataDates));

	let height = window.innerHeight*.5;
	let width = (window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)*.8;

	let margin = {
		left: 50,
		right: 20,
		top: 30,
		bottom: 40
	};

	let x = d3.scaleTime()
		.domain(d3.extent(dataDates))
		.range([0, width - margin.right]);

	let y = d3.scaleLinear()
		.domain([0, 70]).nice()
		.range([height - margin.bottom, margin.top]);

	let yAxis = d3.axisLeft(y).ticks(5).tickPadding(10).tickSize(10);
	let xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

	// console.log(d.date);

	let line = d3.line()
		// .defined(d => !isNaN(d.value))
		.x(function(d){ return x(d.date); })
		.y(function(d){ return y(d.winAmount); })
		.curve(d3.curveStepAfter);

	let svg = d3.select(".wins-graph").append("svg").attr("width", "100%").attr("height", "100%").classed("wins-graph-svg", true);
	let chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

	// chartGroup.append("path").attr("d", area(dataArray));

	chartGroup.append("g")
		.attr("class","axis y")
		.call(yAxis);

	chartGroup.append("g")
		.attr("class","axis x")
		.attr("transform","translate(0,"+height+")")
		.call(xAxis);

	chartGroup.append("path")
		.attr("fill", "none")
		.attr("stroke-width", "2")
		.attr("stroke", "hsl(345, 85%, 44%)")
		.attr("d",line(d));

});
// end of wins-graph Code

//Start of game margin graph

let gameMarginsData = d3.csv("../assets/data/201718RapsGames.csv", function (d) {
	// console.log(d);
	return {
		attendence: +d.attendence,
		date: new Date (d.date.slice(0,4), d.date.slice(5,7)-1, d.date.slice(8,10), d.date.slice(11,13), d.date.slice(14,16)),
		difference: +d.difference,
		homeTeam: d.home,
		homePoints: +d.homePoints,
		overtime: d.ot === "y" ? true : false,
		visitorTeam: d.visitor,
		visitorPoints: +d.visitorPoints
	};
});

// console.log(gameMarginsData);

gameMarginsData.then(function(d) {
	d = d.slice(0, 82);
	// console.log(d);

	let regularSeasonGamesDates = [];

	for (var i = 0; i < d.length; i++) {
		regularSeasonGamesDates[i] = d[i].date;
	}

	// console.log(d3.extent(regularSeasonGamesDates));

	let width = window.innerWidth * 0.95;
	let height = window.innerHeight * 0.5;
	// let height = 200;
	let margin = {top: 20, right: 20, bottom: 0, left: 20};
	let x, y, xAxis, yAxis, colour;

	colour = d3.scaleSequential(d3.interpolateRdYlGn);

	x = d3.scaleTime()
		.domain(d3.extent(regularSeasonGamesDates))
		.range([0, width - margin.right]);

	y = d3.scaleLinear()
		.domain([-20, d3.max(d, d => d.difference)]).nice()
		.range([height - margin.bottom, margin.top]);

	xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x)
			.tickSizeOuter(0));

	yAxis = g => g
		.attr("transform", `translate(${margin.left-20},0)`)
		.call(d3.axisLeft(y))
		.call(g => g.select(".domain").remove());

	let svg = d3.select(".game-margin-graph").append("svg").attr("width", "100%").attr("height", "100%").classed("game-margin-svg", true);
	let chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

	chartGroup.append("g")
		.selectAll("rect").data(d).enter().append("rect")
		.attr("fill", d => colour((d.difference + 20) / 50))
		.attr("class", d => "bar bar--" + (d.difference < 0 ? "negative" : "positive"))
		.attr("x", d => x(d.date))
		.attr("y", d => d.difference < 0 ? y(0) : y(d.difference))
		.attr("height", d => Math.abs(y(0) - y(d.difference)))
		.attr("width", width/82+"px");

	chartGroup.append("g")
		.attr("class", "axis x")
		.call(xAxis);

	chartGroup.append("g")
		.attr("class", "axis y")
		.call(yAxis);

});

//End of game margin graph

// Start of calendar view

let calendarData = d3.csv("../assets/data/calendarData.csv", function (d) {
	// console.log(d);
	return {
		date: new Date(d.date),
		gameNumber: +d.gameNumber,
		homeGame: d.homeGame === "TRUE" ? true : false,
		notableGame: d.notableGame === "TRUE" ? true : false,
		opponent: d.opponent,
		whyNotable: d.whyNotable
	};
});

// console.log(calendarData);
let weekday;

calendarData.then(function(d) {

	let data = [];

	for (var i = 0; i < d.length; i++) {
		data[i] = {date: d[i].date, value: 1, };
	}

	data = d;

	// console.log(data);

	let cellSize = 17;
	let width = window.innerWidth*0.95;
	let height = cellSize * (weekday === "weekday" ? 7 : 9);
	let timeWeek = weekday === "sunday" ? d3.timeSunday : d3.timeMonday;
	let countDay = weekday === "sunday" ? d => d.getDay() : d => (d.getDay() + 6) % 7;

	function pathMonth(t) {
		const n = weekday === "weekday" ? 5 : 7;
		const d = Math.max(0, Math.min(n, countDay(t)));
		const w = timeWeek.count(d3.timeYear(t), t);
		return `${d === 0 ? `M${w * cellSize},0`
			: d === n ? `M${(w + 1) * cellSize},0`
				: `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
	}

	let format = d3.format("+.2%");
	let formatDate = d3.timeFormat("%x");
	let formatDay = d => "SMTWTFS"[d.getDay()];
	let formatMonth = d3.timeFormat("%b");
	// let color = d3.scaleSequential(d3.interpolatePiYG).domain([-0.05, 0.05]);

	const years = d3.nest()
		.key(d => d.date.getFullYear())
		.entries(data);
		// .reverse();

	const svg = d3.select(".games-to-watch")
		.append("svg")
		.attr("width", width+"px")
		.attr("height", (height*years.length)+"px")
		.classed("games-to-watch-svg", true);
		// .style("font", "10px sans-serif")
		// .style("width", "100%")
		// .style("height", "auto");

	const year = svg.selectAll("g")
		.data(years)
		.enter().append("g")
		.attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`);

	year.append("text")
		.attr("x", -5)
		.attr("y", -5)
		.attr("font-weight", "bold")
		.attr("text-anchor", "end")
		.text(d => d.key);

	year.append("g")
		.attr("text-anchor", "end")
		.selectAll("text")
		.data((weekday === "weekday" ? d3.range(2, 7) : d3.range(7)).map(i => new Date(2017, 0, i)))
		.enter().append("text")
		.attr("x", -5)
		.attr("y", d => (countDay(d) + 0.5) * cellSize)
		.attr("dy", "0.31em")
		.text(formatDay);

	year.append("g").attr("class", "a-very-nice-class")
		.selectAll("rect")
		.data(d => d.values)
		.enter().append("rect")
		.attr("width", cellSize - 1)
		.attr("height", cellSize - 1)
		.attr("x", d => timeWeek.count(d3.timeYear(d.date), d.date) * cellSize + 0.5)
		.attr("y", d => countDay(d.date) * cellSize + 0.5)
		.attr("fill", d => d.homeGame === true ? "hsl(345, 85%, 44%)" : "hsl(255, 85%, 44%)")
		.attr("stroke", d => d.notableGame === true ? "yellow" : "")
		.append("title")
		.text(d => `${formatDate(d.date)} — The Raptors are ${d.homeGame === true ? "hosting" : "playing at"} the ${d.opponent}. ${d.whyNotable}`);

	const month = year.append("g").attr("class", "a-very-nice-class")
		.selectAll("g")
		.data(d => d3.timeMonths(d3.timeMonth(d.values[0].date), d.values[d.values.length - 1].date))
		.enter().append("g");

	month.filter((d, i) => i).append("path")
		.attr("fill", "none")
		.attr("stroke", "#fff")
		.attr("stroke-width", 2)
		.attr("d", pathMonth);

	month.append("text")
		.attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize + 2)
		.attr("y", -5)
		.text(formatMonth);

});

// }
