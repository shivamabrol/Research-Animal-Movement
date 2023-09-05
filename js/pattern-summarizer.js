import {
  trajectoryGroups,
  trajectoryGroupCells,
  cellVisits,
  cellMoves,
} from "./grid.js";

let totalClicks = [];

// svg.on("click", function () {
//   // Get the coordinates of the mouse pointer relative to the SVG element
//   var coordinates = d3.pointer(event, this);
//   console.log(coordinates);
//   // Log the coordinates to the console
//   let summarizedPoints = d3.selectAll(".points").data();
//   // console.log("Clicked at: (" + x + ", " + y + ")");
//   d3.csv("data/centroids.csv").then(function (data) {
//     const xMin = 624079.8465020715,
//       xMax = 629752.8465020715,
//       yMin = 1009715.5668793379,
//       yMax = 1015157.5668793379;

//     // Define the cell width
//     // const cellWidth = parseInt(
//     //   document.getElementById("voronoi-cell-width").value
//     // );
//     const cellWidth = 100;
//     // let summarizedPoints = d3.selectAll("circle.points").data();

//     // Generate a set of points
//     const points = [];

//     for (let x = xMin; x < xMax; x += cellWidth) {
//       for (let y = yMin; y < yMax; y += cellWidth) {
//         points.push([xScale(x), yScale(y)]);
//       }
//     }
//     let centroids = data;
//     // for (let i = 0; i < centroids.length; i++) {
//     //   let coordinates = centroids[i];
//     //   points.push([
//     //     xScale(parseInt(coordinates.X)),
//     //     yScale(parseInt(coordinates.Y)),
//     //   ]);
//     // }

//     // Compute the Voronoi diagram
//     const delaunay = d3.Delaunay.from(points);
//     const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

//     let groups = trajectoryGroups(summarizedPoints);
//     let summarizedCells = trajectoryGroupCells(delaunay, groups);
//     let visits = cellVisits(summarizedCells);
//     let moves = cellMoves(visits);
//     let dataCells = visits.flat().map((obj) => obj.cell);
//     let directionString = "";
//     for (let i = 0; i < dataCells.length - 1; i++) {
//       directionString.append(findDirection(dataCells[i], dataCells[i + 1]));
//     }
//     console.log(directionString);

//     //Finding the pattern
//     if (totalClicks.length < 5) {
//       totalClicks.push(delaunay.find(coordinates[0], coordinates[1]));
//     }
//     console.log(totalClicks);
//     // Create SVG element
//     console.log(moves);
//     let c11 = delaunay.find(coordinates[0], coordinates[1]);
//     const svg = d3.select("svg#map");
//     d3.selectAll(".cells").remove();
//     // Draw Voronoi cells
//     svg
//       .selectAll("path")
//       .data(voronoi.cellPolygons())
//       .enter()
//       .append("path")
//       .attr("d", (d) => "M" + d.join("L") + "Z")
//       .attr("class", "cells")
//       .attr("stroke", "orange")
//       .attr("stroke-width", 1)
//       .attr("stroke-opacity", 0.5)
//       .attr("fill", function (d, i) {
//         if (totalClicks.indexOf(i) != -1) {
//           // console.log(i);
//           return "red";
//         }

//         return "none";
//       })
//       .attr("fill-opacity", 0.9);
//     // plotMoveLines(voronoi, moves);
//   });
// });

function findAllPatterns() {
  console.log(totalClicks);
}

// document
// .getElementById("find-all-patterns")
// .addEventListener("click", findAllPatterns, false);
