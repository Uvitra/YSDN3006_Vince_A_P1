/* global d3 */
/* */

// Global Javascript

document.querySelector("p").setAttribute("style", "background-color: hsla(180, 75%, 75%, 0.75);");

// D3 Related

// var dataArray = [{x:5,y:5},{x:10,y:15},{x:20,y:7},{x:30,y:18},{x:40,y:10}];
//
// var svg = d3.select(".wins-graph").append("svg").attr("height","100%").attr("width","100%");
//
// var line = d3.line()
// 	.x(function(d){ return d.x*6; })
// 	.y(function(d){ return d.y*4; })
// 	.curve(d3.curveStepAfter);
//
// svg.append("path")
// 	.attr("fill","none")
// 	.attr("stroke","blue")
// 	.attr("d",line(dataArray));

let winsGraphData = d3.csv("../assets/data/winsData.csv", function (d) {
	// console.log(d);
	return {
		city: d.city,
		date: new Date(d.date.slice(0,4), d.date.slice(4,6)-1, d.date.slice(6,8)),
		winAmount: +d.wins
	};
});

console.log(winsGraphData);

let dataDates = [];
let winValues = [];

winsGraphData.then(function(d) {
	for (var i = 0; i < d.length; i++) {
		dataDates[i] = d[i].date;
		winValues[i] = d[i].winAmount;
	}
	console.log(dataDates);
	// expected output: list of dates

  console.log(winValues);
	// expected output: 24, 24, 23, 23, ...

	console.log(d3.extent(dataDates));

	let height = 200;
	let width = 350;

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
		.domain([0, 82]).nice()
		.range([height - margin.bottom, margin.top]);

	let yAxis = d3.axisLeft(y).ticks(3).tickPadding(10).tickSize(10);
	let xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

	let svg = d3.select(".wins-graph").append("svg").attr("width", "100%").attr("height", "100%").classed("wins-graph-svg", true);
	let chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

	// chartGroup.append("path").attr("d",area(dataArray));

	chartGroup.append("g")
		.attr("class","axis y")
		.call(yAxis);

	chartGroup.append("g")
		.attr("class","axis x")
		.attr("transform","translate(0,"+height+")")
		.call(xAxis);

});
