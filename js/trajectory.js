import { data } from "./data.js";
import { xScale, yScale } from "./index.js";
import { colorArrayTrajectory } from "./colors.js";
import { showPoints } from "./points.js";
import { plotFruitTrees } from "./fruits.js";
var trajectoryColumn = "trajectory_number";
const svg = d3.select("svg#map");

function plotSeparatePaths(data) {
  const margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3
    .select("#timechart")
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
export function plotTrajectoryBCI() {
  if (document.getElementById("lines-add").checked == false) {
    svg.selectAll(".lines").remove();
    return;
  }
  let plotList = [];
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
    ...new Set(trajectoryData.map((item) => item[trajectoryColumn])),
  ];

  // // Log the unique categories to the console
  trajectoryLinePlotter(trajectoryData);
}

function trajectoryLinePlotter(data) {
  var line = d3
    .line()
    .x(function (d) {
      return xScale(parseFloat(d["utm-easting"]));
    })
    .y(function (d) {
      return yScale(parseFloat(d["utm-northing"]));
    });

  svg
    .selectAll(".line")
    .data(d3.groups(data, (d) => d[trajectoryColumn]))
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

    let radius = parseInt(
      document.getElementById("start-circle").getAttribute("r")
    );

    console.log(radius);

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

function trajectoryPlotter() {
  let objects = isolatePoints();
  if (objects.data().length == 0) {
    return;
  }

  objects = objects.data();
  // console.log(data);

  //Given a list of those points plot all the trajectories through those points - originating / passing through

  //Find all the trajectories in the data
  const distinctTrajectories = [
    ...new Set(objects.map((item) => item[trajectoryColumn])),
  ];

  // Filter the data based on the list of names
  const filteredTrajectories = data.filter((item) =>
    distinctTrajectories.includes(item[trajectoryColumn])
  );

  // console.log(filteredData);
  svg.selectAll(".lines").remove();

  trajectoryLinePlotter(filteredTrajectories);
  //get points with all those trajectories
}

export function plotCircles() {
  var circleData = [
    { x: 250, y: 200, r: 20, color: "red", opacity: 0.5, id: "start-circle" },
  ];

  let activated = document.getElementById("start-location");

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
  //   if (document.getElementById("fruit").checked) {
  //     plotFruitTrees();
  //   }
}

function clicked(event, d) {
  if (event.defaultPrevented) return; // dragged

  // d3.select(this)
  //   .transition()
  //   .attr("fill", "blue")
  //   .attr("r", r * 2)
  //   .transition()
  //   .attr("r", r)
  //   .attr("opacity", 0.5)
  //   .attr("fill", "green");
}

function sliderChanged(id) {
  var sliderValue = document.getElementById("start-resize").value;
  // var circle1 = d3.selectAll("circle.points");
  var circle = d3.selectAll("#start-circle");

  circle.attr("r", sliderValue);
}

document
  .getElementById("start-location")
  .addEventListener("click", plotCircles, false);

document
  .getElementById("start-resize")
  .addEventListener("change", sliderChanged, false);
