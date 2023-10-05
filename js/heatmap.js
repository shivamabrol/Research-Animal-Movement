import { pointsInGridCount, uniqueRevisitsCount } from "./grid.js";
import { xScale, yScale, dataAlert } from "./index.js";

const svg = d3.select("svg#map");
export function gridHeatmaps(value, timelineParam = false) {
  let heatmapButton = document.getElementById("find-heatmap");
  console.log(value);
  if (!dataAlert(timelineParam)) {
    alert("Select Animal first");
    return;
  }

  if (!heatmapButton.checked) {
    d3.selectAll(".cells").remove();
    return;
  }
  //starting function for grid heatmap
  // console.log("Clicked at: (" + x + ", " + y + ")");
  const xMin = 624079.8465020715,
    xMax = 629752.8465020715,
    yMin = 1009715.5668793379,
    yMax = 1015157.5668793379;

  // Define the cell width
  // const cellWidth = parseInt(
  //   document.getElementById("voronoi-cell-width").value
  // );
  let cellWidth = 5.5 * document.getElementById("heatmap-cell-width").value;
  cellWidth = Math.round(cellWidth);
  const widthInfoElement = document.getElementById("heatmapInfo");

  // Display the information on the screen
  widthInfoElement.textContent = "Width of cell: " + cellWidth + " meters";

  // let summarizedPoints = d3.selectAll("circle.points").data();

  // Generate a set of points
  const points = [];
  for (let x = xMin; x < xMax; x += cellWidth) {
    for (let y = yMin; y < yMax; y += cellWidth) {
      points.push([xScale(x), yScale(y)]);
    }
  }

  // Build color scale

  // Compute the Voronoi diagram
  const delaunay = d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

  let gridData = d3.selectAll(".points").data();
  let cellList = pointsInGridCount(delaunay, gridData);
  let cellPointCounts = createNumberCountDict(cellList);
  let uniqueRevists = uniqueRevisitsCount(cellList);
  let uniqueRevisitCounts = createNumberCountDict(uniqueRevists);
  console.log(cellPointCounts);
  console.log(uniqueRevisitCounts);
  let selectedData = cellPointCounts;
  if (value == "uniqueRevisits") {
    selectedData = uniqueRevisitCounts;
  }
  console.log(value);
  // Initialize max value variable with the smallest possible value
  var maxValue = Number.MIN_VALUE;

  // Iterate over the values and update max value if necessary
  for (var key in selectedData) {
    if (selectedData.hasOwnProperty(key)) {
      var value = selectedData[key];
      if (value > maxValue) {
        maxValue = value;
      }
    }
  }
  const svg = d3.select("svg#map");
  d3.selectAll(".cells").remove();
  var myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateMagma)
    .domain([1, maxValue]);
  // Draw Voronoi cells
  svg
    .selectAll("path")
    .data(voronoi.cellPolygons())
    .enter()
    .append("path")
    .attr("d", (d) => "M" + d.join("L") + "Z")
    .attr("class", "cells")
    .attr("stroke", "orange")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.5)
    .attr("fill", function (d, i) {
      return myColor(selectedData[i]);
    })
    .attr("fill-opacity", 0.5);
}

function createNumberCountDict(numbers) {
  let countDict = {};

  // Count the occurrences of each number
  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    countDict[number] = (countDict[number] || 0) + 1;
  }

  return countDict;
}

document
  .getElementById("find-heatmap")
  .addEventListener("click", gridHeatmaps, false);

document.getElementById("metricDropdown").addEventListener(
  "change",
  function () {
    const value = this.value; // Get the selected value from the dropdown
    gridHeatmaps(value); // Pass the value to the gridHeatmaps function
  },
  false
);

const colorScale = d3
  .scaleQuantize()
  .domain([0, 100]) // Define the domain of values
  .range(["#e5f5f9", "#99d8c9", "#2ca25f"]);
const numRectangles = 100;
var myColor = d3
  .scaleSequential()
  .interpolator(d3.interpolateMagma)
  .domain([1, numRectangles * 1.5]); // Doubling the domain range

const svg_rect = d3
  .select(".heatmap-class")
  .append("svg")
  .attr("width", "100%") // Set the width to 100% of the viewport
  .attr("height", 50) // Set the height for your color scale
  .style("position", "relative");

svg_rect
  .selectAll("rect")
  .data(d3.range(numRectangles))
  .enter()
  .append("rect")
  .attr("x", (d, i) => (i * 400) / numRectangles) // Adjust the positioning as needed
  .attr("width", 1000 / numRectangles) // Adjust the width as needed
  .attr("height", 50)
  .attr("fill", (d) => myColor(d * 2)); // Doubling the input value

document
  .getElementById("heatmap-cell-width")
  .addEventListener("change", gridHeatmaps, false);
