import { pointsInGridCount, uniqueRevisitsCount } from "./grid.js";
import { xScale, yScale } from "./index.js";
const svg = d3.select("svg#map");
function gridHeatmaps(value) {
  console.log(value);
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
  let cellWidth = document.getElementById("voronoi-cell-width").value;
  cellWidth = Math.round(cellWidth / 100) * 100;

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
    .interpolator(d3.interpolateOrRd)
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
