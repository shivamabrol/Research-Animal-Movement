import { pointsInGridCount, uniqueRevisitsCount } from "./grid.js";
import { xScale, yScale, dataAlert } from "./index.js";

const svg = d3.select("svg#map");
export function gridHeatmaps(value, timelineParam = false) {
  let heatmapButton = document.getElementById("find-heatmap");
  let heatmapGrid = document.getElementById("heatmap-cell-width");
  console.log(value);
  if (!dataAlert(timelineParam)) {
    alert("Select Animal first");
    return;
  }

  if (!heatmapButton.checked) {
    d3.selectAll(".cells").remove();
    d3.selectAll(".rect-class").remove();

    heatmapGrid.disabled = true;
    return;
  } else {
    heatmapGrid.disabled = false;
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

  let selectedData = cellPointCounts;
  if (value == "uniqueRevisits") {
    selectedData = uniqueRevisitCounts;
  }

  // Initialize max value variable with the smallest possible value
  var maxValue = Number.MIN_VALUE;
  var maxkey = -1;

  // Iterate over the values and update max value if necessary
  for (var key in selectedData) {
    if (selectedData.hasOwnProperty(key)) {
      var value = selectedData[key];
      if (value > maxValue) {
        maxkey = key;
        maxValue = value;
      }
    }
  }

  console.log("key : " + maxkey + " value: " + maxValue);

  var minValue = Number.MAX_VALUE;

  // Iterate over the values and update max value if necessary
  for (var key in selectedData) {
    if (selectedData.hasOwnProperty(key)) {
      var value = selectedData[key];
      if (value < minValue && minValue > 100) {
        minValue = value;
      }
    }
  }
  const numRectangles = 100;
  var myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateMagma)
    .domain([1, numRectangles * 2]); // Doubling the domain range

  const svg_rect = d3
    .select("#map")
    .append("svg")
    .attr("class", "rect-class")
    .attr("width", "100%") // Set the width to 100% of the viewport
    .attr("height", 50) // Set the height for your color scale
    .style("position", "relative");

  svg_rect
    .selectAll("rect")
    .data(d3.range(numRectangles))
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i * 400) / numRectangles) // Adjust the positioning as needed
    .attr("width", 400 / numRectangles) // Adjust the width as needed
    .attr("height", 50)
    .attr("fill", (d) => myColor(d * 2)); // Doubling the input value

  // Add numbers only to the first and last rectangles
  svg_rect
    .selectAll("text")
    .data([0, maxValue / 2, maxValue]) // Bind data to the values you want
    .enter()
    .append("text")
    .text((d) => d) // Set the text content to the value of 'd'
    .attr("x", (d, i) => {
      if (i === 0) return 0; // Position the first value at the beginning
      else if (i === 1)
        return 400 / 2; // Position the second value in the middle
      else return 400; // Position the third value at the end
    })
    .attr("y", 25) // Set the y-position to half the height for centering
    .attr("text-anchor", (d, i) => {
      if (i === 0) return "start"; // Align text left for the first
      else if (i === 1) return "middle"; // Center align the middle value
      else return "end"; // Align text right for the third
    })
    .attr("fill", "blue"); // Set the text color

  const svg = d3.select("svg#map");
  d3.selectAll(".cells").remove();
  var myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateMagma)
    .domain([minValue, maxValue]);
  // Draw Voronoi cells
  console.log(minValue, maxValue);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("opacity", 0);
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
    .attr("fill-opacity", 0.5)
    .on("mouseover", function (d, i) {
      // Show the tooltip and set its content
      tooltip.transition().duration(200).style("opacity", 0.9);
      var coordinates = d3.pointer(event, this);
      var key = [delaunay.find(coordinates[0], coordinates[1])];

      var value = selectedData[delaunay.find(coordinates[0], coordinates[1])];
      if (value == undefined) {
        tooltip.transition().duration(500).style("opacity", 0);
        return;
      }
      console.log(value);
      console.log();
      tooltip
        .html("Animal count: " + value)
        .style("left", d.screenX - 40 + "px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("top", d.screenY + "px");

      // highlightRectangleByValue(svg_rect, value, maxValue, myColor);
    })
    .on("mouseout", function (d, i) {
      // Hide the tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    });
  // Three function that change the tooltip when user hover / move / leave a cell

  const colorScale = d3
    .scaleQuantize()
    .domain([0, 100]) // Define the domain of values
    .range(["#e5f5f9", "#99d8c9", "#2ca25f"]);
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

function updateRectanglesAndValues(maxValue) {
  rectangles
    .data([1, maxValue])
    .transition()
    .duration(500) // Animation duration in milliseconds
    .attr("fill", (d) => myColor(d * 2)); // Update rectangle colors

  textValues.data(newData).text((d) => d); // Update text values
}

document
  .getElementById("heatmap-cell-width")
  .addEventListener("change", gridHeatmaps, false);

function highlightRectangle(svg_rect, myColor, colorToHighlight) {
  const numRectangles = 100;

  svg_rect
    .selectAll("rect")
    .style("stroke", "none") // Remove any previous highlights
    .data(d3.range(numRectangles))
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i * 400) / numRectangles) // Adjust the positioning as needed
    .attr("width", 1000 / numRectangles) // Adjust the width as needed
    .attr("height", 50)
    .attr("fill", (d) => myColor(d * 2));

  let index = findRectangleIndexByColor(svg_rect, colorToHighlight);
  index = index == -1 ? 0 : index;
  // Highlight the specific rectangle by index
  svg_rect
    .select(`rect:nth-child(${index + 1})`)
    .style("stroke", "red") // Change the border color to red (you can customize this)
    .style("stroke-width", 2);
}

function highlightRectangleByValue(
  svg_rect,
  valueToHighlight,
  maxValue,
  myColor
) {
  // Calculate the index based on linear interpolation
  const index =
    (valueToHighlight / maxValue) * svg_rect.selectAll("rect").size();

  svg_rect
    .selectAll("rect") // Select all the rectangle elements
    .each(function (d, i) {
      if (i === Math.floor(index)) {
        // Check if the index matches the calculated index
        d3.select(this) // Select the rectangle element
          .attr("fill", "red"); // Change the fill color to highlight
      } else {
        d3.select(this).attr("fill", myColor[d]);
      }
    });
}

function findRectangleIndexByColor(svg_rect, targetColor) {
  const rectangles = svg_rect.selectAll("rect").nodes();
  for (let i = 0; i < rectangles.length; i++) {
    const currentColor = d3.select(rectangles[i]).attr("fill");
    if (currentColor === targetColor) {
      return i; // Return the index of the matching rectangle
    }
  }
  return -1; // Return -1 if no matching color is found
}
