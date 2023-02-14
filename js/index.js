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
  "John Snow",
  "Samwell Tarly",
  "Olenna Tyrell",
];

var svgPanZoom = $("svg#map").svgPanZoom();

var svg = d3.select("svg#map");

var image = d3.select("image#myimg");

// zoomFactor: number (0.25)
svgPanZoom.events.mouseWheel = false;
svgPanZoom.events.doubleClick = false;
svgPanZoom.events.drag = false;

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

document.getElementById("paths").addEventListener("click", function () {
  //******Timeline chart data */
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
          return colorArray[
            names.indexOf(d["individual-local-identifier"]) % names.length
          ];
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

// Add brushing
svg.call(
  d3
    .brush() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [1000, 1000],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
);

// Function that is triggered when brushing is performed
function updateChart(e1) {
  extent = e1.selection;
  start = e1.selection[0];
  end = e1.selection[1];
  console.log(start, end);

  d3.csv("../data/Dead-Reackon-Sample.csv") //updted the data
    .then((data) => {
      const filteredData = data.filter(function (d) {
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
