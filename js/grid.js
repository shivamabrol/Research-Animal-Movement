import { xScale, yScale, dataAlert } from "./index.js";
import { seeDistance } from "./download.js";

const svg = d3.select("svg#map");
var trajectoryColumn = "trajectory_number";

let totalClicks = [];
export function getTotalClicks() {
  return totalClicks;
}
export function plotPattern(totalClicks) {
  console.log(totalClicks);
  // Log the coordinates to the console
  let summarizedPoints = d3.selectAll(".points").data();
  // console.log("Clicked at: (" + x + ", " + y + ")");
  const xMin = 624079.8465020715,
    xMax = 629752.8465020715,
    yMin = 1009715.5668793379,
    yMax = 1015157.5668793379;

  // Define the cell width
  // const cellWidth = parseInt(
  //   100
  // );
  const cellWidth = 5.5 * document.getElementById("pattern-cell-width").value;
  // let summarizedPoints = d3.selectAll("circle.points").data();

  // Generate a set of points
  const points = [];

  for (let x = xMin; x < xMax; x += cellWidth) {
    for (let y = yMin; y < yMax; y += cellWidth) {
      points.push([xScale(x), yScale(y)]);
    }
  }
  // let centroids = data;
  // for (let i = 0; i < centroids.length; i++) {
  //   let coordinates = centroids[i];
  //   points.push([
  //     xScale(parseInt(coordinates.X)),
  //     yScale(parseInt(coordinates.Y)),
  //   ]);
  // }

  // Compute the Voronoi diagram
  const delaunay = d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

  let groups = trajectoryGroups(summarizedPoints);
  let summarizedCells = trajectoryGroupCells(delaunay, groups);
  let visits = cellVisits(summarizedCells);
  let moves = cellMoves(visits);
  let dataCells = visits.flat().map((obj) => obj.cell);

  //Finding the pattern

  // Create SVG element
  console.log(moves);
  const svg = d3.select("svg#map");
  d3.selectAll(".cells").remove();
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
      if (totalClicks.indexOf(i) != -1) {
        // console.log(i);
        return "red";
      }

      return "none";
    })
    .attr("fill-opacity", 0.9);
  // plotMoveLines(voronoi, moves);
}
svg.on("click", function () {
  if (!document.getElementById("pattern-toggle").checked) {
    return;
  }

  // Get the coordinates of the mouse pointer relative to the SVG element
  var coordinates = d3.pointer(event, this);
  console.log(coordinates);
  // Log the coordinates to the console
  let summarizedPoints = d3.selectAll(".points").data();
  // console.log("Clicked at: (" + x + ", " + y + ")");
  const xMin = 624079.8465020715,
    xMax = 629752.8465020715,
    yMin = 1009715.5668793379,
    yMax = 1015157.5668793379;

  // Define the cell width
  // const cellWidth = parseInt(
  //   100
  // );
  const cellWidth = 5.5 * document.getElementById("pattern-cell-width").value;
  // let summarizedPoints = d3.selectAll("circle.points").data();

  // Generate a set of points
  const points = [];

  for (let x = xMin; x < xMax; x += cellWidth) {
    for (let y = yMin; y < yMax; y += cellWidth) {
      points.push([xScale(x), yScale(y)]);
    }
  }
  // let centroids = data;
  // for (let i = 0; i < centroids.length; i++) {
  //   let coordinates = centroids[i];
  //   points.push([
  //     xScale(parseInt(coordinates.X)),
  //     yScale(parseInt(coordinates.Y)),
  //   ]);
  // }

  // Compute the Voronoi diagram
  const delaunay = d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

  let groups = trajectoryGroups(summarizedPoints);
  let summarizedCells = trajectoryGroupCells(delaunay, groups);
  let visits = cellVisits(summarizedCells);
  let moves = cellMoves(visits);
  let dataCells = visits.flat().map((obj) => obj.cell);

  //Finding the pattern
  if (totalClicks.length < 5) {
    totalClicks.push(delaunay.find(coordinates[0], coordinates[1]));
  }
  console.log(totalClicks);
  // Create SVG element
  console.log(moves);
  let c11 = delaunay.find(coordinates[0], coordinates[1]);
  const svg = d3.select("svg#map");
  d3.selectAll(".cells").remove();
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
      if (totalClicks.indexOf(i) != -1) {
        // console.log(i);
        return "red";
      }

      return "none";
    })
    .attr("fill-opacity", 0.9);
  // plotMoveLines(voronoi, moves);
});

//movement between the cells. based on the previous data strcture <ci, ci+1, tend(i), tstart(i + 1)
export function cellMoves(visits) {
  const moves = [];

  for (let i = 0; i < visits.length; i++) {
    let visit = visits[i];
    let allMoves = [];
    for (let j = 0; j < visit.length - 1; j++) {
      let startMove = visit[j];
      let endMove = visit[j + 1];

      allMoves.push([
        startMove.cell,
        endMove.cell,
        startMove["lastTimestamp"],
        endMove["firstTimestamp"],
      ]);
    }
    moves[i] = allMoves;
  }

  return moves;
}

function countMoves(moves) {
  console.log(moves);

  const counts = {};

  for (let i = 0; i < moves.length; i++) {
    const key = moves[i].slice(0, 2).toString();
    counts[key] = (counts[key] || 0) + 1;
  }

  return counts;
}

function plotSummaryLines(startC, endC) {
  // Append a circle for each pair of x and y values
  // let i = 14;
  startC = startC.flat();
  endC = endC.flat();
  for (let i = 0; i < startC.length; i++) {
    let a = startC[i];
    let b = endC[i];
    var length = Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);

    if (length > 70) {
      continue;
    }
    var lineGenerator = d3.line();

    // Create a data array containing the starting and ending points
    var data = [a, b];

    // Generate the path string from the data using the line generator
    var pathString = lineGenerator(data);

    // Append the path element to the SVG

    // Append the marker element to the SVG

    // Define the arrowhead symbol
    var arrowPoints = [
      [0, 0],
      [0, 20],
      [20, 10],
    ];
    let markerBoxWidth = 20;
    let markerBoxHeight = 20;
    let refX = markerBoxWidth / 2;
    let refY = markerBoxHeight / 2;
    // Append the marker element to the SVG
    var arrowhead = d3.symbol().type(d3.symbolTriangle);

    // Append the marker element to the SVG
    d3.select("svg")
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -4 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", arrowhead);
    // Append the path element to the SVG
    svg
      .append("path")
      .attr("d", pathString)
      .attr("stroke", "yellow")
      .attr("marker-end", "url(#arrowhead)")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }
}

function getDelaunay() {
  const xMin = 624079.8465020715,
    xMax = 629752.8465020715,
    yMin = 1009715.5668793379,
    yMax = 1015157.5668793379;

  // Define the cell width
  const cellWidth = 5.5 * document.getElementById("pattern-cell-width").value;

  // Generate a set of points
  const points = [];
  for (let x = xMin; x < xMax; x += cellWidth) {
    for (let y = yMin; y < yMax; y += cellWidth) {
      points.push([xScale(x), yScale(y)]);
    }
  }

  // Compute the Voronoi diagram
  const delaunay = d3.Delaunay.from(points);

  return delaunay;
}

///function for finding the pattern
export function patternFinder(timelineParam = false) {
  if (!dataAlert() && !dataAlert(timelineParam)) {
    alert("Select Animal first");
    return;
  }

  if (!document.getElementById("pattern-toggle").checked) {
    alert("Activate Grid first");
    return;
  }
  let cells = d3.selectAll(".cells").data();
  if (cells.length == 0) {
    alert("Grid is activated. Select the particular pattern you want to see ");
  }

  let gridData = d3.selectAll(".points").data();
  const delaunay = getDelaunay();
  let cellList = pointsInGridCount(delaunay, gridData);
  let uniqueRevists = uniqueRevisitsCount(cellList);

  let patterns = findCombos(uniqueRevists, totalClicks);

  // Get the <span> element where we want to display combos.length
  var lengthValueElement = document.getElementById("lengthValue");
  if (totalClicks.length != 0) {
    lengthValueElement.textContent = patterns.length;
  } else {
    lengthValueElement.textContent = 0;
  }
  console.log(totalClicks, patterns.length);
  // Update the value
  // totalClicks = [];
  highlightCellsFromPatterns(delaunay, patterns.flat());
}

function directionString() {
  let gridData = d3.selectAll(".points").data();
  const delaunay = getDelaunay();
  let cellList = pointsInGridCount(delaunay, gridData);
  let uniqueRevists = uniqueRevisitsCount(cellList);
  let patternsFound = "";
  for (let i = 0; i < uniqueRevists.length - 1; i++) {
    patternsFound += findDirection(
      uniqueRevists[i],
      uniqueRevists[i + 1],
      patternGap
    );
  }
  console.log(patternsFound);
}

function highlightCellsFromPatterns(delaunay, highlightCells, color = "red") {
  d3.selectAll(".cells").remove();
  console.log(totalClicks);
  const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

  svg
    .selectAll("path")
    .data(voronoi.cellPolygons())
    .enter()
    .append("path")
    .attr("d", (d) => "M" + d.join("L") + "Z")
    .attr("class", "cells")
    .attr("id", "pattern-cells")
    .attr("stroke", "orange")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.5)
    .attr("fill", function (d, i) {
      if (highlightCells.indexOf(i) != -1 || totalClicks.indexOf(i) != -1) {
        // console.log(i);
        return color;
      }

      return "none";
    })
    .attr("fill-opacity", function (d, i) {
      if (highlightCells.indexOf(i) !== -1) {
        return 0.3;
      } else if (totalClicks.indexOf(i) !== -1) {
        return 0.9;
      } else {
        return 0; // Set to 0 if neither condition is met.
      }
    });
}

export function trajectoryGroups(summarizedPoints) {
  const groupedData = d3.groups(summarizedPoints, (d) => d[trajectoryColumn]);

  return groupedData;
}

export function trajectoryGroupCells(delaunay, groups) {
  let summarizedCells = [];
  Object.keys(groups).forEach((key) => {
    const points = groups[key][1];
    summarizedCells[key] = [];
    points.forEach((point) => {
      const timestamp = point["timestamp"];
      const cellIndex = delaunay.find(
        xScale(parseFloat(point["utm-easting"])),
        yScale(parseFloat(point["utm-northing"]))
      );

      summarizedCells[key].push({ cellIndex, timestamp });
    });
  });
  // console.log(summarizedCells);
  return summarizedCells;
}

export function cellVisits(summarizedCells) {
  const trajectoryCellSummaries = [];

  for (let i = 0; i < summarizedCells.length; i++) {
    let cells = summarizedCells[i];
    let cellSummaries = [];

    for (let j = 0; j < cells.length; j++) {
      let cellIndex = cells[j].cellIndex;
      let timestamp = cells[j].timestamp;

      let existingSummary = cellSummaries.find(
        (summary) => summary.cell === cellIndex
      );

      if (!existingSummary) {
        cellSummaries.push({
          cell: cellIndex,
          firstTimestamp: timestamp,
          lastTimestamp: timestamp,
        });
      } else {
        existingSummary.lastTimestamp = timestamp;
      }
    }

    trajectoryCellSummaries[i] = cellSummaries;
  }

  return trajectoryCellSummaries;
}

function findDirection(originalCell, nextCell, width) {
  const directions = ["N", "S", "E", "W", "1", "2", "3", "4"];

  let gap = nextCell - originalCell;
  let direction = "";

  if (gap === -1) {
    direction = directions[0]; // N
  } else if (gap === 1) {
    direction = directions[1]; // S
  } else if (gap === width) {
    direction = directions[2]; // E
  } else if (gap === -1 * width) {
    direction = directions[3]; // W
  } else if (gap === 0) {
    direction = "";
  } else if (gap === width + 1) {
    direction = directions[4];
  } else if (gap === width - 1) {
    direction = directions[5];
  } else if (gap === 1 + width) {
    direction = directions[6];
  } else if (gap === 1 - width) {
    direction = directions[6];
  }

  return direction;
}

export function pointsInGridCount(delaunay, data) {
  let cellList = [];
  for (let i = 0; i < data.length; i++) {
    cellList.push(
      delaunay.find(
        xScale(data[i]["utm-easting"]),
        yScale(data[i]["utm-northing"])
      )
    );
  }
  return cellList;
}

export function uniqueRevisitsCount(cells) {
  let visitedCells = [];
  let uniqueRevisits = 0;
  let prevCell = null;

  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    if (cell === prevCell) {
      continue;
    }
    visitedCells.push(cell);
    prevCell = cell;
  }

  return visitedCells;
}

function findCombos(list, pattern) {
  const combos = [];

  for (let i = 0; i <= list.length - pattern.length; i++) {
    let isValidCombo = true;

    for (let j = 0; j < pattern.length - 1; j++) {
      const diff1 = list[i + j + 1] - list[i + j];
      const diff2 = pattern[j + 1] - pattern[j];

      if (diff1 !== diff2) {
        isValidCombo = false;
        break; // Exit the inner loop if the difference doesn't match
      }
    }

    if (isValidCombo) {
      combos.push(list.slice(i, i + pattern.length));
    }
  }

  return combos;
}

function patternReset() {
  totalClicks = [];
}

function gridConfig() {
  let toggle = document.getElementById("pattern-toggle");
  let patternGrid = document.getElementById("pattern-cell-width");
  if (!dataAlert()) {
    alert("Select an animal first");
    toggle.checked = false;
  }
  if (toggle.checked) {
    alert("Grid is enabled. Please click on the map to start it");
    patternGrid.disabled = false;
  } else {
    svg.selectAll("*.cells").remove();
    patternGrid.disabled = true;
  }
}

function resetPattern() {
  totalClicks = [];
  d3.selectAll("#pattern-cells").remove();
  patternFinder();
}
document
  .getElementById("pattern-toggle")
  .addEventListener("change", gridConfig);

document
  .getElementById("find-pattern")
  .addEventListener("click", patternFinder, false);

// document
//   .getElementById("find-all-pattern")
//   .addEventListener("click", directionString, false);

document
  .getElementById("pattern-cell-width")
  .addEventListener("change", patternFinder, false);

document
  .getElementById("reset-pattern")
  .addEventListener("click", resetPattern, false);

document.getElementById("pattern-cell-width").addEventListener(
  "input",
  function (event) {
    // console.log(id.target);
    seeDistance(event.target.id);
  },
  false
);
