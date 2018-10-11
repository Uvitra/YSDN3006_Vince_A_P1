/* global d3 */
/* */

// Global Javascript

document.querySelector("p").setAttribute("style", "background-color: hsla(180, 75%, 75%, 0.75);");

// D3 Related

d3.select(".wins-graph").append("svg").attr("width", "100%").attr("height", "100%").classed("wins-graph-svg", true);
