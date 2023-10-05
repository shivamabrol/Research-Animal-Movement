//Color picker would be activated only if single animal is present on screen a
import { colorDictionary, names } from "./colors.js";
import { plotFruitTrees } from "./fruits.js";
import { showPoints } from "./points.js";
import { changeColor } from "./colors.js";
import { plotTrajectoryBCI } from "./trajectory.js";
import { plotCircles } from "./trajectory.js";

// It'll be disabled if there are 2 or more

var svgPanZoom = $("svg#map").svgPanZoom();

const svg = d3.select("svg#map");

export const xScale = d3
  .scaleLinear()
  .domain([624079.8465020715, 629752.8465020715])
  .range([0, 1000]);

export const yScale = d3
  .scaleLinear()
  .domain([1009715.5668793379, 1015157.5668793379])
  .range([1000, 0]);

// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
svgPanZoom.events.drag = false;

document.getElementById("reset-map").addEventListener("click", function () {
  svgPanZoom.reset();
});

document.getElementById("reset").addEventListener("click", function () {
  // code to be executed when button is clicked
  if (confirm("This will reset the map and remove all your data")) {
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
  }
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

document.getElementById("download").addEventListener("click", function () {
  exportData();
});

document.getElementById("fruit").addEventListener("change", (event) => {
  // code to be executed when button is clicked
  if (event.target.checked) {
    plotFruitTrees();
  } else {
    svg.selectAll("*.fruits").remove();

    // select the div element by its ID
    let divElement = document.getElementById("fruit-container");

    // select all child elements with the class name "myClass"
    let checkboxes = divElement.querySelectorAll(".fruit-checkbox");
    let labels = divElement.querySelectorAll(".fruit-checkbox-label");

    // loop through the child elements and remove each one
    checkboxes.forEach((child) => {
      child.checked = false;
    });
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

names.forEach(function (name) {
  var checkbox = document.getElementById(name + "-checkbox");
  checkbox.addEventListener("change", showPoints, false);
});

document
  .getElementById("colorpicker")
  .addEventListener("input", changeColor, false);

document
  .getElementById("point-resize")
  .addEventListener("change", resizePoints, false);

document
  .getElementById("lines-add")
  .addEventListener("change", plotTrajectoryBCI, false);

// document
//   .getElementById("start-resize")
//   .addEventListener("change", sliderChanged, false);

//top left
// Latitude : 9.181898
// Longitude: -79.870619

//right bottom
// Latitude : 9.13252
// Longitude: -79.819153

// var left = 624079.8465020715;
// var right = 629752.8465020715;

// var top = 1009715.5668793379;
// var bottom = 1015157.5668793379;

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

function updateChart2(ev) {}
// Function that is triggered when brushing is performed
function updateChart(e1) {
  extent = e1.selection;
  start = e1.selection[0];
  end = e1.selection[1];

  d3.csv("../data/BCI-movement-filtered.csv") //updted the data
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

//code for focus + context

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

function trajectoryPlotter2() {
  objects = isolatePoints().data();
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

//for each cell find the time the animal enters the cell and leaves the cell
//c1 , c1, c1 , c1 -> c1, <tstart, tend>

// changeAttribute("speed");

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

function exportData() {
  var a = document.createElement("a");
  var exportData = d3.selectAll("circle.points").data();
  console.log(exportData);
  a.href = URL.createObjectURL(
    new Blob([convertToCSV(exportData)], { type: "application/csv" })
  );
  a.download = "myFile.csv";
  a.click();
}

var trajectoryColumn = "trajectory_number";
// document
//   .getElementById("trajectory-column")
//   .addEventListener("change", function () {
//     trajectoryColumn = document.getElementById("trajectory-column").value;
//     console.log(trajectoryColumn);
//   });

//Given a min value which is diff bw 2 coordinates

export function dataAlert(timelineParam) {
  console.log(timelineParam);
  if (timelineParam) {
    return true;
  }
  let d = svg.selectAll(".points");
  return d.data().length != 0;
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// Loop through elements with IDs from "map-info-1" to "map-info-8"
for (var i = 1; i <= 4; i++) {
  // Get a reference to the element with the current ID
  var mapInfoElement = document.getElementById("map-info-" + i);

  if (mapInfoElement) {
    // Modify the CSS properties for the current element
    mapInfoElement.style.lineHeight = "12px";
    mapInfoElement.style.width = "18px";
    mapInfoElement.style.fontSize = "8pt";
    mapInfoElement.style.fontFamily = "tahoma";
    mapInfoElement.style.marginTop = "1px";
    mapInfoElement.style.marginRight = "2px";
    mapInfoElement.style.position = "absolute";
    mapInfoElement.style.top = "1";
    mapInfoElement.style.right = "0";
  }
}

for (var i = 5; i <= 8; i++) {
  // Get a reference to the element with the current ID
  var mapInfoElement = document.getElementById("map-info-" + i);

  if (mapInfoElement) {
    // Modify the CSS properties for the current element
    mapInfoElement.style.lineHeight = "12px";
    mapInfoElement.style.width = "18px";
    mapInfoElement.style.fontSize = "8pt";
    mapInfoElement.style.fontFamily = "tahoma";
    mapInfoElement.style.marginTop = "1px";
    mapInfoElement.style.marginRight = "2px";
    mapInfoElement.style.position = "absolute";
    mapInfoElement.style.top = "1";
    mapInfoElement.style.left = "0";
  }
}
