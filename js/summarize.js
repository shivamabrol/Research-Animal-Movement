import { xScale, yScale } from "./index.js";
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

    if (document.getElementById("voronoi-plot").checked) {
      plotVoronoiCells(voronoi);
    }

    if (document.getElementById("summarize").checked) {
      summarizeMovement(delaunay, voronoi);
    }
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
  console.log(moves);
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
      .attr("stroke", colorArrayTrajectory[i])
      .attr("marker-start", (d) => "url(#arrow)")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // Add a mouseover event listener to the path element
    lines.on("mouseover", function (event) {
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

function changeAttribute(svg2, attribute, width, height) {
  // Parse the Data
  //////////
  // GENERAL //
  //////////
  // List of groups = header of the csv files
  const keys = ["max_speed"];

  // color palette

  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

  //stack the data?
  const stackedData = d3.stack().keys(keys)(data);

  //////////
  // AXIS //
  //////////

  // Add X axis

  const x = d3
    .scaleTime()
    .domain([new Date("2022-01-01"), new Date("2022-12-31")])
    .range([0, width]);
  console.log(x(new Date("2022-05-05")));
  let xAxisGenerator = d3.axisBottom(xScale);

  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(6));

  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height)
    .text("Time");

  // Add Y axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("Attribute")
    .attr("text-anchor", "start");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y).ticks(5));

  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg2
    .append("defs")
    .append("svg2:clipPath")
    .attr("id", "clip")
    .append("svg2:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("brush", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
  // Create the scatter variable: where both the circles and the brush take place
  const areaChart = svg2.append("g").attr("clip-path", "url(#clip)");

  // Area generator
  const area = d3
    .area()
    .x(function (d) {
      return x(parseTime(d.data["study-local-timestamp"]));
    })
    .y0(function (d) {
      return 10;
    })
    .y1(function (d) {
      return 10;
    });

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .attr("class", function (d) {
      return "myArea " + d.key;
    })
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  // Add the brushing
  areaChart.append("g").attr("class", "brush").call(brush);

  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    addEventListener("dblclick", (event) => {});

    extent = event.selection;
    // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
    showPointsTimeline(x.invert(extent[0]), x.invert(extent[1]));
  }
}

function changeAttributeDays(svg2, attribute, width, height) {
  // Parse the Data
  //////////
  // GENERAL //
  //////////
  // List of groups = header of the csv files
  const keys = ["max_speed"];

  // color palette

  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

  //stack the data?
  const stackedData = d3.stack().keys(keys)(data);

  //////////
  // AXIS //
  //////////

  // Add X axis

  const x = d3
    .scaleTime()
    .domain([new Date("2022-01-01T00:00:00"), new Date("2022-01-01T23:59:59")])
    .range([0, width]);
  let xAxisGenerator = d3.axisBottom(xScale);

  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(6));

  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height)
    .text("Time");

  // Add Y axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("Attribute")
    .attr("text-anchor", "start");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y).ticks(5));

  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg2
    .append("defs")
    .append("svg2:clipPath")
    .attr("id", "clip")
    .append("svg2:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("brush", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
  // Create the scatter variable: where both the circles and the brush take place
  const areaChart = svg2.append("g").attr("clip-path", "url(#clip)");

  // Area generator
  const area = d3
    .area()
    .x(function (d) {
      return x(parseTime(d.data["study-local-timestamp"]));
    })
    .y0(function (d) {
      return 10;
    })
    .y1(function (d) {
      return 10;
    });

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .attr("class", function (d) {
      return "myArea " + d.key;
    })
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area);

  // Add the brushing
  areaChart.append("g").attr("class", "brush").call(brush);

  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    addEventListener("dblclick", (event) => {});

    extent = event.selection;
    // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
    showPointsTimelineDays(x.invert(extent[0]), x.invert(extent[1]));
  }
}

function changeAttribute2(attribute) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#timechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

  //Read the data
  d3.csv(
    "../data/BCI-movement-filtered.csv",

    // When reading the csv, I must format variables:
    (d) => {
      return {
        date: parseTime(d.date),
        value: d[attribute],
      };
    }
  ).then(
    // Now I can use this dataset:
    function (data1) {
      // Add X axis --> it is a date format
      const x = d3
        .scaleTime()
        .domain(d3.extent(data1, (d) => d.date))
        .range([0, width]);
      xAxis = svg2
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data1, (d) => +d.value)])
        .range([height, 0]);
      yAxis = svg2.append("g").call(d3.axisLeft(y));

      // Add a clipPath: everything out of this area won't be drawn.
      const clip = svg2
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Add brushing
      const brush = d3
        .brushX() // Add the brush feature using the d3.brush function
        .extent([
          [0, 0],
          [width, height],
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

      // Create the area variable: where both the area and the brush take place
      const area = svg2.append("g").attr("clip-path", "url(#clip)");

      // Create an area generator
      const areaGenerator = d3
        .area()
        .x(function (d) {
          return d.date;
        })
        .y0(y(0))
        .y1(function (d) {
          return d.value;
        });

      //   // Add the area
      //   area
      //     .append("path")
      //     .datum(data)
      //     .attr("class", "myArea") // I add the class myArea to be able to modify it later on.
      //     .attr("fill", "#69b3a2")
      //     .attr("fill-opacity", 0.3)
      //     .attr("stroke", "black")
      //     .attr("stroke-width", 1)
      //     .attr("d", areaGenerator);

      area
        .append("path")
        .attr("class", "myArea")
        .attr("d", areaGenerator(data1));

      // Add the brushing
      area.append("g").attr("class", "brush").call(brush);

      // A function that set idleTimeOut to null
      let idleTimeout;
      function idled() {
        idleTimeout = null;
      }

      // A function that update the chart for given boundaries
      function updateChart(event) {
        // What are the selected boundaries?
        extent = event.selection;

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
          x.domain([4, 8]);
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])]);
          area.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and area position
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        area
          .select(".myArea")
          .transition()
          .duration(1000)
          .attr("d", areaGenerator(data1));
      }

      // If user double click, reinitialize the chart
      svg2.on("dblclick", function () {
        x.domain(d3.extent(data1, (d) => d.date));
        xAxis.transition().call(d3.axisBottom(x));
        area.select(".myArea").transition().attr("d", areaGenerator(data1));
      });
    }
  );
}

document.getElementById("voronoi-plot").addEventListener("change", (event) => {
  let summarize = document.getElementById("summarize");
  if (event.target.checked) {
    let width = document.getElementById("voronoi-cell-width").value;
    summarize.disabled = false;
    voronoiCells(parseInt(width));
  } else {
    svg.selectAll("*.cells").remove();
    // svg.selectAll("*.voronoi-cell").remove();
    // svg.selectAll("*.voronoi-path").remove();
    summarize.disabled = true;
  }
});

document.getElementById("summarize").addEventListener("change", (event) => {
  if (event.target.checked) {
    // Checkbox is checked
    // Do something here
    let width = document.getElementById("voronoi-cell-width").value;
    voronoiCells(parseInt(width));
  } else {
    svg.selectAll("*.voronoi-cell").remove();
    svg.selectAll("*.voronoi-path").remove();
  }
});
