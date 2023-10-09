import { xScale, yScale, dataAlert } from "./index.js";
import { colorArrayTrajectory } from "./colors.js";
import {
  trajectoryGroups,
  trajectoryGroupCells,
  cellVisits,
  cellMoves,
} from "./grid.js";

//Add all the heatmap and pattern finding functions here - Grid should only contain voronoi stuff
const svg = d3.select("svg#map");

function voronoiCells(cellW) {
  d3.json("data/centroids.json").then(function (data2) {
    const xMin = 624079.8465020715,
      xMax = 629752.8465020715,
      yMin = 1009715.5668793379,
      yMax = 1015157.5668793379;

    // Define the cell width
    let cellWidth = cellW;
    cellWidth = Math.round(cellWidth / 100) * 100;

    // Generate a set of points
    const points = [];
    for (let x = xMin; x < xMax; x += cellWidth) {
      for (let y = yMin; y < yMax; y += cellWidth) {
        points.push([xScale(x), yScale(y)]);
      }
    }

    // let centroids = data2[cellWidth];
    // for (let i = 0; i < centroids.length; i++) {
    //   let coordinates = centroids[i];
    //   points.push([
    //     xScale(parseInt(coordinates[0])),
    //     yScale(parseInt(coordinates[1])),
    //   ]);
    // }

    // Compute the Voronoi diagram
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);
    // Create SVG element

    // if (document.getElementById("voronoi-plot").checked) {
    plotVoronoiCells(voronoi);
    // }

    // if (document.getElementById("summarize").checked) {
    summarizeMovement(delaunay, voronoi);
    // }
  });
}

function plotVoronoiCells(voronoi) {
  const svg = d3.select("svg#map");

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
      return "none";
    });
}
function summarizeMovement(delaunay, voronoi) {
  // Get the coordinates of the mouse pointer relative to the SVG element

  // Log the coordinates to the console
  let summarizedPoints = d3.selectAll(".points").data();
  // console.log("Clicked at: (" + x + ", " + y + ")");
  d3.json("data/centroids.json").then(function (data) {
    const xMin = 624079.8465020715,
      xMax = 629752.8465020715,
      yMin = 1009715.5668793379,
      yMax = 1015157.5668793379;

    // Define the cell width
    // const cellWidth = parseInt(
    //   document.getElementById("voronoi-cell-width").value
    // );
    let cellWidth = 5.5 * document.getElementById("voronoi-cell-width").value;
    cellWidth = Math.round(cellWidth / 100) * 100;

    // let summarizedPoints = d3.selectAll("circle.points").data();

    // Generate a set of points
    const points = [];
    for (let x = xMin; x < xMax; x += cellWidth) {
      for (let y = yMin; y < yMax; y += cellWidth) {
        points.push([xScale(x), yScale(y)]);
      }
    }
    console.log(points);
    let centroids = data[cellWidth];
    for (let i = 0; i < centroids.length; i++) {
      let coordinates = centroids[i];
      points.push([
        xScale(parseInt(coordinates[0])),
        yScale(parseInt(coordinates[1])),
      ]);
    }

    // Compute the Voronoi diagram
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

    let groups = trajectoryGroups(summarizedPoints);
    let summarizedCells = trajectoryGroupCells(delaunay, groups);
    let visits = cellVisits(summarizedCells);
    let moves = cellMoves(visits);
    let dataCells = visits.flat().map((obj) => obj.cell);
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
        if (dataCells.includes(i)) {
          return "green";
        }
        return "none";
      })
      .attr("fill-opacity", 0.3);
    plotMoveLines(voronoi, moves);
  });
}

function plotMoveLines(voronoi, moves) {
  // const i = 6;
  for (let i = 0; i < moves.length; i++) {
    let line_points = [];

    let move = moves[i];
    for (let j = 0; j < move.length; j++) {
      line_points.push(d3.polygonCentroid(voronoi.cellPolygon(move[j][0])));
    }

    // Define the d3.line() function
    var line = d3
      .line()
      .x(function (d) {
        return d[0];
      })
      .y(function (d) {
        return d[1];
      });
    const markerBoxWidth = 20;
    const markerBoxHeight = 20;
    const refX = markerBoxWidth / 2;
    const refY = markerBoxHeight / 2;
    var arrowPoints = [
      [5, 0],
      [0, 5],
      [5, 10],
    ];
    var hover = false;
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", [0, 0, markerBoxWidth, markerBoxHeight])
      .attr("refX", refX - 10)
      .attr("refY", refY - 5)
      .attr("markerWidth", markerBoxWidth)
      .attr("markerHeight", markerBoxHeight)
      .attr("orient", "auto")
      .append("path")
      .attr("d", d3.line()(arrowPoints))
      .attr("stroke", function (d) {
        if (!hover) {
          return "black";
        }
        return "yellow";
      });

    // Generate the SVG path for the line
    var path = line(line_points);

    // Append the path to the SVG container
    const lines = d3
      .select("svg")
      .append("path")
      .attr("d", path)
      .attr("class", "cells")
      .attr("stroke", function (d, i) {
        return colorArrayTrajectory[i];
      })
      .attr("marker-start", function (d) {
        return "url(#arrow)";
      })
      .attr("stroke-width", 1)
      .attr("fill", "none");
    console.log(line_points);

    // Add a mouseover event listener to the path element
    lines.on("click", function (event) {
      // Get the data bound to the path element
      // const lineData = d3.select(this).datum();

      const lineData = this.getAttribute("d"); // "M10,10 L100,100"
      // Generate the line using the line generator function and the data
      hover = true;
      const hoverLine = svg
        .append("path")
        .attr("d", lineData)
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .attr("fill", "none")
        .attr("marker-start", (d) => "url(#arrow)");

      // Remove the line on mouseout
      hoverLine.on("mouseleave", function () {
        d3.select(this).remove();
        hover = false;
      });
    });
  }
}

document.getElementById("voronoi-plot").addEventListener("change", (event) => {
  // let summarize = document.getElementById("summarize");
  if (!dataAlert()) {
    alert("Select Animal first");
    event.target.checked = false;
    return;
  }

  let voronoiGridSize = document.getElementById("voronoi-cell-width");
  if (event.target.checked) {
    let width = 5.5 * voronoiGridSize.value;
    voronoiGridSize.disabled = false;
    // summarize.disabled = false;
    voronoiCells(parseInt(width));
  } else {
    voronoiGridSize.disabled = true;
    svg.selectAll("*.cells").remove();
  }
});

document
  .getElementById("voronoi-cell-width")
  .addEventListener("change", (event) => {
    // let summarize = document.getElementById("summarize");
    svg.selectAll("*.cells").remove();

    let voronoiGridSize = document.getElementById("voronoi-cell-width");
    let voronoicheckBox = document.getElementById("voronoi-plot");

    if (voronoicheckBox.checked) {
      let width = 5.5 * voronoiGridSize.value;
      voronoiGridSize.disabled = false;
      // summarize.disabled = false;
      voronoiCells(parseInt(width));
    } else {
      voronoiGridSize.disabled = true;
    }
  });
