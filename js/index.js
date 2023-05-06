//Color picker would be activated only if single animal is present on screen a
// It'll be disabled if there are 2 or more
let data;

let totalData;
d3.csv("../data/BCI-movement-data.csv")
  .then(function (data1) {
    // Do something with the data here
    data = data1;
  })
  .catch(function (error) {
    console.log(error); // log any errors to the console
  }); // declare a variable to store the data

let fruitTreeData;
const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

d3.csv("../data/fruit_tree.csv")
  .then(function (data1) {
    fruitTreeData = data1; // assign the data to the variable
    // Do something with the data here
  })
  .catch(function (error) {
    console.log(error); // log any errors to the console
  });

const colorArrayTrajectory = [
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#f1c40f",
  "#f39c12",
  "#e67e22",
  "#d35400",
  "#e74c3c",
  "#c0392b",
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#f1c40f",
  "#f39c12",
  "#e67e22",
  "#d35400",
  "#e74c3c",
  "#c0392b",
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#f1c40f",
  "#f39c12",
  "#e67e22",
  "#d35400",
  "#e74c3c",
  "#c0392b",
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#f1c40f",
  "#f39c12",
  "#e67e22",
  "#d35400",
  "#e74c3c",
  "#c0392b",
];

const names = [
  "Daniel",
  "Magnolia",
  "Jessy",
  "Drogon",
  "Viserion",
  "Rhaegal",
  "John",
  "Rhaegal_2",
  "Viserion_2",
  "Samwell",
  "Gendry",
  "Gendry_2",
  "Daenerys",
  "Olenna",
];

const colors = {
  Daniel: "",
  Magnolia: "",
  Jessy: "",
  Drogon: "",
  Viserion: "",
  Rhaegal: "",
  John: "",
  Rhaegal_2: "",
  Viserion_2: "",
  Samwell: "",
  Gendry: "",
  Gendry_2: "",
  Daenerys: "",
  Olenna: "",
};

const colorArray = [
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#3498db",
  "#2980b9",
  "#9b59b6",
  "#8e44ad",
  "#f1c40f",
  "#f39c12",
  "#e67e22",
  "#d35400",
  "#e74c3c",
  "#c0392b",
];

let colorDictionary = {};

for (let key in colors) {
  colorDictionary[key] = colorArray.shift();
}

var svgPanZoom = $("svg#map").svgPanZoom();

const svg = d3.select("svg#map");

var pointsPlotted = false;
var data3D = [
  [
    [0, -1, 0],
    [-1, 1, 0],
    [1, 1, 0],
  ],
];

var triangles3D = d3._3d().scale(100).origin([480, 250]).shape("TRIANGLE");

var projectedData = triangles3D(data3D);

init(projectedData);

function init(data) {
  var triangles = svg.selectAll("path").data(data);

  // add your logic here...
}

const xScale = d3
  .scaleLinear()
  .domain([624079.8465020715, 629752.8465020715])
  .range([0, 1000]);

const yScale = d3
  .scaleLinear()
  .domain([1009715.5668793379, 1015157.5668793379])
  .range([1000, 0]);

// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
svgPanZoom.events.drag = false;

document.getElementById("reset").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.reset();
  svg.selectAll(".points").remove();
  svg.selectAll(".lines").remove();
  svg.selectAll(".fruits").remove();
  svg.selectAll(".cells").remove();

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  // document.getElementById("Daniel").checked = false;
});

document.getElementById("zoom-in").addEventListener("click", function () {
  // code to be executed when button is clicked

  svgPanZoom.zoomIn(0.5);
  // Get the image element
});

document.getElementById("zoom-out").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.zoomOut(1);
});

document.getElementById("left").addEventListener("mousedown", function () {
  // code to be executed when button is clicked
  // simulating hold event
  setTimeout(function () {
    svgPanZoom.panLeft(5);
  }, 200);
  //
});

document.getElementById("fruit").addEventListener("change", (event) => {
  // code to be executed when button is clicked
  if (event.target.checked) {
    plotFruitTrees();
  } else {
    svg.selectAll("*.fruits").remove();
  }

  //
});

document.getElementById("right").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panRight(5);
});
document.getElementById("up").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panUp(5);
});
document.getElementById("down").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.panDown(5);
});

// document.getElementById("lines-add").addEventListener("click", function () {
//   // code to be executed when button is clicked
//   plotLinesBCI();
// });

document
  .getElementById("start-location")
  .addEventListener("click", function () {
    plotCircles();
  });

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

const container = document.getElementById("names");

container.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-primary")) {
    plotBCIdata((individual = event.target.innerHTML.trim()));
  }
});

//top left
// Latitude : 9.181898
// Longitude: -79.870619

//right bottom
// Latitude : 9.13252
// Longitude: -79.819153

var left = 624079.8465020715;
var right = 629752.8465020715;

var top = 1009715.5668793379;
var bottom = 1015157.5668793379;

function plotFruitTrees() {
  var corners = svgPanZoom.getViewBox();

  svg.selectAll("circle.points").remove();

  var dot = svg
    .selectAll("circle")
    .data(fruitTreeData)
    .enter()
    .append("circle")
    // .attr("cx", (d) => xScale(d.UTM_X))
    .attr("class", "fruits")
    .attr("cx", function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", function (d) {
      return parseInt(parseInt(d.Area)) / 300;
    })
    .style("opacity", function (d) {
      return 1;
    })
    .attr("fill", function (d) {
      return "pink";
    });

  showPoints("");
}

function changeColor() {
  const colorPoints = svg.selectAll("circle.points").data();
  const uniqueAnimals = [
    ...new Set(colorPoints.map((item) => item["individual-local-identifier"])),
  ];

  //This doesn't let color changes on the latest one
  if (uniqueAnimals.length > 1 || uniqueAnimals.length == 0) {
    document.getElementById("colorpicker").disabled = true;
    return;
  }

  document.getElementById("colorpicker").disabled = false;

  const checkbox = document.getElementById(uniqueAnimals[0] + "-checkbox");
  checkbox.style.backgroundColor = document.getElementById("colorpicker").value;
  colorDictionary[uniqueAnimals[0]] =
    document.getElementById("colorpicker").value;
  d3.selectAll("circle")
    .data(colorPoints)
    .style("fill", function (d) {
      return document.getElementById("colorpicker").value;
    });
}

function plotBCIdata(
  individual = "all",
  starttime = "2000-07-07 22:07:07.000",
  endtime = "2100-07-07 22:07:07.000"
) {
  pointsPlotted = true;
  // starttime = document.getElementById()
  //

  starttime =
    document.getElementById("startstamp").value == ""
      ? starttime
      : document.getElementById("startstamp").value;
  endtime =
    document.getElementById("endstamp").value == ""
      ? endtime
      : document.getElementById("endstamp").value;

  // svg.selectAll(".points").remove();

  var data2 = data.filter(function (d) {
    return d["timestamp"] >= starttime && d["timestamp"] <= endtime;
  });
  if (individual != "all") {
    data2 = data2.filter(function (d) {
      return d["individual-local-identifier"] == individual;
    });
  }

  var dot = svg
    .selectAll("circle")
    .data(data2)
    .enter()
    .append("circle")
    .attr("class", "points")
    .attr("id", function (d) {
      return d["individual-local-identifier"];
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", function (d) {
      return 1;
    })
    .style("opacity", function (d) {
      //
      if (individual == "all") {
        return 1;
      } else {
        if (d["individual-local-identifier"] == individual) {
          return 1;
        }
        return 0;
      }
    })
    .attr("fill", function (d) {
      return colorDictionary[d["individual-local-identifier"]];
    });
}

// Add brushing
svg.call(
  d3
    .brush() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [1000, 1000],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart2) // Each time the brush selection changes, trigger the 'updateChart' function
);

// svg.on("click", function () {
//   // Get the coordinates of the mouse pointer relative to the SVG element
//   var coordinates = d3.pointer(event, this);

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
//     console.log(points);
//     let centroids = data;
//     for (let i = 0; i < centroids.length; i++) {
//       let coordinates = centroids[i];
//       points.push([
//         xScale(parseInt(coordinates.X)),
//         yScale(parseInt(coordinates.Y)),
//       ]);
//     }

//     // Compute the Voronoi diagram
//     const delaunay = d3.Delaunay.from(points);
//     const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);

//     let groups = trajectoryGroups(summarizedPoints);
//     let summarizedCells = trajectoryGroupCells(delaunay, groups);
//     let visits = cellVisits(summarizedCells);
//     let moves = cellMoves(visits);
//     let dataCells = visits.flat().map((obj) => obj.cell);
//     // Create SVG element
//     console.log(moves);

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
//         if (dataCells.includes(i)) {
//           return "green";
//         }
//         return "none";
//       })
//       .attr("fill-opacity", 0.3);
//     plotMoveLines(voronoi, moves);
//   });
// });

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

function updateChart2(ev) {}
// Function that is triggered when brushing is performed
function updateChart(e1) {
  extent = e1.selection;
  start = e1.selection[0];
  end = e1.selection[1];

  d3.csv("../data/BCI-movement-data.csv") //updted the data
    .then((data) => {
      const filteredData = data.filter(function (d) {
        var horizontal = xScale(d["utm-easting"]);
        var vertical = yScale(d["utm-northing"]);
        return (
          horizontal > start[0] &&
          horizontal < end[0] &&
          vertical > start[1] &&
          vertical < end[1] &&
          d["individual-local-identifier"] == "Daniel"
        );
      });

      plotSeparatePaths(filteredData);
    });
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
    .domain([new Date("2022-01-01T00:00:00"), new Date("2022-01-01T23:59:59")])
    .range([0, width]);

  let xAxisGenerator = d3.axisBottom(xScale);

  const xAxis = svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10));

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

  let idleTimeout;
  function idled() {
    idleTimeout = null;
  }
  function reset(event, d) {
    console.log("reset triggered");
  }
  // A function that update the chart for given boundaries
  function updateChart(event, d) {
    addEventListener("dblclick", (event) => {});

    extent = event.selection;
    // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
    showPointsTimeline(x.invert(extent[0]), x.invert(extent[1]));

    // // If no selection, back to initial coordinate. Otherwise, update X axis domain
    // if (!extent) {
    //   if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
    //   x.domain([new Date("2022-01-01"), new Date("2022-12-31")]);
    //   showPoints("");
    // } else {
    //   x.domain([x.invert(extent[0]), x.invert(extent[1])]);
    //   // console.log([x.invert(extent[0]) + " " + x.invert(extent[1])]);
    //   showPointsTimeline(x.invert(extent[0]), x.invert(extent[1]));
    //   areaChart.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    // }

    // // Update axis and area position
    // xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
    // areaChart.selectAll("path").transition().duration(1000).attr("d", area);
  }

  //////////
  // HIGHLIGHT GROUP //
  //////////

  // What to do when one group is hovered
  const highlight = function (event, d) {
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", 0.1);
    // expect the one that is hovered
    d3.select("." + d).style("opacity", 1);
  };

  // And when it is not hovered anymore
  const noHighlight = function (event, d) {
    d3.selectAll(".myArea").style("opacity", 1);
  };

  //////////
  // LEGEND //
  //////////

  // Add one dot in the legend for each name.
  const size = 20;
  svg2
    .selectAll("myrect")
    .data(keys)
    .join("rect")
    .attr("x", 400)
    .attr("y", function (d, i) {
      return 10 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) {
      return color(d);
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);

  // Add one dot in the legend for each name.
  svg2
    .selectAll("mylabels")
    .data(keys)
    .join("text")
    .attr("x", 400 + size * 1.2)
    .attr("y", function (d, i) {
      return 10 + i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);
}

function changeAttribute2(attribute) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

  //Read the data
  d3.csv(
    "../data/BCI-movement-data.csv",

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

function plotSeparatePaths(data) {
  const margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  var x = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, width]);

  svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y));

  // Add dots
  svg2
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")

    .attr("cx", function (d) {
      return x(d["utm-easting"]);
    })
    .attr("cy", function (d) {
      return y(d["utm-northing"]);
    })
    .attr("r", 1.5)
    .style("fill", "#69b3a2");
}
function plotTrajectoryBCI() {
  if (document.getElementById("lines-add").checked == false) {
    svg.selectAll(".lines").remove();
    return;
  }
  plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  const trajectoryData = data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );

  // Get the unique categories from the data
  const uniqueTrajectories = [
    ...new Set(trajectoryData.map((item) => item.trajectoryNumber)),
  ];

  // // Log the unique categories to the console
  trajectoryLinePlotter(trajectoryData);
}

function trajectoryLinePlotter(data) {
  var line = d3
    .line()
    .x(function (d) {
      return xScale(d["utm-easting"]);
    })
    .y(function (d) {
      return yScale(d["utm-northing"]);
    });

  svg
    .selectAll(".line")
    .data(d3.groups(data, (d) => d.trajectoryNumber))
    .enter()
    .append("path")
    .attr("class", "lines")
    .attr("d", function (d) {
      return line(d[1]);
    })
    .style("stroke", function (d) {
      return colorArrayTrajectory[parseInt(d[0]) % 60];
    });
}

function getColorList() {
  // Use D3's schemeCategory20c() and schemeSet3() functions to get 20 and 12 colors respectively
  var colorList1 = d3.schemeCategory10;
  var colorList2 = d3.schemeCategory10;

  // Combine the two color lists and select the first 35 colors
  var colorList = colorList1.concat(colorList2).slice(0, 15);

  return colorList;
}

function plotLinesBCI() {
  // svg.selectAll("*").remove();

  const line = d3
    .line()
    .x(function (d) {
      return xScale(d["utm-easting"]);
    })
    .y(function (d) {
      return yScale(d["utm-northing"]);
    });

  const circles = d3.selectAll("circle");

  // Filter the selection to only include circles with a non-empty ID
  const circlesWithId = circles.filter(function () {
    return d3.select(this).attr("id") !== null;
  });

  var opacityScale = d3
    .scalePow()
    .exponent(0.5)
    .domain([
      0,
      d3.max(data, function (d, i) {
        if (i > 0) {
          // Calculate the length of the line
          var dx = data[i]["utm-easting"] - data[i - 1]["utm-easting"];
          var dy = data[i]["utm-northing"] - data[i - 1]["utm-northing"];
          return Math.sqrt(dx * dx + dy * dy);
        } else {
          return 0;
        }
      }),
    ])
    .range([1, 0]);

  circlesWithId.each(function () {
    individual = d3.select(this).attr("id");
  });

  var linedata = data.filter(function (d) {
    return d["individual-local-identifier"] == individual;
  });
  var corners = svgPanZoom.getViewBox();
  svg.selectAll(".lines").remove();

  svg
    .selectAll("path")
    .data(linedata.slice(1))
    .join("path")
    .attr("class", "lines")
    .attr("d", function (d, i) {
      // Generate the line path
      var pathData = line([linedata[i], d]);
      return pathData;
    })
    .attr("opacity", function (d, i) {
      // Calculate the length of the line
      if (i > 0) {
        var dx = d["utm-easting"] - linedata[i - 1]["utm-easting"];
        var dy = d["utm-northing"] - linedata[i]["utm-northing"];
        var length = Math.sqrt(dx * dx + dy * dy);
        let a = opacityScale(length);
        //
        return a;
      }
      return 1;
    })
    .attr("stroke-width", corners.width / 500)
    .attr("stroke", function (d) {
      //
      return "white";
    });

  // plotBCIdata();
}

function moveRange() {
  // Define the input domain and output range

  var rangeScale = d3.scaleLinear().domain([0, 100000]).range([0, 100]);
  var circles = d3.selectAll("circle");
  // Filter the selection to only include circles with a non-empty ID
  const circlesWithId = circles.filter(function () {
    return d3.select(this).attr("id") !== null;
  });
  // var individual = 'all'
  // Do something with the filtered selection, e.g. log the IDs to the console
  circlesWithId.each(function () {
    individual = d3.select(this).attr("id");
  });

  d3.selectAll("circle").remove();
  var rangeValue = document.getElementById("movement-range").value;

  let rangeData = data.filter(function (d) {
    return (
      d["individual-local-identifier"] == individual &&
      parseInt(d.index) <= rangeValue
    );
  });

  var dot = svg
    .selectAll("circle")
    .data(rangeData)
    .enter()
    .append("circle")
    .attr("class", "points")
    // .transition()
    // .delay(function (d, i) {
    //   return i * 20; // Set a delay for each circle based on its index
    // })

    .attr("id", function (d) {
      return d["individual-local-identifier"];
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", function (d) {
      return parseInt(svgPanZoom.getViewBox().width) / 600;
    })
    .style("opacity", function (d) {
      //
      return 1;
    })
    .attr("fill", function (d) {
      return colorDictionary[d["individual-local-identifier"]];
    });
}

function plotCircles() {
  var circleData = [
    { x: 250, y: 200, r: 20, color: "red", opacity: 0.5, id: "start-circle" },
  ];

  // Create an SVG element
  const svg = d3.select("svg#map");
  d3.selectAll("circle.points").remove();
  svg.selectAll(".fruits").remove();

  var drag = d3
    .drag()
    .on("start", function (event, d) {
      // Do something when the drag starts
      d3.select(this).attr("stroke", "black");
    })
    .on("drag", function (event, d) {
      // Do something as the drag progresses
      d3.select(this)
        .raise()
        .attr("cx", (d.x = event.x))
        .attr("cy", (d.y = event.y));

      trajectoryPlotter();
      // trajectoryPlotter2();
    })
    .on("end", function (event, d) {
      // Do something when the drag ends

      d3.select(this).attr("stroke", null);
    });

  // Add circles to the SVG
  svg
    .selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    .attr("class", "isolated")
    .attr("id", function (d) {
      return d.id;
    })
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", function (d) {
      return d.r;
    })
    .attr("fill", function (d) {
      return d.color;
    })
    .attr("opacity", function (d) {
      return d.opacity;
    })
    .call(drag)
    .on("click", clicked);

  showPoints("");
  if (document.getElementById("fruit").checked) {
    plotFruitTrees();
  }
}

function clicked(event, d) {
  if (event.defaultPrevented) return; // dragged

  d3.select(this)
    .transition()
    .attr("fill", "blue")
    .attr("r", r * 2)
    .transition()
    .attr("r", r)
    .attr("opacity", 0.5)
    .attr("fill", "green");
}

//code for focus + context

function plotFocusTimeline() {}

plotFocusTimeline();

function isolatePoints() {
  const circles = d3.selectAll("circle.points");
  const isolated = d3.selectAll("circle.isolated");

  // Filter the selection to only include circles with a non-empty ID
  // const circlesWithId = circles.filter(function () {
  //   return d3.select(this).attr("id") !== null;
  // });
  let start = isolated.nodes()[0];
  var data = circles.filter(function (d) {
    //this radius needs to be dynamic accordingto circle

    let radius = 15;

    //start conditions
    let startX = parseInt(start.getAttribute("cx"));
    let startY = parseInt(start.getAttribute("cy"));
    let pointStartX = xScale(d["utm-easting"]);
    let pointStartY = yScale(d["utm-northing"]);
    let startXCondition =
      pointStartX >= startX - radius && pointStartX <= startX + radius;
    let startYCondition =
      pointStartY >= startY - radius && pointStartY <= startY + radius;

    return startXCondition && startYCondition;
  });

  return data;
}

function plotIsolatedPoints() {
  data = isolatePoints();
  svg.selectAll(".points").remove();
  data = data.data();
  var dot = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "points")
    .attr("id", function (d) {
      return d["individual-local-identifier"];
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .attr("cy", function (d) {
      //
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", function (d) {
      //
      return parseInt(svgPanZoom.getViewBox().width) / 600;
    })
    .style("opacity", function (d) {
      //
      return 1;
    })
    .attr("fill", function (d) {
      // console.log(
      //   colorArray[
      //     names.indexOf(d["individual-local-identifier"]) % names.length
      //   ]
      // );
      return colorDictionary[d["individual-local-identifier"]];
    });

  plotLinesData(data);
}

//break into grid and then creat a treemap from the data - aggregation and

//slider to reize the circles
function sliderChanged(id) {
  var sliderValue = document.getElementById("start-resize").value;
  // var circle1 = d3.selectAll("circle.points");
  var circle = d3.selectAll("circle.isolated#" + id);

  circle.attr("r", sliderValue);
}

function trajectoryPlotter2() {
  objects = isolatePoints().data();
}

function trajectoryPlotter() {
  objects = isolatePoints().data();
  // console.log(data);

  //Given a list of those points plot all the trajectories through those points - originating / passing through

  //Find all the trajectories in the data
  const distinctTrajectories = [
    ...new Set(objects.map((item) => item.trajectoryNumber)),
  ];

  // Filter the data based on the list of names
  const filteredTrajectories = data.filter((item) =>
    distinctTrajectories.includes(item.trajectoryNumber)
  );

  // console.log(filteredData);
  svg.selectAll(".lines").remove();

  trajectoryLinePlotter(filteredTrajectories);
  //get points with all those trajectories
}

function plotLinesData(data) {
  // svg.selectAll("*").remove();

  const line = d3
    .line()
    .x(function (d) {
      return xScale(d["utm-easting"]);
    })
    .y(function (d) {
      return yScale(d["utm-northing"]);
    });

  var opacityScale = d3
    .scalePow()
    .exponent(0.5)
    .domain([
      0,
      d3.max(data, function (d, i) {
        if (i > 0) {
          // Calculate the length of the line
          var dx = data[i]["utm-easting"] - data[i - 1]["utm-easting"];
          var dy = data[i]["utm-northing"] - data[i - 1]["utm-northing"];
          return Math.sqrt(dx * dx + dy * dy);
        } else {
          return 0;
        }
      }),
    ])
    .range([1, 0]);

  var corners = svgPanZoom.getViewBox();
  svg.selectAll(".lines").remove();

  svg
    .selectAll("path")
    .data(data.slice(1))
    .join("path")
    .attr("class", "lines")
    .attr("d", function (d, i) {
      // Generate the line path
      var pathData = line([data[i], d]);
      return pathData;
    })
    .attr("opacity", function (d, i) {
      // Calculate the length of the line
      if (i > 0) {
        var dx = d["utm-easting"] - data[i - 1]["utm-easting"];
        var dy = d["utm-northing"] - data[i]["utm-northing"];
        var length = Math.sqrt(dx * dx + dy * dy);
        let a = opacityScale(length);
        //
        return a;
      }
      return 1;
    })
    .attr("stroke-width", corners.width / 500)
    .attr("stroke", function (d) {
      //
      return "white";
    });
}

function resizePoints() {
  var sliderValue = document.getElementById("point-resize").value;
  // var circle1 = d3.selectAll("circle.points");
  var circle = d3.selectAll("circle.points");

  circle.attr("r", sliderValue);
}

function showPoints(id) {
  const checkboxes = [
    document.getElementById("Daniel-checkbox"),
    document.getElementById("Magnolia-checkbox"),
    document.getElementById("Jessy-checkbox"),
    document.getElementById("Drogon-checkbox"),
    document.getElementById("Viserion-checkbox"),
    document.getElementById("Rhaegal-checkbox"),
    document.getElementById("John Snow-checkbox"),
    document.getElementById("Rhaegal_2-checkbox"),
    document.getElementById("Viserion_2-checkbox"),
    document.getElementById("Samwell-checkbox"),
    document.getElementById("Gendry-checkbox"),
    document.getElementById("Gendry_2-checkbox"),
    document.getElementById("Daenerys-checkbox"),
    document.getElementById("Olenna-checkbox"),
  ];

  let checkedValues = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(checkbox.value);
    }
  });
  const filteredData = data.filter((item) =>
    checkedValues.includes(item["individual-local-identifier"])
  );

  d3.selectAll("circle.points").remove();

  var dot = svg
    .selectAll("circle")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "points")
    .attr("id", function (d) {
      return d["individual-local-identifier"];
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", 1)
    .style("opacity", 1)
    .attr("fill", function (d) {
      return colorDictionary[d["individual-local-identifier"]];
    });

  // if (!cb.checked) {
  //   d3.selectAll("circle.points#" + id).remove();
  // }
}

function selectAll(id) {
  if (document.getElementById(id).checked) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    showPoints(id);
  } else {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    d3.selectAll("circle.points").remove();
  }
}

function trajectoryGroups(summarizedPoints) {
  const groups = [
    ...new Set(summarizedPoints.map((obj) => obj.trajectoryNumber)),
  ].map((trajectoryNumber) => {
    return {
      trajectoryNumber,
      objects: summarizedPoints.filter(
        (obj) => obj.trajectoryNumber === trajectoryNumber
      ),
    };
  });
  return groups;
}

function trajectoryGroupCells(delaunay, groups) {
  summarizedCells = [];
  Object.keys(groups).forEach((key) => {
    const points = groups[key].objects;
    summarizedCells[key] = [];
    points.forEach((point) => {
      const timestamp = point["timestamp"];
      const cellIndex = delaunay.find(
        xScale(point["utm-easting"]),
        yScale(point["utm-northing"])
      );

      summarizedCells[key].push({ cellIndex, timestamp });
    });
  });
  // console.log(summarizedCells);
  return summarizedCells;
}

//for each cell find the time the animal enters the cell and leaves the cell
//c1 , c1, c1 , c1 -> c1, <tstart, tend>
function cellVisits(summarizedCells) {
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

//movement between the cells. based on the previous data strcture <ci, ci+1, tend(i), tstart(i + 1)
function cellMoves(visits) {
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
  let d = -1;
  d3.csv("data/centroids.csv").then(function (data2) {
    const xMin = 624079.8465020715,
      xMax = 629752.8465020715,
      yMin = 1009715.5668793379,
      yMax = 1015157.5668793379;

    // Define the cell width
    const cellWidth = cellW;

    // Generate a set of points
    const points = [];
    for (let x = xMin; x < xMax; x += cellWidth) {
      for (let y = yMin; y < yMax; y += cellWidth) {
        points.push([xScale(x), yScale(y)]);
      }
    }

    let centroids = data2;
    for (let i = 0; i < centroids.length; i++) {
      let coordinates = centroids[i];
      points.push([
        xScale(parseInt(coordinates.X)),
        yScale(parseInt(coordinates.Y)),
      ]);
    }

    // Compute the Voronoi diagram
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, 1000, 1000]);
    // Create SVG element

    d = delaunay;
    return delaunay;
  });

  return d;
}
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

    let centroids = data2[cellWidth];
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

function showPointsTimeline(startTime, endTime) {
  // console.log(startTime, endTime);

  var plotList = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked == true) {
      plotList.push(checkbox.value);
    }
  });
  const circles = data.filter((item) =>
    plotList.includes(item["individual-local-identifier"])
  );

  var data2 = circles.filter(function (d) {
    return (
      new Date(d["study-local-timestamp"]) >= new Date(startTime) &&
      new Date(d["study-local-timestamp"]) <= new Date(endTime)
    );
  });
  pointsTimelinePlot(data2);
}

function pointsTimelinePlot(data2) {
  console.log(data2);
  d3.selectAll("circle.points").remove();

  var dot = svg
    .selectAll("circle")
    .data(data2)
    .enter()
    .append("circle")
    .attr("class", "points")
    .attr("id", function (d) {
      return d["individual-local-identifier"];
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d["utm-northing"]));
    })
    .attr("r", 1)
    .style("opacity", 1)
    .attr("fill", function (d) {
      return colorDictionary[d["individual-local-identifier"]];
    });
}
// changeAttribute("speed");

function caller() {
  // append the svg2 object to the body of the page
  // set the dimensions and margins of the graph
  const margin = { top: 60, right: 230, bottom: 50, left: 50 },
    width = 660 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const svg2 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  changeAttribute(svg2, "speed", width, height, margin);
}

function caller() {
  // append the svg2 object to the body of the page
  // set the dimensions and margins of the graph
  const margin = { top: 60, right: 230, bottom: 50, left: 50 },
    width = 660 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const svg2 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  changeAttribute(svg2, "speed", width, height, margin);
}

setTimeout(function () {
  //your code here
  caller();
  caller();
}, 500);
