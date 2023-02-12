//do button click isolation

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

var svgPanZoom = $("svg#map").svgPanZoom();

var svg = d3.select("svg#map");

var image = d3.select("image#myimg");

// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
// svgPanZoom.events.drag = false;

document.getElementById("reset").addEventListener("click", function () {
  // code to be executed when button is clicked
  svgPanZoom.reset();
});

document.getElementById("zoom-in").addEventListener("click", function () {
  // code to be executed when button is clicked

  svgPanZoom.zoomIn(1);
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
  // console.log(svgPanZoom.getViewBox());
});

document.getElementById("fruit").addEventListener("click", function () {
  // code to be executed when button is clicked

  console.log(svgPanZoom.getViewBox());
  plotFruitTrees();
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

document.getElementById("bci").addEventListener("click", function () {
  // code to be executed when button is clicked
  plotBCIdata();
});

const container = document.getElementById("names");

container.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-primary")) {
    plotBCIdata(event.target.innerHTML.trim());
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

var top = 1015157.5668793379;
var bottom = 1009715.5668793379;

function plotFruitTrees() {
  var corners = svgPanZoom.getViewBox();

  // Define the input domain and output range
  var xScale = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, 1000]);
  // 643249.2264808861

  // 629,297.409565999990000","1,013,079.908749999900000
  var yScale = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([1000, 0]);

  const svg = d3.select("svg#map");

  // svg.selectAll(".selected").remove();

  d3.csv("../data/fruit_tree.csv") //updted the data
    .then((data) => {
      var dot = svg
        .selectAll("circle")
        .classed("selected", true)
        .data(data)
        .enter()
        .append("circle")
        // .attr("cx", (d) => xScale(d.UTM_X))
        .attr("cx", function (d) {
          return xScale(parseFloat(d["utm-easting"].replace(",", "")));
        })
        .attr("cy", function (d) {
          return yScale(parseFloat(d["utm-northing"].replace(/,/g, "")));
        })
        .attr("r", function (d) {
          return parseInt(d.Area) / 300;
        })
        .style("opacity", function (d) {
          return 1;
        })
        .attr("fill", function (d) {
          return "pink";
        });
    });
}

function plotBCIdata(individual = "all") {
  // Define the input domain and output range
  var xScale = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, 1000]);
  // 643249.2264808861

  // 629,297.409565999990000","1,013,079.908749999900000
  var yScale = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([1000, 0]);

  const svg = d3.select("svg#map");
  svg.selectAll(".selected").remove();

  d3.csv("../data/Dead-Reackon-Sample.csv") //updted the data
    .then((data) => {
      var dot = svg
        .selectAll("circle")
        .classed("selected", true)
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return xScale(parseFloat(d["utm-easting"].replace(",", "")));
        })
        .attr("cy", function (d) {
          return yScale(parseFloat(d["utm-northing"].replace(/,/g, "")));
        })
        .attr("r", function (d) {
          return parseInt(svgPanZoom.getViewBox().width) / 600;
        })
        .style("opacity", function (d) {
          // console.log(individual);
          if (individual == "all") {
            return 1;
          } else {
            if (d["individual-local-identifier"] == individual) {
              console.log(individual);
              return 1;
            }
            return 0;
          }
        })
        .attr("fill", function (d) {
          return colorArray[names.indexOf(d["individual-local-identifier"])];
        });
    });
}

function separateBCIdata() {
  // Define the input domain and output range
  var xScale = d3
    .scaleLinear()
    .domain([624079.8465020715, 629752.8465020715])
    .range([0, 1000]);
  // 643249.2264808861

  // 629,297.409565999990000","1,013,079.908749999900000
  var yScale = d3
    .scaleLinear()
    .domain([1009715.5668793379, 1015157.5668793379])
    .range([1000, 0]);

  const svg = d3.select("svg#map");

  svg.selectAll(".selected").remove();

  d3.csv("../data/Dead-Reackon-Sample.csv") //updted the data
    .then((data) => {
      var dot = svg
        .selectAll("circle")
        .classed("selected", true)
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return xScale(parseFloat(d["utm-easting"].replace(",", "")));
        })
        .attr("cy", function (d) {
          return yScale(parseFloat(d["utm-northing"].replace(/,/g, "")));
        })
        .attr("r", function (d) {
          return parseInt(svgPanZoom.getViewBox().width) / 600;
        })
        .style("opacity", function (d) {
          return 1;
        })
        .attr("fill", function (d) {
          return "pink";
        });
    });
}

//******Timeline chart data */

var margin = { top: 20, right: 20, bottom: 90, left: 50 },
  margin2 = { top: 230, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom,
  height2 = 300 - margin2.top - margin2.bottom;

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
  x2 = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x).tickSize(0),
  xAxis2 = d3.axisBottom(x2).tickSize(0),
  yAxis = d3.axisLeft(y).tickSize(0);

var brush = d3
  .brushX()
  .extent([
    [0, 0],
    [width, height2],
  ])
  .on("brush", brushed);

var zoom = d3
  .zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([
    [0, 0],
    [width, height],
  ])
  .extent([
    [0, 0],
    [width, height],
  ])
  .on("zoom", zoomed);

var svg2 = d3.select("svg#timeline");

svg2
  .append("defs")
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

var focus = svg2
  .append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg2
  .append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// // Data Load from CSV

d3.csv("../data/fruit_tree.csv") //updted the data
  .then((data) => {});

// d3.csv("data/fruit_tree.csv", function (error, data) {
//   if (error) throw error;

//   data.forEach(function (d) {
//     d.sent_time = parseTime(d.sent_time);
//   });

//   var xMin = d3.min(data, function (d) {
//     return d.sent_time;
//   });
//   var yMax = Math.max(
//     20,
//     d3.max(data, function (d) {
//       return d.messages_sent_in_day;
//     })
//   );

//   x.domain([xMin, new Date()]);
//   y.domain([0, yMax]);
//   x2.domain(x.domain());
//   y2.domain(y.domain());

//   var num_messages = function (dataArray, domainRange) {
//     return d3.sum(dataArray, function (d) {
//       return (
//         d.sent_time >= domainRange.domain()[0] &&
//         d.sent_time <= domainRange.domain()[1]
//       );
//     });
//   };

//   // append scatter plot to main chart area
//   var messages = focus.append("g");
//   messages.attr("clip-path", "url(#clip)");
//   messages
//     .selectAll("message")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("class", "message")
//     .attr("r", 4)
//     .style("opacity", 0.4)
//     .attr("cx", function (d) {
//       return x(d.sent_time);
//     })
//     .attr("cy", function (d) {
//       return y(d.messages_sent_in_day);
//     });

//   focus
//     .append("g")
//     .attr("class", "axis x-axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

//   focus.append("g").attr("class", "axis axis--y").call(yAxis);

//   // Summary Stats
//   focus
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - height / 2)
//     .attr("dy", "1em")
//     .style("text-anchor", "middle")
//     .text("Messages (in the day)");

//   focus
//     .append("text")
//     .attr("x", width - margin.right)
//     .attr("dy", "1em")
//     .attr("text-anchor", "end")
//     .text("Messages: " + num_messages(data, x));

//   svg2
//     .append("text")
//     .attr(
//       "transform",
//       "translate(" +
//         (width + margin.right + margin.left) / 2 +
//         " ," +
//         (height + margin.top + margin.bottom) +
//         ")"
//     )
//     .style("text-anchor", "middle")
//     .text("Date");

//   svg2
//     .append("rect")
//     .attr("class", "zoom")
//     .attr("width", width)
//     .attr("height", height)
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//     .call(zoom);

//   // append scatter plot to brush chart area
//   var messages = context.append("g");
//   messages.attr("clip-path", "url(#clip)");
//   messages
//     .selectAll("message")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("class", "messageContext")
//     .attr("r", 3)
//     .style("opacity", 0.6)
//     .attr("cx", function (d) {
//       return x2(d.sent_time);
//     })
//     .attr("cy", function (d) {
//       return y2(d.messages_sent_in_day);
//     });

//   context
//     .append("g")
//     .attr("class", "axis x-axis")
//     .attr("transform", "translate(0," + height2 + ")")
//     .call(xAxis2);

//   context
//     .append("g")
//     .attr("class", "brush")
//     .call(brush)
//     .call(brush.move, x.range());
// });

// //create brush function redraw scatterplot with selection
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus
    .selectAll(".message")
    .attr("cx", function (d) {
      return x(d.sent_time);
    })
    .attr("cy", function (d) {
      return y(d.messages_sent_in_day);
    });
  focus.select(".x-axis").call(xAxis);
  svg
    .select(".zoom")
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
    );
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus
    .selectAll(".message")
    .attr("cx", function (d) {
      return x(d.sent_time);
    })
    .attr("cy", function (d) {
      return y(d.messages_sent_in_day);
    });
  focus.select(".x-axis").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
