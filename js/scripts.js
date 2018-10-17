/* global d3 */
/* */

// Global Javascript

document.querySelector("p").setAttribute("style", "background-color: hsla(180, 75%, 75%, 0.75);");

// D3 Related

// d3.select(".wins-graph").append("svg").attr("width", "100%").attr("height", "100%").classed("wins-graph-svg", true);

var dataArray = [{x:5,y:5},{x:10,y:15},{x:20,y:7},{x:30,y:18},{x:40,y:10}];

var svg = d3.select(".wins-graph").append("svg").attr("height","100%").attr("width","100%");

var line = d3.line()
	.x(function(d){ return d.x*6; })
	.y(function(d){ return d.y*4; })
	.curve(d3.curveStepAfter);

svg.append("path")
	.attr("fill","none")
	.attr("stroke","blue")
	.attr("d",line(dataArray));

let winsGraphData = d3.csv("../assets/data/winsData.csv", function (d) {
	// console.log(d);
	return {
		city: d.city,
		date: new Date(d.date.slice(0,4), d.date.slice(4,6)-1, d.date.slice(6,8)),
		winAmount: d.wins
	};
});

console.log(winsGraphData);
console.log(winsGraphData[0]);
